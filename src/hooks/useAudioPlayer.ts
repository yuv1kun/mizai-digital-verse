
import { useState, useRef, useEffect, useCallback } from 'react';
import { Content } from '../services/contentService';
import { YouTubeService } from '../services/youtubeService';

interface UseAudioPlayerProps {
  content: Content;
  onTrackEnd?: () => void;
  onError?: (error: string) => void;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudioPlayer = ({ content, onTrackEnd, onError }: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null,
  });

  // Setup audio element and load content
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Setting up audio for:', content.title);

    // Check if it's a YouTube URL (not supported)
    if (YouTubeService.isYouTubeUrl(content.url)) {
      const errorMsg = 'YouTube playback is not currently supported. Please use direct audio file URLs.';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      onError?.(errorMsg);
      return;
    }

    // Reset state for new content
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      isPlaying: false,
      currentTime: 0,
      duration: 0
    }));

    // Event handlers
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleError = () => {
      console.error('Audio loading failed for URL:', content.url);
      const errorMsg = 'Failed to load audio file. Please check the URL or file format.';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false, isPlaying: false }));
      onError?.(errorMsg);
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      onTrackEnd?.();
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setState(prev => ({ ...prev, isLoading: false }));
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    // Set audio source and load
    audio.src = content.url;
    audio.load();

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [content.url]); // Only depend on content.url

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || state.error) {
      console.log('Cannot play: no audio element or error state');
      return;
    }

    try {
      console.log('Playing audio:', content.title);
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Play failed:', error);
      const errorMsg = 'Failed to play audio. Please try again.';
      setState(prev => ({ ...prev, error: errorMsg, isPlaying: false }));
      onError?.(errorMsg);
    }
  }, [state.error, content.title, onError]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Pausing audio');
    audio.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || state.error) return;

    audio.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  }, [state.error]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    setState(prev => ({ ...prev, volume }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  return {
    audioRef,
    ...state,
    play,
    pause,
    seek,
    setVolume,
    togglePlayPause,
  };
};
