const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const {
  getChats,
  accessChat,
  deleteChatForUser,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatcontroller");

const router = express.Router();

router.get("/", protect, getChats); // Get all chats of logged-in user
router.post("/", protect, accessChat); // Access or create one-on-one chat

router.delete("/:chatId", protect, deleteChatForUser);

router.put("/group/rename", protect, renameGroup);
router.put("/group/add", protect, addToGroup);
router.put("/group/remove", protect, removeFromGroup);

module.exports = router;
