// app/anime/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Play, Calendar, Clock, Star, Users, Film } from 'lucide-react'
import { apiService } from '@/lib/api'

export default function AnimeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [animeInfo, setAnimeInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await apiService.getAnimeInfo(slug)
        
        if (response.error || !response.data) {
          throw new Error(response.error || 'Failed to fetch anime info')
        }
        
        setAnimeInfo(response.data)
      } catch (error) {
        console.error('Error fetching anime info:', error)
        setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat info anime')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchAnimeInfo()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          <div className="md:w-2/3 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !animeInfo) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Anime tidak ditemukan</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild>
          <Link href="/anime">Kembali ke Daftar Anime</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="sticky top-24">
            <Image
              src={animeInfo.gambar || '/placeholder-anime.jpg'}
              alt={animeInfo.judul}
              width={300}
              height={400}
              className="w-full rounded-lg object-cover"
            />
            
            {animeInfo.episodes && animeInfo.episodes.length > 0 && (
              <Button asChild className="w-full mt-4">
                <Link href={`/anime/${slug}/${animeInfo.episodes[0].slug}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Tonton Episode 1
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{animeInfo.judul}</h1>
          <p className="text-muted-foreground mb-4">{animeInfo.namaJapan}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{animeInfo.skor}</span>
            </div>
            <div className="flex items-center">
              <Film className="h-5 w-5 mr-1" />
              <span>{animeInfo.tipe}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{animeInfo.durasi}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>{animeInfo.rilis}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Informasi</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Status:</span> {animeInfo.status}</p>
                <p><span className="font-medium">Total Episode:</span> {animeInfo.totalEpisode}</p>
                <p><span className="font-medium">Produser:</span> {animeInfo.produser}</p>
                <p><span className="font-medium">Studio:</span> {animeInfo.studio}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {animeInfo.genre.split(', ').map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4">Daftar Episode</h3>
            <div className="grid gap-2">
              {animeInfo.episodes && animeInfo.episodes.map((episode: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{episode.judul}</h4>
                    <p className="text-sm text-muted-foreground">{episode.tanggal}</p>
                  </div>
                  
                  <Button asChild size="sm">
                    <Link href={`/anime/${slug}/${episode.slug}`}>
                      <Play className="h-4 w-4 mr-1" />
                      Tonton
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}