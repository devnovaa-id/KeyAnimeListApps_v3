// app/anime/[slug]/[episode]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'
import Player from '@/components/anime/player'
import { apiService } from '@/lib/api'

export default function WatchEpisodePage() {
  const params = useParams()
  const slug = params.slug as string
  const episode = params.episode as string
  const [episodeData, setEpisodeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [currentEpisode, setCurrentEpisode] = useState(1)

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await apiService.getEpisode(slug)
        
        if (response.error || !response.data) {
          throw new Error(response.error || 'Failed to fetch episode data')
        }
        
        setEpisodeData(response.data)
      } catch (error) {
        console.error('Error fetching episode data:', error)
        setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat episode')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchEpisodeData()
    }
  }, [slug])

  // Extract episode number from episode slug
  useEffect(() => {
    if (episode) {
      const epNum = episode.match(/episode-(\d+)/i)
      if (epNum) {
        setCurrentEpisode(parseInt(epNum[1]))
      }
    }
  }, [episode])

  const nextEpisode = currentEpisode + 1
  const prevEpisode = currentEpisode - 1

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-64 md:h-96" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    )
  }

  if (error || !episodeData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Episode tidak ditemukan</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild>
          <Link href={`/anime/${slug}`}>Kembali ke Detail Anime</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link href={`/anime/${slug}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali
          </Link>
        </Button>

        <h1 className="text-xl font-bold text-center">{episodeData.judul}</h1>

        <div className="flex space-x-2">
          {prevEpisode > 0 && (
            <Button asChild size="sm">
              <Link href={`/anime/${slug}/episode-${prevEpisode}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                EP {prevEpisode}
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/anime/${slug}/episode-${nextEpisode}`}>
              EP {nextEpisode}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <Player episodeData={episodeData} />

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Download Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodeData.download && Object.entries(episodeData.download).map(([quality, links]) => (
            <div key={quality} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{quality.toUpperCase()}</h3>
              <div className="space-y-2">
                {(links as any[]).map((link, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      {link.nama}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}