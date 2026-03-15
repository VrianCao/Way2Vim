'use client';

import { useTranslations } from 'next-intl';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const t = useTranslations('errorBoundary');
  return (
    <ErrorBoundaryWrapper title={t('title')} message={t('message')} retry={t('retry')}>
      {children}
    </ErrorBoundaryWrapper>
  );
}
