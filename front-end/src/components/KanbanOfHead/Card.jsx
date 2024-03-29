import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import AlarmOnTwoToneIcon from '@mui/icons-material/AlarmOnTwoTone';
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './styleKanban.scss'

const Card = ({ task, index }) => {
  const [taskDetail, setTaskDetail] = useState({});
  const [commentContent, setCommentContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); 

  useEffect(() => {
    const taskId = task.taskId;
    console.log("taskId:", taskId);
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axios.get(`http://localhost:5000/api/head/manager/detail/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("detailTask: ", response.data);
            setTaskDetail(response.data);
            console.log("detailTask2: ", taskDetail);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, []);

  const handleCommentChange = (event) => {
    setCommentContent(event.target.value);
  };

  const handleCommentSubmit = () => {  
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      axios.post(`http://localhost:5000/api/head/comment/create/${task.taskId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        // Xử lý phản hồi từ server nếu cần
        console.log('Comment submitted successfully:', response.data);
        // Xóa nội dung comment và tệp đã chọn sau khi gửi thành công
        setCommentContent('');
        setSelectedFile(null);
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Error submitting comment:', error);
      });
    }
  };
  

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ display: 'flex', userSelect: 'none', padding: '16px', margin: '0 0 8px 0', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', ...provided.draggableProps.style, }}>
          {task.requirement}
          <div style={{ marginLeft: '80px' }}>
            <div class="btn-group">
              <button type="button" class="btn" data-bs-toggle="dropdown" style={{ border: 'none' }}>
                <MoreHorizTwoToneIcon />
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" href="#">View</a></li>
                <li><a class="dropdown-item" href="#">Edit</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#">Delete Task</a></li>
              </ul>
            </div>
            <div class="modal modal-lg fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
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
                            <label className='name'>{ taskDetail?.task?.timeStart}</label>
                          </label>
                        </div>
                        <div className='lable-items'>
                          <AlarmOnTwoToneIcon />
                          <label className='name-label'>Thời gian kết thúc: {taskDetail?.task?.timeEnd}</label>
                        </div>
                      </div>
                      <div>
                        <div className='lable-items'>
                          <AssignmentIndOutlinedIcon />
                          <label className='name-label'>Người tạo task: {taskDetail?.task?.createBy?.firstName + ' ' + taskDetail?.task?.createBy?.lastName}</label>
                        </div>
                        <div className='lable-items'>
                          <AssignmentTurnedInOutlinedIcon />
                          <label className='name-label'>Người thực hiện: {taskDetail?.task?.assignTo?.person?.firstName + ' ' + taskDetail?.task?.assignTo?.person?.lastName}</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={commentContent} onChange={handleCommentChange}></textarea>
                      </div>
                    </div>
                    <div class="mb-3">
                      <input class="form-control" type="file" id="formFile" />
                    </div>
                    <div className='button-container'>
                      <button className='btn-comment' onClick={handleCommentSubmit}>
                        Comment
                      </button>
                    </div>
                    <div className='comment-items'>
                      {taskDetail.listComment && taskDetail.listComment.map((comment, index) => (
                        <div key={index}>
                          <div className='comment-item'>
                            <div className='header-comment'>
                              <label className='name-post'>{comment.poster.firstName + ' ' + comment.poster.lastName}</label>
                              <label className='time-post'>{comment.dateSubmit}</label>
                            </div>
                            <div className='body-comment'>
                              <label className='content'>{comment.content}</label><br />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
