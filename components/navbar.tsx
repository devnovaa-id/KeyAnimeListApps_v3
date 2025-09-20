// components/navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Tv, 
  Users, 
  MessageCircle, 
  User, 
  Sun, 
  Moon, 
  Menu,
  X
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import SearchAnime from './search-anime'

export default function Navbar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Anime', href: '/anime', icon: Tv },
    { name: 'Teman', href: '/friends', icon: Users },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setMobileMenuOpen(false)
  }

  if (!mounted) return null

  return (
    <nav className="fixed top-0 w-full bg-background border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Tv className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">KeyAnimeList</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Link href={item.href} className="flex items-center space-x-1">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <SearchAnime />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden mt-16 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="lg"
                    className="justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
              
              <div className="border-t pt-4">
                {user ? (
                  <>
                    <Button asChild variant="ghost" size="lg" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/profile" className="flex items-center space-x-3">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="justify-start w-full mt-2" 
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleSignOut()
                      }}
                    >
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="lg" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/login" className="flex items-center space-x-3">
                        <span>Masuk</span>
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="justify-start w-full mt-2" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/register">
                        <span>Daftar</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}