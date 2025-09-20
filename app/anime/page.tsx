// app/anime/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AnimeGrid from '@/components/anime/anime-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

export default function AnimePage() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch genres (would typically come from API)
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Demons', 'Drama', 'Ecchi',
    'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Josei',
    'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery',
    'Psychological', 'Parody', 'Police', 'Romance', 'Samurai', 'School',
    'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Slice of Life',
    'Sports', 'Space', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
  ]

  const types = [
    { value: 'ongoing', label: 'Sedang Tayang' },
    { value: 'complete', label: 'Selesai' }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', { search, genre, type })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Daftar Anime</h1>
        
        <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Semua Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Genre</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Tipe</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button type="submit" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Terapkan Filter
          </Button>
        </form>
      </div>

      <AnimeGrid />
    </div>
  )
}