// axiosInstance.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL_HOME = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

const axiosInstanceHome = axios.create({
    baseURL: BASE_URL_HOME,
});

export default axiosInstance;
