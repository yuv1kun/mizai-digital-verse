
import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import ContentCard from './ContentCard';
import RecommendationExplanation from './RecommendationExplanation';
import { TextShimmer } from '../ui/text-shimmer';
import { Play, BookOpen, Music } from 'lucide-react';

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

  // Separate content by type
  const getContentByType = (contentList: typeof mockContent, type: string) => 
    contentList.filter(content => content.type === type);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'article':
        return <BookOpen className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'video':
        return '🎬';
      case 'article':
        return '📚';
      case 'music':
        return '🎵';
      default:
        return '🎬';
    }
  };

  const ContentSection = ({ 
    title, 
    emoji, 
    icon, 
    content, 
    isPrimary = false 
  }: { 
    title: string; 
    emoji: string; 
    icon: React.ReactNode; 
    content: typeof mockContent; 
    isPrimary?: boolean; 
  }) => {
    if (content.length === 0) return null;

    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{emoji}</span>
            <div className="flex items-center space-x-2">
              {icon}
              <h3 className={`text-2xl font-bold ${isPrimary ? 'text-purple-600' : 'text-gray-700'}`}>
                {title} ({content.length})
              </h3>
            </div>
          </div>
          {isPrimary && (
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
              Perfect Match
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ContentCard
                content={item}
                isPrimaryMatch={isPrimary}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 px-4">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold text-purple-600">
          Personalized for You
        </h2>
        <div className="flex justify-center">
          <RecommendationExplanation currentMood={mood.primaryEmotion} />
        </div>
      </div>

      {/* Perfectly Matched Content - Organized by Type */}
      {recommendedContent.length > 0 && (
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-600 mb-2">🎯 Perfectly Matched</h2>
            <p className="text-gray-600">Content that matches your current mood perfectly</p>
          </div>

          {/* Videos Section */}
          <ContentSection
            title="Videos"
            emoji={getTypeEmoji('video')}
            icon={getTypeIcon('video')}
            content={getContentByType(recommendedContent, 'video')}
            isPrimary={true}
          />

          {/* Articles Section */}
          <ContentSection
            title="Articles"
            emoji={getTypeEmoji('article')}
            icon={getTypeIcon('article')}
            content={getContentByType(recommendedContent, 'article')}
            isPrimary={true}
          />

          {/* Music Section */}
          <ContentSection
            title="Music"
            emoji={getTypeEmoji('music')}
            icon={getTypeIcon('music')}
            content={getContentByType(recommendedContent, 'music')}
            isPrimary={true}
          />
        </div>
      )}

      {/* You Might Also Like - Organized by Type */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">🌟 You Might Also Like</h2>
          <p className="text-gray-600">Discover more content tailored to your interests</p>
        </div>

        {/* Videos Section */}
        <ContentSection
          title="Videos"
          emoji={getTypeEmoji('video')}
          icon={getTypeIcon('video')}
          content={getContentByType(otherContent, 'video')}
        />

        {/* Articles Section */}
        <ContentSection
          title="Articles"
          emoji={getTypeEmoji('article')}
          icon={getTypeIcon('article')}
          content={getContentByType(otherContent, 'article')}
        />

        {/* Music Section */}
        <ContentSection
          title="Music"
          emoji={getTypeEmoji('music')}
          icon={getTypeIcon('music')}
          content={getContentByType(otherContent, 'music')}
        />
      </div>
    </div>
  );
};

export default ContentFeed;
