// components/anime/anime-grid.tsx
'use client'

import { useState, useEffect } from 'react'
import AnimeCard from './anime-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Anime {
  gambar: string
  judul: string
  slug: string
  eps: string[]
  rate: string[]
}

export default function AnimeGrid() {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/anime?page=${page}`)
        const data = await response.json()
        setAnimeList(data)
      } catch (error) {
        console.error('Error fetching anime:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [page])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeList.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(prev => prev + 1)}
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}