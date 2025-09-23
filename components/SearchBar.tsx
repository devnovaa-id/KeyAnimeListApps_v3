// components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { Anime } from '@/types/anime';
import { api } from '@/lib/api';
import Link from 'next/link';

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const searchAnime = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await api.searchAnime(query);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAnime, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-dark-900/95 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          {/* Search Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari anime..."
                className="w-full pl-12 pr-12 py-4 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader size={24} className="animate-spin text-primary-500" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((anime) => (
                  <Link
                    key={anime.slug}
                    href={`/anime/${anime.slug}`}
                    onClick={onClose}
                  >
                    <div className="flex items-center space-x-4 p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-16 bg-dark-700 rounded overflow-hidden flex-shrink-0">
                        {anime.gambar && (
                          <img
                            src={anime.gambar}
                            alt={anime.judul}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium line-clamp-1">{anime.judul}</h3>
                        {anime.eps && (
                          <p className="text-gray-400 text-sm">{anime.eps[0]} Episode</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 3 ? (
              <div className="text-center py-8 text-gray-400">
                Tidak ada hasil untuk "{query}"
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}