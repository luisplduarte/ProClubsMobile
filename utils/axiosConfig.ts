import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://proclubs.ea.com/api/fc', Pro clubs API base URL
  baseURL: `https://9996-2001-818-dcaa-f200-391d-2f86-d7e6-cb1c.ngrok-free.app/api`, // Ngrok url to API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;
