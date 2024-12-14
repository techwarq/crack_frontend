'use client'
import React, { createContext, useReducer, useContext, useMemo, useCallback } from "react";
import { TodoList } from "../types/Tdolist"; // Ensure this type is correctly imported
import { getTodoLists, postTodoList } from "../action/backend";

// Define the context type
export const TodoContext = createContext<{
  todoLists: TodoList[];
  topicId: string;
  dispatch: React.Dispatch<TodoAction>;
  addTodoList: (
    topicId: string,
    title: string,
    description: string,
    items: { title: string; isCompleted?: boolean }[]
  ) => Promise<void>;
  fetchTodoLists: (topicId: string) => Promise<void>;
}>({
  todoLists: [],
  topicId: "",
  dispatch: () => {},
  addTodoList: async () => {},
  fetchTodoLists: async () => {},
});

// Define action types
type TodoAction =
  | { type: "SET_TODO_LISTS"; payload: TodoList[] }
  | { type: "ADD_TODO_LIST"; payload: TodoList }
  | { type: "REMOVE_TODO_LIST"; payload: string }
  | { type: "UPDATE_TODO_LIST"; payload: TodoList }
  | { type: "SET_TOPIC_ID"; payload: string };

// State interface
interface TodoState {
  todoLists: TodoList[];
  topicId: string;
}

// Reducer function
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "SET_TODO_LISTS":
      return { ...state, todoLists: action.payload };
    case "ADD_TODO_LIST":
      return { ...state, todoLists: [...state.todoLists, action.payload] };
    case "REMOVE_TODO_LIST":
      return {
        ...state,
        todoLists: state.todoLists.filter((list) => list.id !== action.payload),
      };
    case "UPDATE_TODO_LIST":
      return {
        ...state,
        todoLists: state.todoLists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        ),
      };
    case "SET_TOPIC_ID":
      return { ...state, topicId: action.payload };
    default:
      return state;
  }
};

// Provider component
export const TodoContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todoLists: [],
    topicId: "",
  });

  // Memoized add todo list function
  const addTodoList = useCallback(async (
    topicId: string,
    title: string,
    description: string,
    items: { title: string; isCompleted?: boolean }[]
  ) => {
    try {
      const newTodoList = await postTodoList(topicId, title, description, items);
      if (newTodoList) {
        dispatch({ type: "ADD_TODO_LIST", payload: newTodoList });
      }
    } catch (error) {
      console.error("Failed to add todo list:", error);
    }
  }, []);

  // Memoized fetch todo lists function
  const fetchTodoLists = useCallback(async (topicId: string) => {
    // Optional: Add a check to prevent unnecessary fetches
    if (state.todoLists.length > 0 && state.topicId === topicId) {
      return; // Skip fetching if lists are already loaded for this topic
    }

    try {
      const lists = await getTodoLists(topicId);
      if (lists) {
        dispatch({ type: "SET_TODO_LISTS", payload: lists });
        dispatch({ type: "SET_TOPIC_ID", payload: topicId });
      }
    } catch (error) {
      console.error("Failed to fetch todo lists:", error);
    }
  }, [state.todoLists.length, state.topicId]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    todoLists: state.todoLists,
    topicId: state.topicId,
    dispatch,
    addTodoList,
    fetchTodoLists,
  }), [
    state.todoLists, 
    state.topicId, 
    addTodoList, 
    fetchTodoLists
  ]);

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoContextProvider");
  }
  return context;
};
