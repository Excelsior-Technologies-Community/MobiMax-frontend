import React, { useState } from 'react';
import { shopDepartments } from '../../../../data/shopDepartments';

const BottomBar = () => {
  const [activeDept, setActiveDept] = useState(shopDepartments[0]);

  return (
    <div className="bg-[#e26a1b] py-[10px]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-[15px]">
        {/* Left Side: Shop Departments & Navigation */}
        <div className="flex items-center">
          
          {/* Shop Departments Dropdown Button & Mega Menu container */}
          <div className="relative group mr-6 z-50">
            {/* The Trigger Button - Fixed width to match sidebar */}
            <div className="w-[260px] flex justify-between items-center bg-[#222] px-[20px] py-[14px] rounded-t-[4px] rounded-b-[4px] group-hover:rounded-b-none cursor-pointer transition-colors">
              <span className="text-white font-bold text-[14px] uppercase tracking-wider">
                Shop Departments
              </span>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Mega Menu Dropdown */}
            <div className="absolute top-full left-0 w-[900px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex border border-gray-100 rounded-b-[4px] rounded-tr-[4px]">
              
              {/* Left Sidebar (Categories) - Width perfectly matches the button above */}
              <div className="w-[260px] bg-white flex flex-col py-2 border-r border-gray-100 shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
                {shopDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    onMouseEnter={() => setActiveDept(dept)}
                    className="px-5 py-3 cursor-pointer flex justify-between items-center group/item hover:bg-[#fff7f2] transition-colors relative"
                  >
                    <a href={dept.link} className={`text-[14px] font-bold transition-colors ${activeDept.id === dept.id ? 'text-[#e26a1b]' : 'text-gray-800 group-hover/item:text-[#e26a1b]'}`}>
                      {dept.name}
                    </a>
                    <svg className={`w-3.5 h-3.5 transition-transform ${activeDept.id === dept.id ? 'text-[#e26a1b] translate-x-1' : 'text-gray-400 group-hover/item:text-[#e26a1b] group-hover/item:translate-x-1'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                ))}
              </div>

              {/* Right Content Area (Subcategories & Best Sellers) */}
              <div className="flex-1 p-8 flex gap-10 bg-white min-h-[440px]">
                
                {/* Best Sellers Column */}
                <div className="w-[220px] shrink-0 border-r border-gray-100 pr-8">
                  <div className="flex justify-between items-center mb-5">
                    <h5 className="text-[13px] font-bold uppercase tracking-wider text-[#e26a1b]">Best Sellers</h5>
                    <div className="flex gap-1.5">
                      <button className="bg-gray-50 hover:bg-gray-200 text-gray-500 p-1.5 rounded transition-colors"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                      <button className="bg-gray-50 hover:bg-gray-200 text-gray-500 p-1.5 rounded transition-colors"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                  </div>
                  
                  {/* Product Card */}
                  <div className="group/product cursor-pointer block">
                    <div className="mb-4 relative rounded-md overflow-hidden bg-gray-50 flex items-center justify-center p-4 h-[180px]">
                      <img src="https://placehold.co/400x400/f8f9fa/e26a1b?text=Tire" alt="Product" className="max-w-full max-h-full object-contain group-hover/product:scale-110 transition-transform duration-500" />
                    </div>
                    <h6 className="text-[14px] font-bold text-gray-900 leading-snug mb-1.5 group-hover/product:text-[#e26a1b] transition-colors">Allstar Performance 16 Grit 7 in OD Nail Head Tire</h6>
                    <div className="flex text-[#ffb400] mb-2 gap-0.5">
                      <span className="text-[11px]">★</span><span className="text-[11px]">★</span><span className="text-[11px]">★</span><span className="text-[11px]">★</span><span className="text-[11px] text-gray-300">★</span>
                    </div>
                    <div className="text-[#e26a1b] font-extrabold text-[16px] mb-4">£135.99</div>
                    <button className="w-full bg-[#ffe600] hover:bg-[#e6cc00] text-black font-extrabold text-[12px] py-2.5 rounded-[3px] transition-colors tracking-wide">
                      ADD TO CART
                    </button>
                  </div>
                </div>

                {/* Subcategories Columns */}
                <div className="flex-1 flex gap-10">
                  <div className="flex-1 flex flex-col gap-8">
                    <div>
                      <h5 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
                        {activeDept.name.toUpperCase()}
                      </h5>
                      <ul className="flex flex-col gap-3">
                        {activeDept.subcategories.slice(0, Math.ceil(activeDept.subcategories.length / 2)).map((sub, idx) => (
                          <li key={idx}>
                            <a href={sub.link} className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {activeDept.id !== 4 && (
                      <div>
                        <h5 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
                          ENGINE PARTS
                        </h5>
                        <ul className="flex flex-col gap-3">
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">Air Boxes</a></li>
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">Cold Start Valves</a></li>
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">Cylinder Heads</a></li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-8">
                    <div>
                      <h5 className="text-[13px] font-bold uppercase tracking-wider text-transparent select-none mb-4 pb-2 border-b border-transparent">
                        HIDDEN TITLE
                      </h5>
                      <ul className="flex flex-col gap-3">
                        {activeDept.subcategories.slice(Math.ceil(activeDept.subcategories.length / 2)).map((sub, idx) => (
                          <li key={idx}>
                            <a href={sub.link} className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {activeDept.id !== 5 && (
                      <div>
                        <h5 className="text-[13px] font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
                          LIGHTING
                        </h5>
                        <ul className="flex flex-col gap-3">
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">Adapters</a></li>
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">Cameras & Cases</a></li>
                          <li><a href="#" className="text-[14px] text-gray-500 hover:text-[#e26a1b] transition-colors">GPS Systems</a></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
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
