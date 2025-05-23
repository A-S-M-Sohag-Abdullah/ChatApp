const Message = require("../models/message");
const Chat = require("../models/chat");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
    console.log("multer hit");
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).array("attachments", 5);

// Get all messages of a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    let deletedAt = null;

    const deletionInfo = chat.deletedFor.find((entry) =>
      entry.user.equals(req.user._id)
    );

    if (deletionInfo) {
      deletedAt = deletionInfo.deletedAt;
    }

    let messageQuery = { chat: chatId };

    if (deletedAt) {
      messageQuery.createdAt = { $gt: deletedAt };
    }

    const messages = await Message.find(messageQuery)
      .populate("sender", "username email profilePicture")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }
    let { content, chatId, storyImage } = req.body;

    if (!content && (!req.files || req.files.length === 0)) {
      return res
        .status(400)
        .json({ message: "Message content or images required!" });
    }
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }

    try {
      // Get chat to find other user
      const chat = await Chat.findById(chatId).populate({
        path: "users.userId",
        select: "_id username email blockedUsers",
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const receiverId = chat.users.find(
        (u) => u.userId._id.toString() !== req.user._id.toString()
      )._id;

      const sender = req.user;
      const receiver = chat.users.find(
        (u) => u._id.toString() === receiverId.toString()
      );

      // Blocking checks
      if (
        sender.blockedUsers?.includes(receiver._id) ||
        receiver.blockedUsers?.includes(sender._id)
      ) {
        return res
          .status(403)
          .json({ message: "Message not allowed. User is blocked." });
      }

      // Process image files
      let imageUrls = [];
      if (req.files) {
        imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      }
      storyImage && imageUrls.push("/" + storyImage);

      // Create message
      let message = await Message.create({
        sender: sender._id,
        content,
        chat: chatId,
        images: imageUrls,
        seenBy: [sender._id],
      });

      message = await Message.populate(message, [
        { path: "sender", select: "username email profilePicture" },
        { path: "chat" },
      ]);

      // Update latest message in chat
      let updatedChat = await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
      });

      updatedChat = await Chat.populate(updatedChat, [
        {
          path: "latestMessage",
          select: "content",
        },
      ]);
      /*       console.log(req.app.get("io")); */
      // Emit message to socket
      updatedChat.users.forEach((u) => {

        req.app.get("io").to(u.userId.toString()).emit("recieveUserMessage", {
          message,
          chatId,
        });
      });

      req.app.get("io").to(chatId).emit("receiveMessage", message);

      res.status(201).json({ success: true, message: message });
    } catch (error) {
      console.error("Send Message Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

const searchMessages = async (req, res) => {
  const { keyword } = req.query;
  console.log(keyword);
  if (!keyword) {
    return res.status(400).json({ message: "Search keyword is required" });
  }

  try {
    // Find messages sent or received by the logged-in user that contain the keyword
    const messages = await Message.find({
      chat: {
        $in: await Chat.find({ "users.userId": req.user._id }).distinct("_id"),
      },
      content: { $regex: keyword, $options: "i" },
    })
      .populate("sender", "_id username email")
      .populate("chat", "_id name isGroupChat");

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error("Search Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/messageController.js
const markMessagesAsRead = async (req, res) => {
  console.log("Marking messages as read");
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      {
        chat: chatId,
        seenBy: { $ne: req.user._id }, // Not yet read by this user
      },
      {
        $push: { seenBy: req.user._id },
      }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mark as Read Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  searchMessages,
  markMessagesAsRead,
};
