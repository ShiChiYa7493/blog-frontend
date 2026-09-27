'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/admin-api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoggedIn()) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
