'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import MobilePrompt from '@/components/layout/MobilePrompt';
import KeyboardHelpPanel from '@/components/layout/KeyboardHelpPanel';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobilePrompt />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <KeyboardHelpPanel />
    </div>
  );
}
