// lib/api.ts
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class OtakudesuApiService {
  private baseUrl = 'https://api.ryzumi.vip';
  private retryDelays = [500, 1000, 2000, 4000];
  
  async fetchWithRetry<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    for (let attempt = 0; attempt < this.retryDelays.length; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Accept': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, this.retryDelays[attempt]));
          continue;
        }

        if (!response.ok) {
          return {
            error: `HTTP error! status: ${response.status}`,
            status: response.status
          };
        }

        const data = await response.json();
        return { data, status: response.status };
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === this.retryDelays.length - 1) {
          return {
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
          };
        }
        await new Promise(resolve => setTimeout(resolve, this.retryDelays[attempt]));
      }
    }
    
    return {
      error: 'All retry attempts failed',
      status: 500
    };
  }

  // 1. Search anime
  async searchAnime(query: string, page: number = 1): Promise<ApiResponse<any[]>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchWithRetry(`/api/otakudesu/anime?search=${encodedQuery}&page=${page}`);
  }

  // 2. Get anime info
  async getAnimeInfo(slug: string): Promise<ApiResponse<any>> {
    const encodedSlug = encodeURIComponent(slug);
    return this.fetchWithRetry(`/api/otakudesu/anime-info?slug=${encodedSlug}`);
  }

  // 3. Get episode data
  async getEpisode(slug: string): Promise<ApiResponse<any>> {
    const encodedSlug = encodeURIComponent(slug);
    return this.fetchWithRetry(`/api/otakudesu/anime/episode?slug=${encodedSlug}`);
  }

  // 4. Get nonce
  async getNonce(): Promise<ApiResponse<{ data: string }>> {
    return this.fetchWithRetry('/api/otakudesu/nonce');
  }

  // 5. Get iframe from mirror content
  async getIframeFromContent(content: string): Promise<ApiResponse<{ iframe: string }>> {
    // First get nonce
    const nonceResponse = await this.getNonce();
    if (nonceResponse.error || !nonceResponse.data) {
      return {
        error: nonceResponse.error || 'Failed to get nonce',
        status: nonceResponse.status
      };
    }

    // Then get iframe
    const encodedContent = encodeURIComponent(content);
    const encodedNonce = encodeURIComponent(nonceResponse.data.data);
    return this.fetchWithRetry(
      `/api/otakudesu/get-iframe?content=${encodedContent}&nonce=${encodedNonce}`
    );
  }

  // Helper to decode mirror content
  decodeMirrorContent(content: string): { id: number; i: number; q: string } | null {
    try {
      // Content is base64 encoded JSON
      const decoded = atob(content);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode mirror content:', error);
      return null;
    }
  }

  // Get quality priority
  getQualityPriority(q: string): number {
    const priorityMap: Record<string, number> = {
      '1080p': 1,
      '720p': 2,
      '480p': 3,
      '360p': 4
    };
    return priorityMap[q] || 5; // Default to lowest priority
  }
}

export const apiService = new OtakudesuApiService();