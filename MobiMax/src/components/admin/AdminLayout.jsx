import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell, ChevronDown, ChevronUp, Image, Mail, Layers } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleStatusUpdate = ({ id, status, company }) => {
      if (status === 'under_review') {
        const newNotif = {
          id: Date.now(),
          message: `New KYC Application submitted for review.`,
          timestamp: new Date().toISOString()
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    };

    socket.on('partner_status_updated', handleStatusUpdate);

    return () => {
      socket.off('partner_status_updated', handleStatusUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Do not show sidebar on the login page itself
  if (location.pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-900">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out md:flex w-64 bg-[#0A0D14] text-white flex flex-col border-r border-[#1C212D]`}>
        <div className="h-20 flex items-center justify-center border-b border-[#1C212D]">
          <div className="bg-white px-4 py-1.5 rounded-xl shadow-sm">
            <img src="/mobimax-logo.png" alt="MobiMax Logo" className="h-10 object-contain" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-4">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/admin/dashboard' ? 'bg-[#e26a1b] text-white shadow-[0_4px_12px_rgba(226,106,27,0.3)]' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
            >
              <LayoutDashboard className={`h-5 w-5 mr-3.5 ${location.pathname === '/admin/dashboard' ? 'text-white' : ''}`} />
              Dashboard
            </Link>

            {/* Accordion Menu */}
            <div>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname.includes('/admin/users') || location.pathname.includes('/admin/partners') ? 'bg-[#1C212D] text-white' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
              >
                <div className="flex items-center">
                  <Users className={`h-5 w-5 mr-3.5 ${location.pathname.includes('/admin/users') || location.pathname.includes('/admin/partners') ? 'text-[#e26a1b]' : ''}`} />
                  Users & Partners
                </div>
                {isUserMenuOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isUserMenuOpen ? 'max-h-40 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-1.5 pl-12 pr-2 py-2 rounded-xl bg-[#0F131D] border border-[#1C212D]">
                  <Link 
                    to="/admin/partners" 
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin/partners' ? 'text-white bg-[#1C212D]' : 'text-gray-400 hover:text-white hover:bg-[#1C212D]'}`}
                  >
                    Partners
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin/users' ? 'text-white bg-[#1C212D]' : 'text-gray-400 hover:text-white hover:bg-[#1C212D]'}`}
                  >
                    End User
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              to="/admin/categories" 
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/admin/categories' ? 'bg-[#1C212D] text-white' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
            >
              <Layers className="h-5 w-5 mr-3.5" />
              Categories
            </Link>

            <Link 
              to="/admin/advertisements" 
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/admin/advertisements' ? 'bg-[#1C212D] text-white' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
            >
              <Image className="h-5 w-5 mr-3.5" />
              Advertisements
            </Link>

            <Link 
              to="/admin/messages" 
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/admin/messages' ? 'bg-[#1C212D] text-white' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
            >
              <Mail className="h-5 w-5 mr-3.5" />
              Messages
            </Link>

            <Link 
              to="/settings" 
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${location.pathname === '/admin/settings' ? 'bg-[#1C212D] text-white' : 'text-gray-400 hover:bg-[#1C212D] hover:text-white'}`}
            >
              <Settings className="h-5 w-5 mr-3.5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-[#1C212D]">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-[#1C212D] rounded-xl font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3.5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent w-full">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 border-b border-gray-100 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative group hidden sm:block">
              <Search className="h-5 w-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#e26a1b] transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-[#e26a1b]/10 focus:border-[#e26a1b]/20 outline-none transition-all text-sm w-48 md:w-72 text-gray-700 placeholder-gray-400 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-400 hover:text-gray-700 relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-[#e26a1b] border-2 border-white rounded-full"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button 
                      onClick={() => setNotifications([])} 
                      className="text-xs text-[#e26a1b] hover:text-[#c45a16] font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-200">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">Admin User</span>
                <span className="text-xs font-medium text-[#e26a1b]">Master Admin</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#e26a1b] to-[#d65a11] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
