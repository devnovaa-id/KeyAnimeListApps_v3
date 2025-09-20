// components/search-anime.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function SearchAnime() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        searchAnime(query)
      }, 500)

      return () => clearTimeout(delayDebounceFn)
    } else {
      setResults([])
    }
  }, [query])

  const searchAnime = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/anime?search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error searching anime:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (slug: string) => {
    setOpen(false)
    setQuery('')
    router.push(`/anime/${slug}`)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cari Anime</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Ketik judul anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading && (
              <div className="text-center py-4">
                <p>Mencari...</p>
              </div>
            )}
            
            {!loading && results.length === 0 && query.length > 2 && (
              <div className="text-center py-4">
                <p>Tidak ada hasil ditemukan</p>
              </div>
            )}
            
            {!loading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((anime) => (
                  <div
                    key={anime.slug}
                    className="flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleResultClick(anime.slug)}
                  >
                    <img
                      src={anime.gambar || '/placeholder-anime.jpg'}
                      alt={anime.judul}
                      className="w-10 h-14 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="font-medium text-sm">{anime.judul}</p>
                      <p className="text-xs text-muted-foreground">
                        {anime.eps && anime.eps.length > 0 ? anime.eps[0] : 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}