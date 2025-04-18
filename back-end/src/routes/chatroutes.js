const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const {
  getChats,
  accessChat,
  deleteChatForUser,
  addToGroup,
  removeFromGroup,
  editGroup,
  searchChats,
} = require("../controllers/chatcontroller");
const upload = require("../middlewares/uploadmiddleware");

const router = express.Router();
router.get("/search", protect, searchChats);
router.get("/", protect, getChats); // Get all chats of logged-in user
router.post("/", protect, upload.single("groupPhoto"), accessChat); // Access or create one-on-one chat

router.delete("/:chatId", protect, deleteChatForUser);

router.put("/group/edit", protect, upload.single("groupPhoto"), editGroup);

router.put("/group/add", protect, addToGroup);
router.put("/group/remove", protect, removeFromGroup);

module.exports = router;
