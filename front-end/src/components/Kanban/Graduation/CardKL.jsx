import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import AlarmOnTwoToneIcon from '@mui/icons-material/AlarmOnTwoTone';
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './scroll.scss'
import axiosInstance from '../../../API/axios';

const CardKL = ({ task, index }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [detail, setDetail] = useState({});
  const [file, setFile] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentFiles, setCommentFiles] = useState([]);

  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };
  

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setCommentFiles(e.target.files);
  };

  const handleViewTask = async (taskId) => {
    setSelectedTask(taskId);
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      try {
        const response = await axiosInstance.get(`/graduation/student/task/detail/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        // Lấy danh sách comment từ phản hồi của API và sắp xếp lại để đưa comment gần nhất lên trên cùng
        const sortedComments = response.data.listComment.reverse(); // Sắp xếp comment từ mới nhất đến cũ nhất
        setDetail(prevDetail => ({
          ...prevDetail,
          listComment: sortedComments
        }));
        setFile(response.data.listFile);
      } catch (error) {
        console.error('Error fetching task detail:', error);
      }
    }
  };
  

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (commentContent.trim() === '' && commentFiles.length === 0) {
      toast.warning('Vui lòng nhập nội dung comment hoặc chọn ít nhất một file.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('content', commentContent);
      for (const file of commentFiles) {
        formData.append('fileInput', file);
      }
  
      const response = await axiosInstance.post(`/graduation/student/comment/create/${task.taskId}`, formData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
  
      const newComment = response.data;
  
      // Sắp xếp lại listComment để đưa comment mới lên đầu
      setDetail(prevDetail => ({
        ...prevDetail,
        listComment: [newComment, ...prevDetail.listComment] // Đưa comment mới lên đầu mảng
      }));
  
      setCommentContent('');
      setCommentFiles([]);
      handleViewTask(task.taskId);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  

  const modalId = `exampleModal-${task.taskId}`;

  return (
    <Draggable draggableId={task?.taskId?.toString()} index={index}>
      {(provided) => (
        <div className="card-items" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className="dropdown">
            <label className='title-task-st'>{task.requirement}</label>
            <button className="btn-secondary" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', backgroundColor: 'white' }}>
              <MoreHorizTwoToneIcon />
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target={`#${modalId}`} href="#" onClick={() => handleViewTask(task.taskId)}>View</a></li>
              <li><a className="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
          <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                        <textarea className="form-control" id="commentContent" rows="3" value={commentContent} onChange={handleCommentChange}></textarea>
                      </div>
                      <div className="mb-3">
                        <input type="file" className="form-control" id="commentFile" onChange={handleFileChange} multiple />
                      </div>
                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary" style={{ marginBottom: '10px', display:'flex', justifyContent:'right'}}>Post Comment</button>
                      </div>
                    </form>
                  </div>
                  <div className='comment-items'>
                    {detail.listComment && detail.listComment.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <div className='comment-item'>
                          <div className='header-comment'>
                            <label className='name-post'>{comment.poster?.firstName + ' ' + comment.poster?.lastName}</label>
                            <label className='time-post'>{comment.dateSubmit}</label>
                          </div>
                          <div className='body-comment'>
                            <label className='content'>{comment.content}</label><br />
                            {file && file.map((files, fileIndex) => {
                              if (files.commentId?.commentId === comment.commentId) {
                                return (
                                  <div key={fileIndex}>
                                    {isImageFile(files.name) ? (
                                      <img src={files.url} alt={files.name} className='content-image' />
                                    ) : (
                                      <a href={files.url} target="_blank" rel="noopener noreferrer" download="" className='content-name'>
                                        {files.name}
                                      </a>
                                    )}
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
}

export default CardKL;

