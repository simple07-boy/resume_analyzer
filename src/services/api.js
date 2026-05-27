import axios from 'axios';

const API = axios.create({
  baseURL: 'https://resume-analyzer-backend-fk2o.onrender.com',
});

export default API;
