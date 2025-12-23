'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, Mic, Camera, ShoppingCart, User, Globe, ChevronDown } from 'lucide-react';

export default function Header() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  return (
    <header className="header">
      {/* Top row with logo, search, and user controls */}
      <div className="header-top">
        <div className="left-section">
          <Image 
            src="/images/logo.png" 
            alt="HIVE Lanka Logo" 
            width={110}
            height={110}
            className="logo"
            priority
          />
          
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
            <input type="text" className="search-input" placeholder="Search... "/>              
            <Search style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0, color: '#000000' }} />
          </div>
        </div>

        <div className="right-section">
          <Link href="/cart">
            <button className="cart-button">
              <ShoppingCart style={{ width:  '22px', height: '22px', color: '#000000' }} />
            </button>
          </Link>
          
          <Link href="/signin">
            <div className="user-section">
              <User style={{ width: '20px', height: '20px', color: '#000000' }} />
              <span className="signin-text">Sign In</span>
            </div>
          </Link>
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
          <Link href="/about"><button className="nav-button">About Us</button></Link>
          <Link href="/contact"><button className="nav-button">Contact</button></Link>
          <Link href="/faq"><button className="nav-button">FAQ</button></Link>
        </div>
      </div>
    </header>
  );
}