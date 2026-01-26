const User = require("../model/User");
const express = require("express");
const hundleErrore = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: "" };

  if (err.message === "incorrect email ") {
    errors.email = "that email is not regestred";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "this password is incorrect";
  }
  //duplicated errore
  if (err.code == 11000) {
    errors.email = "that email is already registered";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      //console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
signup_Post = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.create({
      email,
      password,
      name,
    });

    res.status(201).json(user);
    console.log(user);
  } catch (err) {
    const errores = hundleErrore(err);
    res.status(400).json(errores);
  }
};
login_Post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      throw Error("incorrect email ");
    }
    
    // Check if password matches
    if (user.password !== password) {
      throw Error("incorrect password");
    }
    
    res.status(200).json({ user });
  } catch (err) {
    const errore = hundleErrore(err);
    res.status(400).json(errore);
  }
};

// Get all users
const Get_Users = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get specific user
const Get_User = async (req, res) => {
  const { userId } = req.params;
  try {
    // Validate ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};

// Update user
const Update_User = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
const Delete_User = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  signup_Post,
  login_Post,
  Get_Users,
  Get_User,
  Update_User,
  Delete_User
};
