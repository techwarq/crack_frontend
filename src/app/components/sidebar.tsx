import React, { useState } from 'react';
import { LucideIcon, ListTodo, ListCollapse, CircleHelp, Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import TodoList from './TodoList'; // Ensure this component is available

// Define the type for the menu item
interface MenuItem {
  icon: LucideIcon;
  text: string;
  component?: React.ComponentType;
  disabled?: boolean;
}

interface SidebarProps {
  selectedItem: MenuItem;
  setSelectedItem: (item: MenuItem) => void; // Ensure this function is passed correctly
}

const menuItems: MenuItem[] = [
  {
    icon: ListTodo,
    text: "Todolist",
    component: () => <TodoList/>// Set the component to render when selected
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

const Sidebar: React.FC<SidebarProps> = ({
  selectedItem,
   setSelectedItem = () => {},
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);


  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectedItem = (item: MenuItem) => {
    setSelectedItem(item);
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
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => !item.disabled && handleSelectedItem(item)} // Use the function handleSelectedItem to update selectedItem
                  className={`flex items-center gap-3 hover:text-yellow-300 duration-200 cursor-pointer ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  } ${selectedItem && selectedItem.text === item.text ? 'bg-gray-700' : ''}`}
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
