// components/admin/manage-ads.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Ad {
  id: string
  title: string
  image: string
  url: string
  created_at: string
}

export default function ManageAds() {
  const [ads, setAds] = useState<Ad[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    url: ''
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching ads:', error)
        return
      }

      setAds(data || [])
    }

    fetchAds()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingAd) {
      const { error } = await supabase
        .from('ads')
        .update(formData)
        .eq('id', editingAd.id)

      if (error) {
        console.error('Error updating ad:', error)
        return
      }

      setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, ...formData } : ad))
    } else {
      const { error } = await supabase
        .from('ads')
        .insert([formData])

      if (error) {
        console.error('Error creating ad:', error)
        return
      }

      setAds([{ id: Date.now().toString(), ...formData, created_at: new Date().toISOString() }, ...ads])
    }

    setFormData({ title: '', image: '', url: '' })
    setEditingAd(null)
    setShowForm(false)
  }

  const deleteAd = async (id: string) => {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting ad:', error)
      return
    }

    setAds(ads.filter(ad => ad.id !== id))
  }

  const startEdit = (ad: Ad) => {
    setFormData({
      title: ad.title,
      image: ad.image,
      url: ad.url
    })
    setEditingAd(ad)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Manage Ads</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ad
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-4">
            {editingAd ? 'Edit Ad' : 'Create New Ad'}
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Target URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit">
                {editingAd ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingAd(null)
                  setFormData({ title: '', image: '', url: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="border rounded-lg overflow-hidden">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold">{ad.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{ad.url}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(ad.created_at).toLocaleDateString()}
              </p>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(ad)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAd(ad.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}