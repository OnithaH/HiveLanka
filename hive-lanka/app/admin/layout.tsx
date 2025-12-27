'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, Users, Settings, LogOut, ShieldAlert, CalendarCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <LayoutDashboard size={28} />
          <span>HiveAdmin</span>
        </div>

        <nav>
          <Link
            href="/admin/dashboard"
            className={`admin-nav-item ${pathname.includes('/dashboard') ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> Overview
          </Link>

          <Link
            href="/admin/sellers"
            className={`admin-nav-item ${pathname.includes('/sellers') ? 'active' : ''}`}
          >
            <ShieldAlert size={20} /> Seller Verification
          </Link>

          <Link
            href="/admin/events"
            className={`admin-nav-item ${pathname.includes('/events') ? 'active' : ''}`}
          >
            <CalendarCheck size={20} /> Event Submissions
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-nav-item">
            <LogOut size={20} /> Exit to Store
          </Link>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
