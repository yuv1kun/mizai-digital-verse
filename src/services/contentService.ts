
import { supabase } from '../integrations/supabase/client';

export interface Content {
  id: string;
  type: 'video' | 'music' | 'article';
  title: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  duration: string;
  metadata: any;
  emotions: string[];
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: string;
  content_id: string;
  interaction_type: 'play' | 'pause' | 'like' | 'complete' | 'bookmark';
  progress_seconds: number;
  created_at: string;
}

export const contentService = {
  // Fetch content by mood
  async getContentByMood(primaryEmotion: string, limit = 20): Promise<Content[]> {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .contains('emotions', [primaryEmotion])
      .limit(limit);

    if (error) {
      console.error('Error fetching content by mood:', error);
      return [];
    }

    return data || [];
  },

  // Fetch all content with optional type filter
  async getAllContent(type?: string): Promise<Content[]> {
    let query = supabase.from('content').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content:', error);
      return [];
    }

    return data || [];
  },

  // Record user interaction
  async recordInteraction(contentId: string, interactionType: UserInteraction['interaction_type'], progressSeconds = 0) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: user.id,
        content_id: contentId,
        interaction_type: interactionType,
        progress_seconds: progressSeconds
      });

    if (error) {
      console.error('Error recording interaction:', error);
    }

    return data;
  },

  // Save mood history
  async saveMoodHistory(moodData: any, primaryEmotion: string, arousalLevel: number) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('mood_history')
      .insert({
        user_id: user.id,
        mood_data: moodData,
        primary_emotion: primaryEmotion,
        arousal_level: arousalLevel
      });

    if (error) {
      console.error('Error saving mood history:', error);
    }

    return data;
  }
};
