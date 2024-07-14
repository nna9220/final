import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import AlarmOnTwoToneIcon from '@mui/icons-material/AlarmOnTwoTone';
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './Styles.scss';
import axiosInstance from '../../API/axios';
import { toast } from 'react-toastify';

const Card = ({ task, index }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [detail, setDetail] = useState([]);
    const [files, setFiles] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [commentFiles, setCommentFiles] = useState([]);

    const handleCommentChange = (e) => {
        setCommentContent(e.target.value);
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        let isValid = true;
        let errorMessage = '';

        for (const file of files) {
            if (file.size > 5242880) { // 5MB
                errorMessage = 'File không được quá 5MB';
                isValid = false;
                break;
            }
        }

        if (isValid) {
            setCommentFiles(files);
        } else {
            e.target.value = null; // Clear file input
            toast.error(errorMessage); // Hiển thị thông báo lỗi bằng toast
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (!userToken) {
            toast.error('Cannot retrieve user token.');
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('content', commentContent);
            for (const file of commentFiles) {
                formData.append('fileInput', file);
            }

            const response = await axiosInstance.post(`/lecturer/comment/create/${task.taskId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            toast.success('Comment created successfully!');
            
            const newComment = response.data;
            setDetail((prevDetail) => ({
                ...prevDetail,
                listComment: [newComment, ...prevDetail.listComment], // Add new comment to the top
            }));

            if (Array.isArray(response.data.files)) {
                setFiles((prevFiles) => [
                    ...prevFiles,
                    ...response.data.files, // Assuming the server responds with files attached to the new comment
                ]);
            } else {
                console.error('Files in response data is not an array:', response.data.files);
            }

            setCommentContent('');
            setCommentFiles([]);
            handleViewTask(task.taskId);
        } catch (error) {
            console.error('Error creating comment:', error);
            toast.error('An error occurred while creating the comment.');
        }
    };

    const handleViewTask = (taskId) => {
        setSelectedTask(taskId);
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.get(`/lecturer/subject/detail/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        setDetail(response.data);
                        setFiles(response.data.listFile);
                    })
                    .catch(error => {
                        console.error(error);
                        toast.error('An error occurred while loading task details.');
                    });
            }
        }
    };

    const modalId = `exampleModal-${task.taskId}`;

    return (
        <Draggable draggableId={task.taskId} index={index}>
            {(provided) => (
                <div className='card-items' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="dropdown">
                        <label className='title-task-st'>{task.requirement}</label>
                        <button className="btn-secondary" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', backgroundColor: 'white', color: 'black' }}>
                            <MoreHorizTwoToneIcon />
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target={`#${modalId}`} href="#" onClick={() => handleViewTask(task.taskId)}>View</a></li>
                            <li><a className="dropdown-item" href="#">Delete</a></li>
                        </ul>
                    </div>
                    <div className="modal fade" id={modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">{task.requirement}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className='info-modal'>
                                        <div>
                                            <div className='lable-items'>
                                                <AddAlarmOutlinedIcon />
                                                <label className='name-label'>Thời gian bắt đầu:
                                                    <label className='name'>{task.timeStart}</label>
                                                </label>
                                            </div>
                                            <div className='lable-items'>
                                                <AlarmOnTwoToneIcon />
                                                <label className='name-label'>Thời gian kết thúc: {task?.timeEnd}</label>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='lable-items'>
                                                <AssignmentIndOutlinedIcon />
                                                <label className='name-label'>Người tạo task: {task?.createBy?.firstName + ' ' + task?.createBy?.lastName}</label>
                                            </div>
                                            <div className='lable-items'>
                                                <AssignmentTurnedInOutlinedIcon />
                                                <label className='name-label'>Người thực hiện: {task?.assignTo?.person?.firstName + ' ' + task?.assignTo?.person?.lastName}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <form onSubmit={handleSubmitComment}>
                                            <div className="mb-3">
                                                <label htmlFor="commentContent" className="form-label">Comment</label>
                                                <textarea className="form-control" id="commentContent" rows="3" value={commentContent} onChange={handleCommentChange} maxLength="225"></textarea>
                                            </div>
                                            <div className="mb-3">
                                                <input type="file" className="form-control" id="commentFile" onChange={handleFileChange} multiple />
                                            </div>
                                            <button type="submit" className="btn btn-primary" style={{ marginBottom: '10px' }}>Post Comment</button>
                                        </form>
                                    </div>
                                    <div className='comment-items'>
                                        {detail.listComment && detail.listComment
                                            .sort((a, b) => new Date(b.dateSubmit) - new Date(a.dateSubmit)) // Sort comments by date
                                            .map((comment, commentIndex) => (
                                                <div key={commentIndex}>
                                                    <div className='comment-item'>
                                                        <div className='header-comment'>
                                                            <label className='name-post'>{comment.poster?.firstName + ' ' + comment.poster?.lastName}</label>
                                                            <label className='time-post'>{comment.dateSubmit}</label>
                                                        </div>
                                                        <div className='body-comment'>
                                                            <p className='content-lecturer'>
                                                                {comment.content}
                                                            </p>
                                                            {files && files.map((file, fileIndex) => {
                                                                if (file.commentId?.commentId === comment.commentId) {
                                                                    return (
                                                                        <div key={fileIndex}>
                                                                            <a href={file.url}><p>{file.name}</p></a>
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return null;
                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ justifyItems: 'flex-end' }}>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Card;
