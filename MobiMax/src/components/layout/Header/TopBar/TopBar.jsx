import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';

const TopBar = () => {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const userDataStr = localStorage.getItem('userData');
      const partnerDataStr = localStorage.getItem('partnerData');

      if (userDataStr) {
        setUser(JSON.parse(userDataStr));
      } else if (partnerDataStr) {
        setUser(JSON.parse(partnerDataStr));
      } else {
        setUser(null);
      }
    };

    checkAuth(); // Initial check

    // Listen for custom auth events to update state instantly without reloading
    window.addEventListener('authChange', checkAuth);

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('partnerData');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    // navigate isn't available here since we aren't in a router component directly, so we just let the event update the UI
    // If we wanted to redirect, we could use navigate if TopBar used useNavigate
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-[#f5f5f5] border-b border-[#e5e5e5] py-2 text-[13px] text-[#666]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-[15px]">
        {/* Left Side: Contact Info */}
        <div className="flex gap-5">
          <div className="flex items-center gap-[6px]">
            <svg className="w-3.5 h-3.5 text-[#e26a1b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-[14px] font-medium text-gray-600">48 Walwyn Rd, Chapelton</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <svg className="w-3.5 h-3.5 text-[#e26a1b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="text-[14px] font-medium text-gray-600">070 5159 1537</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <svg className="w-3.5 h-3.5 text-[#e26a1b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-[14px] font-medium text-gray-600">Mon. - Sat. 10:00 am - 20:00 pm</span>
          </div>
        </div>

        {/* Right Side: Currency, Language, Login */}
        <div className="flex items-center h-full">
          {/* Currency Switcher */}
          <div 
            className="relative flex items-center gap-[6px] cursor-pointer bg-white px-2 py-1 rounded border border-[#e5e5e5] h-[28px] mr-4"
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
          >
            <span className="text-[14px] leading-none">🇬🇧</span>
            <span className="text-[13px] font-medium text-gray-700">£ GBP</span>
            <svg className="w-3 h-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-1 w-[100px] bg-white border border-gray-200 shadow-lg rounded z-10">
                <div className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                  <span>🇬🇧</span> £ GBP
                </div>
                <div className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                  <span>🇺🇸</span> $ USD
                </div>
              </div>
            )}
          </div>

          <div className="w-[1px] h-[14px] bg-gray-300 mx-2"></div>

          {/* Language Switcher */}
          <div 
            className="relative flex items-center cursor-pointer px-2 h-full text-gray-400 hover:text-gray-600 transition-colors mr-2"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2 w-[120px] bg-white border border-gray-200 shadow-lg rounded z-10 py-1">
                <div className="px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-700">English</div>
                <div className="px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-700">Deutsch</div>
                <div className="px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-700">Français</div>
              </div>
            )}
          </div>

          <div className="w-[1px] h-[14px] bg-gray-300 mx-2"></div>

          {/* Login / User Profile */}
          {user ? (
            <div className="relative flex items-center ml-2" ref={userMenuRef}>
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-[#e26a1b] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {getInitial(user.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-gray-500 capitalize leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
              </div>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-[14px] font-semibold text-gray-900">{user.name}</p>
                    <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {user.role === 'partner' && (
                      <Link to="/partner/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-[#fff7f2] hover:text-[#e26a1b] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-[#fff7f2] hover:text-[#e26a1b] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-gray-50 py-1">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-[6px] cursor-pointer hover:text-[#e26a1b] transition-colors ml-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-[13px] font-medium text-gray-600 hover:text-[#e26a1b]">Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
