import React, { useState, useEffect } from 'react';
import './notification.scss';

function NotificationOfLecturer({ notifications, onReadNotification }) {
    const [readNotifications, setReadNotifications] = useState(new Set(JSON.parse(localStorage.getItem('readNotificationsLecturer')) || []));
    const [visibleContent, setVisibleContent] = useState(null);

    useEffect(() => {
        const storedReadNotifications = JSON.parse(localStorage.getItem('readNotificationsLecturer')) || [];
        setReadNotifications(new Set(storedReadNotifications));
    }, []);

    const handleReadNotification = (id) => {
        if (!readNotifications.has(id)) {
            setReadNotifications(prevState => {
                const newReadNotifications = new Set(prevState).add(id);
                localStorage.setItem('readNotificationsLecturer', JSON.stringify(Array.from(newReadNotifications)));
                onReadNotification(id);  // Notify parent component
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

    return (
        <div className='notification-list'>
            {notifications.map((item, index) => (
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

export default NotificationOfLecturer;
