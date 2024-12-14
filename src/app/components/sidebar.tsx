import React, { useState } from 'react';
import { LucideIcon, ListTodo, ListCollapse, CircleHelp, Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import TodoList from './TodoList'; // Ensure this component is available
import { TodoContextProvider, useTodoContext } from '../context/TodolistContext';
import AddTodoBtn from './AddTodoIcon';

// Define the type for the menu item


const Sidebar = () =>{
  const { goalId, topicId } = useTodoContext();
  const [dialogOpen, setDialogOpen] = useState(false);


  const handleDialogClose = () => {
    setDialogOpen(false);
  };


  return (
    <>
      <div>
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
              <AddTodoBtn topicId={topicId} goalId={goalId}/>
              
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
      </div>
    </>
  );
};

export default Sidebar;
