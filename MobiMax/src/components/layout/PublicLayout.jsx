import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Header/TopBar/TopBar';
import MiddleBar from './Header/MiddleBar/MiddleBar';
import BottomBar from './Header/BottomBar/BottomBar';
import MobileHeader from './Header/MobileHeader';
import Footer from './Footer/Footer';
import { useSettings } from '../../contexts/SettingsContext';
import MaintenanceScreen from '../MaintenanceScreen';

const PublicLayout = () => {
  const { globalSettings, loadingSettings } = useSettings();

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e26a1b]"></div>
      </div>
    );
  }

  if (globalSettings.maintenance_mode === 'true') {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="hidden md:block">
        <TopBar />
        <MiddleBar />
      </div>
      <div className="hidden md:block sticky top-0 z-[60]">
        <BottomBar />
      </div>
      <MobileHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
