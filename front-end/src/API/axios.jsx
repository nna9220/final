// axiosInstance.js
import axios from 'axios';

const BASE_URL = '/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export default axiosInstance;
