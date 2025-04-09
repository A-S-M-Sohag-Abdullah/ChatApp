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
      .populate("sender", "username email")
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

    const { content, chatId } = req.body;

    if (!content && (!req.files || req.files.length === 0)) {
      return res
        .status(400)
        .json({ message: "Message content or images required!" });
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

      // Create message
      let message = await Message.create({
        sender: sender._id,
        content,
        chat: chatId,
        images: imageUrls,
      });

      message = await Message.populate(message, [
        { path: "sender", select: "username email" },
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

      // Emit message to socket
      req.app.get("io").to(chatId).emit("receiveMessage", message);

      res.status(201).json({ success: true, message: message });
    } catch (error) {
      console.error("Send Message Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

module.exports = { getMessages, sendMessage };
