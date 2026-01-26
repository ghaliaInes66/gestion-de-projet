const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "please enter a name"],
    minLength: [3, "minimum name length is 3 characters"],
  },
  description: {
    type: String,
  },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
