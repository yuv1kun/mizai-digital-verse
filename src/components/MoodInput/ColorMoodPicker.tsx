
import React from 'react';
import { useMood } from '../../contexts/MoodContext';

const emotionColors = [
  { emotion: 'joy', color: '#FFD700', label: 'Joy', description: 'Happy & Content' },
  { emotion: 'calm', color: '#83A4D4', label: 'Calm', description: 'Peaceful & Relaxed' },
  { emotion: 'excitement', color: '#FF6B6B', label: 'Excitement', description: 'Energetic & Thrilled' },
  { emotion: 'love', color: '#FF69B4', label: 'Love', description: 'Warm & Affectionate' },
  { emotion: 'anger', color: '#DC2626', label: 'Anger', description: 'Frustrated & Mad' },
  { emotion: 'sadness', color: '#6366F1', label: 'Sadness', description: 'Down & Blue' },
  { emotion: 'fear', color: '#7C3AED', label: 'Fear', description: 'Worried & Anxious' },
  { emotion: 'surprise', color: '#F59E0B', label: 'Surprise', description: 'Amazed & Shocked' },
];

const ColorMoodPicker: React.FC = () => {
  const { mood, updateMood } = useMood();

  const handleEmotionSelect = (emotion: string, intensity: number = 0.8) => {
    console.log(`Selected emotion: ${emotion} with intensity: ${intensity}`);
    updateMood(emotion, intensity);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {emotionColors.map(({ emotion, color, label, description }) => {
          const isActive = mood.primaryEmotion === emotion;
          const currentIntensity = mood.currentMood[emotion as keyof typeof mood.currentMood];
          
          return (
            <button
              key={emotion}
              onClick={() => handleEmotionSelect(emotion)}
              className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive 
                  ? 'ring-4 ring-white/50 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: color,
                borderWidth: '2px'
              }}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow"
                style={{ backgroundColor: color }}
              />
              
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">{label}</h3>
                <p className="text-xs opacity-80">{description}</p>
                
                {isActive && (
                  <div className="mt-2">
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: color,
                          width: `${currentIntensity * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs opacity-70 mt-1 block">
                      {Math.round(currentIntensity * 100)}% intensity
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm opacity-70">
        <p>Tap a color to set your current mood</p>
        <p className="mt-1">The interface will adapt to match your emotions</p>
      </div>
    </div>
  );
};

export default ColorMoodPicker;
