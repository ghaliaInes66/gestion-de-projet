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

    res.status(200).json({ user });
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
    res.status(200).json({ user });
  } catch (err) {
    const errore = hundleErrore(err);
    res.status(400).json(errore);
  }
};
module.exports = {
  signup_Post,
  login_Post,
};
