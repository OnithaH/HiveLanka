'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Camera, ShoppingCart, User, Globe, ChevronDown, Store, Shield, LayoutDashboard } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import VoiceSearch from '@/components/search/VoiceSearch';

export default function Header() {
  const { user, isLoaded } = useUser();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserRole();
    }
  }, [isLoaded, user]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`/api/user/role?clerkId=${user?.id}`);
      const data = await response. json();
      if (data.role) {
        setUserRole(data. role);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage. getItem('cart') || '[]');
      const count = cart.reduce((sum:  number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="header">
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
            <ChevronDown className="dropdown-arrow-svg" style={{ width:  '12px', height: '12px', color:  '#000000' }} />
            
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
            <VoiceSearch/>
            <span className="divider"></span> 
            <Link href="/visual-search"><Camera style={{ width: '20px', height: '20px', marginLeft: '5px', cursor: 'pointer', flexShrink: 0, color: '#000000' }} /></Link>
            <input type="text" className="search-input" placeholder="Search..." />              
            <Search style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink:  0, color:  '#000000' }} />
          </div>
        </div>

        <div className="right-section">
          <Link href="/cart">
            <button className="cart-button">
              <ShoppingCart style={{ width: '22px', height: '22px', color:  '#000000' }} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </Link>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            >
              <UserButton.MenuItems>
                {userRole === 'ADMIN' && (
                  <UserButton.Link
                    label="Admin Dashboard"
                    labelIcon={<Shield size={16} />}
                    href="/admin"
                  />
                )}
                {userRole === 'SELLER' && (
                  <UserButton. Link
                    label="Seller Dashboard"
                    labelIcon={<Store size={16} />}
                    href="/seller/dashboard"
                  />
                )}
                {userRole === 'CUSTOMER' && (
                  <UserButton.Link
                    label="My Dashboard"
                    labelIcon={<LayoutDashboard size={16} />}
                    href="/dashboard"
                  />
                )}
                
                <UserButton. Link
                  label="My Orders"
                  labelIcon={<ShoppingCart size={16} />}
                  href="/orders"
                />
                
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
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