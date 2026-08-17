import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attaches the JWT saved by AuthContext to every request — components
// never need to know the token exists.
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('marlow_auth');
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
