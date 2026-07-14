import React from 'react';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import PromoPopup from '../../components/home/HeroSection/PromoPopup';
import FeaturesBar from '../../components/home/FeaturesBar/FeaturesBar';
import PopularParts from '../../components/home/PopularParts/PopularParts';
import PromoSection from '../../components/home/PromoSection/PromoSection';
import ShopByMake from '../../components/home/ShopByMake/ShopByMake';

const HomePage = () => {
  return (
    <main className="flex-grow">
      <PromoPopup />
      <HeroSection />
      <FeaturesBar />
      <PopularParts />
      <ShopByMake />
      <PromoSection />
    </main>
  );
};

export default HomePage;
