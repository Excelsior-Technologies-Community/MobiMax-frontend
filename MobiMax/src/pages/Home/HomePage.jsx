import React from 'react';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import PromoPopup from '../../components/home/HeroSection/PromoPopup';
import FeaturesBar from '../../components/home/FeaturesBar/FeaturesBar';
import PopularParts from '../../components/home/PopularParts/PopularParts';

const HomePage = () => {
  return (
    <main className="flex-grow">
      <PromoPopup />
      <HeroSection />
      <FeaturesBar />
      <PopularParts />
    </main>
  );
};

export default HomePage;
