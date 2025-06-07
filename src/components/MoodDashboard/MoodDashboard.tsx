
import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import Header from '../Header/Header';
import MoodInput from '../MoodInput/MoodInput';
import ContentFeed from '../ContentFeed/ContentFeed';
import PrivacyDashboard from '../PrivacyDashboard/PrivacyDashboard';

const MoodDashboard: React.FC = () => {
  const { mood } = useMood();
  const { theme } = useAdaptiveUI();

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ease-in-out ${theme.backgroundStyle}`}
      style={{ 
        background: `${theme.gradient}, ${theme.backgroundStyle}`,
        color: theme.textColor 
      }}
    >
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            mizai
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Your AI-powered companion that adapts to your emotions in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <MoodInput />
            <PrivacyDashboard />
          </div>
          
          <div className="lg:col-span-2">
            <ContentFeed />
          </div>
        </div>

        <div className="text-center mt-12 p-6 rounded-xl bg-white/20 backdrop-blur-sm">
          <p className="text-sm opacity-70">
            Current Mood: <span className="font-semibold capitalize">{mood.primaryEmotion}</span> 
            {" • "}
            Arousal Level: <span className="font-semibold">{Math.round(mood.arousalLevel * 100)}%</span>
            {" • "}
            Last Updated: {mood.lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default MoodDashboard;
