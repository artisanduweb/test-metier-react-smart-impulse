import React from 'react';
import logo from "@/assets/logo.svg";

export const Sidebar = () => {
  return (
    <div className="w-[300px] border-r border-gray-200 h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img className="w-8 h-8 rounded-full" src={logo} alt="logo" />
          <span className="text-lg font-bold">Test métier</span>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="flex items-center space-x-2">
              <span className="text-lg">🏠</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/project" className="flex items-center space-x-2">
              <span className="text-lg">📂</span>
              <span>Projects</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

  );
}