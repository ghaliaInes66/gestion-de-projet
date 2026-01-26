// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Task API - Fetch functions for task operations
 * 
 * Follow the same pattern as userApi.js and projectApi.js
 * 
 * Backend endpoints:
 * - POST /api/tasks/create - Create a new task
 * - GET /api/tasks/:projectId - Get all tasks for a project
 * - PUT /api/tasks/update/:taskId - Update a task
 * - DELETE /api/tasks/delete/:taskId - Delete a task
 */

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.projectId - Project ID this task belongs to
 * @param {string} taskData.title - Task title
 * @param {number} taskData.duree - Task duration
 * @param {Array<number>} taskData.predeceseur - Array of predecessor task IDs
 * @returns {Promise<Object>} - Returns { success: true, task } on success
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create task');
    }

    return data;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

/**
 * Get all tasks for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Returns { tasks } array
 */
export const getTasks = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch tasks');
    }

    return data;
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

/**
 * Update a task
 * @param {string} taskId - Task ID to update
 * @param {Object} updates - Task updates (title, duree, predeceseur, project, etc.)
 * @returns {Promise<Object>} - Returns { updatedTask } on success
 */
export const updateTask = async (taskId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/update/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update task');
    }

    return data;
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task ID to delete
 * @returns {Promise<Object>} - Returns { message } on success
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete task');
    }

    return data;
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

