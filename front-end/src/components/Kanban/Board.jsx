import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './scroll.scss'

const KanbanBoard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axios.get('http://localhost:5000/api/student/task/list', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("detailTaskSt: ", response.data.listTask);
            setData(response.data.listTask);
          })
          .catch(error => {
            console.error("Error fetching task list:", error);
            // Xử lý lỗi ở đây, ví dụ:
            // setErrorMessage("Error fetching task list. Please try again later.");
          });
      }
    }
  }, []);
  const onDragEnd = (result) => {
    // Code xử lý kéo và thả task tại đây
  };

  return (
    <div>
        <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        <Column className='column' title="Must Do" tasks={data.filter(task => task.status === 'MustDo')} droppableId="MustDo" />
        <Column className='column' title="Doing" tasks={data.filter(task => task.status === 'Doing')} droppableId="Doing" />
        <Column className='column' title="Closed" tasks={data.filter(task => task.status === 'Closed')} droppableId="Closed" />
        {/* Các cột khác */}
      </div>
    </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
