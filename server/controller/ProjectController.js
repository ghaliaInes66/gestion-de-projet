const express = require("express");
const Project = require("../model/Project");
const User = require("../model/User");
const Create_Project = async (req, res) => {
  const { userId, title, description } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const project = await Project.create({
      user: userId,
      title,
      description,
    });

    user.projects.push(project._id);
    await user.save();

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const Get_Projects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ user: userId });
    res.status(200).json({ projects });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Update_Project = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const delete_Project = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  Create_Project,
  Get_Projects,
  Update_Project,
  delete_Project,
};
