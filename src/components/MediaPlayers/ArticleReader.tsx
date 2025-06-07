
import React, { useState, useEffect } from 'react';
import { X, Heart, Volume2, VolumeX, Bookmark } from 'lucide-react';
import { Content, contentService } from '../../services/contentService';

interface ArticleReaderProps {
  content: Content;
  onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ content, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    contentService.recordInteraction(content.id, 'like');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    contentService.recordInteraction(content.id, 'bookmark');
  };

  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content.description);
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.max(12, Math.min(24, prev + delta)));
  };

  // Sample article content (in production, fetch from content.url)
  const articleContent = `
    ${content.description}
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
  `;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-10">
        <div 
          className="h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-xl text-gray-800 truncate">{content.title}</h1>
            <p className="text-sm text-gray-600">Reading time: {content.duration}</p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
              <button
                onClick={() => adjustFontSize(-2)}
                className="px-2 py-1 text-sm hover:bg-gray-100 transition-colors"
              >
                A-
              </button>
              <span className="px-2 py-1 text-sm border-x border-gray-300">{fontSize}px</span>
              <button
                onClick={() => adjustFontSize(2)}
                className="px-2 py-1 text-sm hover:bg-gray-100 transition-colors"
              >
                A+
              </button>
            </div>

            <button
              onClick={toggleTextToSpeech}
              className={`p-2 rounded-full transition-colors ${
                isSpeaking ? 'text-purple-500 bg-purple-50' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

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
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Image */}
        {content.thumbnail_url && (
          <div className="mb-8">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Emotion Tags */}
        <div className="flex space-x-2 mb-6">
          {content.emotions.map((emotion) => (
            <span
              key={emotion}
              className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 capitalize"
            >
              {emotion}
            </span>
          ))}
        </div>

        {/* Article Text */}
        <article 
          className="prose prose-lg max-w-none leading-relaxed text-gray-800"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
        >
          {articleContent.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph.trim()}
            </p>
          ))}
        </article>
      </main>
    </div>
  );
};

export default ArticleReader;
