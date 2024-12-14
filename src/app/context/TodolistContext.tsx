import React, { createContext, useReducer, useContext } from "react";
import { TodoList } from "../types/Tdolist"; // Assuming you have the correct types for TodoList
import { getTodoLists, postTodoList } from "../action/backend";

// Define the context
export const TodoContext = createContext<{
  todoLists: TodoList[];
  goalId: string;
  topicId: string;
  dispatch: React.Dispatch<TodoAction>;
  addTodoList: (
    topicId: string,
    goalId: string,
    title: string,
    description: string,
    items: { title: string; isCompleted?: boolean }[]
  ) => Promise<void>;
  fetchTodoLists: (topicId: string, goalId: string) => Promise<void>;
}>({
  todoLists: [],
  goalId: "",
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
  | { type: "SET_GOAL_ID"; payload: string }
  | { type: "SET_TOPIC_ID"; payload: string };

// State type that will hold todoLists, goalId, and topicId
interface TodoState {
  todoLists: TodoList[];
  goalId: string;
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
    case "SET_GOAL_ID":
      return { ...state, goalId: action.payload };
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
    goalId: "",
    topicId: "",
  });

  // Add a new todo list
  const addTodoList = async (
    topicId: string,
    goalId: string,
    title: string,
    description: string,
    items: { title: string; isCompleted?: boolean }[]
  ) => {
    try {
      const newTodoList = await postTodoList(topicId, goalId, title, description, items);
      if (newTodoList) {
        dispatch({ type: "ADD_TODO_LIST", payload: newTodoList });
      }
    } catch (error) {
      console.error("Failed to add todo list:", error);
    }
  };

  // Fetch todo lists
  const fetchTodoLists = async (topicId: string, goalId: string) => {
    try {
      const lists = await getTodoLists(topicId, goalId);
      if (lists) {
        dispatch({ type: "SET_TODO_LISTS", payload: lists });
      }
    } catch (error) {
      console.error("Failed to fetch todo lists:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todoLists: state.todoLists,
        goalId: state.goalId,
        topicId: state.topicId,
        dispatch,
        addTodoList,
        fetchTodoLists,
      }}
    >
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
