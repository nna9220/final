// axiosInstance.js
import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
 const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});


export default axiosInstance;
