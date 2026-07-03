import TopBar from './components/TopBar/TopBar';
import MiddleBar from './components/MiddleBar/MiddleBar';
import BottomBar from './components/BottomBar/BottomBar';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesBar from './components/FeaturesBar/FeaturesBar';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <MiddleBar />
      <BottomBar />
      <HeroSection />
      <FeaturesBar />
    </div>
  );
}