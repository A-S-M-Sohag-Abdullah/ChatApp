import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Emit userOnline when logged in
export const setUserOnline = (userId) => {
  if (userId) socket.emit("userOnline", userId);
};

// Listen for user status updates
export const listenForUserStatus = (callback) => {
  socket.on("updateUserStatus", (data) => {
    console.log("update status initiated", data);
    callback(data);
  });
};

// Emit disconnect when tab closes
window.addEventListener("beforeunload", () => {
  socket.disconnect();
});

export default socket;
