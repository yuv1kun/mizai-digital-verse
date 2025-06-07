
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Emotion {
  joy: number;
  calm: number;
  excitement: number;
  love: number;
  anger: number;
  sadness: number;
  fear: number;
  surprise: number;
}

export interface MoodState {
  currentMood: Emotion;
  primaryEmotion: string;
  arousalLevel: number;
  lastUpdated: Date;
}

interface MoodContextType {
  mood: MoodState;
  updateMood: (emotion: string, intensity: number) => void;
  setMoodFromText: (text: string) => void;
  resetMood: () => void;
}

const defaultEmotion: Emotion = {
  joy: 0,
  calm: 0.5,
  excitement: 0,
  love: 0,
  anger: 0,
  sadness: 0,
  fear: 0,
  surprise: 0
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<MoodState>({
    currentMood: defaultEmotion,
    primaryEmotion: 'calm',
    arousalLevel: 0.3,
    lastUpdated: new Date()
  });

  const updateMood = (emotion: string, intensity: number) => {
    console.log(`Updating mood: ${emotion} with intensity ${intensity}`);
    
    const newMood = { ...defaultEmotion };
    newMood[emotion as keyof Emotion] = Math.max(0, Math.min(1, intensity));
    
    // Calculate arousal level based on emotion
    const arousalMap: Record<string, number> = {
      excitement: 0.9,
      anger: 0.8,
      surprise: 0.7,
      joy: 0.6,
      fear: 0.5,
      love: 0.4,
      sadness: 0.3,
      calm: 0.1
    };
    
    const arousal = arousalMap[emotion] || 0.5;
    
    setMood({
      currentMood: newMood,
      primaryEmotion: emotion,
      arousalLevel: arousal,
      lastUpdated: new Date()
    });
  };

  const setMoodFromText = (text: string) => {
    console.log(`Analyzing text for mood: ${text}`);
    
    // Simple sentiment analysis keywords
    const emotionKeywords: Record<string, string[]> = {
      joy: ['happy', 'great', 'awesome', 'wonderful', 'amazing', 'fantastic', 'excellent'],
      excitement: ['excited', 'pumped', 'energetic', 'thrilled', 'enthusiastic'],
      love: ['love', 'adore', 'cherish', 'affection', 'romantic', 'heart'],
      anger: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated'],
      sadness: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'heartbroken'],
      fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'frightened'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
      calm: ['peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'meditative']
    };

    const lowerText = text.toLowerCase();
    let detectedEmotion = 'calm';
    let maxMatches = 0;

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    });

    const intensity = Math.min(1, Math.max(0.3, maxMatches * 0.3));
    updateMood(detectedEmotion, intensity);
  };

  const resetMood = () => {
    setMood({
      currentMood: defaultEmotion,
      primaryEmotion: 'calm',
      arousalLevel: 0.3,
      lastUpdated: new Date()
    });
  };

  return (
    <MoodContext.Provider value={{ mood, updateMood, setMoodFromText, resetMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
