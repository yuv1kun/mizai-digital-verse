import React from 'react';
import MoodDashboard from '../components/MoodDashboard/MoodDashboard';
import { MoodProvider } from '../contexts/MoodContext';
import { AdaptiveUIProvider } from '../contexts/AdaptiveUIContext';

const Index = () => {
  return (
    <MoodProvider>
      <AdaptiveUIProvider>
        <div className="min-h-screen transition-all duration-1000 ease-in-out">
          <MoodDashboard />
        </div>
      </AdaptiveUIProvider>
    </MoodProvider>
  );
};

export default Index;
