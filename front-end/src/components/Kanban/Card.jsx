import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import AlarmOnTwoToneIcon from '@mui/icons-material/AlarmOnTwoTone';
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './scroll.scss'
import axiosInstance from '../../API/axios';

const Card = ({ task, index }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [detail, setDetail] = useState([]);
  const [file, setFile] = useState([]);

  const [commentContent, setCommentContent] = useState('');
  const [commentFiles, setCommentFiles] = useState([]);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setCommentFiles(e.target.files);
  };

  const handleSubmitComment = async (e) => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    e.preventDefault();
    console.log("taskID-post: ", task.taskId);
    try {
      const formData = new FormData();
      formData.append('content', commentContent);
      for (const file of commentFiles) {
        formData.append('fileInput', file);
      }

      console.log("Comment-post: ", formData);
      const response = await axiosInstance.post(`/student/comment/create/${task.taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userToken}`, // Thay thế userToken bằng cách lấy từ storage hoặc một cách thích hợp khác
        },
      });
      console.log('Comment created successfully:', response.data);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleViewTask = (taskId) => {
    setSelectedTask(taskId);
    // Gửi yêu cầu API với taskId đã chọn
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get(`/student/task/detail/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("detailTask: ", response.data);
            setDetail(response.data);
            setFile(response.data.listFile);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  const modalId = `exampleModal-${task.taskId}`;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div className="card-items" ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}>
          <div class="dropdown">
            <label className='title-task-st'>{task.requirement}</label>
            <button class="btn-secondary" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', backgroundColor: 'white' }} >
              <MoreHorizTwoToneIcon />
            </button>
            <ul class="dropdown-menu">
              <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target={`#${modalId}`} href="#" onClick={() => handleViewTask(task.taskId)}>View</a></li>
              <li><a class="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
          <div class="modal fade" id={modalId} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">{task.requirement}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
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
                      <div class="mb-3">
                        <label for="commentContent" class="form-label">Comment</label>
                        <textarea class="form-control" id="commentContent" rows="3" value={commentContent} onChange={handleCommentChange}></textarea>
                      </div>
                      <div class="mb-3">
                        <input type="file" class="form-control" id="commentFile" onChange={handleFileChange} multiple />
                      </div>
                      <button type="submit" class="btn btn-primary">Post Comment</button>
                    </form>
                  </div>
                  <div className='comment-items'>
                    {detail.listComment && detail.listComment.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <div className='comment-item'>
                          <div className='header-comment'>
                            <label className='name-post'>{comment.poster.firstName + ' ' + comment.poster.lastName}</label>
                            <label className='time-post'>{comment.dateSubmit}</label>
                          </div>
                          <div className='body-comment'>
                            <label className='content'>{comment.content}</label><br />
                            {file && file.map((files, fileIndex) => {
                              // Kiểm tra xem tệp có thuộc về comment hiện tại không
                              if (files.commentId.commentId === comment.commentId) {
                                return (
                                  <div key={fileIndex}>
                                    <a href={files.url}><p>{files.name}</p></a>
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
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
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
