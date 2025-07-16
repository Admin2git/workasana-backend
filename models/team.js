const mongoose = require("mongoose");
const taskModel = require("./task.model");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

teamSchema.pre("findOneAndDelete", async function (next) {
  const team = await this.model.findOne(this.getQuery());
  if (team) {
    const res = await taskModel.deleteMany({ team: team._id });
    console.log(
      `🗑️ Deleted ${res.deletedCount} tasks that belonged to deleted team: ${team._id}`
    );
  }
  next();
});

module.exports = mongoose.model("Team", teamSchema);
