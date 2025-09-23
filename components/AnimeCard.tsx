// components/AnimeCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle } from 'lucide-react';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
  showGenre?: boolean;
}

export default function AnimeCard({ anime, showGenre = false }: AnimeCardProps) {
  const rating = anime.rate?.[1] ? parseFloat(anime.rate[1]) : null;

  return (
    <Link href={`/anime/${anime.slug}`}>
      <div className="group cursor-pointer card-hover">
        <div className="relative overflow-hidden rounded-lg bg-dark-800 aspect-[3/4]">
          {anime.gambar ? (
            <Image
              src={anime.gambar}
              alt={anime.judul}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-dark-700 flex items-center justify-center">
              <PlayCircle size={48} className="text-primary-500" />
            </div>
          )}
          
          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-primary-500/90 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Star size={14} fill="currentColor" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold line-clamp-2 text-sm">
                {anime.judul}
              </h3>
              {anime.eps && (
                <p className="text-gray-300 text-xs mt-1">
                  {anime.eps[0]} Episode
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Title for non-hover state */}
        <div className="mt-3">
          <h3 className="text-white font-medium line-clamp-2 text-sm group-hover:text-primary-400 transition-colors">
            {anime.judul}
          </h3>
          {showGenre && anime.eps && (
            <p className="text-gray-400 text-xs mt-1">
              {anime.eps[0]} Episode
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}