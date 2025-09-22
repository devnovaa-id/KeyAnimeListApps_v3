import Link from 'next/link'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-premium-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-white font-bold text-xl">KeyAnimeList</span>
            </Link>
            <p className="text-gray-400 mb-4">
              The ultimate destination for anime lovers. Discover new shows, track your progress, and join our community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/schedule" className="text-gray-400 hover:text-white transition-colors">Schedule</Link></li>
              <li><Link href="/genres" className="text-gray-400 hover:text-white transition-colors">Genres</Link></li>
              <li><Link href="/popular" className="text-gray-400 hover:text-white transition-colors">Popular</Link></li>
              <li><Link href="/new" className="text-gray-400 hover:text-white transition-colors">New Releases</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/feedback" className="text-gray-400 hover:text-white transition-colors">Feedback</Link></li>
              <li><Link href="/status" className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/dmca" className="text-gray-400 hover:text-white transition-colors">DMCA</Link></li>
              <li><Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} KeyAnimeList. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Made with ❤️ for anime fans worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}