import Link from 'next/link'
import Image from 'next/image'
import { Anime } from '@/lib/api/anime'

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export default function AnimeCard({ anime, className = '' }: AnimeCardProps) {
  return (
    <div className={`group relative bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-premium-primary/20 transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={anime.gambar}
          alt={anime.judul}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-premium-primary text-white text-xs font-bold px-2 py-1 rounded">
          {anime.rate[1] || 'N/A'}
        </div>
        
        {/* Episode Badge */}
        <div className="absolute top-2 left-2 bg-premium-dark text-white text-xs font-bold px-2 py-1 rounded">
          EP {anime.eps[0]}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm text-white line-clamp-2 mb-1 group-hover:text-premium-primary transition-colors">
          {anime.judul}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Anime</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-premium-primary rounded-full"></div>
            <div className="w-2 h-2 bg-premium-secondary rounded-full"></div>
            <div className="w-2 h-2 bg-premium-accent rounded-full"></div>
          </div>
        </div>
      </div>
      
      <Link 
        href={`/anime/${anime.slug}`}
        className="absolute inset-0"
        prefetch={false}
      >
        <span className="sr-only">View {anime.judul}</span>
      </Link>
    </div>
  )
}