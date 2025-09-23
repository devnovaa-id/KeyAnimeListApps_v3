// components/AdBanner.tsx
'use client';

import { useState, useEffect } from 'react';

interface AdBannerProps {
  type?: 'horizontal' | 'vertical';
  className?: string;
}

export default function AdBanner({ type = 'horizontal', className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Simulate ad content rotation
  const ads = [
    {
      title: "Premium Streaming",
      description: "Tonton tanpa iklan dengan premium",
      cta: "Upgrade Sekarang"
    },
    {
      title: "Download App",
      description: "Download aplikasi mobile kami",
      cta: "Download"
    },
    {
      title: "Special Offer",
      description: "Dapatkan diskon 50% untuk bulan pertama",
      cta: "Lihat Offer"
    }
  ];

  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  if (!isVisible) return null;

  const ad = ads[currentAd];

  return (
    <div className={`bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 relative ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        ✕
      </button>
      
      <div className="text-center">
        <h3 className="font-bold text-white mb-1">{ad.title}</h3>
        <p className="text-white/90 text-sm mb-2">{ad.description}</p>
        <button className="bg-white text-primary-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          {ad.cta}
        </button>
      </div>
    </div>
  );
}