import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Header/TopBar/TopBar';
import MiddleBar from './Header/MiddleBar/MiddleBar';
import BottomBar from './Header/BottomBar/BottomBar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <MiddleBar />
      <BottomBar />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
