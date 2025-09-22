import { notFound } from 'next/navigation'
import { animeAPI } from '@/lib/api/anime'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Star, Users, Play } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  let animeInfo: any = null
  
  try {
    animeInfo = await animeAPI.getAnimeInfo(slug)
  } catch (error) {
    console.error('Failed to fetch anime info:', error)
  }

  return {
    title: animeInfo?.judul || 'Anime Not Found',
    description: animeInfo?.nama || 'Anime details page',
    openGraph: {
      title: animeInfo?.judul || 'Anime Not Found',
      description: animeInfo?.nama || 'Anime details page',
      images: [animeInfo?.gambar || '/og-image.jpg'],
    },
  }
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params
  let animeInfo: any = null
  
  try {
    animeInfo = await animeAPI.getAnimeInfo(slug)
  } catch (error) {
    console.error('Failed to fetch anime info:', error)
    notFound()
  }

  const extractValue = (text: string) => text.split(':')[1]?.trim() || 'N/A'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        <Image
          src={animeInfo.gambar}
          alt={animeInfo.judul}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{animeInfo.judul}</h1>
          <p className="text-gray-300 text-lg">{extractValue(animeInfo.nama)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Synopsis */}
          <div className="card p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Episodes */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>
            <div className="space-y-3">
              {animeInfo.episodes.slice(0, 10).map((episode: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-premium-primary rounded-full flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{episode.judul}</h3>
                      <p className="text-gray-400 text-sm">{episode.tanggal}</p>
                    </div>
                  </div>
                  <Link
                    href={`/watch/${episode.slug}`}
                    className="btn-primary text-sm"
                  >
                    Watch
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Info Card */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Anime Details</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Score: {extractValue(animeInfo.skor)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Studio: {extractValue(animeInfo.studio)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Aired: {extractValue(animeInfo.rilis)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">Duration: {extractValue(animeInfo.durasi)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Status: {extractValue(animeInfo.status)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Episodes: {extractValue(animeInfo.totalEpisode)}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="mt-4">
              <h3 className="text-white font-medium mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {animeInfo.genre.split(', ').map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-premium-primary/20 text-premium-primary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                Add to Watchlist
              </button>
              <button className="w-full btn-secondary">
                Share Anime
              </button>
              <Link
                href={`/watch/${animeInfo.episodes[0]?.slug}`}
                className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch First Episode
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}