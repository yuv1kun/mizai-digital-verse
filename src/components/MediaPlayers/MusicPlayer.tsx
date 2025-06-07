
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { Content, contentService } from '../../services/contentService';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { YouTubeService } from '../../services/youtubeService';

interface MusicPlayerProps {
  content: Content;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ content, onClose }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    isExtracting,
    togglePlayPause,
    seek,
    setVolume: handleVolumeChange
  } = useAudioPlayer({
    content,
    onTrackEnd: () => {
      contentService.recordInteraction(content.id, 'complete', duration);
    },
    onError: (errorMsg) => {
      console.error('Audio player error:', errorMsg);
    }
  });

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    handleVolumeChange(newVolume);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    contentService.recordInteraction(content.id, 'like');
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getThumbnailUrl = () => {
    if (content.thumbnail_url) {
      return content.thumbnail_url;
    }
    if (YouTubeService.isYouTubeUrl(content.url)) {
      return YouTubeService.getThumbnailUrl(content.url);
    }
    return null;
  };

  const getStatusMessage = () => {
    if (isExtracting) return 'Extracting audio from YouTube...';
    if (isLoading) return 'Loading audio...';
    if (error) return error;
    return null;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-200 p-4 z-50">
      <audio ref={audioRef} preload="metadata" />
      
      <div className="max-w-4xl mx-auto flex items-center space-x-4">
        {/* Album Art with Enhanced Loading */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
          {getThumbnailUrl() ? (
            <img
              src={getThumbnailUrl()!}
              alt={content.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-purple-100 flex items-center justify-center text-2xl ${getThumbnailUrl() ? 'hidden' : ''}`}>
            🎵
          </div>
          
          {/* Loading overlay for YouTube extraction */}
          {isExtracting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{content.title}</h4>
          <p className="text-sm text-gray-600 truncate">{content.description}</p>
          
          {/* Status Messages */}
          {getStatusMessage() && (
            <div className={`flex items-center space-x-1 text-xs mt-1 ${
              error ? 'text-red-500' : 'text-blue-500'
            }`}>
              {error ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              <span>{getStatusMessage()}</span>
            </div>
          )}
          
          {YouTubeService.isYouTubeUrl(content.url) && !error && (
            <div className="text-xs text-gray-500 mt-1">
              🎵 YouTube Audio
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
            disabled={error || isLoading || isExtracting}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={error || isLoading || isExtracting}
            className={`p-3 rounded-full transition-colors ${
              error || isLoading || isExtracting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isLoading || isExtracting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
            disabled={error || isLoading || isExtracting}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={error || isLoading || isExtracting}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeSliderChange}
              disabled={error}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
