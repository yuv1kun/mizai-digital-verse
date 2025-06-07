import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import ContentCard from './ContentCard';
import RecommendationExplanation from './RecommendationExplanation';
import { TextShimmer } from '../ui/text-shimmer';

// Mock content data with emotion mappings
const mockContent = [
  {
    id: 1,
    type: 'video',
    title: 'Sunrise Meditation: 10 Minutes to Inner Peace',
    description: 'Start your day with mindful breathing and gentle movement',
    emotions: ['calm', 'joy'],
    thumbnail: '🧘‍♀️',
    duration: '10 min',
    matchScore: 0.95
  },
  {
    id: 2,
    type: 'music',
    title: 'Uplifting Jazz Playlist',
    description: 'Feel-good classics to boost your mood instantly',
    emotions: ['joy', 'excitement'],
    thumbnail: '🎵',
    duration: '45 min',
    matchScore: 0.88
  },
  {
    id: 3,
    type: 'article',
    title: 'The Science of Happiness: 5 Evidence-Based Tips',
    description: 'Research-backed strategies for lasting well-being',
    emotions: ['joy', 'calm'],
    thumbnail: '📖',
    duration: '5 min read',
    matchScore: 0.82
  },
  {
    id: 4,
    type: 'video',
    title: 'High-Energy Dance Workout',
    description: 'Get your heart pumping with this 20-minute routine',
    emotions: ['excitement', 'joy'],
    thumbnail: '💃',
    duration: '20 min',
    matchScore: 0.79
  },
  {
    id: 5,
    type: 'article',
    title: 'Managing Stress in the Digital Age',
    description: 'Practical techniques for finding balance in busy times',
    emotions: ['calm', 'fear'],
    thumbnail: '🧠',
    duration: '7 min read',
    matchScore: 0.75
  },
  {
    id: 6,
    type: 'music',
    title: 'Romantic Evening Acoustic Set',
    description: 'Soft melodies perfect for intimate moments',
    emotions: ['love', 'calm'],
    thumbnail: '💕',
    duration: '60 min',
    matchScore: 0.72
  }
];

const ContentFeed: React.FC = () => {
  const { mood } = useMood();
  const { theme } = useAdaptiveUI();

  // Filter and sort content based on current mood
  const recommendedContent = mockContent
    .filter(content => content.emotions.includes(mood.primaryEmotion))
    .sort((a, b) => b.matchScore - a.matchScore);

  const otherContent = mockContent
    .filter(content => !content.emotions.includes(mood.primaryEmotion))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold text-purple-600">
          Personalized for You
        </h2>
        <div className="flex justify-center">
          <RecommendationExplanation currentMood={mood.primaryEmotion} />
        </div>
      </div>

      {/* Perfectly Matched Section */}
      {recommendedContent.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🎯</span>
            <h3 className="text-3xl font-bold text-purple-600">
              Perfectly Matched ({recommendedContent.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedContent.map((content) => (
              <div key={content.id} className="flex justify-center">
                <ContentCard
                  content={content}
                  isPrimaryMatch={true}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* You Might Also Like Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🌟</span>
          <h3 className="text-3xl font-bold text-purple-600">
            You Might Also Like
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherContent.slice(0, 6).map((content) => (
            <div key={content.id} className="flex justify-center">
              <ContentCard
                content={content}
                isPrimaryMatch={false}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContentFeed;
