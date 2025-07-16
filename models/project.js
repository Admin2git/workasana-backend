const mongoose = require("mongoose");
const taskModel = require("./task.model");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

projectSchema.pre("findOneAndDelete", async function (next) {
  const project = await this.model.findOne(this.getQuery());
  if (project) {
    const res = await taskModel.deleteMany({ project: project._id });
    console.log(
      `🗑️ Deleted ${res.deletedCount} tasks that belonged to deleted project: ${project._id}`
    );
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
