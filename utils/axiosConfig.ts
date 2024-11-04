import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://proclubs.ea.com/api/fc', Pro clubs API base URL
  baseURL: 'https://56e3-2001-818-dcaa-f200-2800-8a70-7d34-4068.ngrok-free.app/api', // Ngrok url to API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;
