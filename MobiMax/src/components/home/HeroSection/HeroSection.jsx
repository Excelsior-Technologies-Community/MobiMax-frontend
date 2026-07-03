import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
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
      imageClass: 'absolute right-[-30px] top-[5%] h-[90%] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none'
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
      imageClass: 'absolute right-[0px] top-[10%] h-[85%] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none'
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
      imageClass: 'absolute right-[-40px] top-[5%] h-[95%] w-auto object-contain z-10 transform -rotate-[8deg] drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] pointer-events-none'
    }
  ];

  const current = slides[activeSlide];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[15px] mt-6 mb-16">
      <div className="flex flex-col md:flex-row w-full gap-6 h-auto md:h-[500px]">
        
        {/* Main Slider (Left) */}
        <div 
          className="w-full md:w-2/3 relative overflow-hidden rounded-2xl shadow-xl group flex-shrink-0 transition-colors duration-700 ease-in-out"
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
          <div className="relative z-20 h-full flex flex-col justify-center pl-12 md:pl-16 max-w-[70%]">
            <h2 
              className="font-black text-4xl md:text-5xl uppercase tracking-wider drop-shadow-sm mb-1 whitespace-nowrap transition-colors duration-700" 
              style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.title1Color }}
            >
              {current.title1}
            </h2>
            <h3 
              className="font-extrabold text-2xl md:text-3xl uppercase tracking-wide drop-shadow-sm mb-3 whitespace-nowrap transition-colors duration-700" 
              style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.title2Color }}
            >
              {current.title2}
            </h3>
            
            <div 
              className="font-black text-8xl md:text-[130px] leading-none mb-1 tracking-tighter transition-colors duration-700 drop-shadow-md" 
              style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.discountColor }}
            >
              {current.discount}
            </div>
            
            <div className="flex items-center gap-6 mt-2">
              <span 
                className="font-black text-4xl md:text-5xl uppercase leading-none transition-colors duration-700" 
                style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.offTextColor }}
              >
                {current.offText}
              </span>
              <button className="bg-[#d52b27] hover:bg-[#1e272e] transform hover:-translate-y-1 transition-all duration-300 text-white font-bold uppercase px-8 py-3.5 rounded-lg text-sm tracking-widest pointer-events-auto shadow-lg hover:shadow-xl">
                Shop Now
              </button>
            </div>
          </div>
          
          {/* Bottom Disclaimer Text */}
          <p 
            className="absolute bottom-6 left-12 md:left-16 text-xs md:text-sm font-medium leading-relaxed max-w-[250px] z-20 transition-colors duration-700" 
            style={{ fontFamily: 'Inter, system-ui, sans-serif', color: current.disclaimerColor }}
          >
            This discount is not valid in conjunction with other offers.
          </p>
          
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm ${
                  activeSlide === index 
                    ? 'border-white bg-white/20 scale-125' 
                    : 'border-black/50 hover:border-black/80'
                }`}
              >
                {activeSlide === index && (
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                )}
              </div>
            ))}
          </div>

          {/* Product Image */}
          <img 
            key={current.image}
            src={current.image} 
            alt="Product promotion" 
            className={`transition-all duration-[800ms] ease-out animate-fade-in ${current.imageClass}`}
          />
        </div>

        {/* Right Side Banners */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 flex-shrink-0 h-[500px]">
          
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
