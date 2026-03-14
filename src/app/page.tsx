'use client';

import VimEditor from '@/components/editor/VimEditor';
import { createInitialState } from '@/engine';

const sampleText = [
  '欢迎来到 Way2Vim！',
  '',
  '这是一个交互式 Vim 学习平台。',
  '点击编辑器区域开始练习。',
  '',
  '试试这些命令：',
  '  h j k l  - 移动光标',
  '  i        - 进入插入模式',
  '  Esc      - 返回普通模式',
  '  dd       - 删除整行',
  '  u        - 撤销',
  '  :wq      - 保存并退出',
];

const initialState = createInitialState(sampleText);

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-tn-green mb-2">Way2Vim</h1>
          <p className="text-text-secondary">
            交互式 Vim 学习平台 — 正在建设中
          </p>
        </div>

        <VimEditor initialState={initialState} />
      </main>
    </div>
  );
}
