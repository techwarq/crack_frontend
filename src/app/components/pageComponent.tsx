'use client'

import React from 'react';
import { ComponentType, useNavigation } from "../context/NavigationContext";
import Dashboard from "./dashboard";
import Questions from "./questions";
import SubTopic from "./subTopics";
import TodoList from "./TodoList";

// Define props interface for components
interface ComponentProps {
  topicId?: string;
}

// Type for the component map
type ComponentMapType = {
  [K in ComponentType]: React.ComponentType<ComponentProps>;
};

// Create the component map with proper typing
const ComponentMap: ComponentMapType = {
  todoList: (props: ComponentProps) => <TodoList {...props} topicId={props.topicId || ''} />,
  dashboard: Dashboard,
  subTopics: SubTopic,
  questions: Questions,
};

interface PageContentProps {
  topicId?: string;
}

export const PageContent: React.FC<PageContentProps> = ({ topicId }) => {
  const { activeComponents } = useNavigation();

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {Object.entries(activeComponents)
        .filter(([, isActive]) => isActive)
        .map(([componentType]) => {
          const Component = ComponentMap[componentType as ComponentType];
          return <Component key={componentType} topicId={topicId} />;
        })}
    </div>
  );
};