import React from 'react'
import { Eventcalendar, getJson, setOptions, Toast } from '@mobiscroll/react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import './TimeLineOfStudent.scss'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const TimeLineOfHeader= ({ subjectId }) => {
  const [data, setData] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();
  const [toastContext, setToastContext] = useState();
  const [showTimeLine, setShowTimeLine] = useState(false);
  const [showListTask, setShowListTask] = useState(true);
  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/head/manager/listTask/${subjectId}`, {
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

  const toggleTimeline = () => {
    setShowTimeLine(!showTimeLine);
    setShowListTask(false);
  }
  const toggleListTask = () => {
    setShowListTask(!showListTask);
    setShowTimeLine(false);
  }
  
  const myView = useMemo(
    () => ({
      timeline: {
        type: 'month',
      },
    }),
    [],
  );

  const randomColor = () => {
    const randomNum = Math.floor(Math.random() * 16777215);
    return '#' + randomNum.toString(16);
  };

  const firstEvents = useMemo(
    () => data.map(task => ({
      start: task.timeStart,
      end: task.timeEnd,
      title: task.requirement,
      color: randomColor(),
      resource: task.taskId,
    })),[data],
  );

  const firstResources = useMemo(
    () => data.map(task => ({
      id: task.taskId,
      name: task.requirement,
    })),
    [data]
  );

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleFirstCalEventCreated = useCallback((args) => {
    if (args.action === 'externalDrop') {
      setToastText('Event dropped to Calendar 1');
      setToastContext('.md-drag-drop-first-calendar');
      setToastOpen(true);
    }
  }, []);

  const handleSecondCalEventCreated = useCallback((args) => {
    if (args.action === 'externalDrop') {
      setToastText('Event dropped to Calendar 2');
      setToastContext('.md-drag-drop-second-calendar');
      setToastOpen(true);
    }
  }, []);

  return (
    <div className="md-drag-drop-calendar">
      <Eventcalendar
        view={myView}
        data={firstEvents}
        resources={firstResources}
        height={500}
        width={1200}
        dragToMove={true}
        eventDelete={true}
        externalDrag={true}
        externalDrop={true}
        onEventCreated={handleFirstCalEventCreated}
        className="md-drag-drop-first-calendar"
      />

      <Toast message={toastText} context={toastContext} isOpen={isToastOpen} onClose={handleCloseToast} />
    </div>
  );
}

export default TimeLineOfHeader