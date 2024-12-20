import React from "react";

const Questions: React.FC = () => (
  <div className="p-4 bg-white shadow rounded mb-4">
    <h1 className="text-2xl font-bold mb-4">Sub Topics</h1>
    <ul className="space-y-2">
      <li className="p-2 bg-gray-100 rounded">React Fundamentals</li>
      <li className="p-2 bg-gray-100 rounded">State Management</li>
      <li className="p-2 bg-gray-100 rounded">Component Design</li>
    </ul>
  </div>
);

export default Questions;
