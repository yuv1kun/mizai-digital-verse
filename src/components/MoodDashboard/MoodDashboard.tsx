
import React from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import Header from '../Header/Header';
import MoodInput from '../MoodInput/MoodInput';
import ContentFeed from '../ContentFeed/ContentFeed';
import PrivacyDashboard from '../PrivacyDashboard/PrivacyDashboard';
import { TextShimmer } from '../ui/text-shimmer';
import MusicArtwork from '../ui/music-artwork';

const MoodDashboard: React.FC = () => {
  const { mood } = useMood();
  const { theme } = useAdaptiveUI();

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

  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ease-in-out ${theme.backgroundStyle}`}
      style={{ 
        background: `${theme.gradient}, ${theme.backgroundStyle}`,
        color: theme.textColor 
      }}
    >
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

          {/* Current Mood Indicator */}
          <div className="inline-block">
            <span className="text-lg font-medium px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              Currently feeling: {mood.primaryEmotion}
            </span>
          </div>
        </div>

        {/* Main Content Grid with Better Spacing */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="transform transition-all duration-500 hover:scale-105">
              <MoodInput />
            </div>
            <div className="transform transition-all duration-500 hover:scale-105">
              <PrivacyDashboard />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <ContentFeed />
            </div>
          </div>
        </div>

        {/* Enhanced Status Footer */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="space-y-4">
              <p className="text-sm opacity-80 font-medium">
                Mood Analysis Complete
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-semibold capitalize">{mood.primaryEmotion}</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                  <span>Arousal: {Math.round(mood.arousalLevel * 100)}%</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                  <span>Updated: {mood.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodDashboard;
