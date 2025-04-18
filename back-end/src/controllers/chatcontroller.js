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
          select: "username profilePicture",
        },
      },
      {
        path: "users.userId",
        select: "blockedUsers phone email bio profilePicture",
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
        new Date(chat.latestMessage.createdAt) <=
          new Date(deletionEntry.deletedAt)
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
  let { userId, username, users, chatName } = req.body;

  if (!userId && (!users || users.length === 0)) {
    return res
      .status(400)
      .json({ message: "User ID or list of users is required!" });
  }
  if (users) users = JSON.parse(users);

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

      const groupPhoto = req.file ? `/uploads/${req.file.filename}` : "";

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
          name: chatName,
          isGroupChat: true,
          groupAdmin: req.user._id,
          users: users.map((user) => ({
            userId: user._id,
            username: user.username,
          })),
          groupPhoto, // Save group photo path
        });
      }
    } else {
      // One-on-one chat logic
      chat = await Chat.findOne({
        isGroupChat: false,
        users: {
          $all: [
            {
              $elemMatch: {
                userId: req.user._id,
                username: req.user.username,
              },
            },
            {
              $elemMatch: {
                userId: userId,
                username: username,
              },
            },
          ],
        },
      })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("users.userId");

      if (!chat) {
        chat = await Chat.create({
          chatName: "Private Chat",
          isGroupChat: false,
          users: [
            { userId: req.user._id, username: req.user.username },
            { userId: userId, username: username },
          ],
        });

        chat = await Chat.populate(chat, [
          {
            path: "latestMessage",
            select: "sender content createdAt",
            populate: {
              path: "sender",
              select: "username profilePicture",
            },
          },
          {
            path: "users.userId",
            select: "blockedUsers phone email bio profilePicture",
            populate: {
              path: "blockedUsers",
              select: "_id username",
            },
          },
        ]);
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
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete Chat Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const editGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (!chat.groupAdmin.equals(req.user._id)) {
      return res.status(403).json({ message: "Only admin can rename group" });
    }

    if (chatName) chat.name = chatName;

    // If a new photo is uploaded
    if (req.file) {
      console.log(req.file);
      chat.groupPhoto = `/uploads/${req.file.filename}`;
    }

    await chat.save();

    res.status(200).json({
      success: true,
      message: `Group updated successfully`,
      chat: chat,
    });
  } catch (err) {
    console.error("Rename Group Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  console.log(userId);
  try {
    const chat = await Chat.findById(chatId);
    if (!chat.isGroupChat)
      return res.status(400).json({ message: "Not a group chat" });

    if (!chat.groupAdmin.equals(req.user._id))
      return res.status(403).json({ message: "Only admin can add members" });

    const alreadyMember = chat.users.find((u) => u.userId.equals(userId));
    if (alreadyMember)
      return res.status(400).json({ message: "User already in group" });

    const user = await User.findById(userId).select("username");
    if (!user) return res.status(404).json({ message: "User not found" });

    chat.users.push({ userId: userId, username: user.username });
    await chat.save();

    res.status(200).json({
      success: true,
      message: `User added successfully to ${chat?.name}`,
      chat: chat,
    });
  } catch (err) {
    console.error("Add to Group Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat.isGroupChat)
      return res.status(400).json({ message: "Not a group chat" });

    if (!chat.groupAdmin.equals(req.user._id))
      return res.status(403).json({ message: "Only admin can remove members" });

    chat.users = chat.users.filter((u) => !u.userId.equals(userId));

    // Optional: If admin removes themselves, transfer admin to another member
    if (chat.groupAdmin.equals(userId) && chat.users.length > 0) {
      chat.groupAdmin = chat.users[0].userId;
    }

    await chat.save();
    res.status(200).json({
      success: true,
      message: "User Removed Successfully",
      chat: chat,
    });
  } catch (err) {
    console.error("Remove from Group Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const searchChats = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const regex = new RegExp(searchQuery, "i"); // case-insensitive

    // Step 1: Find all chats current user is part of
    let chats = await Chat.find({ "users.userId": req.user._id })
      .populate({
        path: "users.userId",
        select: "username profilePicture blockedUsers",
      })
      .populate("latestMessage");

    // Step 2: Filter with regex
    const filteredChats = chats.filter((chat) => {
      if (chat.isGroupChat) {
        return regex.test(chat.name || "");
      } else {
        const otherUser = chat.users.find(
          (u) => u.userId._id.toString() !== req.user._id.toString()
        );
        return regex.test(otherUser?.userId?.username || "");
      }
    });

    res.status(200).json({ success: true, chats: filteredChats });
  } catch (error) {
    console.error("Search Chats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getChats,
  accessChat,
  deleteChatForUser,
  editGroup,
  addToGroup,
  removeFromGroup,
  searchChats
};
