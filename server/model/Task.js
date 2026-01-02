const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: {
    type: String,
    required: [true, "please enter a title"],
    minLength: [3, "minimum title length is 3 characters"],
  },
  duree: {
    type: Number,
    default: 1,
    min: [1, "duration must be at least 1 day"],
  },
  status: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
