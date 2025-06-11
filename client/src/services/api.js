import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false, // change to true if using cookies
  headers: 
  {
    'Content-Type': 'application/json',
  },
});

export default api;
