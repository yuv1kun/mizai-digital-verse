
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

    // For now, we'll throw a more descriptive error since YouTube audio extraction
    // requires server-side processing or paid APIs
    throw new Error(
      'YouTube audio extraction is currently unavailable. This feature requires a backend service to process YouTube URLs safely. Please use direct audio file URLs (.mp3, .wav, etc.) instead.'
    );
  }

  static getThumbnailUrl(url: string): string {
    const videoId = this.extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  }

  static getVideoTitle(url: string): string {
    // Extract title from URL if possible, otherwise return generic title
    const videoId = this.extractVideoId(url);
    return videoId ? `YouTube Video (${videoId})` : 'YouTube Video';
  }
}
