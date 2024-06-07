import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = localStorage.getItem('accessToken'); // Lấy token từ lưu trữ
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken !== null) {
                console.log('Token đã được lưu trữ với key "accessToken".');
                // Thực hiện các hành động khi token đã được lưu trữ
            } else {
                console.log('Không tìm thấy token với key "accessToken" trong localStorage.');
                // Thực hiện các hành động khi token chưa được lưu trữ
            }
            if (!userToken) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/admin/check-authorization/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authorization:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthorization();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
