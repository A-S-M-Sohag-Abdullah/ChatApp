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

connectDB();
dotenv.config();
//seedDatabase();

const app = express();
// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(","), // Allow frontend to access the backend
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

/* app.use("/uploads", express.static("uploads")); // Serve images
app.use("/uploads/stories", express.static("uploads/stories")); */

/* const server = http.createServer(app); // Create HTTP server for Socket.io
const io = initializeSocket(server); // Initialize Socket.io
app.set("io", io); */

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
