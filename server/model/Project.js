const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: [true, "please enter a title"],
    minLength: [3, "minimum title length is 3 characters"],
  },
  description: {
    type: String,
    required: [true, "please enter a description"],
  },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
