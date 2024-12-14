'use client'

import React from 'react';
import Sidebar from '../components/sidebar'; // Your Sidebar Component
import { TodoContextProvider } from '../context/TodolistContext';
 // Optional toast notifications

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   
     
     

    
      <div>
        <TodoContextProvider>
        {children}
        </TodoContextProvider></div>
      
     
    
  );
}
