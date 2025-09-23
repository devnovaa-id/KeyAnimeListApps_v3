// components/GenreFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { Genre } from '@/types/anime';
import { api } from '@/lib/api';

export default function GenreFilter() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await api.getGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();
  }, []);

  if (loading) {
    return <div className="flex space-x-2 overflow-x-auto py-4">Loading...</div>;
  }

  return (
    <div className="flex space-x-2 overflow-x-auto py-4 scrollbar-hide">
      {genres.map((genre) => (
        <a
          key={genre.slug}
          href={`/genre/${genre.slug}`}
          className="flex-shrink-0 px-4 py-2 bg-dark-800 rounded-full hover:bg-primary-500 transition-colors text-sm"
        >
          {genre.judul}
        </a>
      ))}
    </div>
  );
}