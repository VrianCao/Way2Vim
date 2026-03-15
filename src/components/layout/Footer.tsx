'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const common = useTranslations('common');

  return (
    <footer
      className="w-full border-t"
      style={{
        height: '48px',
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--surface-hover)',
      }}
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between text-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span className="flex items-center gap-1">
          {t('madeWith')}
          <Heart size={12} style={{ color: 'var(--red)' }} />
          {t('by')} &middot; Way2Vim
        </span>
        <span>{common('tagline')}</span>
      </div>
    </footer>
  );
}
