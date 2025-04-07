const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Chat.deleteMany();
    await Message.deleteMany();

    console.log("Existing data cleared!");

    // Insert sample users
    const users = await User.insertMany([
      { name: "Alice", email: "alice@example.com", password: "123456" },
      { name: "Boob", email: "bob@example.com", password: "123456" },
    ]);

    console.log("Users inserted!");

    // Create a chat between Alice and Bob
    const chat = await Chat.create({
      users: [users[0]._id, users[1]._id],
      isGroupChat: false,
    });

    console.log("Chat created!");

    // Insert a message in the chat
    await Message.create({
      sender: users[0]._id,
      content: "Hello, Bob!",
      chat: chat._id,
    });
    console.log("Message inserted!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


module.exports = {seedDatabase};