// app/anime/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Star, Play, Download } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { api } from '@/lib/api';

interface AnimeDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: AnimeDetailPageProps) {
  try {
    const animeDetail = await api.getAnimeDetail(params.slug);
    
    return {
      title: `${animeDetail.judul} - KeyAnimeListApps`,
      description: `Nonton ${animeDetail.judul} subtitle Indonesia. ${animeDetail.genre}`,
      openGraph: {
        title: animeDetail.judul,
        description: `Nonton ${animeDetail.judul} subtitle Indonesia`,
        images: [animeDetail.gambar],
      },
    };
  } catch (error) {
    return {
      title: 'Anime Detail - KeyAnimeListApps',
      description: 'Detail anime subtitle Indonesia',
    };
  }
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  let animeDetail;
  
  try {
    animeDetail = await api.getAnimeDetail(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner />
        </div>

        {/* Anime Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={animeDetail.gambar}
                alt={animeDetail.judul}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-white mb-4">{animeDetail.judul}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-white">{animeDetail.skor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary-400" size={20} />
                <span className="text-white">{animeDetail.rilis}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-primary-400" size={20} />
                <span className="text-white">{animeDetail.durasi}</span>
              </div>
              <div className="text-white">{animeDetail.status}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <button className="btn-primary flex items-center space-x-2">
                <Play size={20} />
                <span>Watch Now</span>
              </button>
              <button className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download size={20} />
                <span>Download</span>
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <strong className="text-primary-400">Japanese:</strong>
                <span className="text-white ml-2">{animeDetail.namaJapan}</span>
              </div>
              <div>
                <strong className="text-primary-400">Studio:</strong>
                <span className="text-white ml-2">{animeDetail.studio}</span>
              </div>
              <div>
                <strong className="text-primary-400">Genre:</strong>
                <span className="text-white ml-2">{animeDetail.genre}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="bg-dark-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Episode List</h2>
          <div className="grid gap-2">
            {animeDetail.episodes.slice(0, 10).map((episode, index) => (
              <Link
                key={episode.slug}
                href={`/watch/${episode.slug}`}
                className="flex items-center justify-between p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              >
                <div>
                  <span className="text-white font-medium">{episode.judul}</span>
                  <span className="text-gray-400 text-sm ml-2">{episode.tanggal}</span>
                </div>
                <Play size={20} className="text-primary-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}