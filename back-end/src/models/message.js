const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    images: [{ type: String }], 
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For read receipts
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);