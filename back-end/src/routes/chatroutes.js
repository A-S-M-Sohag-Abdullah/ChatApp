const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const { getChats, accessChat } = require("../controllers/chatcontroller");

const router = express.Router();


router.get("/", protect, getChats); // Get all chats of logged-in user
router.post("/", protect, accessChat); // Access or create one-on-one chat

module.exports = router;
