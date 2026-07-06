import React from 'react';
import { carMakes } from '../../../data/carMakes';
import { Link } from 'react-router-dom';

const ShopByMake = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-[15px] pt-8 pb-16 mb-16 relative">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
        <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      {/* Header section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between relative z-10">
        <div className="pl-4 border-l-4 border-[#e26a1b]">
          <h4 className="text-gray-900 text-3xl font-black mb-1.5 tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Select auto parts by make
          </h4>
          <p className="text-gray-500 text-[15px] font-medium m-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Explore our comprehensive catalog by choosing your vehicle's manufacturer.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/makes" className="text-sm font-semibold text-[#e26922] hover:text-orange-600 transition-colors flex items-center gap-1 group">
            View All Makes
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Grid section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-5 relative z-10">
        {carMakes.map((make, index) => (
          <Link 
            key={index}
            to={make.link || "#"}
            className="group relative flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(226,105,34,0.12)] border border-gray-100 hover:border-[#e26922]/30 transition-all duration-500 ease-out hover:-translate-y-1.5 overflow-hidden"
            style={{ minHeight: '140px' }}
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e26922]/0 to-[#e26922]/0 group-hover:from-[#e26922]/5 group-hover:to-transparent transition-colors duration-500 z-0"></div>
            
            <div 
              className="relative z-10 w-16 h-14 mb-4 flex items-center justify-center opacity-60 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-500"
              dangerouslySetInnerHTML={{ __html: make.svg }}
            />
            <span className="relative z-10 text-sm font-bold text-gray-700 group-hover:text-gray-900 text-center font-inter tracking-wide transition-colors duration-300">
              {make.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByMake;
