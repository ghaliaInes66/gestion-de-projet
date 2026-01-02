const mongoose = require("mongoose");

const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
    minLength: [4, "minimun name lenght is 4"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "pleas enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minLength: [6, "minimun password lenght is 6"],
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
