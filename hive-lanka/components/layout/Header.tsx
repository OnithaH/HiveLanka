'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Mic,
  Camera
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#8B4513] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📞 Support:   0771234567</span>
            <span>📧 info@hivelanka.com</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:underline">English</button>
            <span>|</span>
            <button className="hover:underline">සිංහල</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-[#8B4513] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">HL</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#8B4513]">HiveLanka</h1>
              <p className="text-xs text-gray-600">Empowering Artisans</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for traditional crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513]"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Voice Search"
                >
                  <Mic className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Image Search"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-[#8B4513] text-white rounded-lg hover: bg-[#6B3410] transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            <Link 
              href="/profile" 
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <User className="w-6 h-6 text-gray-700" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(! mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 border-t pt-4">
          <ul className="flex items-center justify-center gap-8 text-gray-700 font-medium">
            <li>
              <Link href="/" className="hover:text-[#8B4513] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#8B4513] transition">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-[#8B4513] transition">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/b2b" className="hover:text-[#8B4513] transition">
                B2B Directory
              </Link>
            </li>
            <li>
              <Link href="/fundraising" className="hover:text-[#8B4513] transition">
                Fundraising
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-[#8B4513] transition">
                Events
              </Link>
            </li>
            <li>
              <Link href="/tutorials" className="hover:text-[#8B4513] transition">
                Tutorials
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md: hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-3">
              <li><Link href="/" className="block py-2 hover:text-[#8B4513]">Home</Link></li>
              <li><Link href="/shop" className="block py-2 hover:text-[#8B4513]">Shop</Link></li>
              <li><Link href="/categories" className="block py-2 hover:text-[#8B4513]">Categories</Link></li>
              <li><Link href="/b2b" className="block py-2 hover:text-[#8B4513]">B2B Directory</Link></li>
              <li><Link href="/fundraising" className="block py-2 hover:text-[#8B4513]">Fundraising</Link></li>
              <li><Link href="/events" className="block py-2 hover:text-[#8B4513]">Events</Link></li>
              <li><Link href="/tutorials" className="block py-2 hover:text-[#8B4513]">Tutorials</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}