
import React, { useState } from 'react';
import { X, Heart, Maximize } from 'lucide-react';
import { Content, contentService } from '../../services/contentService';

interface VideoPlayerProps {
  content: Content;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    contentService.recordInteraction(content.id, 'like');
  };

  const handlePlay = () => {
    contentService.recordInteraction(content.id, 'play');
  };

  const handlePause = () => {
    contentService.recordInteraction(content.id, 'pause');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1` : url;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-white rounded-lg overflow-hidden shadow-2xl ${
        isFullscreen ? 'w-full h-full rounded-none' : 'max-w-4xl w-full max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-800 truncate">{content.title}</h3>
            <p className="text-sm text-gray-600 truncate">{content.description}</p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Content */}
        <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
          <iframe
            src={getYouTubeEmbedUrl(content.url)}
            title={content.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handlePlay}
          />
        </div>

        {/* Video Info */}
        {!isFullscreen && (
          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Duration: {content.duration}</span>
                <div className="flex space-x-2">
                  {content.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 capitalize"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
