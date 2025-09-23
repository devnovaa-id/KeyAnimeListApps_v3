// app/genre/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import AnimeGrid from '@/components/AnimeGrid';
import AdBanner from '@/components/AdBanner';
import { api } from '@/lib/api';

interface GenrePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: GenrePageProps) {
  const genreAnime = await api.getAnimeByGenre(params.slug);
  
  return {
    title: `Anime ${params.slug} - KeyAnimeListApps`,
    description: `Koleksi anime genre ${params.slug} terlengkap dengan subtitle Indonesia`,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  let genreAnime;
  
  try {
    genreAnime = await api.getAnimeByGenre(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 capitalize">
            Anime Genre {params.slug}
          </h1>
          <p className="text-gray-300">
            Menampilkan {genreAnime.length} anime
          </p>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner />
        </div>

        {/* Anime Grid */}
        <Suspense fallback={<div className="text-center py-8">Loading anime...</div>}>
          <AnimeGrid anime={genreAnime} columns={6} />
        </Suspense>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}