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
import axiosInstance from '../../API/axios';

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
        axiosInstance.get(`/head/manager/detail/${taskId}`, {
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
      axiosInstance.post(`/head/comment/create/${task.taskId}`, {
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
    <Draggable draggableId={task.taskId} index={index}>
      {(provided) => (
        <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} style={{
          display: 'flex', userSelect: 'none', padding: '16px', margin: '0 0 3px 0',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '10px',
          justifyContent: 'space-between',
          ...provided.draggableProps.style,
        }}
        >
          {task.requirement}
          <div class="dropdown" style={{ border: 'none' }}>
            <button class="btn-secondary" data-bs-toggle="dropdown" aria-expanded="false" style={{ display: 'flex', border: 'none', backgroundColor: 'none' }} >
              <MoreHorizTwoToneIcon />
            </button>
            <ul class="dropdown-menu">
              <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target={`#modal-${task.taskId}`} href="#" >View</a></li>
              <li><a class="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
          <div class="modal fade" id={`modal-${task.taskId}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    <div class="mb-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                  </div>
                  <div class="mb-3">
                    <input class="form-control" type="file" id="formFile" />
                  </div>
                  <div className='button-container'>
                    <button className='btn-comment' >
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
