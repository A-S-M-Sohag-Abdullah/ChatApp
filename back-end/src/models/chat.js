const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String }, // Only for group chats
    isGroupChat: { type: Boolean, default: false },
    groupPhoto: { type: String },
    users: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User's ID
        username: { type: String }, // User's username
      },
    ], // Participants, now stores both userId and username
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Last sent message
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Only for groups
    deletedFor: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deletedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
