// components/anime/episode-list.tsx (perbaikan)
'use client'

import { Button } from '@/components/ui/button'
import { Play, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface AnimeEpisode {
  judul: string
  slug: string
  tanggal: string
}

interface EpisodeListProps {
  episodes: AnimeEpisode[]
  slug: string
}

export default function EpisodeList({ episodes, slug }: EpisodeListProps) {
  const [error, setError] = useState<string>('')

  if (episodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Tidak ada episode yang tersedia</p>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {episodes.map((episode, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1">
            <h4 className="font-medium">{episode.judul}</h4>
            <p className="text-sm text-muted-foreground">{episode.tanggal}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button asChild size="sm">
              <Link href={`/anime/${slug}/${episode.slug}`}>
                <Play className="h-4 w-4 mr-1" />
                Tonton
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}