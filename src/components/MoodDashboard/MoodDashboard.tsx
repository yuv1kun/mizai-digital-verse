import React, { useState, useEffect } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import Header from '../Header/Header';
import MoodInput from '../MoodInput/MoodInput';
import ContentFeed from '../ContentFeed/ContentFeed';
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
  const [currentPlayingMusic, setCurrentPlayingMusic] = useState<Content | null>(null);

  // Mood-based images
  const getMoodImage = () => {
    switch (mood.primaryEmotion) {
      case 'calm':
        return 'https://www.shutterstock.com/image-photo/soft-gently-wind-grass-flowers-600nw-1919586134.jpg';
      case 'joy':
        return 'https://wallpapercave.com/wp/wp5910085.jpg';
      case 'excitement':
        return 'https://c4.wallpaperflare.com/wallpaper/766/348/908/birds-happy-mood-silhouette-exciting-wallpaper-thumb.jpg';
      case 'love':
        return 'https://i.pinimg.com/736x/71/5b/a4/715ba46666e2a80e68f1f7ffa77a8108.jpg';
      case 'anger':
        return 'https://i.pinimg.com/474x/9e/54/b3/9e54b34b26fe271a8244ef8020336b45.jpg';
      case 'sadness':
        return 'https://w0.peakpx.com/wallpaper/933/159/HD-wallpaper-sad-emotional-sad-anime-boy-with-crows-background-sad-anime-boy-thumbnail.jpg';
      case 'fear':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdE_nPzDx8rEKRv_UoIqQac77rOG0DTNt_Iw&s';
      case 'surprise':
        return 'https://www.shutterstock.com/image-photo/excited-young-woman-amazed-by-260nw-1934342621.jpg';
      default:
        return 'https://www.shutterstock.com/image-photo/soft-gently-wind-grass-flowers-600nw-1919586134.jpg';
    }
  };

  // Sample music data based on mood
  const getMoodMusic = () => {
    switch (mood.primaryEmotion) {
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
  const moodBasedMusic = getMoodMusic();

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
    setCurrentPlayingMusic(content);
  };
  const handleClosePlayer = () => {
    setCurrentPlayingMusic(null);
  };
  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${theme.backgroundStyle}`} style={{
      background: `${theme.gradient}, ${theme.backgroundStyle}`,
      color: theme.textColor
    }}>
      {isAnalyzing && <HexagonLoader />}
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section with Enhanced Typography */}
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-6">
            <h1 className="text-7xl font-bold mb-6">
              <TextShimmer speed="slow" className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-extrabold">
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
            <TextShimmer speed="normal" className="text-xl font-medium text-blue-600 dark:text-blue-400">
              Hi, how are you feeling today?
            </TextShimmer>
          </div>

          {/* Mood-based Background Image */}
          <div className="mb-8 mx-auto max-w-4xl">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={getMoodImage()}
                alt={`${mood.primaryEmotion} mood visualization`}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-lg font-medium capitalize">
                  Current mood: {mood.primaryEmotion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Input Section */}
        <div className="max-w-2xl mx-auto">
          <MoodInput />
        </div>

        {/* Personalized Content - Only show after mood analysis */}
        {showPersonalizedContent && (
          <div className="animate-in fade-in-0 duration-1000">
            <ContentFeed onPlayMusic={handlePlayMusic} />
          </div>
        )}
      </main>

      {/* Music Player */}
      {currentPlayingMusic && (
        <MusicPlayer content={currentPlayingMusic} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default MoodDashboard;
