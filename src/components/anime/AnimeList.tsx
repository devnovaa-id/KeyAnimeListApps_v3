import AnimeCard from './AnimeCard'
import { Anime } from '@/lib/api/anime'

interface AnimeListProps {
  anime: Anime[]
  className?: string
}

export default function AnimeList({ anime, className = '' }: AnimeListProps) {
  if (anime.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No anime data available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {anime.map((anime) => (
        <AnimeCard key={anime.slug} anime={anime} />
      ))}
    </div>
  )
}