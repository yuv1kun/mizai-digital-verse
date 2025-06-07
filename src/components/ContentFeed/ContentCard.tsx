
import React, { useState } from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { Play, BookOpen, Music, Heart, Sparkles } from 'lucide-react';
import MusicArtwork from '../ui/music-artwork';

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
        return <Play className="w-5 h-5" />;
      case 'article':
        return <BookOpen className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const handleContentClick = () => {
    console.log(`Opening ${content.type}: ${content.title}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    console.log(`${isLiked ? 'Unliked' : 'Liked'} content: ${content.title}`);
  };

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

  // Music content with existing clean layout
  if (content.type === 'music') {
    return (
      <div
        className={`group relative p-6 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 cursor-pointer w-full max-w-sm ${
          isPrimaryMatch
            ? 'bg-white/40 border-purple-300 hover:bg-white/50 hover:shadow-xl shadow-purple-200'
            : 'bg-white/20 border-white/30 hover:bg-white/30 hover:shadow-lg'
        }`}
        onClick={handleContentClick}
      >
        {isPrimaryMatch && (
          <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm font-bold bg-purple-500 text-white shadow-lg">
            {Math.round(content.matchScore * 100)}% match
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center">
            <MusicArtwork
              artist="Various Artists"
              music={content.title}
              albumArt={getMusicAlbumArt()}
              isSong={true}
              isLoading={false}
            />
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
              {getTypeIcon()}
              <span className="font-medium uppercase">{content.type}</span>
              <span>•</span>
              <span>{content.duration}</span>
            </div>
            
            <h4 className="font-bold text-lg text-gray-800 line-clamp-2">
              {content.title}
            </h4>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {content.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                {content.emotions.slice(0, 2).map((emotion) => (
                  <span
                    key={emotion}
                    className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 capitalize font-medium"
                  >
                    {emotion}
                  </span>
                ))}
              </div>

              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart 
                  className="w-5 h-5" 
                  fill={isLiked ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video and article content with clean card design
  return (
    <div
      className={`group relative p-6 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 cursor-pointer w-full max-w-sm ${
        isPrimaryMatch
          ? 'bg-white/40 border-purple-300 hover:bg-white/50 hover:shadow-xl shadow-purple-200'
          : 'bg-white/20 border-white/30 hover:bg-white/30 hover:shadow-lg'
      }`}
      onClick={handleContentClick}
    >
      {isPrimaryMatch && (
        <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm font-bold bg-purple-500 text-white shadow-lg">
          {Math.round(content.matchScore * 100)}% match
        </div>
      )}

      <div className="space-y-4">
        {/* Content thumbnail/icon */}
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
            isPrimaryMatch ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {content.thumbnail}
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <div className={`flex items-center justify-center space-x-2 text-sm ${
            isPrimaryMatch ? 'text-purple-600' : 'text-blue-600'
          }`}>
            {getTypeIcon()}
            <span className="font-medium uppercase">{content.type}</span>
            <span>•</span>
            <span>{content.duration}</span>
          </div>
          
          <h4 className="font-bold text-lg text-gray-800 line-clamp-2">
            {content.title}
          </h4>
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {content.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              {content.emotions.slice(0, 2).map((emotion) => (
                <span
                  key={emotion}
                  className={`px-3 py-1 rounded-full text-xs capitalize font-medium ${
                    isPrimaryMatch 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {emotion}
                </span>
              ))}
            </div>

            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart 
                className="w-5 h-5" 
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
