'use client'

import React, { useState, useRef, MouseEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Move } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Define the shape of a Todo item
interface Todo {
  id: string;
  content: string;
}

// Define the shape of the card's position
interface Position {
  x: number;
  y: number;
}

const TodoList: React.FC = () => {
  const [title, setTitle] = useState<string>('My Todo List');
  const [todos, setTodos] = useState<Todo[]>([
    { id: 'todo-1', content: 'Learn React' },
    { id: 'todo-2', content: 'Build a project' },
  ]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<Todo | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Card Drag Handlers
  const handleCardMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const card = cardRef.current;
    
    if (!card) return;
    
    const cardRect = card.getBoundingClientRect();
    
    // Calculate offset to prevent card jumping
    const offsetX = e.clientX - cardRect.left;
    const offsetY = e.clientY - cardRect.top;
    
    card.style.position = 'fixed';
    card.style.cursor = 'grabbing';
    
    const moveCard = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY
      });
    };
    
    const stopMoving = () => {
      setIsDragging(false);
      if (card) {
        card.style.cursor = 'grab';
      }
      document.removeEventListener('mousemove', moveCard as unknown as EventListener);
      document.removeEventListener('mouseup', stopMoving as EventListener);
    };
    
    document.addEventListener('mousemove', moveCard as unknown as EventListener);
    document.addEventListener('mouseup', stopMoving as EventListener);
  };

  // Todo list functionality
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newTodoItem: Todo = {
      id: `todo-${Date.now()}`,
      content: newTodo
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleTodoReorder = (draggedTodo: Todo, targetTodo: Todo) => {
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
          {todos.map((todo) => (
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