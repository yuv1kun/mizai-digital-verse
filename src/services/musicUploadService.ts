
import { supabase } from '../integrations/supabase/client';
import { Content } from './contentService';

export interface MusicFileInfo {
  file: File;
  title: string;
  description: string;
  emotions: string[];
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

class MusicUploadService {
  async uploadMusicFile(
    musicInfo: MusicFileInfo,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Content | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to upload music');
      }

      onProgress?.({ progress: 10, status: 'uploading', message: 'Starting upload...' });

      // Generate unique filename
      const fileExt = musicInfo.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      onProgress?.({ progress: 30, status: 'uploading', message: 'Uploading file...' });

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('music')
        .upload(fileName, musicInfo.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      onProgress?.({ progress: 60, status: 'processing', message: 'Processing metadata...' });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('music')
        .getPublicUrl(uploadData.path);

      // Extract audio duration (this is an approximation)
      const duration = await this.getAudioDuration(musicInfo.file);

      onProgress?.({ progress: 80, status: 'processing', message: 'Saving to database...' });

      // Save content record to database
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .insert({
          type: 'music',
          title: musicInfo.title,
          description: musicInfo.description,
          url: urlData.publicUrl,
          duration: duration,
          emotions: musicInfo.emotions,
          metadata: {
            filename: musicInfo.file.name,
            fileSize: musicInfo.file.size,
            mimeType: musicInfo.file.type,
            storagePath: uploadData.path
          }
        })
        .select()
        .single();

      if (contentError) {
        // If database save fails, clean up the uploaded file
        await supabase.storage.from('music').remove([uploadData.path]);
        throw contentError;
      }

      onProgress?.({ progress: 100, status: 'complete', message: 'Upload complete!' });

      return contentData as Content;
    } catch (error) {
      onProgress?.({ progress: 0, status: 'error', message: error.message });
      console.error('Music upload error:', error);
      return null;
    }
  }

  private async getAudioDuration(file: File): Promise<string> {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        URL.revokeObjectURL(url);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve('0:00');
      });

      audio.src = url;
    });
  }

  async deleteMusicFile(content: Content): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Delete from storage
      const storagePath = content.metadata?.storagePath;
      if (storagePath) {
        await supabase.storage.from('music').remove([storagePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', content.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete music file error:', error);
      return false;
    }
  }

  async getUserMusicFiles(): Promise<Content[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'music')
        .like('metadata->>storagePath', `${user.id}/%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Content[];
    } catch (error) {
      console.error('Get user music files error:', error);
      return [];
    }
  }
}

export const musicUploadService = new MusicUploadService();
