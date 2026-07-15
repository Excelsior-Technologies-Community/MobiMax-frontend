import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Header/TopBar/TopBar';
import MiddleBar from './Header/MiddleBar/MiddleBar';
import BottomBar from './Header/BottomBar/BottomBar';
import MobileHeader from './Header/MobileHeader';
import Footer from './Footer/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="hidden md:block">
        <TopBar />
        <MiddleBar />
        <BottomBar />
      </div>
      <MobileHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
