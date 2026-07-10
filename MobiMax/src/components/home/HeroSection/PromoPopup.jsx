import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ad, setAd] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/public/advertisements');
        const data = await res.json();
        
        if (data.status === 'success') {
          const apiSettings = data.data.settings || {};
          setSettings(apiSettings);
          
          if (apiSettings.popup_enabled === 'false') {
            return;
          }

          // Frequency check removed so the popup appears on every page reload


          if (data.data.advertisements && data.data.advertisements.length > 0) {
            let fetchedAds = data.data.advertisements;
            
            // Apply shuffle if setting is enabled
            if (apiSettings.shuffle) {
              fetchedAds = fetchedAds.sort(() => 0.5 - Math.random());
            }
            
            setAd(fetchedAds[0]); // Select the first ad to show in the popup
            
            // Delay before showing popup
            const delay = apiSettings.popup_delay !== undefined ? apiSettings.popup_delay : 1000;
            setTimeout(() => {
              setIsOpen(true);
            }, delay);
          }
        }
      } catch (error) {
        console.error('Error fetching promo advertisement:', error);
      }
    };
    
    fetchAd();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl animate-fade-in-up z-10 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors backdrop-blur-md"
          aria-label="Close promotion"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Area */}
        <div 
          className="w-full bg-gray-100 cursor-pointer"
          onClick={() => {
            if (ad.link_url) {
              window.location.href = ad.link_url;
            }
          }}
        >
          <img 
            src={ad.image_url} 
            alt="Special Promotion" 
            className="w-full h-auto object-cover max-h-[70vh] md:max-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
