'use server'

import { cookies } from "next/headers";

type Goal = {
    id: string;
    title: string;
    description: string;
    topics?: []; // Adjusted to use any[] type
  };
  
export const getGoals = async (): Promise<Goal[]> => {
    try {
        const token = (await cookies()).get('token')?.value; // Example: retrieve token from localStorage or cookies
      const response = await fetch('http://localhost:4005/api/me/goals', {
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

        const response = await fetch('http://localhost:4005/api/me/goals', {
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
  




