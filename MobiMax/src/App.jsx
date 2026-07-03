import TopBar from './components/layout/Header/TopBar/TopBar';
import MiddleBar from './components/layout/Header/MiddleBar/MiddleBar';
import BottomBar from './components/layout/Header/BottomBar/BottomBar';
import HeroSection from './components/home/HeroSection/HeroSection';
import FeaturesBar from './components/home/FeaturesBar/FeaturesBar';
import PopularParts from './components/home/PopularParts/PopularParts';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <MiddleBar />
      <BottomBar />
      <HeroSection />
      <FeaturesBar />
      <PopularParts />
    </div>
  );
}