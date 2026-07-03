import React, { useState } from 'react';

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 0,
      bgColor: '#f5f5f5',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset2-2.jpg',
      title1: 'Take care',
      title1Color: '#000000',
      title2: 'of your tires',
      title2Color: '#000000',
      discount: '22%',
      discountColor: '#ffcc00',
      offText: 'OFF',
      offTextColor: '#000000',
      disclaimerColor: '#616161',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset1.png',
      imageClass: 'absolute right-[-20px] top-[20px] h-[450px] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none'
    },
    {
      id: 1,
      bgColor: '#e05c0b',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset3.jpg',
      title1: 'Ready for',
      title1Color: '#ffffff',
      title2: 'OFF ROAD?',
      title2Color: '#ffffff',
      discount: '18%',
      discountColor: '#ffcc00',
      offText: 'OFF',
      offTextColor: '#ffffff',
      disclaimerColor: '#ffffff',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/slide_asset4.png',
      imageClass: 'absolute right-[10px] top-[20px] h-[450px] w-auto object-contain z-10 drop-shadow-2xl pointer-events-none'
    },
    {
      id: 2,
      bgColor: '#ffd800',
      pattern: 'https://enovathemes.com/mobimax/wp-content/uploads/slider_pattern_white-1.png',
      title1: 'Mega Sale',
      title1Color: '#ffffff',
      title2: 'Disks & Pads',
      title2Color: '#ffffff',
      discount: '33%',
      discountColor: '#000000',
      offText: 'OFF',
      offTextColor: '#ffffff',
      disclaimerColor: '#ffffff',
      image: 'https://enovathemes.com/mobimax/wp-content/uploads/revslider/banner_img_3.png',
      imageClass: 'absolute right-[-40px] top-[15px] h-[460px] w-auto object-contain z-10 transform -rotate-[12deg] drop-shadow-2xl pointer-events-none'
    }
  ];

  const current = slides[activeSlide];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[15px] mt-[20px] mb-12">
      <div className="flex w-full gap-[20px]">
        
        {/* Main Slider (Left) */}
        <div 
          className="w-2/3 relative overflow-hidden h-[493px] rounded-sm group flex-shrink-0 transition-colors duration-500"
          style={{
            backgroundColor: current.bgColor,
          }}
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 z-0 opacity-40 mix-blend-multiply transition-opacity duration-500"
            style={{
              backgroundImage: `url("${current.pattern}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}
          ></div>

          {/* Content */}
          <div className="relative z-20 pl-[50px] pt-[75px] max-w-[55%]">
            <h2 
              className="font-black text-[46px] leading-[1.1] uppercase tracking-wide drop-shadow-sm mb-1 whitespace-nowrap transition-colors duration-500" 
              style={{ fontFamily: 'Montserrat, sans-serif', color: current.title1Color }}
            >
              {current.title1}
            </h2>
            <h3 
              className="font-black text-[31px] leading-[1.1] uppercase drop-shadow-sm mb-1 whitespace-nowrap transition-colors duration-500" 
              style={{ fontFamily: 'Montserrat, sans-serif', color: current.title2Color }}
            >
              {current.title2}
            </h3>
            
            <div 
              className="font-black text-[123px] leading-[1] mb-2 tracking-tighter transition-colors duration-500" 
              style={{ fontFamily: 'Montserrat, sans-serif', color: current.discountColor }}
            >
              {current.discount}
            </div>
            
            <div className="flex items-center gap-5">
              <span 
                className="font-black text-[46px] leading-[1] transition-colors duration-500" 
                style={{ fontFamily: 'Montserrat, sans-serif', color: current.offTextColor }}
              >
                {current.offText}
              </span>
              <button className="bg-[#d52b27] hover:bg-[#212121] transition-colors duration-300 text-white font-bold uppercase px-[34px] py-[12px] rounded-[4px] text-[13px] tracking-wide pointer-events-auto shadow-md">
                Shop Now
              </button>
            </div>
          </div>
          
          {/* Bottom Text */}
          <p 
            className="absolute bottom-[24px] left-[24px] text-[13px] font-medium leading-[21px] w-[230px] z-20 transition-colors duration-500" 
            style={{ fontFamily: 'Montserrat, sans-serif', color: current.disclaimerColor }}
          >
            This discount is not valid in conjunction with other offers
          </p>
          
          {/* Slider Dots */}
          <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex gap-[12px] z-30">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`w-[16px] h-[16px] rounded-full border-[3px] cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm ${
                  activeSlide === index 
                    ? 'border-white bg-transparent scale-110' 
                    : 'border-black hover:border-black/70'
                }`}
              >
                {activeSlide === index && (
                  <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
                )}
              </div>
            ))}
          </div>

          {/* Product Image */}
          <img 
            key={current.image}
            src={current.image} 
            alt="Product" 
            className={`transition-all duration-700 ease-out animate-fade-in ${current.imageClass}`}
          />
        </div>

        {/* Right Side Banners */}
        <div className="w-1/3 flex flex-col gap-[20px] flex-shrink-0">
          
          {/* Top Banner */}
          <div 
            className="flex-1 bg-white relative overflow-hidden flex items-center pl-[40px] rounded-sm group transition-all"
            style={{
              backgroundImage: 'url("https://enovathemes.com/mobimax/wp-content/uploads/banner_img_13.jpg")',
              backgroundSize: 'contain',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10">
              <div className="text-[#e26a1b] font-normal text-[32px] leading-[1] mb-2 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                EARN
              </div>
              <div className="flex items-center mb-6">
                <span className="text-black font-black text-[42px] leading-[1] mr-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  $10
                </span>
                <span className="text-[#616161] font-semibold text-[11px] uppercase leading-[1.2] mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Gift<br/>Card
                </span>
              </div>
              <button className="bg-[#ffcc00] hover:bg-[#e26a1b] hover:text-white transition-colors duration-300 text-black font-bold uppercase px-[26px] py-[10px] rounded-[3px] text-[12px]">
                Shop Now
              </button>
            </div>
          </div>
          
          {/* Bottom Banner */}
          <div 
            className="flex-1 bg-[#ffd800] relative overflow-hidden flex items-center pl-[40px] rounded-sm group transition-all"
            style={{
              backgroundImage: 'url("https://enovathemes.com/mobimax/wp-content/uploads/banner_img_1.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10 pt-[20px]">
              <div className="text-black font-bold text-[14px] uppercase mb-1 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Buy 1 Get 1
              </div>
              <div className="text-[#d52b27] font-black text-[42px] leading-[1] uppercase mb-[26px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Free
              </div>
              <button className="bg-white hover:bg-black hover:text-white transition-colors duration-300 text-black font-bold uppercase px-[26px] py-[10px] rounded-[3px] text-[12px]">
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
