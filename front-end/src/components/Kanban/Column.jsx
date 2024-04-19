import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card'; 
import './scroll.scss'

const Column = ({title, tasks, droppableId, }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="column-task"
        >
          <h5 className='title-column'>{title}</h5>
          {tasks.map((task, index) => (
            <Card key={task.taskId} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
