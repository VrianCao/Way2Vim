'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { VimMode } from '@/types/vim';

interface StatusBarProps {
  mode: VimMode;
  commandBuffer: string;
  statusMessage?: string;
  cursorLine: number;
  cursorCol: number;
  pendingKeys?: string[];
}

const modeLabels: Record<VimMode, string> = {
  NORMAL: 'NORMAL',
  INSERT: '-- INSERT --',
  VISUAL: '-- VISUAL --',
  COMMAND: 'COMMAND',
};

const modeBadgeClass: Record<VimMode, string> = {
  NORMAL: 'vim-mode-badge--normal',
  INSERT: 'vim-mode-badge--insert',
  VISUAL: 'vim-mode-badge--visual',
  COMMAND: 'vim-mode-badge--command',
};

const StatusBar = React.memo(function StatusBar({
  mode,
  commandBuffer,
  statusMessage,
  cursorLine,
  cursorCol,
  pendingKeys,
}: StatusBarProps) {
  const t = useTranslations('statusBar');
  // In COMMAND mode, show the command buffer with ':'/' prefix
  const centerText =
    mode === 'COMMAND'
      ? statusMessage ?? `:${commandBuffer}`
      : statusMessage ?? '';

  const pendingDisplay = pendingKeys && pendingKeys.length > 0
    ? pendingKeys.join('')
    : '';

  return (
    <div
      className="flex items-center justify-between px-3 font-mono text-xs select-none"
      style={{
        height: '32px',
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--surface-hover)',
      }}
      role="status"
      aria-live="polite"
      aria-label="Editor status information"
    >
      {/* Left: Mode badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${modeBadgeClass[mode]}`}
          style={{ color: 'var(--bg)' }}
        >
          {modeLabels[mode]}
        </span>
        {pendingDisplay && (
          <span className="text-text-secondary">{pendingDisplay}</span>
        )}
      </div>

      {/* Center: Status message or command buffer */}
      <div className="flex-1 text-center truncate px-4">
        <span className="text-text-secondary">{centerText}</span>
      </div>

      {/* Right: Cursor position */}
      <div className="text-text-secondary whitespace-nowrap">
        {t('ln')} {cursorLine + 1}, {t('col')} {cursorCol + 1}
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';

export default StatusBar;
