
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, []);

  const handleTrackEnd = () => {
    setIsPlaying(false);
    contentService.recordInteraction(content.id, 'complete', duration);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      contentService.recordInteraction(content.id, 'pause', currentTime);
    } else {
      audio.play();
      contentService.recordInteraction(content.id, 'play', currentTime);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Extract YouTube audio URL (Note: In production, you'd want to use YouTube API properly)
  const getAudioUrl = (url: string) => {
    // For demo purposes, using a placeholder. In production, implement proper YouTube audio extraction
    // or use services like YouTube Music API, Spotify Web API, etc.
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Placeholder audio
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-200 p-4 z-50">
      <audio
        ref={audioRef}
        src={getAudioUrl(content.url)}
        preload="metadata"
      />
      
      <div className="max-w-4xl mx-auto flex items-center space-x-4">
        {/* Album Art */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={content.thumbnail_url || '/placeholder.svg'}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{content.title}</h4>
          <p className="text-sm text-gray-600 truncate">{content.description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
