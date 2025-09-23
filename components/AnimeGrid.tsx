// components/AnimeGrid.tsx
import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
  anime: Anime[];
  columns?: number;
}

export default function AnimeGrid({ anime, columns = 6 }: AnimeGridProps) {
  const gridClasses = {
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    8: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
  };

  return (
    <div className={`grid ${gridClasses[columns as keyof typeof gridClasses]} gap-4`}>
      {anime.map((item) => (
        <AnimeCard key={item.slug} anime={item} />
      ))}
    </div>
  );
}