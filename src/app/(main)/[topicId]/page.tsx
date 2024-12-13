'use client'

import React, { useState } from 'react';
import { LucideIcon, ListTodo, ListCollapse, CircleHelp, Plus } from 'lucide-react';
import Sidebar from '../../components/sidebar';
import TodoList from '../../components/TodoList';

// Define the type for the menu item
interface MenuItem {
  icon: LucideIcon; // For Lucide icon
  text: string;
  component?: React.ComponentType;
}

// Define menuItems here
const menuItems: MenuItem[] = [
  {
    icon: ListTodo,
    text: "Todolist",
    component: () => <TodoList/>
  },
  {
    icon: ListCollapse,
    text: "Subtopics",
  },
  {
    icon: CircleHelp,
    text: "Question",
  },
];

export default function PlayGround() {
  // Initial state of selectedItem
  const [selectedItem, setSelectedItem] = useState<MenuItem>(menuItems[0]);

  // Dynamically render the selected component
  const RenderComponent = selectedItem.component ? selectedItem.component : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        <div className="flex-1 p-6">
          {/* Render selected component dynamically */}
          {RenderComponent && <RenderComponent />}
        </div>
      </div>
    </div>
  );
}