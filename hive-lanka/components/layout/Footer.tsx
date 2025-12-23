import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md: grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About HiveLanka</h3>
            <p className="text-sm mb-4">
              Empowering Sri Lankan artisans by connecting them with global markets.  
              Supporting traditional crafts and sustainable livelihoods.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
              <li><Link href="/become-seller" className="hover:text-white transition">Become a Seller</Link></li>
              <li><Link href="/fundraising" className="hover:text-white transition">Fundraising</Link></li>
              <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#8B4513]" />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#8B4513]" />
                <span>support@hivelanka.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm mb-2">Subscribe to our newsletter: </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-gray-800 rounded-l-lg flex-1 text-sm focus:outline-none"
                />
                <button className="px-4 py-2 bg-[#8B4513] text-white rounded-r-lg hover:bg-[#6B3410] transition text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 HiveLanka.   All rights reserved.  | Made with ❤️ for Sri Lankan Artisans</p>
        </div>
      </div>
    </footer>
  );
}