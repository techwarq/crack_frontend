import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Move } from 'lucide-react';

const TodoList = () => {
  const [title, setTitle] = useState('My Todo List');
  const [todos, setTodos] = useState([
    { id: 'todo-1', content: 'Learn React' },
    { id: 'todo-2', content: 'Build a project' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  // Card Drag Handlers
  const handleCardMouseDown = (e) => {
    setIsDragging(true);
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    
    // Calculate offset to prevent card jumping
    const offsetX = e.clientX - cardRect.left;
    const offsetY = e.clientY - cardRect.top;
    
    card.style.position = 'fixed';
    card.style.cursor = 'grabbing';
    
    const moveCard = (moveEvent) => {
      setPosition({
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY
      });
    };
    
    const stopMoving = () => {
      setIsDragging(false);
      card.style.cursor = 'grab';
      document.removeEventListener('mousemove', moveCard);
      document.removeEventListener('mouseup', stopMoving);
    };
    
    document.addEventListener('mousemove', moveCard);
    document.addEventListener('mouseup', stopMoving);
  };

  // Todo list functionality
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newTodoItem = {
      id: `todo-${Date.now()}`,
      content: newTodo
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleTodoReorder = (draggedTodo, targetTodo) => {
    const newTodos = [...todos];
    const dragItemIndex = newTodos.findIndex(todo => todo.id === draggedTodo.id);
    const dropItemIndex = newTodos.findIndex(todo => todo.id === targetTodo.id);

    const [reorderedItem] = newTodos.splice(dragItemIndex, 1);
    newTodos.splice(dropItemIndex, 0, reorderedItem);

    setTodos(newTodos);
  };

  return (
    <Card 
      ref={cardRef}
      className={`w-full max-w-md absolute transition-none ${isDragging ? 'z-50 shadow-lg' : 'z-10'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <CardHeader 
        onMouseDown={handleCardMouseDown} 
        className="select-none flex flex-row items-center cursor-move"
      >
        <Move className="h-4 w-4 mr-2 text-gray-500" />
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none focus:outline-none"
          placeholder="Todo List Title"
        />
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
            className="mr-2"
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              draggable
              onDragStart={() => setDraggedItem(todo)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedItem && draggedItem.id !== todo.id) {
                  handleTodoReorder(draggedItem, todo);
                }
                setDraggedItem(null);
              }}
              className={`flex items-center bg-gray-100 p-3 rounded-lg cursor-move
                ${draggedItem?.id === todo.id ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <span className="flex-grow mr-2">{todo.content}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;