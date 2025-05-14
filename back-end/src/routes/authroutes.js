const express = require("express");
const upload = require("../middlewares/uploadmiddleware");
const {
  signup,
  login,
  user,
  searchUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authcontroller");
const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

// Login Route
router.post("/login", login);
// Signup Route
router.post("/signup", upload.single("profilePicture"), signup);

router.get("/user", protect, user);

router.get("/search", protect, searchUser);

router.get("/:id", protect, getUserById);

router.put("/update", protect, upload.single("profilePicture"), updateUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
