import React, { useState } from 'react';
import { Move } from 'lucide-react';
import { TodoItem, TodoListProps } from '../types/sidebar';

const TodoList: React.FC<TodoListProps> = ({ onMouseDown }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-4 w-64 select-none"
      onMouseDown={onMouseDown}
    >
      <div className="flex justify-between items-center mb-4 cursor-move bg-gray-50 p-2 rounded">
        <span className="text-sm font-medium text-gray-600">Todo List</span>
        <Move size={16} className="text-gray-400" />
      </div>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </form>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => setTodos(todos.map(t => 
                t.id === todo.id ? { ...t, completed: !t.completed } : t
              ))}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;