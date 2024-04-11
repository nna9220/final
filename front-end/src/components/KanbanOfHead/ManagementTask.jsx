import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './styleKanban.scss'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const ManagementTask = ({subjectId}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/head/manager/listTask/${subjectId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        setData(response.data.listTask);
        console.log("DataTask:", response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [subjectId]);

  const onDragEnd = (result) => {
    // Code xử lý kéo và thả task tại đây
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        <Column className='column' title="Must Do" tasks={data.filter(task => task.status === 'MustDo')} droppableId="MustDo" />
        <Column className='column' title="Doing" tasks={data.filter(task => task.status === 'Doing')} droppableId="Doing" />
        <Column className='column' title="Closed" tasks={data.filter(task => task.status === 'Closed')} droppableId="Closed" />
        {/* Các cột khác */}
      </div>
    </DragDropContext>
  );
};

export default ManagementTask;
