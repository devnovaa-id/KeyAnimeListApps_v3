'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { uploadFile, deleteFile } from '@/lib/utils/storage'
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from 'lucide-react'

interface Ad {
  id: string
  title: string
  image_url: string
  target_url: string
  active: boolean
  created_at: string
  created_by: string
}

export default function AdminAds() {
  const { user } = useAuth()
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    target_url: '',
    image: null as File | null
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      checkAdmin()
    }
  }, [user])

  const checkAdmin = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/dashboard')
    } else {
      fetchAds()
    }
  }

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = editingAd?.image_url || ''

      if (formData.image) {
        // Delete old image if editing
        if (editingAd?.image_url) {
          const oldImagePath = editingAd.image_url.split('/').pop()
          await deleteFile('ads', oldImagePath!)
        }

        const uploadResult = await uploadFile(formData.image, 'ads')
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        imageUrl = uploadResult.url!
      }

      if (editingAd) {
        // Update existing ad
        const { error } = await supabase
          .from('ads')
          .update({
            title: formData.title,
            target_url: formData.target_url,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAd.id)

        if (error) throw error
      } else {
        // Create new ad
        const { error } = await supabase
          .from('ads')
          .insert([{
            title: formData.title,
            target_url: formData.target_url,
            image_url: imageUrl,
            created_by: user?.id
          }])

        if (error) throw error
      }

      setShowForm(false)
      setEditingAd(null)
      setFormData({ title: '', target_url: '', image: null })
      fetchAds()
    } catch (error) {
      console.error('Error saving ad:', error)
    } finally {
      setUploading(false)
    }
  }

  const toggleAdStatus = async (adId: string, currentlyActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ active: !currentlyActive })
        .eq('id', adId)

      if (error) throw error
      fetchAds()
    } catch (error) {
      console.error('Error toggling ad status:', error)
    }
  }

  const deleteAd = async (adId: string, imageUrl: string) => {
    try {
      // Delete image from storage
      const imagePath = imageUrl.split('/').pop()
      await deleteFile('ads', imagePath!)

      // Delete ad from database
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId)

      if (error) throw error
      fetchAds()
    } catch (error) {
      console.error('Error deleting ad:', error)
    }
  }

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Ads Management</h1>
          <p className="text-gray-400">Create and manage advertisements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Ad</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingAd ? 'Edit Ad' : 'Create New Ad'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target URL
                </label>
                <input
                  type="url"
                  required
                  className="input-field"
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  }}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary flex-1"
                >
                  {uploading ? 'Uploading...' : (editingAd ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAd(null)
                    setFormData({ title: '', target_url: '', image: null })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ads..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="card p-6">
            <div className="relative mb-4">
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ad.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ad.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <h3 className="text-white font-semibold mb-2">{ad.title}</h3>
            <p className="text-gray-400 text-sm mb-4 truncate">{ad.target_url}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => toggleAdStatus(ad.id, ad.active)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                  ad.active
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white transition-colors`}
              >
                {ad.active ? <EyeOff className="h-4 w-4 mx-auto" /> : <Eye className="h-4 w-4 mx-auto" />}
              </button>
              
              <button
                onClick={() => {
                  setEditingAd(ad)
                  setFormData({
                    title: ad.title,
                    target_url: ad.target_url,
                    image: null
                  })
                  setShowForm(true)
                }}
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => deleteAd(ad.id, ad.image_url)}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No ads found</p>
        </div>
      )}
    </div>
  )
}