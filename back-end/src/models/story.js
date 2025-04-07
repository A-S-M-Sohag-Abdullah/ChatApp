const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true }, // Image URL
    createdAt: { type: Date, default: Date.now, expires: "24h" }, // Auto-delete after 24 hours
  }
);

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
