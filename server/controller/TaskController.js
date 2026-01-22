const express = require("express");
const Task = require("../model/Task");
const Project = require("../model/Project");

const Create_Task = async (req, res) => {
  const { projectId, title, duree, predeceseur } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const task = await Task.create({
        project: projectId,
        title,
        duree,
        predeceseur,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const Get_Tasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await Task.find({ project: projectId });
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Update_Task = async (req, res) => {
    const { taskId } = req.params;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body, // title, duree, predeceseur, project ...
            { new: true, runValidators: true }
          );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ updatedTask });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  const delete_Task = async (req, res) => {
    const { taskId } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  module.exports = {
    Create_Task,
    Get_Tasks,
    Update_Task,
    delete_Task,
  };
  