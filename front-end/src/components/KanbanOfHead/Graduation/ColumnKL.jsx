import React from 'react'
import { Droppable } from 'react-beautiful-dnd';
import CardKL from './CardKL';

const ColumnKL = ({title, tasks, droppableId }) => {
    return (
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='column-lecturer'
          >
            <h5 className='title-column-lec'>{title}</h5>
            {tasks.map((task, index) => (
              <CardKL key={task} task={task} index={index} /> // Use Card component
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

export default ColumnKL;