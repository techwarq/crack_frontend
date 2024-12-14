'use server'

import { cookies } from "next/headers";


type Goal = {
    id: string;
    title: string;
    description: string;
    topics?: []; // Adjusted to use any[] type
  };
type Topic = {
    id: string; // Topic ID (UUID string)
    title: string; // Topic title
    description?: string;
    goalId: string // Optional description of the topic
   // The user associated with the topic (nullable)
   
  };


  type TodoItem = {
    id: string;
    title: string;
    
    isCompleted: boolean;
    todoListId: string;
  };
  
  type TodoList = {
    id: string;
    title: string;
    description?: string;
    topicId: string;
    goalId: string;
    items: TodoItem[];
  };
export const getGoals = async (): Promise<Goal[]> => {
    try {
        const token = (await cookies()).get('token')?.value; // Example: retrieve token from localStorage or cookies
      const response = await fetch('http://localhost:4007/api/me/goals', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add token here
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      return [];
    }
  };


  export const postGoals = async (title: string, description: string): Promise<Goal | null> => {
    try {
        const token = (await cookies()).get('token')?.value; 

        const response = await fetch('http://localhost:4007/api/me/goals', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result as Goal;
    } catch (error) {
        console.error("Failed to post new goal:", error);
        return null;
    }
  }

 



  export const getTopics = async (goalId: string): Promise<Topic[]> => {
    try {
        if (!goalId) {
            throw new Error("Goal ID is required");
        }

        const token = (await cookies()).get('token')?.value;
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`http://localhost:4007/api/me/goals/${goalId}/topics`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch topics: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch topics:", error);
        return [];
    }
};

export const postTopics = async (goalId: string, title: string, description: string): Promise<Topic | null> => {
    try {
        if (!goalId) {
            throw new Error("Goal ID is required");
        }

        const token = (await cookies()).get('token')?.value;
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`http://localhost:4007/api/me/goals/${goalId}/topics`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create topic: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create topic:", error);
        throw error;
    }
};
export const postTodoList = async (
  topicId: string,
  goalId: string,
  listTitle: string,
  listDescription: string,
  items: { title: string; isCompleted?: boolean }[]
): Promise<TodoList | null> => {
  try {
    const token = (await cookies()).get('token')?.value;

    const response = await fetch(
      `http://localhost:4007/api/me/goals/${goalId}/topics/${topicId}/todolist`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          title: listTitle,
          description: listDescription,
          items,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create todo list: ${response.status}`);
    }

    const newTodoList = await response.json() as TodoList;

    // Add goalId to the response if it's missing
    return { ...newTodoList, goalId };
  } catch (error) {
    console.error("Failed to create todo list:", error);
    return null;
  }
};

export const getTodoLists = async (
  topicId: string,
  goalId: string
): Promise<TodoList[]> => {
  try {
    const token = (await cookies()).get('token')?.value;

    const response = await fetch(
      `http://localhost:4007/api/me/goals/${goalId}/topics/${topicId}/todolist`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch todo lists: ${response.status}`);
    }

    const data = await response.json();

    // Ensure goalId is added to each list
    return Array.isArray(data)
      ? data.map((list: TodoList) => ({ ...list, goalId }))
      : [];
  } catch (error) {
    console.error("Failed to fetch todo lists:", error);
    return [];
  }
};
