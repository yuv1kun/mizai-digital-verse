
import React, { useState, useEffect } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import Header from '../Header/Header';
import MoodInput from '../MoodInput/MoodInput';
import ContentFeed from '../ContentFeed/ContentFeed';
import MusicLibrary from '../MusicUpload/MusicLibrary';
import MusicPlayer from '../MediaPlayers/MusicPlayer';
import { TextShimmer } from '../ui/text-shimmer';
import MusicArtwork from '../ui/music-artwork';
import HexagonLoader from '../ui/hexagon-loader';
import { Content } from '../../services/contentService';

const MoodDashboard: React.FC = () => {
  const { mood } = useMood();
  const { theme } = useAdaptiveUI();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPersonalizedContent, setShowPersonalizedContent] = useState(false);
  const [lastMoodUpdate, setLastMoodUpdate] = useState<Date | null>(null);
  const [currentMusic, setCurrentMusic] = useState<Content | null>(null);

  // Sample music data based on mood
  const getMoodMusic = () => {
    switch(mood.primaryEmotion) {
      case 'joy':
        return {
          artist: "Pharrell Williams",
          music: "Happy",
          albumArt: "https://upload.wikimedia.org/wikipedia/en/2/23/Pharrell_Williams_-_Happy.jpg"
        };
      case 'calm':
        return {
          artist: "Ludovico Einaudi",
          music: "Nuvole Bianche",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856"
        };
      case 'excitement':
        return {
          artist: "Daft Punk",
          music: "One More Time",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273b33d46dfa2635a47eebf63b2"
        };
      default:
        return {
          artist: "Billie Eilish",
          music: "What Was I Made For?",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273ee7c4fd0b050b0f3e8a8c7e8"
        };
    }
  };

  const currentMusic = getMoodMusic();

  // Watch for mood changes to trigger loading and content reveal
  useEffect(() => {
    if (mood.lastUpdated && (!lastMoodUpdate || mood.lastUpdated > lastMoodUpdate)) {
      if (mood.primaryEmotion !== 'calm' || mood.arousalLevel !== 0.3) {
        setIsAnalyzing(true);
        setLastMoodUpdate(mood.lastUpdated);
        
        // Simulate analysis time
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowPersonalizedContent(true);
        }, 3000);
      }
    }
  }, [mood.lastUpdated, lastMoodUpdate, mood.primaryEmotion, mood.arousalLevel]);

  const handlePlayMusic = (content: Content) => {
    setCurrentMusic(content);
  };

  const handleClosePlayer = () => {
    setCurrentMusic(null);
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ease-in-out ${theme.backgroundStyle}`}
      style={{ 
        background: `${theme.gradient}, ${theme.backgroundStyle}`,
        color: theme.textColor 
      }}
    >
      {isAnalyzing && <HexagonLoader />}
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section with Enhanced Typography */}
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-6">
            <h1 className="text-7xl font-bold mb-6">
              <TextShimmer 
                duration={1.5}
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-extrabold"
              >
                mizai
              </TextShimmer>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-2xl opacity-90 font-light">
                Your AI-powered companion that adapts to your emotions in real-time
              </p>
            </div>
          </div>

          {/* User Acknowledgment with Text Shimmer */}
          <div className="mb-8">
            <TextShimmer 
              duration={2}
              className="text-xl font-medium text-blue-600 dark:text-blue-400"
            >
              Hi, how are you feeling today?
            </TextShimmer>
          </div>

          {/* Music Artwork Display */}
          <div className="flex justify-center py-8">
            <MusicArtwork
              artist={currentMusic.artist}
              music={currentMusic.music}
              albumArt={currentMusic.albumArt}
              isSong={true}
              isLoading={false}
            />
          </div>
        </div>

        {/* Mood Input Section */}
        <div className="max-w-2xl mx-auto">
          <MoodInput />
        </div>

        {/* Music Library Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-purple-600 mb-4">🎵 Your Music</h2>
            <p className="text-gray-600 text-lg">Discover and play music that matches your mood</p>
          </div>
          
          <MusicLibrary onPlayMusic={handlePlayMusic} />
        </div>

        {/* Personalized Content - Only show after mood analysis */}
        {showPersonalizedContent && (
          <div className="animate-in fade-in-0 duration-1000">
            <ContentFeed />
          </div>
        )}
      </main>

      {/* Music Player */}
      {currentMusic && (
        <MusicPlayer 
          content={currentMusic} 
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MoodDashboard;
