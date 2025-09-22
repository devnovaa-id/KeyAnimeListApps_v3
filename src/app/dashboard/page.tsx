'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { uploadFile } from '@/lib/utils/storage'
import { User, Camera, Save, LogOut } from 'lucide-react'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
  role: string
  banned: boolean
  created_at: string
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    avatar: null as File | null
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async (): Promise<void> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setProfile(data)
      setFormData({ username: data.username, avatar: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      let avatarUrl = profile?.avatar_url || null
      
      if (formData.avatar) {
        const uploadResult = await uploadFile(formData.avatar, 'profiles', `avatar-${user?.id}`)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload avatar')
        }
        avatarUrl = uploadResult.url
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          username: formData.username,
          avatar_url: avatarUrl
        })
        .eq('id', user?.id)

      if (updateError) {
        throw updateError
      }

      setSuccess('Profile updated successfully!')
      setEditMode(false)
      fetchProfile() // Refresh profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-premium-primary p-2 rounded-full cursor-pointer">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData({ ...formData, avatar: e.target.files[0] })
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white mb-1">
                  {profile?.username || 'User'}
                </h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {profile?.role}
                </span>
                
                {profile?.banned && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                    Banned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn-primary text-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setFormData({ username: profile?.username || '', avatar: null })
                      }}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="btn-primary text-sm flex items-center space-x-1"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={user.email}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={new Date(profile?.created_at || '').toLocaleDateString()}
                    disabled
                  />
                </div>
              </form>
            </div>

            {/* Recent Activity Section */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="text-center text-gray-400 py-8">
                <User className="h-12 w-12 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}