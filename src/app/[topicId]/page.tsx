'use client'

import React, { useState } from 'react';
import Sidebar from "../components/sidebar";
import Canvas from "../components/canvas";
import { CanvasItem } from '../types/sidebar';

export default function PlayGround() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    setIsDragging(true);
    e.dataTransfer.setData('componentType', componentType);
    
    // Create a ghost image
    const ghostElement = document.createElement('div');
    ghostElement.className = 'bg-purple-500 opacity-50 rounded-lg w-64 h-32';
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 32, 32);
    setTimeout(() => document.body.removeChild(ghostElement), 0);
    
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    const rect = canvasRef.current?.getBoundingClientRect();
    
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCanvasItems([...canvasItems, {
        id: Date.now(),
        type: componentType,
        position: { x, y }
      }]);
    }
    setIsDragging(false);
  };

  const handleItemMouseDown = (e: React.MouseEvent, item: CanvasItem) => {
    const startX = e.clientX - item.position.x;
    const startY = e.clientY - item.position.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      
      if (rect) {
        const x = moveEvent.clientX - rect.left - startX;
        const y = moveEvent.clientY - rect.top - startY;
        
        setCanvasItems(items => items.map(i => 
          i.id === item.id ? { ...i, position: { x, y } } : i
        ));
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        <Sidebar
          isDragging={isDragging}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
        />
        <Canvas
          canvasRef={canvasRef}
          handleDrop={handleDrop}
          canvasItems={canvasItems}
          draggedItem={draggedItem}
          handleItemMouseDown={handleItemMouseDown}
          
        />
      </div>
    </div>
  );
}