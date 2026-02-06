import axios from 'axios';

const API_URL = '/api/tasks';

// Helper to get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await axios.post(API_URL, taskData, { headers: getAuthHeader() });
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await axios.put(`${API_URL}/${id}`, taskData, { headers: getAuthHeader() });
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Reorder tasks
  reorderTasks: async (tasks) => {
    const response = await axios.put(`${API_URL}/reorder`, { tasks }, { headers: getAuthHeader() });
    return response.data;
  },
};
