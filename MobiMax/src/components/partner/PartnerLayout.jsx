import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, DollarSign, Settings, LogOut, Bell, ExternalLink, Package } from 'lucide-react';

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
      <div className="min-h-screen bg-[#f1f2f6]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f2f6] flex p-4 md:p-6 gap-6 font-sans selection:bg-[#e26a1b] selection:text-white relative overflow-hidden text-[#1e272e]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Sidebar */}
      <div className="w-[280px] bg-white rounded-2xl flex flex-col shadow-xl overflow-hidden relative z-20 flex-shrink-0 border border-gray-100">
        <Link to="/" className="pt-8 pb-6 px-6 flex items-center justify-start hover:opacity-80 transition-opacity cursor-pointer border-b border-gray-100">
          <img src="https://enovathemes.com/mobimax/wp-content/uploads/logo-retina.png" alt="MobiMax Logo" className="h-6 object-contain" />
          <span className="ml-3 text-[10px] font-black text-white uppercase tracking-widest bg-[#e26a1b] px-2.5 py-1 rounded-sm flex-shrink-0 shadow-sm">Partner</span>
        </Link>
        
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <nav className="space-y-2">
            <Link 
              to="/partner/dashboard" 
              className={`flex items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-wide text-xs ${location.pathname === '/partner/dashboard' ? 'bg-[#e26a1b] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e272e]'}`}
            >
              <LayoutDashboard className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/dashboard' ? 'scale-110' : ''}`} />
              Overview
            </Link>

            <Link 
              to="/partner/orders" 
              className={`flex items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-wide text-xs ${location.pathname === '/partner/orders' ? 'bg-[#e26a1b] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e272e]'}`}
            >
              <ShoppingBag className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/orders' ? 'scale-110' : ''}`} />
              Orders
            </Link>

            <Link 
              to="/partner/products" 
              className={`flex items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-wide text-xs ${location.pathname === '/partner/products' ? 'bg-[#e26a1b] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e272e]'}`}
            >
              <Package className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/products' ? 'scale-110' : ''}`} />
              Products
            </Link>

            <Link 
              to="/partner/earnings" 
              className={`flex items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-wide text-xs ${location.pathname === '/partner/earnings' ? 'bg-[#e26a1b] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e272e]'}`}
            >
              <DollarSign className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/earnings' ? 'scale-110' : ''}`} />
              Earnings
            </Link>

            <Link 
              to="/partner/settings" 
              className={`flex items-center px-4 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-wide text-xs ${location.pathname === '/partner/settings' ? 'bg-[#e26a1b] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e272e]'}`}
            >
              <Settings className={`h-5 w-5 mr-4 transition-transform duration-300 ${location.pathname === '/partner/settings' ? 'scale-110' : ''}`} />
              Settings
            </Link>

            <div className="pt-4 pb-2">
              <div className="h-px w-full bg-gray-100"></div>
            </div>

            <Link 
              to="/" 
              className="flex items-center px-4 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-[#d52b27] transition-all duration-300 group uppercase tracking-wide text-xs"
            >
              <ExternalLink className="h-5 w-5 mr-4 transition-transform duration-300 group-hover:scale-110" />
              Storefront
            </Link>
          </nav>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#1e272e] text-white flex items-center justify-center font-black text-lg shadow-sm border-2 border-white">
                {partnerUser?.company ? partnerUser.company.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <span className="block text-sm font-black text-[#1e272e] truncate w-24 uppercase">{partnerUser?.company || partnerUser?.name || 'Partner'}</span>
                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-[#2ed573] mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2ed573] mr-1.5"></span>Online</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="h-10 w-10 bg-white border border-gray-200 text-gray-500 flex items-center justify-center rounded-full hover:text-[#d52b27] hover:border-[#d52b27] transition-all duration-200 shadow-sm"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="h-24 bg-transparent flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center">
            <h1 className="text-4xl font-black text-[#1e272e] uppercase tracking-wider drop-shadow-sm">
              {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1) || 'Overview'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-[#e26a1b] shadow-md border border-gray-100 relative transition-all duration-300 hover:scale-105 group">
              <Bell className="h-5 w-5 group-hover:animate-swing" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-[#e55039] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
