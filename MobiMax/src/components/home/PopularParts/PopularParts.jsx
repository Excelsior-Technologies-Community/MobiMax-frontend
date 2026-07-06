import React from 'react';

const PopularParts = () => {
  const parts = [
    {
      title: 'Service Kits',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      link: '/product-category/service-kits/'
    },
    {
      title: 'Brake Discs & Pads',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
      link: '/product-category/brake-disks-pads/'
    },
    {
      title: 'Suspension',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <path d="M9 2h6M12 2v4l-4 3 8 4-8 4 4 3v2M9 22h6"/>
        </svg>
      ),
      link: '/product-category/brake-disks-pads/'
    },
    {
      title: 'Engine Parts',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <path d="M12 22v-2M12 4V2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      link: '/product-category/engine-parts/'
    },
    {
      title: 'Oil & lubricants',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        </svg>
      ),
      link: '/product-category/oil-lubricants/'
    },
    {
      title: 'Tires & Wheels',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      link: '/product-category/tires-wheels/'
    },
    {
      title: 'Steering',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
          <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/>
        </svg>
      ),
      link: '/product-category/steering/'
    },
    {
      title: 'Batteries',
      svg: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-9 h-9">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/>
          <line x1="22" y1="11" x2="22" y2="13"/>
          <line x1="6" y1="12" x2="10" y2="12"/>
          <line x1="8" y1="10" x2="8" y2="14"/>
        </svg>
      ),
      link: '/product-category/batteries/'
    }
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[15px] mb-12 relative z-10">
      
      {/* Section Header */}
      <div className="mb-10 pl-4 border-l-4 border-[#e26a1b]">
        <h4 
          className="text-gray-900 text-3xl font-black mb-1.5 tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Popular parts for your car
        </h4>
        <p 
          className="text-gray-500 text-[15px] font-medium m-0"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          View a selection of our most popular car parts
        </p>
      </div>

      {/* Grid of Parts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {parts.map((part, index) => (
          <a 
            href={part.link} 
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#e26a1b]/30 p-8 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 transform hover:-translate-y-1.5"
          >
            {/* Icon Badge */}
            <div className="w-[84px] h-[84px] rounded-[22px] bg-gray-50 group-hover:bg-[#e26a1b] flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-300 mb-6 shadow-sm group-hover:shadow-md">
              {part.svg}
            </div>

            {/* Title */}
            <h6 
              className="text-gray-900 font-extrabold text-[15px] lg:text-[16px] group-hover:text-[#e26a1b] transition-colors duration-300 text-center" 
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {part.title}
            </h6>
          </a>
        ))}
      </div>

    </div>
  );
};

export default PopularParts;
