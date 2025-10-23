
import React from 'react';
import { Home, ClipboardList } from 'lucide-react';

type Screen = 'Home' | 'Summary';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => (
  <nav className="fixed bottom-0 left-0 z-30 flex h-16 w-full border-t border-gray-200 bg-white md:left-1/2 md:max-w-md md:-translate-x-1/2">
    <button
      onClick={() => onNavigate('Home')}
      className="flex flex-1 flex-col items-center justify-center text-gray-500"
    >
      <Home className={`h-6 w-6 ${currentScreen === 'Home' ? 'text-emerald-500' : ''}`} />
      <span className={`text-xs font-medium ${currentScreen === 'Home' ? 'text-emerald-500' : ''}`}>
        Home
      </span>
    </button>
    <button
      onClick={() => onNavigate('Summary')}
      className="flex flex-1 flex-col items-center justify-center text-gray-500"
    >
      <ClipboardList className={`h-6 w-6 ${currentScreen === 'Summary' ? 'text-emerald-500' : ''}`} />
      <span className={`text-xs font-medium ${currentScreen === 'Summary' ? 'text-emerald-500' : ''}`}>
        Summary
      </span>
    </button>
  </nav>
);

export default BottomNav;
