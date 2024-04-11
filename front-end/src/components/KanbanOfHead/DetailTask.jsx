import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

const EditTaskForm = ({ subjectId }) => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = getTokenFromUrlAndSaveToStorage();
    console.log("subjectID2:", subjectId);
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/head/manager/listTask/${subjectId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        setTaskList(response.data.listTask);
        console.log("Detail: ", response.data.listTask);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [subjectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Hiển thị form chỉnh sửa task */}
    </div>
  );
};

export default EditTaskForm;
