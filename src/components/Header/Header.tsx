
import React from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, isAdaptive, toggleAdaptive } = useAdaptiveUI();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" className="h-full w-full">
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="50%" stopColor="#764ba2"/>
                  <stop offset="100%" stopColor="#f093fb"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main flowing wave that forms the M shape */}
              <path 
                d="M50,150
                  C80,150 90,120 100,100
                  C110,80 120,60 140,50
                  C160,40 180,60 200,100
                  C220,140 240,160 260,140
                  C280,120 300,80 320,60
                  C340,40 360,80 370,120
                  C380,160 390,180 400,160"
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                opacity="0.9"
              />
              
              {/* Subtle secondary wave for depth */}
              <path 
                d="M40,160
                  C70,160 85,130 95,110
                  C105,90 115,70 135,60
                  C155,50 175,70 195,110
                  C215,150 235,170 255,150
                  C275,130 295,90 315,70
                  C335,50 355,90 365,130
                  C375,170 385,190 395,170"
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
            </svg>
          </div>
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
