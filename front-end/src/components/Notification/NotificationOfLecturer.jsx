import React from 'react';

function NotificationOfLecturer({ notifications }) {
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
                                className="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target={`#flush-collapseOne-${index}`} 
                                aria-expanded="false" 
                                aria-controls={`flush-collapseOne-${index}`}
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

export default NotificationOfLecturer;
