import React from 'react';
import { Eventcalendar, setOptions, Toast } from '@mobiscroll/react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import './TimeLineOfLecturer.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

const TimeLineOfLecturer = ({ subjectId }) => {
  const [data, setData] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();
  const [toastContext, setToastContext] = useState();

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [subjectId]);

  const myView = useMemo(
    () => ({
      calendar: {
        type: 'month',
        labels: true
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
    })), [data],
  );

  const firstResources = useMemo(
    () => data.map(task => ({
      id: task.taskId,
      name: task.requirement,
    })), [data]
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

  return (
    <div className="md-drag-drop-calendar-lecturer">
      <Eventcalendar
        view={myView}
        data={firstEvents}
        resources={firstResources}
        height={600}
        width={1050}
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
};

export default TimeLineOfLecturer;
