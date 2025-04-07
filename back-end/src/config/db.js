const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`);

    console.log(`MongoDB Connected`);
  } catch (error) {
    
    console.error(`Mongo connect Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;