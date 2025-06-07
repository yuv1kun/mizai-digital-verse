
import React from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { Settings, Heart } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, isAdaptive, toggleAdaptive } = useAdaptiveUI();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart 
            className="h-8 w-8" 
            style={{ color: theme.primary }}
            fill="currentColor"
          />
          <span className="text-2xl font-bold">mizai</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleAdaptive}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAdaptive 
                ? 'bg-white/20 text-current' 
                : 'bg-gray-400/20 text-gray-600'
            }`}
          >
            {isAdaptive ? 'Adaptive ON' : 'Adaptive OFF'}
          </button>
          
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
