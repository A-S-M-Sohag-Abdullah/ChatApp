const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header is present
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token!" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (excluding password)
    req.user = await User.findById(decoded.userId)
      .select("-password")
      ;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token!" });
  }
};

module.exports = { protect };
