import React from 'react';

const BottomBar = () => {
  return (
    <div className="bg-[#e26a1b] py-[10px]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-[15px]">
        {/* Left Side: Shop Departments & Navigation */}
        <div className="flex items-center">
          
          {/* Shop Departments Dropdown Button */}
          <div className="flex items-center bg-white px-[22px] py-[12px] rounded-[3px] cursor-pointer mr-8">
            <span className="text-[#222] font-bold text-[14px] uppercase tracking-wide mr-2">
              Shop Departments
            </span>
            <svg className="w-3.5 h-3.5 text-[#222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-7">
            <a href="#" className="text-white font-bold text-[15px] hover:text-white/90 relative">
              Home
              <span className="absolute -bottom-[4px] left-0 w-full h-[2px] bg-white"></span>
            </a>
            
            <div className="relative group">
              <a href="#" className="text-white font-bold text-[15px] relative inline-block">
                Pages
                <span className="absolute -bottom-[4px] left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </a>
              {/* Invisible bridge to prevent dropdown from closing when moving mouse down */}
              <div className="absolute top-full left-0 w-full h-[14px]"></div>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-[14px] w-[210px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-3 border border-[#f0f0f0]">
                <a href="#" className="block px-7 py-2.5 text-[#666] hover:text-[#e26a1b] text-[15px] transition-colors">About us</a>
                <a href="#" className="block px-7 py-2.5 text-[#666] hover:text-[#e26a1b] text-[15px] transition-colors">Contact us</a>
              </div>
            </div>

            <a href="#" className="text-white font-bold text-[15px] hover:text-white/90 relative group">
              Blog
              <span className="absolute -bottom-[4px] left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
            <a href="#" className="text-white font-bold text-[15px] hover:text-white/90">Shop</a>
            <a href="#" className="text-white font-bold text-[15px] hover:text-white/90">Elements</a>
          </nav>

        </div>

        {/* Right Side: My Vehicles Button */}
        <div className="flex items-center bg-[#ffe600] px-[22px] py-[12px] rounded-[3px] cursor-pointer hover:bg-[#e6cc00] transition-colors">
          <svg className="w-5 h-5 text-black mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm-10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"></path>
          </svg>
          <span className="text-[#222] font-bold text-[14px]">
            My vehicles
          </span>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
