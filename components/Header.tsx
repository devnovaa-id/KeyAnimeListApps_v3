// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-800/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gradient">KeyAnimeList</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-primary-400 transition-colors">Home</a>
            <a href="/schedule" className="hover:text-primary-400 transition-colors">Jadwal</a>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-primary-400 transition-colors"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:text-primary-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-dark-700 pt-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="hover:text-primary-400 transition-colors">Home</a>
              <a href="/schedule" className="hover:text-primary-400 transition-colors">Jadwal</a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <SearchBar onClose={() => setIsSearchOpen(false)} />
      )}
    </header>
  );
}