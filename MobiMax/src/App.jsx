import TopBar from './components/TopBar/TopBar';
import MiddleBar from './components/MiddleBar/MiddleBar';
import BottomBar from './components/BottomBar/BottomBar';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <MiddleBar />
      <BottomBar />
    </div>
  );
}