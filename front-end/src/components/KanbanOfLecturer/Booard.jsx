import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './Styles.scss'
import axiosInstance from '../../API/axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import TimeLineOfLecturer from '../Timeline/TimeLineOfLecturer';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const Booard = ({ subjectId }) => {
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
        const response = await axiosInstance.get(`/lecturer/subject/listTask/${subjectId}`, {
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
            <Column className='column' title="Must Do" tasks={data.filter(task => task.status === 'MustDo')} droppableId="MustDo" />
            <Column className='column' title="Doing" tasks={data.filter(task => task.status === 'Doing')} droppableId="Doing" />
            <Column className='column' title="Closed" tasks={data.filter(task => task.status === 'Closed')} droppableId="Closed" />
          </div>
        </DragDropContext>
      )}
      {showTimeLine && <TimeLineOfLecturer subjectId={subjectId} />}    
    </div>
  )
}

export default Booard