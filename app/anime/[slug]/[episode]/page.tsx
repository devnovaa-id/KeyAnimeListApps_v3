// app/anime/[slug]/[episode]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Play, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'
import { getIframeUrl } from '@/lib/utils'

interface EpisodeData {
  judul: string
  iframe: string
  mirror: {
    [key: string]: Array<{
      nama: string
      content: string
    }>
  }
  download: {
    [key: string]: Array<{
      nama: string
      href: string
    }>
  }
}

export default function WatchEpisodePage() {
  const params = useParams()
  const slug = params.slug as string
  const episode = params.episode as string
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentEpisode, setCurrentEpisode] = useState(1)

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/anime/episode?slug=${slug}&episode=${episode}`)
        const data = await response.json()
        setEpisodeData(data)

        // Get actual iframe URL
        if (data.iframe) {
          const actualIframeUrl = await getIframeUrl(data.iframe)
          setIframeUrl(actualIframeUrl)
        }
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

  // Extract episode number from episode slug (e.g., "episode-1" -> 1)
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

      <div className="aspect-video mb-8">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title={episodeData.judul}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Player tidak tersedia</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Download Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(episodeData.download).map(([quality, links]) => (
            <div key={quality} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{quality.toUpperCase()}</h3>
              <div className="space-y-2">
                {links.map((link, index) => (
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