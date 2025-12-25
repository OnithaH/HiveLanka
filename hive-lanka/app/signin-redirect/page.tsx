'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserRole();
    } else if (isLoaded && !user) {
      // Not signed in, redirect to signin
      router.push('/signin');
    }
  }, [isLoaded, user]);

  const checkUserRole = async () => {
    try {
      const response = await fetch(`/api/user/role? clerkId=${user?. id}`);
      const data = await response.json();

      console.log('🔍 User role:', data.role);

      if (data.role === 'ADMIN') {
        console.log('👑 Admin detected → Redirecting to /admin');
        router.push('/admin');
      } else if (data.role === 'SELLER') {
        console.log('🏪 Seller detected → Redirecting to /seller/dashboard');
        router.push('/seller/dashboard');
      } else {
        console.log('🛍️ Customer → Redirecting to home');
        router.push('/');
      }
    } catch (error) {
      console.error('❌ Role check failed:', error);
      router.push('/');
    } finally {
      setChecking(false);
    }
  };

  if (! isLoaded || checking) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems:  'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ 
          textAlign: 'center',
          background: 'white',
          padding: '60px 40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom:  '20px',
            animation: 'spin 2s linear infinite'
          }}>⏳</div>
          <p style={{ 
            fontSize:  '1.3rem', 
            color: '#333',
            fontWeight: '600'
          }}>Checking your access...</p>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#666',
            marginTop: '10px'
          }}>Please wait</p>
        </div>
      </div>
    );
  }

  return null;
}