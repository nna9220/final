import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

const KanbanBoard = () => {
  const [taskList, setTaskList] = useState([]);

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
            setTaskList(response.data.listTask);
          })
          .catch(error => {
            console.error("Error fetching task list:", error);
            // Xử lý lỗi ở đây, ví dụ:
            // setErrorMessage("Error fetching task list. Please try again later.");
          });
      }
    }
  }, []);

  return (
    <div>
      <div className="kanban-board">
        <div className="column">
          <h3>Must Do</h3>
          {taskList.filter(task => task.status === 'Must Do').map(task => (
            <div key={task.task_id} className="task">
              <p>{task.requirement}</p>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Doing</h3>
          {taskList.filter(task => task.status === 'Doing').map(task => (
            <div key={task.task_id} className="task">
              <p>{task.requirement}</p>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Closed</h3>
          {taskList.filter(task => task.status === 'Closed').map(task => (
            <div key={task.task_id} className="task">
              <p>{task.requirement}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
