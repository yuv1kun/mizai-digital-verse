
import React, { useState } from 'react';
import { useAdaptiveUI } from '../../contexts/AdaptiveUIContext';
import { useMood } from '../../contexts/MoodContext';
import { Shield, Eye, EyeOff, Trash2, Clock, Lock } from 'lucide-react';

const PrivacyDashboard: React.FC = () => {
  const { theme } = useAdaptiveUI();
  const { resetMood } = useMood();
  const [localProcessing, setLocalProcessing] = useState(true);
  const [dataRetention, setDataRetention] = useState(24); // hours

  const handleForgetData = (timeframe: string) => {
    console.log(`Forgetting data from: ${timeframe}`);
    if (timeframe === 'all') {
      resetMood();
    }
    // In a real app, this would delete specific temporal data
  };

  const handleToggleProcessing = () => {
    setLocalProcessing(!localProcessing);
    console.log(`Processing mode: ${!localProcessing ? 'Local' : 'Cloud'}`);
  };

  return (
    <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 mr-3" style={{ color: theme.primary }} />
        <h2 className="text-xl font-semibold">Privacy Controls</h2>
      </div>

      <div className="space-y-6">
        {/* Data Processing Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/10">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5" />
            <div>
              <h3 className="font-medium text-sm">Data Processing</h3>
              <p className="text-xs opacity-70">
                {localProcessing ? 'Local device only' : 'Cloud enhanced'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggleProcessing}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              localProcessing ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                localProcessing ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Data Retention */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium text-sm">Auto-Delete Data</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 24, 168].map((hours) => (
              <button
                key={hours}
                onClick={() => setDataRetention(hours)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  dataRetention === hours
                    ? 'bg-white/30 text-current'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {hours === 1 ? '1 hour' : hours === 24 ? '1 day' : '1 week'}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Data Controls */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Trash2 className="w-5 h-5" />
            <h3 className="font-medium text-sm">Forget Data</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => handleForgetData('15min')}
              className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Last 15 minutes
            </button>
            <button
              onClick={() => handleForgetData('1hour')}
              className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Last hour
            </button>
            <button
              onClick={() => handleForgetData('all')}
              className="w-full py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-colors text-sm"
            >
              Reset all mood data
            </button>
          </div>
        </div>

        {/* Privacy Status */}
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/20">
          <div className="flex items-center space-x-3">
            {localProcessing ? (
              <EyeOff className="w-5 h-5 text-green-400" />
            ) : (
              <Eye className="w-5 h-5 text-yellow-400" />
            )}
            <div>
              <h3 className="font-medium text-sm text-green-400">
                {localProcessing ? 'Privacy Protected' : 'Enhanced Experience'}
              </h3>
              <p className="text-xs opacity-70">
                {localProcessing 
                  ? 'All analysis happens on your device'
                  : 'Using cloud AI for better recommendations'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
