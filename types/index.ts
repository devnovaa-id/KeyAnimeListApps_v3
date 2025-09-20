// types/index.ts
export interface Anime {
  gambar: string
  judul: string
  slug: string
  eps: string[]
  rate: string[]
}

export interface AnimeDetail {
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
  episodes: AnimeEpisode[]
  batch: {
    judul: string
    slug: string
    tanggal: string
  }
  lengkap: {
    judul: string
    slug: string
    tanggal: string
  }
}

export interface AnimeEpisode {
  judul: string
  slug: string
  tanggal: string
}

export interface Profile {
  id: string
  username: string
  avatar: string | null
  bio: string | null
  role: string
  banned: boolean
  created_at: string
  updated_at: string
}