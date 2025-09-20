// app/watch/[slug]/[episode]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import Link from 'next/link'
import WatchPlayer from '@/components/watch/watch-player'
import WatchChat from '@/components/watch/watch-chat'
import WatchUsers from '@/components/watch/watch-users'

export default function WatchPartyPage() {
  const params = useParams()
  const slug = params.slug as string
  const episode = params.episode as string
  const [episodeData, setEpisodeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const roomId = `${slug}-${episode}`

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/anime/episode?slug=${slug}&episode=${episode}`)
        const data = await response.json()
        setEpisodeData(data)
      } catch (error) {
        console.error('Error fetching episode data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug && episode) {
      fetchEpisodeData()
    }
  }, [slug, episode])

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
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="aspect-video bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!episodeData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Episode tidak ditemukan</h1>
        <Button asChild className="mt-4">
          <Link href={`/anime/${slug}`}>Kembali ke Detail Anime</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="outline">
          <Link href={`/anime/${slug}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Kembali
          </Link>
        </Button>

        <h1 className="text-xl font-bold text-center">
          {episodeData.judul} - Watch Party
        </h1>

        <div className="flex space-x-2">
          {prevEpisode > 0 && (
            <Button asChild size="sm">
              <Link href={`/watch/${slug}/episode-${prevEpisode}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                EP {prevEpisode}
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/watch/${slug}/episode-${nextEpisode}`}>
              EP {nextEpisode}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <WatchPlayer
            src={episodeData.iframe}
            title={episodeData.judul}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <WatchUsers roomId={roomId} />
          <WatchChat roomId={roomId} />
        </div>
      </div>
    </div>
  )
}