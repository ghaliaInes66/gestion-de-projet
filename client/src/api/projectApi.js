// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Project API - Fetch functions for project operations
 * 
 * Follow the same pattern as userApi.js
 * 
 * Backend endpoints:
 * - POST /api/projects/create - Create a new project
 * - GET /api/projects/:userId - Get all projects for a user
 * - PUT /api/projects/update/:projectId - Update a project
 * - DELETE /api/projects/delete/:projectId - Delete a project
 */

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} projectData.userId - User ID who owns the project
 * @param {string} projectData.title - Project title
 * @param {string} projectData.description - Project description
 * @returns {Promise<Object>} - Returns { success: true, project } on success
 */
export const createProject = async (projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create project');
    }

    return data;
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};

/**
 * Get all projects for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Returns { projects } array
 */
export const getProjects = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch projects');
    }

    return data;
  } catch (error) {
    console.error('Get projects error:', error);
    throw error;
  }
};

/**
 * Update a project
 * @param {string} projectId - Project ID to update
 * @param {Object} updates - Project updates
 * @param {string} updates.title - New project title (optional)
 * @param {string} updates.description - New project description (optional)
 * @returns {Promise<Object>} - Returns { project } on success
 */
export const updateProject = async (projectId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/update/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update project');
    }

    return data;
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project ID to delete
 * @returns {Promise<Object>} - Returns { message } on success
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/delete/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete project');
    }

    return data;
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Returns project object
 */
export const getProjectById = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch project');
    }

    return data;
  } catch (error) {
    console.error('Get project by ID error:', error);
    throw error;
  }
};
