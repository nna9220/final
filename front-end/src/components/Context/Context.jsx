import React, { useState } from 'react';
import './widget.scss';

const notifications = [
    { title: 'Thông báo 1', content: 'Nội dung của thông báo 1.' },
    { title: 'Thông báo 2', content: 'Nội dung của thông báo 2.' },
    { title: 'Thông báo 3', content: 'Nội dung của thông báo 3.' },
];

function Context() {
    const [visibleContent, setVisibleContent] = useState(null);

    const handleTitleClick = (index) => {
        setVisibleContent(visibleContent === index ? null : index);
    };

    return (
        <div className="notification-list">
            {notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                    <h3
                        className="notification-title"
                        onClick={() => handleTitleClick(index)}
                    >
                        {notification.title}
                    </h3>
                    {visibleContent === index && (
                        <p className="notification-content">{notification.content}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Context