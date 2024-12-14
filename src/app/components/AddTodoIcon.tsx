"use client";

import React from "react";
import { useTodoContext } from "../context/TodolistContext";
import { ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddTodoBtnProps {
  topicId: string;
  
}

const AddTodoBtn: React.FC<AddTodoBtnProps> = ({ topicId,  }) => {
  const { addTodoList, } = useTodoContext();

  const handleAddTodo = async () => {
    try {
      await addTodoList(topicId, "", "", []);
    } catch (error) {
      console.error("Failed to add todo list:", error);
    }
  };

  return (
    <Button
      onClick={handleAddTodo}
      className="flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors"
    >
      <ListTodo size={20} />
      
    </Button>
  );
};

export default AddTodoBtn;
