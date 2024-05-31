import React, { useState, useEffect } from 'react';

function NotificationOfHeader({ notifications }) {
    const [readNotifications, setReadNotifications] = useState(new Set(JSON.parse(localStorage.getItem('readNotifications')) || []));

    useEffect(() => {
        const storedReadNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
        setReadNotifications(new Set(storedReadNotifications));
    }, []);

    const handleReadNotification = (id) => {
        setReadNotifications(prevState => {
            const newReadNotifications = new Set(prevState).add(id);
            localStorage.setItem('readNotifications', JSON.stringify(Array.from(newReadNotifications)));
            return newReadNotifications;
        });
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
        <div className='widget'>
            <div className="accordion" id="accordionFlushExample">
                {notifications.map((item, index) => (
                    <div className="accordion-item" key={item.notificationId}>
                        <h2 className="accordion-header">
                            <button 
                                className={`accordion-button collapsed ${readNotifications.has(item.notificationId) ? 'read-notification' : ''}`} 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target={`#flush-collapseOne-${index}`} 
                                aria-expanded="false" 
                                aria-controls={`flush-collapseOne-${index}`}
                                onClick={() => handleReadNotification(item.notificationId)}
                                style={{backgroundColor:'var(--bs-accordion-active-bg)', fontWeight:'bold'}}
                            >
                                {item.title}
                            </button>
                        </h2>
                        <div 
                            id={`flush-collapseOne-${index}`} 
                            className="accordion-collapse collapse" 
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                {formatContent(item.content)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationOfHeader;
