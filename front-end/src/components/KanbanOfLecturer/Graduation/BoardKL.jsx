import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ColumnKL from './ColumnKL';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import TimeLineOfLecturerGraduation from '../../Timeline/TimeLineOfLecturerGraduation';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';

const BoardKL = ({ subjectId }) => {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [showTimeLine, setShowTimeLine] = useState(false);
  const [showListTask, setShowListTask] = useState(true);
  const [formNewTask, setFormNewTask] = useState({
    requirement: '',
    timeStart: '',
    timeEnd: '',
    assignTo: '',
  })

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setFormNewTask(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubjectId = () => {
    setSelectedSubjectId(subjectId);
  }
  const toggleTimeline = () => {
    setShowTimeLine(!showTimeLine);
    setShowListTask(false);
  }
  const toggleListTask = () => {
    setShowListTask(!showListTask);
    setShowTimeLine(false);
  }
  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/lecturer/subjectGraduation/listTask/${subjectId}`, {
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
    <div>
      <div>
        <div className='list-button' style={{display:'flex', justifyContent:'flex-end'}}>
          <div>
            <button type="button" className='button-add-task' onClick={toggleListTask}>
              <DnsOutlinedIcon /> List Task
            </button>
            <button type="button" className='button-add-task' onClick={toggleTimeline}>
              <TimelineOutlinedIcon subjectId={subjectId} /> Time Line
            </button>
          </div>
        </div>
      </div>
      {showListTask && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            <ColumnKL className='column' title="Must Do" tasks={data.filter(task => task.status === 'MustDo')} droppableId="MustDo" />
            <ColumnKL className='column' title="Doing" tasks={data.filter(task => task.status === 'Doing')} droppableId="Doing" />
            <ColumnKL className='column' title="Closed" tasks={data.filter(task => task.status === 'Closed')} droppableId="Closed" />
          </div>
        </DragDropContext>
      )}
      {showTimeLine && <TimeLineOfLecturerGraduation subjectId={subjectId} />}    
    </div>
  )
}

export default BoardKL