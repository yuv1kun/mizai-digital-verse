
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

  const updateState = useCallback((updates: Partial<AudioPlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle audio URL processing
  useEffect(() => {
    const processAudioUrl = () => {
      if (YouTubeService.isYouTubeUrl(content.url)) {
        // For YouTube URLs, show a clear error message
        const errorMsg = 'YouTube playback is not currently supported. Please use direct audio file URLs (.mp3, .wav, etc.) for music playback.';
        updateState({ 
          error: errorMsg, 
          isLoading: false, 
          isExtracting: false,
          extractedAudioUrl: null
        });
        onError?.(errorMsg);
      } else {
        // For direct audio URLs (including Supabase storage), proceed normally
        updateState({ 
          extractedAudioUrl: content.url,
          error: null,
          isLoading: true 
        });
      }
    };

    processAudioUrl();
  }, [content.url, updateState, onError]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.extractedAudioUrl) return;

    // Update audio source when extracted URL is available
    audio.src = state.extractedAudioUrl;
    
    // Add CORS settings for Supabase storage
    audio.crossOrigin = 'anonymous';

    const handleTimeUpdate = () => updateState({ currentTime: audio.currentTime });
    const handleDurationChange = () => updateState({ duration: audio.duration, isLoading: false });
    const handleCanPlay = () => updateState({ isLoading: false, error: null });
    const handleError = () => {
      const errorMsg = 'Failed to load audio file. Please check if the URL is a valid audio file.';
      updateState({ error: errorMsg, isLoading: false });
      onError?.(errorMsg);
    };
    const handleEnded = () => {
      updateState({ isPlaying: false });
      onTrackEnd?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.extractedAudioUrl, updateState, onTrackEnd, onError]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || state.error || !state.extractedAudioUrl) return;

    try {
      await audio.play();
      updateState({ isPlaying: true });
    } catch (error) {
      const errorMsg = 'Failed to play audio. Please try a different audio file.';
      updateState({ error: errorMsg });
      onError?.(errorMsg);
    }
  }, [state.error, state.extractedAudioUrl, updateState, onError]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    updateState({ isPlaying: false });
  }, [updateState]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || state.error) return;

    audio.currentTime = time;
    updateState({ currentTime: time });
  }, [state.error, updateState]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    updateState({ volume });
  }, [updateState]);

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
