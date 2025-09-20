// components/anime/player.tsx
'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

interface PlayerProps {
  episodeData: any
}

export default function Player({ episodeData }: PlayerProps) {
  const [iframeUrl, setIframeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selectedMirror, setSelectedMirror] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    loadBestQualityMirror()
  }, [episodeData])

  const loadBestQualityMirror = async () => {
    if (!episodeData?.mirror) return

    setLoading(true)
    setError('')

    try {
      // Collect all mirrors with their quality information
      const allMirrors: Array<{
        quality: string
        nama: string
        content: string
        priority: number
      }> = []

      // Process each quality group
      for (const [qualityGroup, mirrors] of Object.entries(episodeData.mirror)) {
        for (const mirror of mirrors as any[]) {
          const decoded = apiService.decodeMirrorContent(mirror.content)
          const quality = decoded?.q || qualityGroup
          const priority = apiService.getQualityPriority(quality)
          
          allMirrors.push({
            quality,
            nama: mirror.nama,
            content: mirror.content,
            priority
          })
        }
      }

      // Sort by quality priority (best quality first)
      allMirrors.sort((a, b) => a.priority - b.priority)

      // Try each mirror in order of quality
      for (const mirror of allMirrors) {
        try {
          const response = await apiService.getIframeFromContent(mirror.content)
          
          if (response.data?.iframe) {
            setIframeUrl(response.data.iframe)
            setSelectedMirror(mirror.nama)
            setError('')
            break
          }
        } catch (err) {
          console.error(`Failed to load mirror ${mirror.nama}:`, err)
          // Continue to next mirror
        }
      }

      if (!iframeUrl) {
        setError('Tidak dapat memuat player dari semua mirror yang tersedia')
      }
    } catch (error) {
      console.error('Error loading mirrors:', error)
      setError('Terjadi kesalahan saat memuat player')
    } finally {
      setLoading(false)
    }
  }

  const handleMirrorSelect = async (content: string, nama: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.getIframeFromContent(content)
      
      if (response.data?.iframe) {
        setIframeUrl(response.data.iframe)
        setSelectedMirror(nama)
      } else {
        setError(`Tidak dapat memuat player dari ${nama}`)
      }
    } catch (error) {
      console.error('Error loading mirror:', error)
      setError('Terjadi kesalahan saat memuat mirror')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Memuat player...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadBestQualityMirror}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full"
            allowFullScreen
            title="Anime Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Player tidak tersedia</p>
          </div>
        )}
      </div>

      {/* Mirror selection */}
      {episodeData.mirror && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Pilih Mirror: {selectedMirror}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(episodeData.mirror).map(([quality, mirrors]) => (
              <div key={quality}>
                <h4 className="text-sm font-medium mb-1">{quality.toUpperCase()}</h4>
                <div className="space-y-1">
                  {(mirrors as any[]).map((mirror, index) => (
                    <Button
                      key={index}
                      variant={selectedMirror === mirror.nama ? "default" : "outline"}
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleMirrorSelect(mirror.content, mirror.nama)}
                    >
                      {mirror.nama}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}