import React, { useState, useEffect } from 'react';
import './notification.scss';

function NotificationOfHeader({ notifications, onReadNotification }) {
    const [readNotifications, setReadNotifications] = useState(new Set(JSON.parse(localStorage.getItem('readNotificationsHead')) || []));
    const [visibleContent, setVisibleContent] = useState(null);

    useEffect(() => {
        const storedReadNotifications = JSON.parse(localStorage.getItem('readNotificationsHead')) || [];
        setReadNotifications(new Set(storedReadNotifications));
    }, []);

    const handleReadNotification = (id) => {
        if (!readNotifications.has(id)) {
            setReadNotifications(prevState => {
                const newReadNotifications = new Set(prevState).add(id);
                localStorage.setItem('readNotificationsHead', JSON.stringify(Array.from(newReadNotifications)));
                onReadNotification(id);
                return newReadNotifications;
            });
        }
    };

    const handleTitleClick = (index, id) => {
        setVisibleContent(visibleContent === index ? null : index);
        handleReadNotification(id);
    };

    const formatContent = (content) => {
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    // Đảo ngược thứ tự mảng notifications
    const reversedNotifications = [...notifications].reverse();

    return (
        <div className='notification-list'>
            {reversedNotifications.map((item, index) => (
                <div key={item.notificationId} className="notification-item">
                    <h3 
                        className={`notification-title ${readNotifications.has(item.notificationId) ? 'read-notification' : ''}`} 
                        onClick={() => handleTitleClick(index, item.notificationId)}
                    >
                        {item.title}
                    </h3>
                    {visibleContent === index && (
                        <div className="notification-content">
                            {formatContent(item.content)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default NotificationOfHeader;
