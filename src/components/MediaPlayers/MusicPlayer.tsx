
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, AlertCircle } from 'lucide-react';
import { Content, contentService } from '../../services/contentService';

interface MusicPlayerProps {
  content: Content;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ content, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleError = () => {
      setAudioError(true);
      setIsLoading(false);
      console.error('Audio failed to load:', content.url);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioError(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const handleTrackEnd = () => {
    setIsPlaying(false);
    contentService.recordInteraction(content.id, 'complete', duration);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
      contentService.recordInteraction(content.id, 'pause', currentTime);
    } else {
      audio.play().catch(() => {
        setAudioError(true);
        console.error('Failed to play audio');
      });
      contentService.recordInteraction(content.id, 'play', currentTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
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

  // Enhanced audio URL processing
  const getAudioUrl = (url: string) => {
    // Check if it's already a direct audio file
    if (url.match(/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i)) {
      return url;
    }
    
    // For YouTube URLs, we'll need a different approach in production
    // For now, return a placeholder or the original URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      console.warn('YouTube URLs require special handling for audio extraction');
      // In production, you'd use YouTube API or a service like youtube-dl
      return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Placeholder
    }
    
    // Assume it's a direct audio URL
    return url;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-200 p-4 z-50">
      <audio
        ref={audioRef}
        src={getAudioUrl(content.url)}
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
      />
      
      <div className="max-w-4xl mx-auto flex items-center space-x-4">
        {/* Album Art with Enhanced Loading */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
          {content.thumbnail_url ? (
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a default music icon
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-purple-100 flex items-center justify-center text-2xl ${content.thumbnail_url ? 'hidden' : ''}`}>
            🎵
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{content.title}</h4>
          <p className="text-sm text-gray-600 truncate">{content.description}</p>
          {audioError && (
            <div className="flex items-center space-x-1 text-red-500 text-xs mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>Audio failed to load</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={audioError}>
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={audioError || isLoading}
            className={`p-3 rounded-full transition-colors ${
              audioError || isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={audioError}>
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
              disabled={audioError || isLoading}
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
              onChange={handleVolumeChange}
              disabled={audioError}
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
