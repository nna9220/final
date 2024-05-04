import React from 'react'
import { Droppable } from 'react-beautiful-dnd';
import Cart from './Cart';

const Column = ({title, tasks, droppableId }) => {
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
              <Cart key={task} task={task} index={index} /> // Use Card component
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

export default Column;