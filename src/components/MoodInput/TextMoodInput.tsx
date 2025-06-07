
import React, { useState } from 'react';
import { useMood } from '../../contexts/MoodContext';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { Send } from 'lucide-react';

const TextMoodInput: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setMoodFromText } = useMood();
  const { theme } = useAdaptiveUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    console.log(`Analyzing mood from text: "${text}"`);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      setMoodFromText(text);
      setIsAnalyzing(false);
      setText('');
    }, 1000);
  };

  const suggestedPrompts = [
    "I'm feeling great today!",
    "Work has been really stressful lately",
    "I just had an amazing weekend",
    "I'm worried about tomorrow's meeting",
    "Feeling peaceful and relaxed",
    "So excited about my vacation!"
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell me how you're feeling right now... I'll analyze your mood and adapt the experience accordingly."
            className="w-full h-32 p-4 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            disabled={isAnalyzing}
          />
          
          {text && (
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                disabled={isAnalyzing || !text.trim()}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                style={{ color: theme.primary }}
              >
                {isAnalyzing ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="text-center py-4">
            <p className="text-sm opacity-80">
              Analyzing your emotions using AI sentiment detection...
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="space-y-3">
        <h4 className="text-sm font-medium opacity-80">Try these prompts:</h4>
        <div className="grid gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setText(prompt)}
              className="text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              disabled={isAnalyzing}
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextMoodInput;
