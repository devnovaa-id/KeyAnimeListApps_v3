// components/admin/manage-users.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Ban, Shield, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  id: string
  username: string
  email: string
  role: string
  banned: boolean
  created_at: string
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      setUsers(data || [])
    }

    fetchUsers()
  }, [supabase])

  const toggleBan = async (userId: string, currentlyBanned: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ banned: !currentlyBanned })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user:', error)
      return
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, banned: !currentlyBanned } : user
    ))
  }

  const changeRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      return
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="bg-background border rounded px-2 py-1"
                  >
                    <option value="pengunjung">Pengunjung</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.banned 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {user.banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Button
                    variant={user.banned ? "default" : "destructive"}
                    size="sm"
                    onClick={() => toggleBan(user.id, user.banned)}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    {user.banned ? 'Unban' : 'Ban'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}