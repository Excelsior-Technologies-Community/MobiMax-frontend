import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight, Heart, Car } from 'lucide-react';

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const shopDepartments = [
    { name: 'Batteries', hasSubmenu: false },
    { name: 'Brake disks & pads', hasSubmenu: true },
    { name: 'Car care kits', hasSubmenu: false },
    { name: 'Engine Parts', hasSubmenu: true },
    { name: 'Lighting', hasSubmenu: true },
    { name: 'Oil & lubricants', hasSubmenu: true },
    { name: 'Service kits', hasSubmenu: true },
    { name: 'Steering', hasSubmenu: true },
    { name: 'Alignment Parts', hasSubmenu: true },
    { name: 'Tires & Wheels', hasSubmenu: true },
  ];

  return (
    <>
      {/* Main Mobile Header Bar */}
      <div className="bg-[#e26a1b] w-full block md:hidden relative z-40">
        {/* Search Row */}
        <div className="p-3">
          <form className="flex w-full h-[40px]">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="flex-1 px-4 py-2 outline-none text-[14px] text-gray-700" 
            />
            <button 
              type="submit" 
              className="bg-black text-white px-6 font-bold text-[14px] uppercase tracking-wide"
            >
              Search
            </button>
          </form>
        </div>

        {/* Thin orange divider, matching image background */}
        <div className="h-[1px] w-full bg-[#d35f15]"></div>
        
        {/* Logo Row */}
        <div className="flex justify-between items-center px-4 py-3">
          {/* Hamburger Menu & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-white hover:text-white/80 transition-colors"
            >
              <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="text-white font-black text-[26px] tracking-tight leading-none" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              MobiMax
            </Link>
          </div>
          
          {/* Icons */}
          <div className="flex items-center gap-3.5">
            <button className="text-white hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            
            <div className="w-[1px] h-5 bg-white/30"></div>
            
            <Link to="/login" className="text-white hover:text-white/80 transition-colors">
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Slide-out Panel */}
        <div 
          className={`absolute inset-y-0 left-0 w-[85%] max-w-[400px] bg-white h-full flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-black text-[28px] tracking-tight leading-none flex items-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span className="text-[#e26a1b]">Mobi</span><span className="text-black">Max</span>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-8 h-8 stroke-[1.5]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* Shop Departments */}
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-[#e26a1b] font-bold text-[14px] uppercase tracking-wide">
                Shop Departments
              </h3>
            </div>
            
            <div className="flex flex-col">
              {shopDepartments.map((dept, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900 font-semibold text-[15px]">
                    {dept.name}
                  </span>
                  {dept.hasSubmenu && (
                    <ChevronRight className="w-5 h-5 text-gray-400 stroke-[1.5]" />
                  )}
                </div>
              ))}
            </div>

            {/* Additional Section */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-[#e26a1b] font-bold text-[14px] uppercase tracking-wide">
                Additional
              </h3>
            </div>

            {/* Language & Currency */}
            <div className="px-5 py-4">
              <h3 className="text-[#e26a1b] font-bold text-[14px] uppercase tracking-wide mb-4">
                Language & Currency
              </h3>
              
              {/* Language Switcher */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  EN
                </button>
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  DE
                </button>
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  FR
                </button>
              </div>

              {/* Currency Switcher */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  $ USD
                </button>
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  £ GBP
                </button>
                <button className="bg-[#f5f5f5] hover:bg-[#e0e0e0] transition-colors py-2.5 rounded-[3px] text-center font-bold text-black text-[13px]">
                  ¥ JPY
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="w-full bg-[#ffe600] hover:bg-[#e6cc00] transition-colors flex justify-center items-center py-3.5 rounded-[3px]">
                  <Heart className="w-[18px] h-[18px] text-black mr-2 stroke-[2]" />
                  <span className="text-black font-bold text-[14px] uppercase tracking-wide">Wishlist</span>
                </button>
                <button className="w-full bg-[#ffe600] hover:bg-[#e6cc00] transition-colors flex justify-center items-center py-3.5 rounded-[3px]">
                  <Car className="w-[18px] h-[18px] text-black mr-2 stroke-[2]" />
                  <span className="text-black font-bold text-[14px] uppercase tracking-wide">My Vehicles</span>
                </button>
              </div>
            </div>
            
            {/* Bottom padding so content doesn't get hidden behind mobile browser bars */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
