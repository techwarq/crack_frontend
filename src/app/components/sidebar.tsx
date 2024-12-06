import React, { useState } from "react";
import { ListTodo, ListCollapse, CircleHelp, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"; // Assuming DialogContent is part of your Dialog component

const menuItems = [
  {
    icon: ListTodo,
    text: "Todolist",
    disabled: false,
    onClick: addTodo,
  },
  {
    icon: ListCollapse,
    text: "Subtopics",
    disabled: false,
  },
  {
    icon: CircleHelp,
    text: "Question",
    disabled: false,
  },
];

export default function Sidebar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addTodo, setaddTodo] = useState('');

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
                  onClick={() => setDialogOpen(true)} // Opening dialog
                >
                  <Plus className="text-yellow-300" />
                  <p className="opacity-0 duration-200 group-hover:opacity-100">
                    Add
                  </p>
                </DialogTrigger>
              </div>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 hover:text-yellow-300 duration-200"
                >
                  <item.icon className="text-white" size={24} />
                  <p className="opacity-0 duration-200 group-hover:opacity-100 text-white">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <DialogContent className="bg-gray-800 text-white">
            {/* Add dialog content here */}
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
}
