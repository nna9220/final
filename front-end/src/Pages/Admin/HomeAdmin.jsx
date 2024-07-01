import React, { useState, useEffect } from 'react';
import './HomeAdmin.scss';
import NotificationOfAdmin from '../../components/Notification/NotificationOfAdmin';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';

function HomeAdmin() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [isCancelClicked, setIsCancelClicked] = useState(false);
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        document.title = "Trang chủ admin";

        if (userToken) {
            axiosInstance.get('/admin/notification', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    const readNotifications = new Set(JSON.parse(localStorage.getItem('readNotificationsStudent')) || []);
                    const notificationsWithReadStatus = response.data.map(notification => ({
                        ...notification,
                        read: readNotifications.has(notification.notificationId),
                    }));
                    setNotifications(notificationsWithReadStatus);
                    setUnreadCount(notificationsWithReadStatus.filter(notification => !notification.read).length);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [userToken]);

    const handleReadNotification = (id) => {
        setUnreadCount(prevCount => prevCount - 1);
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.notificationId === id ? { ...notification, read: true } : notification
            )
        );
    };

    // Kiểm tra quyền truy cập
    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    const response = await axiosInstance.post('/check-authorization/admin', null, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                        },
                    });
                    console.log("Nhận : ", response.data);
                    if (response.data == "Authorized") {
                        setAuthorized(true);
                    } else {
                        setAuthorized(false);
                    }
                } catch (error) {
                    if (error.response) {
                        console.error("Response error:", error.response.data);
                        console.error("Response status:", error.response.status);
                        console.error("Response headers:", error.response.headers);
                        setAuthorized(false);
                    } else if (error.request) {
                        console.error("Request error:", error.request);
                        setAuthorized(false);
                    } else {
                        console.error("Axios error:", error.message);
                        setAuthorized(false);
                    }
                }
            } else {
                // Nếu không có token, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                setAuthorized(false);
            }
        };

        checkAuthorization();
    }, []);

    if (!authorized) {
        return <Navigate to="/" />;
    }

    return (
        <div className='HomeStudent'>
            <Sidebar />
            <div className='context'>
                <Navbar unreadCount={unreadCount} />
                <hr />
                <div className='widgets'>
                    <div className='headMana-class'>
                        <div className='titleMana-class'>
                            <h5>TRANG CHỦ</h5>
                        </div>
                    </div>
                    <NotificationOfAdmin notifications={notifications} onReadNotification={handleReadNotification} />
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
