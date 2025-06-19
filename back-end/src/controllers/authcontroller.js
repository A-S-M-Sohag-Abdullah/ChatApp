const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Signup Function
const signup = async (req, res) => {
  try {
    const { username, email, phone, password, dateOfBirth } = req.body;

    if (!username || !email || !phone || !password || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    // Validate phone number
    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ existingUser: true, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicturePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      profilePicture: profilePicturePath,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res
      .status(201)
      .header("Authorization", `Bearer ${token}`)
      .json({
        success: true,
        message: "User registered successfully!",
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          dateOfBirth: newUser.dateOfBirth,
          profilePicture: newUser.profilePicture,
        },
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Function
const login = async (req, res) => {
  console.log("hit");
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ message: "Email/Phone and Password are required!" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = generateToken(user._id);
    // Set token in Authorization header
    res
      .status(200)
      .header("Authorization", `Bearer ${token}`)
      .json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          profilePicture: user.profilePicture,
        },
      });
    console.log("Login successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const user = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password"); // Exclude password

    user = await User.populate(user, [
      {
        path: "blockedUsers",
        select: "_id username",
      },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchUser = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-password"); // Exclude password from results

    res.status(200).json(users);
  } catch (error) {
    console.error("Search User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("updating user");

    const updates = {};
    const allowedFields = ["username", "email", "phone", "dateOfBirth", "bio"];

    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    // Handle profile picture update
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: "-password", // Exclude password
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "User info updated successfully",
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/authController.js

const forgotPassword = async (req, res) => {
  console.log("forgot password");
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.json({ success: true, message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Function
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token is invalid or expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  signup,
  login,
  user,
  searchUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
