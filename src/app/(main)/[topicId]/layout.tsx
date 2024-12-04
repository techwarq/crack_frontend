'use client'

import React from 'react';
import Sidebar from '../../components/sidebar'; // Your Sidebar Component
 // Optional toast notifications

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   
     
     

    
      <div>
         <Sidebar />
        {children}</div>
      
     
    
  );
}
