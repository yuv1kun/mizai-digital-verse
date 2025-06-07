
import React, { useState, useEffect } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import ContentCard from './ContentCard';
import RecommendationExplanation from './RecommendationExplanation';
import MusicPlayer from '../MediaPlayers/MusicPlayer';
import VideoPlayer from '../MediaPlayers/VideoPlayer';
import ArticleReader from '../MediaPlayers/ArticleReader';
import { TextShimmer } from '../ui/text-shimmer';
import { Play, BookOpen, Music } from 'lucide-react';
import { Content, contentService } from '../../services/contentService';

const ContentFeed: React.FC = () => {
  const { mood } = useMood();
  const { theme } = useAdaptiveUI();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState<{
    type: 'music' | 'video' | 'article';
    content: Content;
  } | null>(null);

  useEffect(() => {
    loadContent();
    // Save mood history when mood changes
    if (mood.primaryEmotion !== 'calm' || mood.arousalLevel !== 0.3) {
      contentService.saveMoodHistory(mood.currentMood, mood.primaryEmotion, mood.arousalLevel);
    }
  }, [mood.primaryEmotion]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Get content based on current mood
      const moodContent = await contentService.getContentByMood(mood.primaryEmotion, 10);
      // Get additional content for variety
      const allContent = await contentService.getAllContent();
      
      // Combine and deduplicate
      const combinedContent = [...moodContent];
      allContent.forEach(item => {
        if (!combinedContent.find(existing => existing.id === item.id)) {
          combinedContent.push(item);
        }
      });
      
      setContent(combinedContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayContent = (selectedContent: Content) => {
    setActivePlayer({
      type: selectedContent.type as 'music' | 'video' | 'article',
      content: selectedContent
    });
  };

  const closePlayer = () => {
    setActivePlayer(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-16 px-4">
        <div className="text-center">
          <TextShimmer duration={1.5} className="text-2xl">
            Loading personalized content...
          </TextShimmer>
        </div>
      </div>
    );
  }

  // Filter and sort content based on current mood
  const recommendedContent = content
    .filter(item => item.emotions.includes(mood.primaryEmotion))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const otherContent = content
    .filter(item => !item.emotions.includes(mood.primaryEmotion))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Separate content by type
  const getContentByType = (contentList: Content[], type: string) => 
    contentList.filter(item => item.type === type);

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
    content: sectionContent, 
    isPrimary = false 
  }: { 
    title: string; 
    emoji: string; 
    icon: React.ReactNode; 
    content: Content[]; 
    isPrimary?: boolean; 
  }) => {
    if (sectionContent.length === 0) return null;

    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{emoji}</span>
            <div className="flex items-center space-x-2">
              {icon}
              <h3 className={`text-2xl font-bold ${isPrimary ? 'text-purple-600' : 'text-gray-700'}`}>
                {title} ({sectionContent.length})
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
          {sectionContent.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ContentCard
                content={item}
                isPrimaryMatch={isPrimary}
                onPlay={handlePlayContent}
              />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
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

      {/* Media Players */}
      {activePlayer && (
        <>
          {activePlayer.type === 'music' && (
            <MusicPlayer
              content={activePlayer.content}
              onClose={closePlayer}
            />
          )}
          {activePlayer.type === 'video' && (
            <VideoPlayer
              content={activePlayer.content}
              onClose={closePlayer}
            />
          )}
          {activePlayer.type === 'article' && (
            <ArticleReader
              content={activePlayer.content}
              onClose={closePlayer}
            />
          )}
        </>
      )}
    </>
  );
};

export default ContentFeed;
