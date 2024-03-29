import React, { useState } from 'react';
import axios from 'axios';
import EditTaskForm from './DetailTask';

const TaskMenu = ({ taskId, onDelete }) => {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDelete = async () => {
    // Xử lý sự kiện xóa task
  };

  return (
    <div className="task-menu">
      <div className="more-options" onClick={() => setEditMode(!editMode)}>Edit</div>
      {editMode ? <EditTaskForm taskId={taskId} /> : null}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TaskMenu;
