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

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    console.log("Tab is inactive");
    // Pause video, stop animations, etc.
  } else if (document.visibilityState === "visible") {
    console.log("Tab is active");
    // Resume activities
  }
});

export default socket;
