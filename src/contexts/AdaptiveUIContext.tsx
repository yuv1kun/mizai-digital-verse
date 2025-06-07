
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMood } from './MoodContext';

interface UITheme {
  primary: string;
  secondary: string;
  gradient: string;
  textColor: string;
  backgroundStyle: string;
  layout: 'grid' | 'carousel';
}

interface AdaptiveUIContextType {
  theme: UITheme;
  isAdaptive: boolean;
  toggleAdaptive: () => void;
}

const emotionThemes: Record<string, UITheme> = {
  joy: {
    primary: '#FFD700',
    secondary: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 100%)',
    textColor: '#2D1810',
    backgroundStyle: 'bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100',
    layout: 'carousel'
  },
  calm: {
    primary: '#83A4D4',
    secondary: '#E0EAFC',
    gradient: 'linear-gradient(135deg, #83A4D4 0%, #E0EAFC 100%)',
    textColor: '#1E293B',
    backgroundStyle: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    layout: 'grid'
  },
  excitement: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    textColor: '#7C2D12',
    backgroundStyle: 'bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100',
    layout: 'carousel'
  },
  love: {
    primary: '#FF69B4',
    secondary: '#FFB6C1',
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
    textColor: '#831843',
    backgroundStyle: 'bg-gradient-to-br from-pink-100 via-rose-50 to-purple-50',
    layout: 'grid'
  },
  anger: {
    primary: '#DC2626',
    secondary: '#FCA5A5',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #FCA5A5 100%)',
    textColor: '#7F1D1D',
    backgroundStyle: 'bg-gradient-to-br from-red-200 via-red-100 to-orange-100',
    layout: 'carousel'
  },
  sadness: {
    primary: '#6366F1',
    secondary: '#C7D2FE',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #C7D2FE 100%)',
    textColor: '#312E81',
    backgroundStyle: 'bg-gradient-to-br from-indigo-100 via-blue-50 to-slate-100',
    layout: 'grid'
  },
  fear: {
    primary: '#7C3AED',
    secondary: '#DDD6FE',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #DDD6FE 100%)',
    textColor: '#581C87',
    backgroundStyle: 'bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-50',
    layout: 'grid'
  },
  surprise: {
    primary: '#F59E0B',
    secondary: '#FED7AA',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FED7AA 100%)',
    textColor: '#92400E',
    backgroundStyle: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100',
    layout: 'carousel'
  }
};

const AdaptiveUIContext = createContext<AdaptiveUIContextType | undefined>(undefined);

export const AdaptiveUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { mood } = useMood();
  const [isAdaptive, setIsAdaptive] = useState(true);
  const [theme, setTheme] = useState<UITheme>(emotionThemes.calm);

  useEffect(() => {
    if (isAdaptive) {
      const newTheme = emotionThemes[mood.primaryEmotion] || emotionThemes.calm;
      setTheme(newTheme);
      console.log(`Switching to ${mood.primaryEmotion} theme`, newTheme);
      
      // Update CSS custom properties for dynamic theming
      document.documentElement.style.setProperty('--emotion-primary', newTheme.primary);
      document.documentElement.style.setProperty('--emotion-secondary', newTheme.secondary);
      document.documentElement.style.setProperty('--emotion-gradient', newTheme.gradient);
      document.documentElement.style.setProperty('--emotion-text', newTheme.textColor);
    }
  }, [mood.primaryEmotion, isAdaptive]);

  const toggleAdaptive = () => {
    setIsAdaptive(!isAdaptive);
    console.log(`Adaptive UI ${!isAdaptive ? 'enabled' : 'disabled'}`);
  };

  return (
    <AdaptiveUIContext.Provider value={{ theme, isAdaptive, toggleAdaptive }}>
      {children}
    </AdaptiveUIContext.Provider>
  );
};

export const useAdaptiveUI = () => {
  const context = useContext(AdaptiveUIContext);
  if (context === undefined) {
    throw new Error('useAdaptiveUI must be used within an AdaptiveUIProvider');
  }
  return context;
};
