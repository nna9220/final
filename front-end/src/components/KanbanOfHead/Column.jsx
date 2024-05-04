import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card'; // Import Card component
import './styleKanban.scss'

const Column = ({title, tasks, droppableId }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="column-head"
        >
          <h5 className='title-column-head' >{title}</h5>
          {tasks.map((task, index) => (
            <Card key={task.taskId} task={task} index={index} /> // Use Card component
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
