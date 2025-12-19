import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// CallTones API
export const callTonesAPI = {
  getAll: (params) => api.get('/calltones', { params }),
  getOne: (id) => api.get(`/calltones/${id}`),
  upload: (formData) => {
    return api.post('/calltones/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/calltones/${id}`),
  select: (id) => api.put(`/calltones/${id}/select`),
  getAIGenerated: () => api.get('/calltones/ai-generated'),
};

export default api;
