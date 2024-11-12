import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://proclubs.ea.com/api/fc', Pro clubs API base URL
  baseURL: `https://f926-2001-818-dcaa-f200-917e-8078-3d8b-923a.ngrok-free.app/api`, // Ngrok url to API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;
