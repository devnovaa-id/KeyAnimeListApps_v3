// types/anime.ts
export interface Genre {
  judul: string;
  slug: string;
}

export interface Anime {
  judul: string;
  slug: string;
  gambar?: string;
  eps?: string[];
  rate?: string[];
}

export interface AnimeSchedule {
  hari: string;
  anime: Anime[];
}

export interface AnimeDetail {
  gambar: string;
  judul: string;
  nama: string;
  namaJapan: string;
  skor: string;
  produser: string;
  tipe: string;
  status: string;
  totalEpisode: string;
  durasi: string;
  rilis: string;
  studio: string;
  genre: string;
  episodes: Episode[];
}

export interface Episode {
  judul: string;
  slug: string;
  tanggal: string;
}