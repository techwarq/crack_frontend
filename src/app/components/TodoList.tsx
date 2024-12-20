"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getTodoLists, postTodoList } from "../action/backend";
import { v4 as uuidv4 } from "uuid"; // Import uuid

export interface TodoItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  description: string;
  items: TodoItem[];
  topicId: string;
}

const generateUniqueId = (): string => uuidv4();

interface EditableTodoListProps {
  topicId: string; // Accept topicId as a prop
}

const EditableTodoList: React.FC<EditableTodoListProps> = ({ topicId }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!topicId) throw new Error("Topic ID is missing.");

      const todoLists = await getTodoLists(topicId);
      if (todoLists.length > 0) {
        const latestList = todoLists[0];
        setTitle(latestList.title ?? "");
        setDescription(latestList.description ?? "");
        setTodos(
          (latestList.items ?? []).map((item) => ({
            id: item.id ?? generateUniqueId(),
            title: item.title ?? "",
            isCompleted: item.isCompleted ?? false,
          }))
        );
      } else {
        setTitle("");
        setDescription("");
        setTodos([{ id: generateUniqueId(), title: "", isCompleted: false }]);
      }
    } catch (err) {
      setError("Failed to fetch todo lists. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    if (topicId) {
      fetchTodos();
    }
  }, [topicId, fetchTodos]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value ?? "");
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value ?? "");
  };

  const handleTodoChange = (id: string, newTitle: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    ));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTodo: TodoItem = { id: generateUniqueId(), title: "", isCompleted: false };
      const newTodos = [
        ...todos.slice(0, index + 1),
        newTodo,
        ...todos.slice(index + 1),
      ];
      setTodos(newTodos);

      setTimeout(() => {
        const nextInput = document.getElementById(`todo-${newTodo.id}`) as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else if (e.key === "Backspace" && todos[index].title === "") {
      e.preventDefault();
      if (todos.length > 1) {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);

        setTimeout(() => {
          const prevInput = document.getElementById(`todo-${todos[index - 1]?.id}`) as HTMLInputElement;
          prevInput?.focus();
        }, 0);
      }
    }
  };

  const saveTodoList = async () => {
    try {
      setIsLoading(true);
      if (!topicId) throw new Error("Topic ID is missing.");

      const nonEmptyTodos = todos.filter((todo) => todo.title.trim() !== "");
      await postTodoList(
        topicId,
        title.trim(),
        description.trim(),
        nonEmptyTodos.map((todo) => ({
          title: todo.title,
          isCompleted: todo.isCompleted,
        }))
      );
      fetchTodos();
    } catch (err) {
      setError("An error occurred while saving. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-72 p-4 bg-zinc-900 rounded-lg">
      {isLoading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
        className="text-2xl font-semibold text-white mb-2 bg-transparent w-full focus:outline-none placeholder:text-zinc-500"
        aria-label="Todo List Title"
      />
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Description"
        className="text-sm text-zinc-400 mb-4 bg-transparent w-full focus:outline-none placeholder:text-zinc-500"
        aria-label="Todo List Description"
      />
      <div className="space-y-3">
        {todos.map((todo, index) => (
          <div key={todo.id} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${todo.id}`}
              checked={todo.isCompleted}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="border-zinc-700 data-[state=checked]:bg-zinc-700"
              aria-label="Complete todo item"
            />
            <input
              id={`todo-${todo.id}`}
              type="text"
              value={todo.title}
              onChange={(e) => handleTodoChange(todo.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, todo.id, index)}
              className={`text-sm bg-transparent w-full focus:outline-none ${
                todo.isCompleted
                  ? "line-through text-zinc-500"
                  : "text-zinc-200"
              }`}
              placeholder={index === todos.length - 1 ? "Add a task..." : ""}
              aria-label="Todo item input"
            />
          </div>
        ))}
      </div>
      <button
        onClick={saveTodoList}
        disabled={isLoading}
        className={`mt-4 px-4 py-2 text-white rounded ${
          isLoading 
            ? "bg-zinc-500 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Saving..." : "Save Todo List"}
      </button>
    </div>
  );
};

export default EditableTodoList;
