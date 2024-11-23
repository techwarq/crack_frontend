// types/index.ts
import { LucideIcon } from 'lucide-react';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface CanvasItem {
  id: number;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface ComponentType {
  id: string;
  icon: LucideIcon;  // Updated to use LucideIcon type
  label: string;
}

export interface TodoListProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface SidebarProps {
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, componentType: string) => void;
  handleDragEnd: () => void;
}

export interface CanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  handleDrop: (e: React.DragEvent) => void;
  canvasItems: CanvasItem[];
  draggedItem: number | null;
  handleItemMouseDown: (e: React.MouseEvent, item: CanvasItem) => void;
}