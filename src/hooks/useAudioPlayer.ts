
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
    console.log('=== PROCESSING NEW CONTENT ===');
    console.log('Content URL:', content.url);
    console.log('Content Type:', content.type);
    console.log('Content Title:', content.title);
    
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
  }, [content.url, content.type, content.title, onError]);

  // Set up audio element when URL is ready
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.extractedAudioUrl) {
      console.log('Audio setup skipped:', { 
        hasAudio: !!audio, 
        hasUrl: !!state.extractedAudioUrl 
      });
      return;
    }

    console.log('=== SETTING UP AUDIO ELEMENT ===');
    console.log('Audio URL:', state.extractedAudioUrl);
    
    // Test if URL is accessible
    fetch(state.extractedAudioUrl, { method: 'HEAD' })
      .then(response => {
        console.log('URL accessibility test:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      })
      .catch(error => {
        console.error('URL accessibility test failed:', error);
      });
    
    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    
    const handleDurationChange = () => {
      console.log('✅ Audio duration loaded:', audio.duration);
      setState(prev => ({ ...prev, duration: audio.duration, isLoading: false }));
    };
    
    const handleCanPlay = () => {
      console.log('✅ Audio can play');
      setState(prev => ({ ...prev, isLoading: false, error: null }));
    };
    
    const handleLoadStart = () => {
      console.log('🔄 Audio load started');
      setState(prev => ({ ...prev, isLoading: true }));
    };
    
    const handleLoadedData = () => {
      console.log('✅ Audio data loaded');
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleLoadedMetadata = () => {
      console.log('✅ Audio metadata loaded:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
    };

    const handleProgress = () => {
      console.log('📊 Audio loading progress:', {
        buffered: audio.buffered.length > 0 ? audio.buffered.end(0) : 0,
        duration: audio.duration
      });
    };

    const handleWaiting = () => {
      console.log('⏳ Audio waiting for data');
    };

    const handleSuspend = () => {
      console.log('⏸️ Audio loading suspended');
    };

    const handleAbort = () => {
      console.log('❌ Audio loading aborted');
    };

    const handleStalled = () => {
      console.log('⚠️ Audio loading stalled');
    };
    
    const handleError = (e: Event) => {
      console.error('❌ Audio error event:', e);
      const target = e.target as HTMLAudioElement;
      console.error('Audio error details:', {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src
      });
      
      let errorMsg = 'Failed to load audio file.';
      if (target.error) {
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Audio loading was aborted.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error while loading audio.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio file is corrupted or unsupported format.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio format not supported.';
            break;
        }
      }
      
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      onError?.(errorMsg);
    };
    
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onTrackEnd?.();
    };

    // Set up the audio element
    console.log('🔧 Configuring audio element...');
    audio.src = state.extractedAudioUrl;
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    
    // Add ALL event listeners for comprehensive debugging
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('abort', handleAbort);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Force load the audio
    console.log('🚀 Loading audio...');
    audio.load();

    return () => {
      console.log('🧹 Cleaning up audio event listeners');
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('abort', handleAbort);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.extractedAudioUrl, onTrackEnd, onError]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || state.error || !state.extractedAudioUrl) {
      console.log('❌ Cannot play:', { 
        audio: !!audio, 
        error: state.error, 
        url: state.extractedAudioUrl 
      });
      return;
    }

    try {
      console.log('▶️ Attempting to play audio...');
      console.log('Audio state before play:', {
        readyState: audio.readyState,
        networkState: audio.networkState,
        paused: audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration
      });
      
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true }));
      console.log('✅ Audio playing successfully');
    } catch (error) {
      console.error('❌ Play error:', error);
      const errorMsg = `Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
    }
  }, [state.error, state.extractedAudioUrl, onError]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('⏸️ Pausing audio');
    audio.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || state.error) return;

    console.log('⏭️ Seeking to:', time);
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
