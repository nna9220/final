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

function TimeLineOfStudentGraduation() {
 const [data, setData] = useState([]);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();
  const [toastContext, setToastContext] = useState();
  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/graduation/student/task/list', {
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

export default TimeLineOfStudentGraduation