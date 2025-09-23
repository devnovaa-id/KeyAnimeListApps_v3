// lib/api.ts
import { rateLimiter } from './rateLimiter';

const API_BASE_URL = 'https://api.ryzumi.vip';

async function fetchWithRateLimit<T>(endpoint: string): Promise<T> {
  await rateLimiter.waitIfNeeded();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
    },
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getGenres: () => fetchWithRateLimit<Genre[]>('/api/otakudesu/genre'),
  getSchedule: () => fetchWithRateLimit<AnimeSchedule[]>('/api/otakudesu/jadwal'),
  getAnimeByGenre: (genre: string) => 
    fetchWithRateLimit<Anime[]>(`/api/otakudesu/anime?genre=${genre}`),
  getAnimeDetail: (slug: string) => 
    fetchWithRateLimit<AnimeDetail>(`/api/otakudesu/anime-info?slug=${slug}`),
  searchAnime: (query: string) => 
    fetchWithRateLimit<Anime[]>(`/api/otakudesu/anime?search=${query}`),
};