import React from 'react'

function Modal({ title, body, onConfirm, onCancel }) {
    return (
        <div className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{body}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={onConfirm}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal