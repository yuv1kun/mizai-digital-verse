
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MusicUploadForm from '../components/MusicUpload/MusicUploadForm';
import MusicLibrary from '../components/MusicUpload/MusicLibrary';
import MusicPlayer from '../components/MediaPlayers/MusicPlayer';
import { Content } from '../services/contentService';

const MusicManager: React.FC = () => {
  const [currentMusic, setCurrentMusic] = useState<Content | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = (success: boolean) => {
    if (success) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handlePlayMusic = (content: Content) => {
    setCurrentMusic(content);
  };

  const handleClosePlayer = () => {
    setCurrentMusic(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Music Manager</h1>
          <p className="text-gray-600">Upload and manage your music collection</p>
        </div>

        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="library">My Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Music</TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <MusicLibrary 
              onPlayMusic={handlePlayMusic}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>

          <TabsContent value="upload">
            <MusicUploadForm onUploadComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>
      </div>

      {currentMusic && (
        <MusicPlayer 
          content={currentMusic} 
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MusicManager;
