const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const authRoutes = require("./routes/authroutes");
const chatRoutes = require("./routes/chatroutes");
const messageRoutes = require("./routes/messageroutes");
const storyRoutes = require("./routes/storyroutes");
const blockRoutes = require("./routes/blockroutes");
const { errorHandler } = require("./middlewares/errormiddleware");
const { seedDatabase } = require("./utils/seedDatabase");
const initializeSocket = require("./sockets/socket");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};
// One level above the current file
const rootDir = path.join(__dirname, "..");

// Ensure upload directories exist
ensureDirExists(path.join(rootDir, "uploads"));
ensureDirExists(path.join(rootDir, "uploads", "stories"));

connectDB();
dotenv.config();
//seedDatabase();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

const io = initializeSocket(server); // Initialize Socket.io
app.set("io", io);
// CORS Configuration
app.use(
  cors({
    origin: "https://chat-app-rho-blush.vercel.app", // Allow frontend to access the backend
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use("/uploads", express.static("uploads")); // Serve images
app.use("/uploads/stories", express.static("uploads/stories"));

app.use(bodyParser.json());
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/block", blockRoutes);

// Error Handling Middleware
app.use(errorHandler);
app.get("/api/health", (req, res) => {
  res.send("OK");
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
