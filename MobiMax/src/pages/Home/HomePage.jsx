import React from 'react';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import FeaturesBar from '../../components/home/FeaturesBar/FeaturesBar';
import PopularParts from '../../components/home/PopularParts/PopularParts';

const HomePage = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesBar />
      <PopularParts />
    </main>
  );
};

export default HomePage;
