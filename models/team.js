const mongoose = require("mongoose");
// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});
module.exports = mongoose.model("Team", teamSchema);
