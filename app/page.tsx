// app/page.tsx
import { Suspense } from 'react';
import GenreFilter from '@/components/GenreFilter';
import AnimeGrid from '@/components/AnimeGrid';
import AdBanner from '@/components/AdBanner';
import { api } from '@/lib/api';

async function getCompleteAnime() {
  try {
    return await api.getAnimeByGenre('complete');
  } catch (error) {
    console.error('Error fetching complete anime:', error);
    return [];
  }
}

export default async function HomePage() {
  const completeAnime = await getCompleteAnime();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Nonton Anime <span className="text-gradient">Terlengkap</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streaming anime subtitle Indonesia dengan kualitas tinggi. 
            Update terbaru setiap hari dengan berbagai genre pilihan.
          </p>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="container mx-auto px-4 mb-8">
        <AdBanner />
      </section>

      {/* Genre Filter */}
      <section className="container mx-auto px-4 mb-8">
        <GenreFilter />
      </section>

      {/* Complete Anime Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Anime Lengkap</h2>
          <a href="/genre/complete" className="text-primary-400 hover:text-primary-300">
            Lihat Semua
          </a>
        </div>
        
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">Loading...</div>}>
          <AnimeGrid anime={completeAnime.slice(0, 12)} />
        </Suspense>
      </section>

      {/* Second Ad Banner */}
      <section className="container mx-auto px-4 mb-8">
        <AdBanner />
      </section>
    </div>
  );
}