import React from 'react';

const MiddleBar = () => {
  return (
    <div className="bg-white py-6">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-[15px]">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="#">
            <img 
              src="https://enovathemes.com/mobimax/wp-content/uploads/logo-retina.png" 
              alt="MobiMax" 
              className="h-8 object-contain"
            />
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[600px] mx-10">
          <form className="flex w-full h-[45px]">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="flex-1 border-2 border-[#e26a1b] border-r-0 px-4 py-2 outline-none text-[14px] text-gray-700 placeholder-gray-400 rounded-l-[3px]"
            />
            <button 
              type="submit" 
              className="bg-[#e26a1b] text-white px-8 font-bold text-[14px] tracking-wide rounded-r-[3px] hover:bg-[#c95d17] transition-colors"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Actions (Wishlist & Cart) */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Wishlist */}
          <a href="#" className="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </a>

          {/* Separator */}
          <div className="w-[1px] h-[30px] bg-[#e5e5e5]"></div>

          {/* Cart */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative text-[#ccc] group-hover:text-gray-400 transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[#e26a1b] font-bold text-[14px] leading-tight">My cart</span>
              <span className="text-gray-500 text-[13px] leading-tight mt-0.5">£135.99 | 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleBar;
