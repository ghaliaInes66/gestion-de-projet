const express = require("express");
const Task = require("../model/Task");
const Project = require("../model/Project");

const Create_Task = async (req, res) => {
  const { projectId, title, description, status, priority, duration, duree, assignedTo, dependencies, predeceseur } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Check for existing task with same name in this project (case-insensitive)
    const trimmedTitle = title.trim();
    const existingTask = await Task.findOne({ 
      project: projectId, 
      title: { $regex: new RegExp(`^${trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });
    if (existingTask) {
        return res
          .status(400)
          .json({ success: false, error: "A task with this name already exists in this project." });
    }

    const taskData = {
        project: projectId,
        title: trimmedTitle,
        description,
        status,
        priority,
        duration: duration || duree,
        duree: duration || duree,
        assignedTo,
        dependencies: dependencies || predeceseur,
        predeceseur: dependencies || predeceseur,
    };

    const task = await Task.create(taskData);

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const Get_Tasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Helper function to check for circular dependencies
const hasCircularDependency = async (taskId, dependencies) => {
  if (!dependencies || dependencies.length === 0) return false;
  
  const visited = new Set();
  const stack = [...dependencies];
  
  while (stack.length > 0) {
    const currentId = stack.pop();
    
    // If we find the original task in dependencies, it's circular
    if (currentId.toString() === taskId.toString()) {
      return true;
    }
    
    if (visited.has(currentId.toString())) continue;
    visited.add(currentId.toString());
    
    try {
      const task = await Task.findById(currentId);
      if (task && task.dependencies && task.dependencies.length > 0) {
        stack.push(...task.dependencies);
      }
    } catch (err) {
      // Skip invalid task IDs
      continue;
    }
  }
  
  return false;
};

const Update_Task = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Check for duplicate name if title is being updated
        if (req.body.title) {
            const currentTask = await Task.findById(taskId);
            if (!currentTask) {
                return res.status(404).json({ error: "Task not found" });
            }

            const trimmedTitle = req.body.title.trim();
            const duplicateTask = await Task.findOne({
                project: currentTask.project,
                title: { $regex: new RegExp(`^${trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                _id: { $ne: taskId }
            });

            if (duplicateTask) {
                return res.status(400).json({ error: "A task with this name already exists in this project." });
            }
        }

        // Check for circular dependencies
        if (req.body.dependencies) {
          const hasCircular = await hasCircularDependency(taskId, req.body.dependencies);
          if (hasCircular) {
            return res.status(400).json({ error: "Circular dependency detected" });
          }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body, // title, duree, predeceseur, project ...
            { new: true, runValidators: true }
          );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Get all tasks
  const Get_All_Tasks = async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Get specific task
  const Get_Task = async (req, res) => {
    const { taskId } = req.params;
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(task);
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
    Get_All_Tasks,
    Get_Task,
    Update_Task,
    delete_Task,
  };
  