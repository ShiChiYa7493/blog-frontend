'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthProvider from '@/components/admin/AuthProvider';
import { logout } from '@/lib/admin-api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, FileText, FolderOpen, Tags, MessageSquare,
  Settings, ExternalLink, LogOut, Menu, Anchor,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/articles', label: '文章', icon: FileText },
  { href: '/admin/categories', label: '分类', icon: FolderOpen },
  { href: '/admin/tags', label: '标签', icon: Tags },
  { href: '/admin/comments', label: '评论', icon: MessageSquare },
  { href: '/admin/settings', label: '设置', icon: Settings },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-bold" onClick={onNavigate}>
          <Anchor className="h-5 w-5 text-primary" />
          管理面板
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-2 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          访问网站
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-muted/30">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between border-b border-border bg-background px-4 h-14">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="p-2">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold">管理</span>
          <ThemeToggle />
        </div>

        <div className="flex">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
            <SidebarContent pathname={pathname} />
          </aside>

          {/* Main content */}
          <main className="flex-1 md:ml-64">
            <div className="hidden md:flex items-center justify-end border-b border-border bg-background px-6 h-14">
              <ThemeToggle />
            </div>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
