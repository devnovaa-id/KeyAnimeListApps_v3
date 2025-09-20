// app/anime/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Play, Calendar, Clock, Star, Users, Film } from 'lucide-react'
import EpisodeList from '@/components/anime/episode-list'

interface AnimeDetail {
  gambar: string
  judul: string
  nama: string
  namaJapan: string
  skor: string
  produser: string
  tipe: string
  status: string
  totalEpisode: string
  durasi: string
  rilis: string
  studio: string
  genre: string
  episodes: AnimeEpisode[]
  batch: {
    judul: string
    slug: string
    tanggal: string
  }
  lengkap: {
    judul: string
    slug: string
    tanggal: string
  }
}

interface AnimeEpisode {
  judul: string
  slug: string
  tanggal: string
}

export default function AnimeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [anime, setAnime] = useState<AnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/anime-info?slug=${slug}`)
        const data = await response.json()
        setAnime(data)
      } catch (error) {
        console.error('Error fetching anime detail:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchAnimeDetail()
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

  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Anime tidak ditemukan</h1>
        <Button asChild className="mt-4">
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
              src={anime.gambar || '/placeholder-anime.jpg'}
              alt={anime.judul}
              width={300}
              height={400}
              className="w-full rounded-lg object-cover"
            />
            
            <Button asChild className="w-full mt-4">
              <Link href={`/anime/${slug}/1`}>
                <Play className="h-4 w-4 mr-2" />
                Tonton Episode 1
              </Link>
            </Button>
          </div>
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{anime.judul}</h1>
          <p className="text-muted-foreground mb-4">{anime.namaJapan}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{anime.skor}</span>
            </div>
            <div className="flex items-center">
              <Film className="h-5 w-5 mr-1" />
              <span>{anime.tipe}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{anime.durasi}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>{anime.rilis}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Informasi</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Status:</span> {anime.status}</p>
                <p><span className="font-medium">Total Episode:</span> {anime.totalEpisode}</p>
                <p><span className="font-medium">Produser:</span> {anime.produser}</p>
                <p><span className="font-medium">Studio:</span> {anime.studio}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genre.split(', ').map((genre, index) => (
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
            <EpisodeList episodes={anime.episodes} slug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
}