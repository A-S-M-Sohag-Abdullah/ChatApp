const express = require("express");
const {
  signup,
  login,
  user,
  searchUser,
  getUserById,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

// Login Route
router.post("/login", login);
// Signup Route
router.post("/signup", signup);

router.get("/user", protect, user);

router.get("/search", protect, searchUser);

router.get("/:id", protect, getUserById);

module.exports = router;
