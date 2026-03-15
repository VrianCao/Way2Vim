'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import VimEditor from '@/components/editor/VimEditor';
import { createInitialState } from '@/engine';
import PageTransition from '@/components/layout/PageTransition';

const defaultText = [
  '# Way2Vim 练习场',
  '',
  '这里是自由练习区域。',
  '你可以在这里尝试任何 Vim 命令，没有步骤限制。',
  '',
  '## 基本操作',
  '- h/j/k/l 移动光标',
  '- i 进入插入模式，Esc 返回普通模式',
  '- dd 删除整行，u 撤销',
  '- yy 复制整行，p 粘贴',
  '- /pattern 搜索，n/N 跳转匹配',
  '',
  '## 试试组合命令',
  '- 2dd 删除两行',
  '- 3w 向前移动三个单词',
  '- d$ 删除到行尾',
  '- cw 修改一个单词',
  '',
  '尽情练习吧！',
];

export default function PlaygroundPage() {
  const t = useTranslations('playground');
  const [resetKey, setResetKey] = useState(0);

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
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ece6a]"
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
