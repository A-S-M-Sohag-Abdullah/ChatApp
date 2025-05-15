import { io } from "socket.io-client";

const socket = io("http://192.168.0.109:5000");

// Emit userOnline when logged in
export const setUserOnline = (userId) => {
  if (userId) socket.emit("userOnline", userId);
};

// Listen for user status updates
export const listenForUserStatus = (callback) => {
  socket.on("updateUserStatus", (data) => {
    callback(data);
  });
};

// Emit disconnect when tab closes
window.addEventListener("beforeunload", () => {
  socket.disconnect();
});

export default socket;
