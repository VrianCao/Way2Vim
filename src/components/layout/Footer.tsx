import { Heart } from 'lucide-react';

export default function Footer() {
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
          用
          <Heart size={12} style={{ color: 'var(--red)' }} />
          制作 &middot; Way2Vim
        </span>
        <span>交互式 Vim 学习平台</span>
      </div>
    </footer>
  );
}
