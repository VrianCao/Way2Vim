'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { BookOpen, Terminal, FileText, Gamepad2, Globe } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/lessons', label: t('lessons'), icon: BookOpen },
    { href: '/playground', label: t('playground'), icon: Gamepad2 },
    { href: '/cheatsheet', label: t('cheatsheet'), icon: FileText },
  ];

  const switchLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    router.replace(pathname, { locale: newLocale });
  };

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
        <Link href="/" className="flex items-center gap-2 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] rounded-md px-1">
          <Terminal size={22} style={{ color: 'var(--green)' }} aria-hidden="true" />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--green)' }}
          >
            Way2Vim
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1" aria-label={t('mainNav')}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
                style={{
                  color: isActive ? 'var(--green)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(158, 206, 106, 0.1)' : 'transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] ml-1"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Switch language"
          >
            <Globe size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{locale === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
