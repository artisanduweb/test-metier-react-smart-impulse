import React from 'react';
import { Outlet } from 'react-router-dom';
import {Sidebar} from './Sidebar';

export const FullscreenLayout = () => {
  return (
    <div className="fullscreen-layout">
      <Outlet />
    </div>
  );
};

export const SidebarLayout = () => {
  return (
    <div className="sidebar-layout flex items-start space-between h-screen">
      <Sidebar />
      <main className="grid w-full h-full">
      <Outlet />
      </main>
    </div>
  );
}
