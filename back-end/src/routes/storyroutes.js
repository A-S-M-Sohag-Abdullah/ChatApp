const express = require("express");
const { protect } = require("../middlewares/authmiddleware");
const { postStory, getStories } = require("../controllers/storycontroller");

const router = express.Router();

router.post("/post", protect, postStory); // Post a story
router.get("/all", protect, getStories); // Get stories from chat contacts

module.exports = router;
