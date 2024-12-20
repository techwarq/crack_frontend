'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { ListTodo, ListCollapse, CircleHelp, Plus } from 'lucide-react';
import { PageContent } from '../components/pageComponent';

export default function PlayGround() {
  const params = useParams();
  
  // Handle different parameter types and ensure we return a string or undefined
  const getTopicId = (): string | undefined => {
    if (!params) return undefined;
    
    // If params.topicId exists and is a string, use it
    if (typeof params.topicId === 'string') {
      return params.topicId;
    }
    
    // If params[0] exists and is a string, use it
    if (typeof params[0] === 'string') {
      return params[0];
    }
    
    // If params.topicId is an array, use the first element
    if (Array.isArray(params.topicId) && params.topicId.length > 0) {
      return params.topicId[0];
    }
    
    return undefined;
  };

  const topicId = getTopicId();

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        <div className="flex-1 pl-7">
          <PageContent topicId={topicId} />
        </div>
      </div>
    </div>
  );
}