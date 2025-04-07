const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const generateToken = require("../utils/generateToken");

// Signup Function
const signup = async (req, res) => {
  try {
    const { username, email, phone, password, dateOfBirth, profilePicture } =
      req.body;

    if (!username || !email || !phone || !password || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    // Validate phone number (basic check)
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
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      profilePicture,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    // Set token in Authorization header
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

module.exports = { signup, login, user, searchUser, getUserById };
