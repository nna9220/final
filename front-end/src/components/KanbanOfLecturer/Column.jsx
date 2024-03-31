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
            className="column"
            style={{ background: 'white', padding: '8px', width: '300px' }}
          >
            <h5>{title}</h5>
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