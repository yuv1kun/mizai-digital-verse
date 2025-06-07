
import React, { useState } from 'react';
import ColorMoodPicker from './ColorMoodPicker';
import TextMoodInput from './TextMoodInput';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';

const MoodInput: React.FC = () => {
  const { theme } = useAdaptiveUI();
  const [activeTab, setActiveTab] = useState<'color' | 'text'>('color');

  return (
    <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">How are you feeling?</h2>
      
      <div className="flex mb-6 bg-white/10 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('color')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'color'
              ? 'bg-white/30 shadow-md'
              : 'hover:bg-white/10'
          }`}
        >
          Color Picker
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'text'
              ? 'bg-white/30 shadow-md'
              : 'hover:bg-white/10'
          }`}
        >
          Tell Us More
        </button>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'color' ? <ColorMoodPicker /> : <TextMoodInput />}
      </div>
    </div>
  );
};

export default MoodInput;
