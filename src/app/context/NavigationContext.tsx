'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type of components that can be rendered
export type ComponentType = 
  | 'dashboard' 
  | 'todoList' 
  | 'subTopics' 
  | 'questions';

// Define the context type
interface NavigationContextType {
  activeComponents: Record<ComponentType, boolean>;
  toggleComponent: (component: ComponentType) => void;
}

// Create the context
const NavigationContext = createContext<NavigationContextType>({
  activeComponents: {
    dashboard: false,
    todoList: false,
    subTopics: false,
    questions: false
  },
  toggleComponent: () => {}
});

// Provider component
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeComponents, setActiveComponents] = useState<Record<ComponentType, boolean>>({
    dashboard: false,
    todoList: false,
    subTopics: false,
    questions: false
  });

  const toggleComponent = (component: ComponentType) => {
    setActiveComponents(prev => ({
      ...prev,
      [component]: !prev[component]
    }));
  };

  return (
    <NavigationContext.Provider value={{ activeComponents, toggleComponent }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};
