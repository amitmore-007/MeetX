import axios from 'axios';

const API = axios.create({
  // Replace the base URL with your deployed backend URL
  baseURL: 'https://activity-backend-ghgw.onrender.com/api', // Updated URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
