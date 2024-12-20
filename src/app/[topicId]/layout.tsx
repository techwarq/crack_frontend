'use client'

import React from 'react';
 // Correct import path
 // Sidebar component
import { PageContent } from '../../components/pageComponent'; // Example content component
import { NavigationProvider } from '../context/NavigationContext';
import Sidebar from '../components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      
        <Sidebar />
        <div >
          {children} {/* Render the child components here */}
        </div>
      
    </NavigationProvider>
  );
}
