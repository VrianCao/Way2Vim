'use client';

import { useTranslations } from 'next-intl';
import { Monitor } from 'lucide-react';

export default function MobilePrompt() {
  const t = useTranslations('mobilePrompt');

  return (
    <div
      className="block md:hidden px-4 py-3 text-center text-xs"
      style={{
        backgroundColor: 'rgba(224, 175, 104, 0.1)',
        color: 'var(--yellow)',
        borderBottom: '1px solid rgba(224, 175, 104, 0.2)',
      }}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Monitor size={14} />
        <span>{t('message')}</span>
      </div>
    </div>
  );
}
