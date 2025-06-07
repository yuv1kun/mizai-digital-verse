
import React from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';

interface RecommendationExplanationProps {
  currentMood: string;
}

const explanations: Record<string, string> = {
  joy: "Based on your joyful mood, we're showing uplifting content to amplify your positive energy! 🌟",
  calm: "Your peaceful state calls for gentle, meditative content to maintain your tranquility 🧘‍♀️",
  excitement: "Your high energy deserves dynamic, engaging content to match your enthusiasm! ⚡",
  love: "Feeling loving? Here's warm, heartfelt content to nurture those beautiful emotions 💕",
  anger: "We understand you're frustrated. These calming activities can help you find balance 🌊",
  sadness: "During tough times, gentle support and uplifting content can help brighten your day 🌈",
  fear: "When you're anxious, we recommend soothing content to help you feel more grounded 🌱",
  surprise: "Your amazement calls for wonder-filled content to keep that curiosity alive! ✨"
};

const RecommendationExplanation: React.FC<RecommendationExplanationProps> = ({ currentMood }) => {
  const { theme } = useAdaptiveUI();

  return (
    <div 
      className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
      style={{ borderColor: `${theme.primary}40` }}
    >
      <div 
        className="w-2 h-2 rounded-full mr-3 animate-pulse"
        style={{ backgroundColor: theme.primary }}
      />
      <p className="text-sm">
        {explanations[currentMood] || explanations.calm}
      </p>
    </div>
  );
};

export default RecommendationExplanation;
