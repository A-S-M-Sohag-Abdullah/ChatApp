const Chat = require("../models/chat");
const User = require("../models/user");
const socketIo = require("socket.io");
const usersOnline = new Map();

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL.split(","), // Allow frontend
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //console.log(`User connected: ${socket.id}`);

    // Handle user login (frontend should emit 'userOnline' after login)

    socket.on("userOnline", async (userId) => {
      if (!userId) return;

      usersOnline.set(userId, socket.id);
      /*  console.log(usersOnline); */
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify all chat participants that this user is online
      socket.broadcast.emit("updateUserStatus", { userId, isOnline: true });
    });

    socket.on("leaveAllChats", () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((room) => socket.leave(room));
      console.log("User left all chat rooms:", rooms);
    });

    // Join a chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("joinUser", (userId) => {
      socket.join(userId);
      console.log(`User joined user: ${userId}`);
    });

    // Handle sending messages

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

      /*     console.log("User disconnected:", socket.id, userId); */
    });
  });

  return io;
};

module.exports = initializeSocket;
