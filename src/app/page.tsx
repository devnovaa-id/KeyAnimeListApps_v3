import { animeAPI } from '@/lib/api/anime'
import AnimeList from '@/components/anime/AnimeList'

export default async function Home() {
  let animeData = []
  
  try {
    animeData = await animeAPI.getAnime({ type: 'complete' })
  } catch (error) {
    console.error('Failed to fetch anime data:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient animate-float">
          Welcome to KeyAnimeList
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the latest and greatest anime series. Find schedules, genres, and detailed information about your favorite shows.
        </p>
      </section>

      {/* Featured Anime */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Anime</h2>
          <div className="flex space-x-2">
            <button className="btn-secondary text-sm">View All</button>
          </div>
        </div>
        
        <AnimeList anime={animeData.slice(0, 10)} />
      </section>

      {/* Latest Updates */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Latest Updates</h2>
        <AnimeList anime={animeData.slice(10, 20)} />
      </section>
    </div>
  )
}