const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const {
  getMessages,
  sendMessage,
  searchMessages,
  markMessagesAsRead,
} = require("../controllers/messagecontroller");

const router = express.Router();
router.get("/search", protect, searchMessages);
router.get("/:chatId", protect, getMessages); // Get all messages in a chat
router.post("/", protect, sendMessage); // Send a message
router.put("/read/:chatId", protect, markMessagesAsRead);

module.exports = router;
