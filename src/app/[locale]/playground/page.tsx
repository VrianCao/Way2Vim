'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import VimEditor from '@/components/editor/VimEditor';
import { createInitialState } from '@/engine';
import PageTransition from '@/components/layout/PageTransition';

export default function PlaygroundPage() {
  const t = useTranslations('playground');
  const [resetKey, setResetKey] = useState(0);
  const defaultText = t.raw('defaultText') as string[];

  return (
    <PageTransition>
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t('title')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={() => setResetKey((k) => k + 1)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--surface-hover)',
          }}
          aria-label={t('reset')}
        >
          <RotateCcw size={14} />
          {t('reset')}
        </button>
      </div>

      <VimEditor key={resetKey} initialState={createInitialState(defaultText)} />
    </div>
    </PageTransition>
  );
}
