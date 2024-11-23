import React from 'react';
import { ListTodo, Type, Image, FileText, Layout, Calendar, Bookmark } from 'lucide-react';
import { ComponentType, SidebarProps } from '../types/sidebar';

const componentTypes: ComponentType[] = [
  { id: 'todo', icon: ListTodo, label: 'Todo List' },
  { id: 'text', icon: Type, label: 'Text Block' },
  { id: 'image', icon: Image, label: 'Image' },
  { id: 'note', icon: FileText, label: 'Note' },
  { id: 'layout', icon: Layout, label: 'Layout' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'bookmark', icon: Bookmark, label: 'Bookmark' }
];

const Sidebar: React.FC<SidebarProps> = ({ isDragging, handleDragStart, handleDragEnd }) => {
  return (
    <div className="w-20 bg-gray-900 border-r border-gray-800 p-3 flex flex-col gap-4">
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Layout size={24} className="text-white" />
        </div>
      </div>
      
      <div className="space-y-4">
        {componentTypes.map((component) => {
          const IconComponent = component.icon;
          return (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
              onDragEnd={handleDragEnd}
              className="group relative"
            >
              <div className={`p-3 bg-gray-800 rounded-xl cursor-move 
                           hover:bg-gray-700 transition-all duration-200
                           border border-transparent hover:border-purple-500
                           flex items-center justify-center
                           transform hover:scale-105
                           ${isDragging ? 'opacity-50' : ''}`}>
                <IconComponent 
                  size={22} 
                  className="text-gray-400 group-hover:text-purple-400 transition-colors duration-200" 
                />
              </div>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-xs text-gray-200 
                            rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none whitespace-nowrap">
                {component.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;