"use client";

import React from "react";

import { ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";



const AddTodoBtn: React.FC = () => {


  return (
    <Button
      
      className="flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors"
    >
      <ListTodo size={20} />
      
    </Button>
  );
};

export default AddTodoBtn;
