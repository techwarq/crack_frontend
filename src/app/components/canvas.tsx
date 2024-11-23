import React from 'react';
import TodoList from './TodoList';
import { CanvasProps } from '../types/sidebar';

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  handleDrop,
  canvasItems,
  draggedItem,
  handleItemMouseDown
}) => {
  return (
    <div
      ref={canvasRef}
      className="bg-gray-900  bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] "
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {canvasItems.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.position.x}px`,
            top: `${item.position.y}px`,
            transition: 'transform 0.1s ease',
            transform: draggedItem === item.id ? 'scale(1.02)' : 'scale(1)',
          }}
          className="cursor-move"
        >
          {item.type === 'todo' && (
            <TodoList 
              onMouseDown={(e) => handleItemMouseDown(e, item)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Canvas;