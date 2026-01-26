const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: {
    type: String,
    required: [true, "please enter a title"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  duration: {
    type: Number,
    default: 1,
    min: [1, "duration must be at least 1 day"],
  },
  duree: {
    type: Number,
    default: 1,
    min: [1, "duration must be at least 1 day"],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dependencies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Task",
    default: [],
  },
  predeceseur: {
    type: [String],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
