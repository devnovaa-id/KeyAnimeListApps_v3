const API_BASE_URL = 'https://api.ryzumi.vip'
const RPS_LIMIT = 3
let lastRequestTime = 0
const requestQueue: Array<() => Promise<any>> = []

async function processQueue(): Promise<void> {
  while (requestQueue.length > 0) {
    await requestQueue[0]()
    requestQueue.shift()
  }
}

async function rateLimitedFetch(url: string, options?: RequestInit): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = async (): Promise<void> => {
      try {
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        const delay = Math.max(0, 1000 / RPS_LIMIT - timeSinceLastRequest)
        
        await new Promise(res => setTimeout(res, delay))
        
        lastRequestTime = Date.now()
        const response = await fetch(`${API_BASE_URL}${url}`, {
          headers: {
            'Accept': 'application/json',
          },
          ...options
        })
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`)
        }
        
        const data = await response.json()
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    
    requestQueue.push(request)
    
    if (requestQueue.length === 1) {
      processQueue()
    }
  })
}

export interface Genre {
  judul: string
  slug: string
}

export interface Schedule {
  hari: string
  anime: Anime[]
}

export interface Anime {
  judul: string
  slug: string
  gambar: string
  eps: string[]
  rate: string[]
}

export interface AnimeInfo {
  gambar: string
  judul: string
  nama: string
  namaJapan: string
  skor: string
  produser: string
  tipe: string
  status: string
  totalEpisode: string
  durasi: string
  rilis: string
  studio: string
  genre: string
  episodes: EpisodeInfo[]
  batch: BatchInfo
  lengkap: CompleteInfo
}

export interface EpisodeInfo {
  judul: string
  slug: string
  tanggal: string
}

export interface BatchInfo {
  judul: string
  slug: string
  tanggal: string
}

export interface CompleteInfo {
  judul: string
  slug: string
  tanggal: string
}

export const animeAPI = {
  getGenres: async (): Promise<Genre[]> => {
    return rateLimitedFetch('/api/otakudesu/genre')
  },
  
  getSchedule: async (): Promise<Schedule[]> => {
    return rateLimitedFetch('/api/otakudesu/jadwal')
  },
  
  getAnime: async (params: { type?: string; genre?: string; search?: string; page?: number }): Promise<Anime[]> => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString())
    })
    return rateLimitedFetch(`/api/otakudesu/anime?${queryParams}`)
  },
  
  getAnimeInfo: async (slug: string): Promise<AnimeInfo> => {
    return rateLimitedFetch(`/api/otakudesu/anime-info?slug=${slug}`)
  },
  
  getEpisode: async (slug: string): Promise<any> => {
    return rateLimitedFetch(`/api/otakudesu/anime/episode?slug=${slug}`)
  }
}