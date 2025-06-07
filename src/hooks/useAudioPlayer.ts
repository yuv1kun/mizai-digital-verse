
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
  isExtracting: boolean;
  extractedAudioUrl: string | null;
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
    isExtracting: false,
    extractedAudioUrl: null,
  });

  // Process the content URL only when it changes
  useEffect(() => {
    console.log('Processing new content URL:', content.url);
    
    if (YouTubeService.isYouTubeUrl(content.url)) {
      const errorMsg = 'YouTube playback is not currently supported. Please use direct audio file URLs (.mp3, .wav, etc.) for music playback.';
      setState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isLoading: false,
        error: errorMsg,
        isExtracting: false,
        extractedAudioUrl: null,
      });
      onError?.(errorMsg);
    } else {
      // For direct audio URLs, set them directly
      console.log('Setting up direct audio URL:', content.url);
      setState(prev => ({
        ...prev,
        extractedAudioUrl: content.url,
        error: null,
        isLoading: true,
        isExtracting: false
      }));
    }
  }, [content.url, onError]);

  // Set up audio element when URL is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.extractedAudioUrl) {
      return;
    }

    console.log('Setting up audio element with URL:', state.extractedAudioUrl);
    
    // Clear any existing event listeners
    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    
    const handleDurationChange = () => {
      console.log('Audio duration loaded:', audio.duration);
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    };
    
    const handleCanPlay = () => {
      console.log('Audio can play');
      setState(prev => ({ ...prev, isLoading: false, error: null }));
    };
    
    const handleLoadStart = () => {
      console.log('Audio load started');
      setState(prev => ({ ...prev, isLoading: true }));
    };
    
    const handleLoadedData = () => {
      console.log('Audio data loaded');
      setState(prev => ({ ...prev, isLoading: false }));
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      const errorMsg = 'Failed to load audio file. Please check if the URL is a valid audio file.';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      onError?.(errorMsg);
    };
    
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onTrackEnd?.();
    };

    // Set up the audio element
    audio.src = state.extractedAudioUrl;
    audio.crossOrigin = 'anonymous';
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Force load the audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.extractedAudioUrl, onTrackEnd, onError]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || state.error || !state.extractedAudioUrl) {
      console.log('Cannot play:', { audio: !!audio, error: state.error, url: state.extractedAudioUrl });
      return;
    }

    try {
      console.log('Attempting to play audio');
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true }));
      console.log('Audio playing successfully');
    } catch (error) {
      console.error('Play error:', error);
      const errorMsg = 'Failed to play audio. Please try a different audio file.';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    }
  }, [state.error, state.extractedAudioUrl, onError]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
