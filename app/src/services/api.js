import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/token', credentials, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/me'),
};

export const todoService = {
  getTodos: (completed = null) => {
    const params = completed !== null ? { completed } : {};
    return api.get('/todos', { params });
  },
  createTodo: (todo) => api.post('/todos', todo),
  updateTodo: (id, updates) => api.put(`/todos/${id}`, updates),
  deleteTodo: (id) => api.delete(`/todos/${id}`),
};

export default api;