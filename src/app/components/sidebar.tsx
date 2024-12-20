import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ComponentType, useNavigation } from '../context/NavigationContext';

// Define the sidebar items
const sidebarItems = [
  {
    icon: '📋',
    component: 'todoList' as ComponentType,
    label: 'Todo List'
  },
];

const Sidebar = () => {
  const { activeComponents, toggleComponent } = useNavigation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="hidden lg:flex fixed top-0 left-0 h-screen w-full p-4 items-center pointer-events-none z-[39]">
          <div className="pointer-events-auto group flex w-16 text-white text-[16px] font-medium flex-col items-start gap-6 overflow-hidden rounded-[20px] border-2 border-gray-700 bg-gray-900 px-4 py-6 hover:w-40 duration-200 z-[99999]">
            <div className="border-b border-gray-700 pb-4 w-full">
              <DialogTrigger
                className="flex w-full text-yellow-300 hover:text-yellow-400 focus:text-yellow-400 cursor-pointer items-center gap-3 px-2 duration-200 justify-start"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="text-yellow-300" />
                <p className="opacity-0 duration-200 group-hover:opacity-100">
                  Add
                </p>
              </DialogTrigger>
            </div>
            
            {sidebarItems.map((item) => (
              <button
                key={item.component}
                onClick={() => toggleComponent(item.component)}
                className={`flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors ${
                  activeComponents[item.component] ? 'bg-blue-400' : 'hover:bg-gray-600'
                }`}
              >
                <span className="size-20">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <DialogContent className="bg-gray-800 text-white">
          <div>
            <p>Dialog content goes here</p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={handleDialogClose}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;