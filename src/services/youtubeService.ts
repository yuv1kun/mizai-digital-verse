
export interface YouTubeAudioInfo {
  audioUrl: string;
  title: string;
  duration: number;
  thumbnail: string;
}

export class YouTubeService {
  private static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  static isYouTubeUrl(url: string): boolean {
    return this.extractVideoId(url) !== null;
  }

  static async getAudioInfo(url: string): Promise<YouTubeAudioInfo> {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    try {
      // Using a free YouTube audio extraction service
      // Note: In production, you might want to use a more reliable service
      const response = await fetch(`https://api.cobalt.tools/api/json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          vCodec: 'h264',
          vQuality: '720',
          aFormat: 'mp3',
          isAudioOnly: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to extract audio from YouTube');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.url) {
        return {
          audioUrl: data.url,
          title: data.title || 'YouTube Audio',
          duration: 0, // Will be set when audio loads
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
      } else {
        throw new Error(data.text || 'Failed to extract audio');
      }
    } catch (error) {
      console.error('YouTube extraction error:', error);
      // Fallback: Return a direct YouTube URL (won't work for audio playback)
      throw new Error('Unable to extract audio from YouTube. Please use a direct audio file URL.');
    }
  }

  static getThumbnailUrl(url: string): string {
    const videoId = this.extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  }
}
