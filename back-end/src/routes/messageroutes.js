const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const {
  getMessages,
  sendMessage,
  searchMessages,
} = require("../controllers/messagecontroller");

const router = express.Router();
router.get("/search", protect, searchMessages);
router.get("/:chatId", protect, getMessages); // Get all messages in a chat
router.post("/", protect, sendMessage); // Send a message

module.exports = router;
