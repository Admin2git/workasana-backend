const { default: mongoose } = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGODB;

const initializeToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to database");
  } catch (err) {
    console.error("Error in connect:", err);
  }
};
module.exports = { initializeToDatabase };
