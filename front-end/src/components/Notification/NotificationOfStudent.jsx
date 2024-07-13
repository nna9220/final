import React, { useState, useEffect } from 'react';
import './notification.scss';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function NotificationOfStudent({ onUpdateUnreadCount }) {
    const [notifications, setNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState(new Set(JSON.parse(localStorage.getItem('readNotifications')) || []));
    const userToken = getTokenFromUrlAndSaveToStorage();

    useEffect(() => {
        document.title = "Trang chủ Trưởng bộ môn";

        if (userToken) {
            axiosInstance.get('/student/notification', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            })
                .then(response => {
                    console.log("Notification: ", response.data);
                    // Sắp xếp thông báo theo thời gian (mới nhất trước)
                    const sortedNotifications = response.data.sort((a, b) => new Date(b.dateSubmit) - new Date(a.dateSubmit));
                    setNotifications(sortedNotifications);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [userToken]);

    useEffect(() => {
        onUpdateUnreadCount(notifications.filter(notification => !readNotifications.has(notification.notificationId)).length);
    }, [notifications, readNotifications, onUpdateUnreadCount]);

    const handleNotificationClick = (notificationId) => {
        setReadNotifications(prevState => {
            const updatedReadNotifications = new Set(prevState).add(notificationId);
            localStorage.setItem('readNotifications', JSON.stringify(Array.from(updatedReadNotifications)));
            return updatedReadNotifications;
        });
    };

    return (
        <div className='notification-list'>
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <div 
                        key={notification.notificationId} 
                        className={`notification-item ${readNotifications.has(notification.notificationId) ? 'read' : 'unread'}`} 
                        onClick={() => handleNotificationClick(notification.notificationId)}
                    >
                        <h3>{notification.title}</h3>
                        {readNotifications.has(notification.notificationId) && (
                            <p>{notification.content}</p>
                        )}
                        <span>{notification.dateSubmit}</span>
                    </div>
                ))
            ) : (
                <p>Chưa có thông báo</p>
            )}
        </div>
    );
}

export default NotificationOfStudent;
