import React, { useState, useEffect } from 'react';
import { Music, Trash2, Play, Download, Search, Database } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Content } from '../../services/contentService';
import { musicUploadService } from '../../services/musicUploadService';
import { seedMusicData } from '../../utils/seedMusicData';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

interface MusicLibraryProps {
  onPlayMusic?: (content: Content) => void;
  refreshTrigger?: number;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ onPlayMusic, refreshTrigger }) => {
  const [musicFiles, setMusicFiles] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const loadMusicFiles = async () => {
    setLoading(true);
    const files = await musicUploadService.getUserMusicFiles();
    setMusicFiles(files);
    setLoading(false);
  };

  useEffect(() => {
    loadMusicFiles();
  }, [refreshTrigger]);

  const handleSeedData = async () => {
    setSeeding(true);
    const success = await seedMusicData();
    if (success) {
      toast.success('Music library updated successfully!');
      await loadMusicFiles();
    } else {
      toast.error('Failed to update music library');
    }
    setSeeding(false);
  };

  const handleDelete = async (content: Content) => {
    if (!confirm(`Are you sure you want to delete "${content.title}"?`)) return;
    
    setDeletingId(content.id);
    const success = await musicUploadService.deleteMusicFile(content);
    if (success) {
      setMusicFiles(files => files.filter(f => f.id !== content.id));
    }
    setDeletingId(null);
  };

  const handleDownload = (content: Content) => {
    const link = document.createElement('a');
    link.href = content.url;
    link.download = content.metadata?.filename || content.title;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = musicFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.emotions?.some(emotion => emotion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Music className="w-6 h-6 mr-2" />
          My Music Library ({musicFiles.length})
        </h2>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleSeedData}
            disabled={seeding}
            className="flex items-center"
            variant="outline"
          >
            <Database className="w-4 h-4 mr-2" />
            {seeding ? 'Updating...' : 'Load Sample Music'}
          </Button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search music..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {searchTerm ? 'No music found' : 'No music uploaded yet'}
          </h3>
          <p className="text-gray-400">
            {searchTerm ? 'Try a different search term' : 'Upload your first music file to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-purple-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{file.title}</h3>
                    {file.description && (
                      <p className="text-sm text-gray-600 truncate">{file.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Duration: {file.duration}</span>
                      {file.metadata?.fileSize && (
                        <span>Size: {formatFileSize(file.metadata.fileSize)}</span>
                      )}
                      <span>Uploaded: {new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                    {file.emotions && file.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.emotions.map((emotion) => (
                          <span
                            key={emotion}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPlayMusic?.(file)}
                    className="flex items-center"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file)}
                    disabled={deletingId === file.id}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;
