'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthProvider from '@/components/admin/AuthProvider';
import { logout } from '@/lib/admin-api';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/tags', label: 'Tags' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-bold text-lg">Admin</Link>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`text-sm ${pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-white">View Site</Link>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-white">Logout</button>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
