'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Terminal, FileText, Gamepad2 } from 'lucide-react';

const navItems = [
  { href: '/lessons', label: '课程', icon: BookOpen },
  { href: '/playground', label: '练习场', icon: Gamepad2 },
  { href: '/cheatsheet', label: '速查表', icon: FileText },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b"
      style={{
        height: '56px',
        backgroundColor: 'rgba(26, 27, 38, 0.85)',
        borderColor: 'var(--surface-hover)',
      }}
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Terminal size={22} style={{ color: 'var(--green)' }} />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--green)' }}
          >
            Way2Vim
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm no-underline transition-colors"
                style={{
                  color: isActive ? 'var(--green)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(158, 206, 106, 0.1)' : 'transparent',
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
