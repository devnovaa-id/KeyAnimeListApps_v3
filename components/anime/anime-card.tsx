// components/anime/anime-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Anime {
  gambar: string
  judul: string
  slug: string
  eps: string[]
  rate: string[]
}

interface AnimeCardProps {
  anime: Anime
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.gambar || '/placeholder-anime.jpg'}
          alt={anime.judul}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button asChild size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link href={`/anime/${anime.slug}`}>
              <Play className="h-4 w-4 mr-1" />
              Tonton
            </Link>
          </Button>
        </div>
        
        {anime.rate && anime.rate.length > 0 && (
          <div className="absolute top-2 right-2 bg-background/80 rounded-full px-2 py-1 text-sm font-semibold flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {anime.rate[0]}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{anime.judul}</h3>
        {anime.eps && anime.eps.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {anime.eps[0]}
          </p>
        )}
      </div>
    </div>
  )
}