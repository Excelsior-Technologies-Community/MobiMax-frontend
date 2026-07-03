import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, DollarSign, Settings, LogOut, Bell, ExternalLink } from 'lucide-react';

const PartnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [partnerUser, setPartnerUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    const userStr = localStorage.getItem('partnerData');
    if (userStr) {
      setPartnerUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partnerData');
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/';
  };

  if (location.pathname.includes('/login') || location.pathname.includes('/signup')) {
    return (
      <div className="min-h-screen bg-[#F2F4F7]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex p-4 gap-4 font-sans selection:bg-[#e26a1b] selection:text-white">
      {/* Floating Sidebar (Bento Pill) */}
      <div className="w-[280px] bg-white rounded-[32px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative z-20 flex-shrink-0">
        <Link to="/" className="pt-8 pb-6 px-6 flex items-center justify-start hover:opacity-80 transition-opacity cursor-pointer">
          <img src="https://enovathemes.com/mobimax/wp-content/uploads/logo-retina.png" alt="MobiMax Logo" className="h-5 object-contain" />
          <span className="ml-2.5 text-[9px] font-black text-[#e26a1b] uppercase tracking-widest bg-[#FFF2EB] px-2 py-1 rounded-full flex-shrink-0">Partner</span>
        </Link>
        
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
          <nav className="space-y-1.5">
            <Link 
              to="/partner/dashboard" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === '/partner/dashboard' ? 'bg-[#e26a1b] text-white shadow-[0_8px_20px_rgba(226,106,27,0.25)]' : 'text-gray-500 hover:bg-[#F8F9FA] hover:text-gray-900'}`}
            >
              <LayoutDashboard className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/dashboard' ? 'scale-110' : ''}`} />
              Overview
            </Link>

            <Link 
              to="/partner/orders" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === '/partner/orders' ? 'bg-[#e26a1b] text-white shadow-[0_8px_20px_rgba(226,106,27,0.25)]' : 'text-gray-500 hover:bg-[#F8F9FA] hover:text-gray-900'}`}
            >
              <ShoppingBag className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/orders' ? 'scale-110' : ''}`} />
              Orders
            </Link>

            <Link 
              to="/partner/earnings" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === '/partner/earnings' ? 'bg-[#e26a1b] text-white shadow-[0_8px_20px_rgba(226,106,27,0.25)]' : 'text-gray-500 hover:bg-[#F8F9FA] hover:text-gray-900'}`}
            >
              <DollarSign className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/earnings' ? 'scale-110' : ''}`} />
              Earnings
            </Link>

            <Link 
              to="/partner/settings" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === '/partner/settings' ? 'bg-[#e26a1b] text-white shadow-[0_8px_20px_rgba(226,106,27,0.25)]' : 'text-gray-500 hover:bg-[#F8F9FA] hover:text-gray-900'}`}
            >
              <Settings className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/settings' ? 'scale-110' : ''}`} />
              Settings
            </Link>

            <div className="pt-4 pb-2">
              <div className="h-px w-full bg-gray-100 rounded-full"></div>
            </div>

            <Link 
              to="/" 
              className="flex items-center px-4 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-[#F8F9FA] hover:text-[#e26a1b] transition-all duration-300 group"
            >
              <ExternalLink className="h-5 w-5 mr-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Back to Website
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <div className="bg-[#F8F9FA] rounded-[24px] p-4 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#e26a1b] to-[#d65a11] text-white flex items-center justify-center font-bold text-xl shadow-md mb-3">
              {partnerUser?.company ? partnerUser.company.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="text-center mb-4">
              <span className="block text-sm font-bold text-gray-900 truncate w-40">{partnerUser?.company || partnerUser?.name || 'Partner'}</span>
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-500 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Online</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full py-2.5 text-xs text-gray-600 font-bold hover:text-red-500 hover:bg-white rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Floating Top Header */}
        <header className="h-20 bg-transparent flex items-center justify-between px-4 z-10 sticky top-0">
          <div className="flex items-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight ml-4">
              {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1) || 'Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-4 mr-4">
            <button className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-[#e26a1b] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative transition-all duration-300 hover:scale-105">
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div className="p-4 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
