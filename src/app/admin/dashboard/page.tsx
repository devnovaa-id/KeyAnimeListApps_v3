'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Users, BarChart3, Eye, Package, AlertTriangle } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalAds: number
  activeUsers: number
  bannedUsers: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAds: 0,
    activeUsers: 0,
    bannedUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Check if user is admin
      const checkAdmin = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          router.push('/dashboard')
        } else {
          fetchStats()
        }
      }
      checkAdmin()
    }
  }, [user, router])

  const fetchStats = async () => {
    try {
      const [
        { count: totalUsers },
        { count: totalAds },
        { count: activeUsers },
        { count: bannedUsers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('ads').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('banned', false),
        supabase.from('profiles').select('*', { count: 'exact' }).eq('banned', true)
      ])

      setStats({
        totalUsers: totalUsers || 0,
        totalAds: totalAds || 0,
        activeUsers: activeUsers || 0,
        bannedUsers: bannedUsers || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">{stats.totalUsers}</h2>
              <p className="text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">{stats.activeUsers}</h2>
              <p className="text-gray-400">Active Users</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">{stats.bannedUsers}</h2>
              <p className="text-gray-400">Banned Users</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Package className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">{stats.totalAds}</h2>
              <p className="text-gray-400">Total Ads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
          <p className="text-gray-400 mb-4">Manage users, roles, and permissions</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="btn-primary flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </button>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Ads Management</h2>
          <p className="text-gray-400 mb-4">Create and manage advertisements</p>
          <button
            onClick={() => router.push('/admin/ads')}
            className="btn-primary flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Manage Ads</span>
          </button>
        </div>
      </div>
    </div>
  )
}