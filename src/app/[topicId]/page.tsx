'use client'

import React, { useState } from 'react';
import { LucideIcon, ListTodo, ListCollapse, CircleHelp, Plus } from 'lucide-react';
import Sidebar from '../components/sidebar';
import TodoList from '../components/TodoList';
import { useTodoContext } from '../context/TodolistContext';


// Define menuItems here


export default function PlayGround() {
  const { topicId } = useTodoContext();


  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        
      <Sidebar />
        <div className="flex-1 p-4">
          {/* Include TodoList component here */}
          <TodoList topicId={topicId}  />
        </div>
        </div>
      </div>
   
  );
}