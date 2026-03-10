import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

// Attach JWT to every request if available
API.interceptors.request.use(cfg => {
    const token = localStorage.getItem('wele_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default API;
