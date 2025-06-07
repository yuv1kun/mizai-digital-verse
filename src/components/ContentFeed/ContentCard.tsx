
import React, { useState } from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { Play, BookOpen, Music, Heart, Sparkles } from 'lucide-react';
import MusicArtwork from '../ui/music-artwork';
import DisplayCards from '../ui/display-cards';

interface Content {
  id: number;
  type: string;
  title: string;
  description: string;
  emotions: string[];
  thumbnail: string;
  duration: string;
  matchScore: number;
}

interface ContentCardProps {
  content: Content;
  isPrimaryMatch: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, isPrimaryMatch }) => {
  const { theme } = useAdaptiveUI();
  const [isLiked, setIsLiked] = useState(false);

  const getTypeIcon = () => {
    switch (content.type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const handleContentClick = () => {
    console.log(`Opening ${content.type}: ${content.title}`);
    // In a real app, this would navigate to the content
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log(`${isLiked ? 'Unliked' : 'Liked'} content: ${content.title}`);
  };

  // Sample album art URLs for music content
  const getMusicAlbumArt = () => {
    const albumArts = [
      "https://i.scdn.co/image/ab67616d0000b273b33d46dfa2635a47eebf63b2",
      "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856",
      "https://upload.wikimedia.org/wikipedia/en/2/23/Pharrell_Williams_-_Happy.jpg",
      "https://i.scdn.co/image/ab67616d0000b273ee7c4fd0b050b0f3e8a8c7e8",
      "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad0",
      "https://i.scdn.co/image/ab67616d0000b273f2248cf6dad1d6c062587249"
    ];
    return albumArts[content.id % albumArts.length];
  };

  // If it's music content, use the existing music artwork design
  if (content.type === 'music') {
    return (
      <div
        className={`group relative p-4 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
          isPrimaryMatch
            ? 'bg-white/30 border-white/40 hover:bg-white/40 hover:shadow-lg'
            : 'bg-white/15 border-white/20 hover:bg-white/25 hover:shadow-md'
        }`}
        onClick={handleContentClick}
      >
        {isPrimaryMatch && (
          <div 
            className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800"
            style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
          >
            {Math.round(content.matchScore * 100)}% match
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <MusicArtwork
              artist="Various Artists"
              music={content.title}
              albumArt={getMusicAlbumArt()}
              isSong={true}
              isLoading={false}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon()}
              <span className="text-xs opacity-70 uppercase font-medium">
                {content.type}
              </span>
              <span className="text-xs opacity-70">•</span>
              <span className="text-xs opacity-70">{content.duration}</span>
            </div>
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-current transition-colors">
              {content.title}
            </h4>
            
            <p className="text-xs opacity-80 line-clamp-2 mb-3">
              {content.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {content.emotions.slice(0, 2).map((emotion) => (
                  <span
                    key={emotion}
                    className="px-2 py-1 rounded-full text-xs bg-white/20 capitalize"
                  >
                    {emotion}
                  </span>
                ))}
              </div>

              <button
                onClick={handleLike}
                className={`p-1 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Heart 
                  className="w-4 h-4" 
                  fill={isLiked ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {isPrimaryMatch && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs opacity-70 italic">
              Suggested because: Perfect match with your {content.emotions[0]} mood
            </p>
          </div>
        )}
      </div>
    );
  }

  // For video and article content, use DisplayCards
  const displayCardData = [
    {
      icon: getTypeIcon(),
      title: content.title,
      description: content.description,
      date: content.duration,
      iconClassName: isPrimaryMatch ? theme.primary : "text-blue-500",
      titleClassName: isPrimaryMatch ? `text-[${theme.primary}]` : "text-blue-500",
      className: `cursor-pointer transition-all duration-300 hover:scale-105 ${
        isPrimaryMatch 
          ? "[grid-area:stack] hover:-translate-y-4" 
          : "[grid-area:stack] hover:-translate-y-2"
      }`
    }
  ];

  return (
    <div 
      className="relative"
      onClick={handleContentClick}
    >
      {isPrimaryMatch && (
        <div 
          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 z-10"
          style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
        >
          {Math.round(content.matchScore * 100)}% match
        </div>
      )}

      <DisplayCards cards={displayCardData} />

      {/* Emotions and Like button overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex space-x-1">
          {content.emotions.slice(0, 2).map((emotion) => (
            <span
              key={emotion}
              className="px-2 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm capitalize text-white"
            >
              {emotion}
            </span>
          ))}
        </div>

        <button
          onClick={handleLike}
          className={`p-1 rounded-full transition-colors ${
            isLiked 
              ? 'text-red-500' 
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          <Heart 
            className="w-4 h-4" 
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {isPrimaryMatch && (
        <div className="absolute bottom-0 left-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-b-xl">
          <p className="text-xs opacity-70 italic text-white">
            Perfect match with your {content.emotions[0]} mood
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
