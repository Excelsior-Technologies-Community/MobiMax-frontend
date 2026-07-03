import React from 'react';

const FeaturesBar = () => {
  const features = [
    {
      title: 'Free delivery',
      subtitle: 'Worldwide from $27',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      )
    },
    {
      title: 'Warranty',
      subtitle: 'Up to 2 years',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      )
    },
    {
      title: 'Easy return',
      subtitle: '365 days return',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
        </svg>
      )
    },
    {
      title: 'Wide choice',
      subtitle: '100k items available',
      svg: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.38v6.71l6-3.39z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[15px] mb-20 relative z-20 -mt-6">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-hidden border border-gray-50/50">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="flex-1 flex items-center p-8 lg:p-10 group cursor-pointer hover:bg-gradient-to-br hover:from-white hover:to-[#e26a1b]/5 transition-all duration-300"
          >
            {/* Icon Badge */}
            <div className="flex-shrink-0 text-[#e26a1b] bg-[#e26a1b]/10 p-4 rounded-[14px] mr-5 lg:mr-6 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out">
              {feature.svg}
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col">
              <h6 
                className="text-gray-900 font-extrabold text-base lg:text-[17px] mb-1.5 tracking-tight group-hover:text-[#e26a1b] transition-colors duration-300" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {feature.title}
              </h6>
              <div 
                className="text-gray-500 text-[13.5px] font-medium leading-relaxed" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {feature.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
