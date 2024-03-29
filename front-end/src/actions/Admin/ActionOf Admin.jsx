import axiosInstance from '../../API/axios';

export const getAdminUser = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/home');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw error;
    }
};