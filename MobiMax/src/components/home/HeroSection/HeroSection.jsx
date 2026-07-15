import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Default fallback slides
  const defaultSlides = [
    {
      id: 0,
      bgColor: '#f1f2f6',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset2-2.jpg',
      title1: 'Take care',
      title1Color: '#1e272e',
      title2: 'Of your tires',
      title2Color: '#1e272e',
      discount: '22%',
      discountColor: '#ffa801',
      offText: 'OFF',
      offTextColor: '#1e272e',
      disclaimerColor: '#576574',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset1.png',
      imageClass: 'absolute right-[-30px] top-[5%] h-[90%] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none',
      isDefault: true
    },
    {
      id: 1,
      bgColor: '#e55039',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset3.jpg',
      title1: 'Ready for',
      title1Color: '#ffffff',
      title2: 'OFF ROAD?',
      title2Color: '#ffffff',
      discount: '18%',
      discountColor: '#ffd32a',
      offText: 'OFF',
      offTextColor: '#ffffff',
      disclaimerColor: '#ffda79',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset4.png',
      imageClass: 'absolute right-[0px] top-[10%] h-[85%] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none',
      isDefault: true
    },
    {
      id: 2,
      bgColor: '#ffc048',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/slider_pattern_white-1.png',
      title1: 'Mega Sale',
      title1Color: '#ffffff',
      title2: 'Disks & Pads',
      title2Color: '#ffffff',
      discount: '33%',
      discountColor: '#1e272e',
      offText: 'OFF',
      offTextColor: '#ffffff',
      disclaimerColor: '#ffffff',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/banner_img_3.png',
      imageClass: 'absolute right-[-40px] top-[5%] h-[95%] w-auto object-contain z-10 transform -rotate-[8deg] drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] pointer-events-none',
      isDefault: true
    }
  ];

  const [duration, setDuration] = useState(5000);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/public/advertisements');
        const data = await res.json();
        if (data.status === 'success' && data.data.settings) {
          if (data.data.settings.duration) {
            // Enforce a minimum duration of 2000ms (2 seconds) to prevent rapid re-rendering
            const parsedDuration = parseInt(data.data.settings.duration);
            setDuration(parsedDuration < 2000 ? 5000 : parsedDuration);
          }
        }
      } catch (error) {
        console.error('Error fetching settings for hero slider:', error);
      }
    };
    fetchSettings();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === defaultSlides.length - 1 ? 0 : prev + 1));
    }, duration);
    
    return () => clearInterval(timer);
  }, [defaultSlides.length, duration]);

  const current = defaultSlides[activeSlide];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-0 md:px-[15px] mt-0 md:mt-6 mb-16">
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 h-auto md:h-[500px]">
        
        {/* Main Slider (Left) */}
        <div 
          className="w-full md:w-2/3 relative overflow-hidden md:rounded-2xl shadow-sm md:shadow-xl group flex-shrink-0 transition-colors duration-700 ease-in-out h-[260px] sm:h-[320px] md:h-full"
          style={{
            backgroundColor: current.bgColor,
          }}
        >
          {/* Subtle Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent z-0"></div>

          {/* Background Pattern */}
          <div 
            className="absolute inset-0 z-0 opacity-20 mix-blend-overlay transition-opacity duration-700"
            style={{
              backgroundImage: `url("${current.pattern}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}
          ></div>

          {/* Content */}
          <div className="relative z-30 h-full flex flex-col justify-center pl-6 md:pl-12 lg:pl-16 max-w-[60%] md:max-w-[55%]">
            <div className="mb-1 md:mb-3">
              <h2 
                className="font-black text-xl md:text-5xl uppercase tracking-wider drop-shadow-sm leading-tight transition-colors duration-700" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.title1Color }}
              >
                {current.title1}
              </h2>
              <h3 
                className="font-extrabold text-[15px] md:text-3xl uppercase tracking-wide drop-shadow-sm transition-colors duration-700" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.title2Color }}
              >
                {current.title2}
              </h3>
            </div>
            
            <div className="mb-1 md:mb-3">
              <span 
                className="font-black text-[70px] md:text-[110px] lg:text-[130px] leading-[0.8] tracking-tighter transition-colors duration-700 drop-shadow-md block" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.discountColor }}
              >
                {current.discount}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-1">
              <span 
                className="font-black text-2xl md:text-5xl uppercase leading-none transition-colors duration-700 drop-shadow-sm" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.offTextColor }}
              >
                {current.offText}
              </span>
              <button className="bg-[#d52b27] hover:bg-[#1e272e] transform hover:-translate-y-1 transition-all duration-300 text-white font-bold uppercase px-3 py-1.5 md:px-8 md:py-3.5 rounded md:rounded-lg text-[10px] md:text-sm tracking-widest shadow-md md:shadow-xl relative z-40 pointer-events-auto">
                Shop Now
              </button>
            </div>
          </div>
          
          {/* Bottom Disclaimer Text */}
          <p 
            className="absolute bottom-4 md:bottom-8 left-6 md:left-20 text-[9px] md:text-sm font-medium leading-relaxed max-w-[200px] md:max-w-[300px] z-20 transition-colors duration-700 opacity-80" 
            style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.disclaimerColor }}
          >
            This discount is not valid in conjunction with other offers.
          </p>

          {/* Product Image */}
          <img 
            key={current.image}
            src={current.image} 
            alt="Product promotion" 
            className={`transition-all duration-[800ms] ease-out animate-fade-in ${current.imageClass}`}
          />
          
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            {defaultSlides.map((slide, index) => (
              <div 
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(index);
                }}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm ${
                  activeSlide === index 
                    ? 'border-white bg-white scale-110 md:scale-125' 
                    : 'border-black bg-transparent hover:border-black/80'
                }`}
              >
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Banners */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 md:gap-6 flex-shrink-0 h-[320px] md:h-[500px] px-[15px] md:px-0">
          
          {/* Top Banner (Earn $10) */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group border border-gray-100 flex items-center">
            
            {/* Faded Background Image - Prevents text overlap! */}
            <div 
              className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: 'url("https://enovathemes.com/mobimax/wp-content/uploads/banner_img_13.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                WebkitMaskImage: 'linear-gradient(to right, transparent 35%, black 65%)',
                maskImage: 'linear-gradient(to right, transparent 35%, black 65%)'
              }}
            ></div>

            <div className="relative z-10 pl-8 w-[60%]">
              <h4 className="text-[#e26a1b] font-bold text-sm tracking-widest uppercase mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Special Offer
              </h4>
              <div className="flex items-center mb-4">
                <span className="text-gray-900 font-black text-5xl mr-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  $10
                </span>
                <span className="text-gray-500 font-bold text-xs uppercase leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Gift<br/>Card
                </span>
              </div>
              <button className="bg-[#ffcc00] hover:bg-[#e26a1b] hover:text-white transform group-hover:-translate-y-0.5 transition-all duration-300 text-black font-bold uppercase px-6 py-2.5 rounded-md text-xs shadow-sm">
                Earn Now
              </button>
            </div>
          </div>
          
          {/* Bottom Banner (Buy 1 Get 1) */}
          <div className="flex-1 bg-[#ffd800] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group border border-[#ffd800]/50 flex items-center">
            
            {/* Faded Background Image - Prevents text overlap! */}
            <div 
              className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: 'url("https://enovathemes.com/mobimax/wp-content/uploads/banner_img_1.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                WebkitMaskImage: 'linear-gradient(to right, transparent 35%, black 65%)',
                maskImage: 'linear-gradient(to right, transparent 35%, black 65%)'
              }}
            ></div>

            <div className="relative z-10 pl-8 w-[60%]">
              <h4 className="text-gray-900 font-extrabold text-sm tracking-widest uppercase mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Buy 1 Get 1
              </h4>
              <div className="text-[#d52b27] font-black text-[54px] leading-none uppercase drop-shadow-sm mb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Free
              </div>
              <button className="bg-white hover:bg-gray-900 hover:text-white transform group-hover:-translate-y-0.5 transition-all duration-300 text-black font-bold uppercase px-6 py-2.5 rounded-md text-xs shadow-sm">
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
