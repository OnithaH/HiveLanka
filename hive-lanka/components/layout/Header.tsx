'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, Camera, ShoppingCart, User, Globe, ChevronDown, Store, Shield, LayoutDashboard } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import VoiceSearch from '@/components/search/VoiceSearch';
import { useLanguage } from '@/lib/LanguageContext';

// Translations for the Header component
const translations = {
  en: {
    home: "Home",
    shop: "Shop",
    donate: "Donate",
    community: "Community Forum",
    tutorials: "Tutorials",
    events: "Events",
    points: "Points",
    about: "About Us",
    contact: "Contact",
    faq: "FAQ",
    searchPlaceholder: "Search...",
    signIn: "Sign In",
    myOrders: "My Orders",
    adminDash: "Admin Dashboard",
    sellerDash: "Seller Dashboard",
    myDash: "My Dashboard",
  },
  si: {
    home: "මුල් පිටුව",
    shop: "සාප්පුව",
    donate: "පරිත්‍යාග",
    community: "ප්‍රජා මණ්ඩපය",
    tutorials: "පාඩම් මාලා",
    events: "විශේෂ අවස්ථා",
    points: "ලකුණු",
    about: "අප ගැන",
    contact: "සම්බන්ධ වන්න",
    faq: "ගැටළු සහ පිළිතුරු",
    searchPlaceholder: "සොයන්න...",
    signIn: "පිවිසෙන්න",
    myOrders: "මගේ ඇණවුම්",
    adminDash: "පරිපාලක පුවරුව",
    sellerDash: "විකුණුම්කරු පුවරුව",
    myDash: "මගේ පුවරුව",
  }
};

export default function Header() {
  const { user, isLoaded } = useUser();
  const { language, setLanguage } = useLanguage();
  const t = translations[language]; // Get current language strings

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
      const data = await response.json();
      if (data.role) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
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
            <span className="language-text">{language === 'en' ? 'Eng' : 'සිංහල'}</span>
            <ChevronDown className="dropdown-arrow-svg" style={{ width:  '12px', height: '12px', color:  '#000000' }} />
            
            {languageDropdownOpen && (
              <div className="language-dropdown show">
                <div 
                  className="language-option" 
                  onClick={() => setLanguage('en')}
                >
                  <span className="lang-flag">🇬🇧</span>
                  <span>English</span>
                </div>
                <div 
                  className="language-option"
                  onClick={() => setLanguage('si')}
                >
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
            <input type="text" className="search-input" placeholder={t.searchPlaceholder} />              
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
                    label={t.adminDash}
                    labelIcon={<Shield size={16} />}
                    href="/admin"
                  />
                )}
                {userRole === 'SELLER' && (
                  <UserButton.Link
                    label={t.sellerDash}
                    labelIcon={<Store size={16} />}
                    href="/seller/dashboard"
                  />
                )}
                {userRole === 'CUSTOMER' && (
                  <UserButton.Link
                    label={t.myDash}
                    labelIcon={<LayoutDashboard size={16} />}
                    href="/dashboard"
                  />
                )}
                
                <UserButton.Link
                  label={t.myOrders}
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
                <span className="signin-text">{t.signIn}</span>
              </div>
            </Link>
          </SignedOut>
        </div>
      </div>

      <div className="navigation-section">
        <div className="nav-buttons">
          <Link href="/"><button className="nav-button">{t.home}</button></Link>
          <Link href="/shop"><button className="nav-button">{t.shop}</button></Link>
          <Link href="/donate"><button className="nav-button">{t.donate}</button></Link>
          <Link href="/forum"><button className="nav-button">{t.community}</button></Link>
          <Link href="/tutorials"><button className="nav-button">{t.tutorials}</button></Link>
          <Link href="/events"><button className="nav-button">{t.events}</button></Link>
          <Link href="/loyalty"><button className="nav-button">{t.points}</button></Link>
          <Link href="/about"><button className="nav-button">{t.about}</button></Link>
          <Link href="/contact"><button className="nav-button">{t.contact}</button></Link>
          <Link href="/faq"><button className="nav-button">{t.faq}</button></Link>
        </div>
      </div>
    </header>
  );
}