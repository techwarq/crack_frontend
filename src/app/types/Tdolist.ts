export interface TodoItem {
    id?: string;
    title: string;
    
    isCompleted: boolean;
  }
  
  export interface TodoList {
    id?: string;
    title: string;
    description?: string;
    items: TodoItem[];
    topicId: string;
    goalId: string;
  }
  