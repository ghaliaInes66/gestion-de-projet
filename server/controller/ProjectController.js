const express = require("express");
const Project = require("../model/Project");
const User = require("../model/User");
const Create_Project = async (req, res) => {
  const { userId, title, name, description, startDate, endDate } = req.body;
  
  // Use 'name' if 'title' is not provided (for backward compatibility)
  const projectName = title || name;

  try {
    // If userId is provided, check if user exists
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }

    // Validate that name is provided
    if (!projectName || projectName.trim().length === 0) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // Check for existing project with same name for this user (case-insensitive)
    const trimmedName = projectName.trim();
    const query = userId 
      ? { user: userId, name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      : { name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } };
    
    const existingProject = await Project.findOne(query);
    if (existingProject) {
      return res
        .status(400)
        .json({ success: false, error: "A project with this name already exists." });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({ error: "End date cannot be before start date" });
      }
    }

    const projectData = {
      name: trimmedName,
      title: trimmedName,
      description,
      startDate,
      endDate,
    };
    
    if (userId) {
      projectData.user = userId;
    }

    const project = await Project.create(projectData);

    // Add project to user's projects if userId exists
    if (userId) {
      const user = await User.findById(userId);
      user.projects.push(project._id);
      await user.save();
    }

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const Get_Projects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ user: userId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Update_Project = async (req, res) => {
  const { projectId } = req.params;
  const { title, name, description, startDate, endDate } = req.body;
  
  // Use 'name' if 'title' is not provided
  const projectName = title || name;
  
  try {
    // Check if updating name/title, ensure uniqueness
    if (projectName) {
       const currentProject = await Project.findById(projectId);
       if (!currentProject) {
         return res.status(404).json({ error: "Project not found" });
       }
       
       const trimmedName = projectName.trim();
       const query = currentProject.user
         ? { user: currentProject.user, name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, _id: { $ne: projectId } }
         : { name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, _id: { $ne: projectId } };
       
       const duplicateProject = await Project.findOne(query);

       if (duplicateProject) {
          return res.status(400).json({ error: "A project with this name already exists." });
       }
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({ error: "End date cannot be before start date" });
      }
    }

    const updateData = {};
    if (projectName) {
      updateData.name = projectName.trim();
      updateData.title = projectName.trim();
    }
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;

    const project = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all projects
const Get_All_Projects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get specific project
const Get_Project = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
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
  Get_All_Projects,
  Get_Project,
  Update_Project,
  delete_Project,
};
