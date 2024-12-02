'use client'

import React, { useState } from 'react';
import Sidebar from '../components/sidebar';


export default function PlayGround() {


  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        <Sidebar />
      </div>
    </div>
  );
}
