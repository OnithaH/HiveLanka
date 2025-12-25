'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Mic, Camera, ShoppingCart, User, Globe, ChevronDown } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
      const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      };

      updateCartCount();
      
      // Listen for storage changes
      window.addEventListener('storage', updateCartCount);
      
      // Check every second (in case same tab updates)
      const interval = setInterval(updateCartCount, 1000);

      return () => {
        window.removeEventListener('storage', updateCartCount);
        clearInterval(interval);
      };
    }, []);


  return (
    <header className="header">
      {/* Top row with logo, search, and user controls */}
      <div className="header-top">
        <div className="left-section">
          <Link href="/">
            <Image 
              src="/images/logo.png" 
              alt="HIVE Lanka Logo" 
              width={110}
              height={110}
              className="logo"
              priority
            />
          </Link>
          
          <div 
            className="language-selector"
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          >
            <Globe className="globe-icon-svg" style={{ width: '23px', height: '23px', color: '#000000' }} />
            <span className="language-text">Eng</span>
            <ChevronDown className="dropdown-arrow-svg" style={{ width: '12px', height: '12px', color: '#000000' }} />
            
            {languageDropdownOpen && (
              <div className="language-dropdown show">
                <div className="language-option">
                  <span className="lang-flag">🇬🇧</span>
                  <span>English</span>
                </div>
                <div className="language-option">
                  <span className="lang-flag">🇱🇰</span>
                  <span>සිංහල</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="center-section">
          <div className="search-container">
            <Mic style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, color: '#000000' }} />
            <span className="divider"></span> 
            <Camera style={{ width: '20px', height: '20px', marginLeft: '5px', cursor: 'pointer', flexShrink: 0, color: '#000000' }} />
            <input type="text" className="search-input" placeholder="Search...  "/>              
            <Search style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, color:  '#000000' }} />
          </div>
        </div>

        <div className="right-section">
          <Link href="/cart">
            <button className="cart-button">
              <ShoppingCart style={{ width: '22px', height: '22px', color: '#000000' }} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </Link>
          
          {/* Show User Button when signed in, Sign In link when not */}
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
          
          <SignedOut>
            <Link href="/signin">
              <div className="user-section">
                <User style={{ width: '20px', height: '20px', color: '#000000' }} />
                <span className="signin-text">Sign In</span>
              </div>
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* Navigation buttons row */}
      <div className="navigation-section">
        <div className="nav-buttons">
          <Link href="/"><button className="nav-button">Home</button></Link>
          <Link href="/shop"><button className="nav-button">Shop</button></Link>
          <Link href="/donate"><button className="nav-button">Donate</button></Link>
          <Link href="/forum"><button className="nav-button">Community Forum</button></Link>
          <Link href="/tutorials"><button className="nav-button">Tutorials</button></Link>
          <Link href="/events"><button className="nav-button">Events</button></Link>
          <Link href="/loyalty"><button className="nav-button">Points</button></Link>
          <Link href="/about"><button className="nav-button">About Us</button></Link>
          <Link href="/contact"><button className="nav-button">Contact</button></Link>
          <Link href="/faq"><button className="nav-button">FAQ</button></Link>
        </div>
      </div>
    </header>
  );
}