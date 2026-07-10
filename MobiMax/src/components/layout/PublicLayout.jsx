import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Header/TopBar/TopBar';
import MiddleBar from './Header/MiddleBar/MiddleBar';
import BottomBar from './Header/BottomBar/BottomBar';
import Footer from './Footer/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <MiddleBar />
      <BottomBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
