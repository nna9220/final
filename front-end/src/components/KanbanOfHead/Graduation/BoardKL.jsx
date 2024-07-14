import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ColumnKL from './ColumnKL';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import TimeLineOfHeadGraduation from '../../Timeline/TimeLineOfHeadGraduation';

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
        const response = await axiosInstance.get(`/head/graduation/manager/listTask/${subjectId}`, {
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
      <ul class="nav" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link-list active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={toggleListTask}>List task</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link-list" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={toggleTimeline}>Time Line</button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
          {showListTask && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="kanban-board">
                <ColumnKL className='column' title="Must Do" tasks={data.filter(task => task.status === 'MustDo')} droppableId="MustDo" />
                <ColumnKL className='column' title="Doing" tasks={data.filter(task => task.status === 'Doing')} droppableId="Doing" />
                <ColumnKL className='column' title="Closed" tasks={data.filter(task => task.status === 'Closed')} droppableId="Closed" />
              </div>
            </DragDropContext>
          )}
          {showTimeLine && <TimeLineOfHeadGraduation subjectId={subjectId} />}
        </div>
        <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
          {showTimeLine && <TimeLineOfHeadGraduation subjectId={subjectId} />}
        </div>
      </div>
    </div>
  )
}

export default BoardKL