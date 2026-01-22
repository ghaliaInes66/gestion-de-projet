// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * User API - Fetch functions for user operations
 * 
 * This file demonstrates the pattern for making API calls using fetch.
 * You can follow the same pattern for projects and tasks.
 */

/**
 * Sign up a new user
 * @param {Object} userData - User data containing name, email, and password
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - Returns { user } on success, or { name, email, password } errors on failure
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // If response is not ok (status 200-299), handle errors
    if (!response.ok) {
      // Backend returns error object with field-specific errors
      throw new Error(JSON.stringify(data));
    }

    // Success - return the user data
    return data;
  } catch (error) {
    // Handle network errors or parse error messages
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Login an existing user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - Returns { user } on success, or error object on failure
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    // If response is not ok (status 200-299), handle errors
    if (!response.ok) {
      // Backend returns error object with field-specific errors
      throw new Error(JSON.stringify(data));
    }

    // Success - return the user data
    return data;
  } catch (error) {
    // Handle network errors or parse error messages
    console.error('Login error:', error);
    throw error;
  }
};

