export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  role: 'pengunjung' | 'admin'
  banned: boolean
  created_at: string
  updated_at: string
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

export interface Ad {
  id: string
  title: string
  image_url: string
  target_url: string
  active: boolean
  created_at: string
  created_by: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
}