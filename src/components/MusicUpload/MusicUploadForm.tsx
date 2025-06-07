
import React, { useState, useRef } from 'react';
import { Upload, Music, X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { musicUploadService, MusicFileInfo, UploadProgress } from '../../services/musicUploadService';

interface MusicUploadFormProps {
  onUploadComplete?: (success: boolean) => void;
}

const MusicUploadForm: React.FC<MusicUploadFormProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [newEmotion, setNewEmotion] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonEmotions = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'melancholy', 'uplifting', 'dreamy'];

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const addEmotion = (emotion: string) => {
    if (emotion && !emotions.includes(emotion)) {
      setEmotions([...emotions, emotion]);
    }
    setNewEmotion('');
  };

  const removeEmotion = (emotionToRemove: string) => {
    setEmotions(emotions.filter(emotion => emotion !== emotionToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    const musicInfo: MusicFileInfo = {
      file: selectedFile,
      title,
      description,
      emotions
    };

    const result = await musicUploadService.uploadMusicFile(musicInfo, setUploadProgress);
    
    if (result) {
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setEmotions([]);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete?.(true);
    } else {
      onUploadComplete?.(false);
    }
  };

  const isUploading = uploadProgress?.status === 'uploading' || uploadProgress?.status === 'processing';

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Music className="w-6 h-6 mr-2" />
        Upload Music
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-purple-400 bg-purple-50'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-purple-300'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-center">
              <Music className="w-12 h-12 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-green-700">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Drag and drop your music file here</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Choose File
              </Button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {uploadProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{uploadProgress.message}</span>
              <span>{uploadProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  uploadProgress.status === 'error' ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
            required
            disabled={isUploading}
          />
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            disabled={isUploading}
          />
        </div>

        {/* Emotions Section */}
        <div>
          <Label>Emotions & Moods</Label>
          
          {/* Common Emotions */}
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {commonEmotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => addEmotion(emotion)}
                disabled={emotions.includes(emotion) || isUploading}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  emotions.includes(emotion)
                    ? 'bg-purple-100 border-purple-300 text-purple-700 cursor-not-allowed'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>

          {/* Custom Emotion Input */}
          <div className="flex gap-2">
            <Input
              value={newEmotion}
              onChange={(e) => setNewEmotion(e.target.value)}
              placeholder="Add custom emotion"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addEmotion(newEmotion)}
              disabled={!newEmotion || isUploading}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Emotions */}
          {emotions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {emotion}
                  <button
                    type="button"
                    onClick={() => removeEmotion(emotion)}
                    disabled={isUploading}
                    className="ml-2 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!selectedFile || !title || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Music'}
        </Button>
      </form>
    </div>
  );
};

export default MusicUploadForm;
