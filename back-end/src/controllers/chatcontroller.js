const Chat = require("../models/chat");
const User = require("../models/user");

// Get all chats of logged-in user
const getChats = async (req, res) => {
  try {
    let chats = await Chat.find({ "users.userId": req.user._id }).sort({
      updatedAt: -1,
    });

    chats = await Chat.populate(chats, [
      {
        path: "latestMessage",
        select: "sender content createdAt",
        populate: {
          path: "sender",
          select: "username",
        },
      },
      {
        path: "users.userId",
        select: "blockedUsers",
        populate: {
          path: "blockedUsers",
          select: "_id username",
        },
      },
    ]);

    // Filter latestMessage based on deletedFor
    chats = chats.map((chat) => {
      const deletionEntry = chat.deletedFor?.find((entry) =>
        entry.user.equals(req.user._id)
      );

      if (
        deletionEntry &&
        chat.latestMessage &&
        new Date(chat.latestMessage.createdAt) <= new Date(deletionEntry.deletedAt)
      ) {
        // Message was sent before deletion — remove it
        chat = chat.toObject(); // Convert to plain object to allow reassignment
        chat.latestMessage = null;
      }

      return chat;
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Create or fetch a chat (one-on-one or group)
const accessChat = async (req, res) => {
  const { userId, username, users, chatName } = req.body;

  if (!userId && (!users || users.length === 0)) {
    return res
      .status(400)
      .json({ message: "User ID or list of users is required!" });
  }

  try {
    let chat;

    // Check if the request is for a one-on-one chat or a group chat
    if (users && users.length > 2) {
      // Group chat logic
      if (!chatName) {
        return res
          .status(400)
          .json({ message: "Chat name is required for group chats!" });
      }

      chat = await Chat.findOne({
        isGroupChat: true,
        users: {
          $all: users.map((user) => ({
            userId: user._id,
            username: user.username,
          })),
        },
      })
        .populate("users", "-password")
        .populate("latestMessage");

      if (!chat) {
        chat = await Chat.create({
          name: chatName, // Include the group chat name
          isGroupChat: true,
          users: users.map((user) => ({
            userId: user._id,
            username: user.username,
          })),
        });
      }
    } else {
      // One-on-one chat logic
      chat = await Chat.findOne({
        isGroupChat: false,
        users: {
          $all: [
            {
              $elemMatch: { userId: req.user._id, username: req.user.username },
            },
            { $elemMatch: { userId: userId, username: username } },
          ],
        },
      })
        .populate("users", "-password")
        .populate("latestMessage");

      if (!chat) {
        chat = await Chat.create({
          chatName: "Private Chat",
          isGroupChat: false,
          users: [
            { userId: req.user._id, username: req.user.username },
            { userId: userId, username: username },
          ],
        });
      }
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Access Chat Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/chatController.js
const deleteChatForUser = async (req, res) => {
  const { chatId } = req.params;

  try {
    console.log(chatId);
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const existingEntry = chat.deletedFor.find((entry) =>
      entry.user.equals(req.user._id)
    );

    if (!existingEntry) {
      chat.deletedFor.push({
        user: req.user._id,
        deletedAt: new Date(),
      });
    } else {
      existingEntry.deletedAt = new Date(); // update timestamp if already exists
    }

    await chat.save();
    res.status(200).json({ message: "Chat soft-deleted successfully" });
  } catch (err) {
    console.error("Delete Chat Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getChats, accessChat, deleteChatForUser };
