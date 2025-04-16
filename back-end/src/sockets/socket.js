const User = require("../models/user");
const socketIo = require("socket.io");
const usersOnline = new Map();
const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Allow frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //console.log(`User connected: ${socket.id}`);

    // Handle user login (frontend should emit 'userOnline' after login)

    socket.on("userOnline", async (userId) => {
      if (!userId) return;

      usersOnline.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify all chat participants that this user is online
      socket.broadcast.emit("updateUserStatus", { userId, isOnline: true });
    });

    // Join a chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      //console.log(`User joined chat: ${chatId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", (message) => {
      const { chatId, content, sender } = message;
      io.to(chatId).emit("receiveMessage", { chatId, content, sender });
    });

    // Handle user disconnect
    socket.on("disconnect", async () => {
      const userId = [...usersOnline.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];
      if (userId) {
        usersOnline.delete(userId);
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        // Notify all chat participants that this user is offline
        socket.broadcast.emit("updateUserStatus", { userId, isOnline: false });
      }

      //console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;
