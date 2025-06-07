
import { supabase } from '../integrations/supabase/client';

export const seedMusicData = async () => {
  try {
    // First, delete all existing music content
    const { error: deleteError } = await supabase
      .from('content')
      .delete()
      .eq('type', 'music');

    if (deleteError) {
      console.error('Error deleting existing music:', deleteError);
      return false;
    }

    // Define the new music data
    const musicData = [
      {
        type: 'music',
        title: 'Maula Mere Maula',
        description: 'Beautiful rendition by Anoop Rathod',
        url: 'https://pszlzaddcjenamoxxcjt.supabase.co/storage/v1/object/public/music//Maula%20Mere%20Maula%20by%20Anoop%20Rathod.mp3',
        duration: '0:00', // Will be updated when played
        emotions: ['peaceful', 'spiritual', 'calming'],
        metadata: {
          artist: 'Anoop Rathod',
          genre: 'Indian Classical',
          language: 'Hindi'
        }
      },
      {
        type: 'music',
        title: 'I Wanna Be Yours',
        description: 'Indie rock classic by Arctic Monkeys',
        url: 'https://pszlzaddcjenamoxxcjt.supabase.co/storage/v1/object/public/music//Wanna%20Be%20Yours%20by%20Arctic%20Monkeys.mp3',
        duration: '0:00', // Will be updated when played
        emotions: ['romantic', 'dreamy', 'indie'],
        metadata: {
          artist: 'Arctic Monkeys',
          genre: 'Indie Rock',
          album: 'AM'
        }
      },
      {
        type: 'music',
        title: 'West Coast',
        description: 'Atmospheric track by Lana Del Rey',
        url: 'https://pszlzaddcjenamoxxcjt.supabase.co/storage/v1/object/public/music//West%20Coast%20by%20Lana%20Del%20Rey.mp3',
        duration: '0:00', // Will be updated when played
        emotions: ['dreamy', 'melancholic', 'atmospheric'],
        metadata: {
          artist: 'Lana Del Rey',
          genre: 'Alternative Pop',
          album: 'Ultraviolence'
        }
      }
    ];

    // Insert the new music data
    const { data, error: insertError } = await supabase
      .from('content')
      .insert(musicData)
      .select();

    if (insertError) {
      console.error('Error inserting music data:', insertError);
      return false;
    }

    console.log('Successfully seeded music data:', data);
    return true;
  } catch (error) {
    console.error('Error in seedMusicData:', error);
    return false;
  }
};
