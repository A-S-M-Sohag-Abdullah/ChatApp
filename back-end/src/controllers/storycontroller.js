const Story = require("../models/story");
const Chat = require("../models/chat");
const multer = require("multer");

// Multer Setup for Uploading Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/stories/"); // Save stories in "uploads/stories/"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage }).single("storyImage"); // Accept single image

// Post a Story
const postStory = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: "File upload error", error: err });
    
    const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl)
      return res.status(400).json({ message: "Story image is required!" });

    try {
      const story = await Story.create({
        user: req.user._id,
        image: imageUrl,
      });
      res.status(201).json({ success: true, story: story });
    } catch (error) {
      console.error("Post Story Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// Get Stories of Chat Contacts
/* const getStories = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all chat contacts
    const chats = await Chat.find({ "users.userId": userId }).select("users");

    // Extract unique user IDs from chats
    const contactIds = new Set();
    chats.forEach((chat) => {
      chat.users.forEach((user) => {
        if (user.userId.toString() !== userId.toString()) {
          contactIds.add(user.userId.toString());
        }
      });
    });

    // Fetch active stories from contacts
    const stories = await Story.find({
      user: { $in: [...contactIds] },
    }).populate("user", "username profilePicture");

    res.status(200).json(stories);
  } catch (error) {
    console.error("Get Stories Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}; */

const getStories = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all chat contacts
    // Find all chat contacts
    const chats = await Chat.find({ "users.userId": userId }).select("users");

    // Extract unique user IDs from chats
    const contactIds = new Set();
    chats.forEach((chat) => {
      chat.users.forEach((user) => {
        if (user.userId.toString() !== userId.toString()) {
          contactIds.add(user.userId.toString());
        }
      });
    });

    // Get stories from contacts in the last 24 hours
    const stories = await Story.find({
      user: { $in: [...contactIds] },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).populate("user", "username profilePicture");

    
    // Group stories by user
    const groupedStories = {};
    stories.forEach((story) => {
      const userId = story.user._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: [],
        };
      }
      groupedStories[userId].stories.push({
        _id: story._id,
        image: story.image,
        createdAt: story.createdAt,
      });
    });

    // Convert grouped stories object to array
    const formattedStories = Object.values(groupedStories);

    res.status(200).json(formattedStories);
  } catch (error) {
    console.error("Get Stories Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { postStory, getStories };
