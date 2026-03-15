'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const shortcuts = [
  { category: '基础移动', items: [
    { key: 'h j k l', desc: '左 / 下 / 上 / 右' },
    { key: 'w / b', desc: '下一个词首 / 上一个词首' },
    { key: '0 / $', desc: '行首 / 行尾' },
    { key: 'gg / G', desc: '文件首行 / 末行' },
  ]},
  { category: '模式切换', items: [
    { key: 'i / a', desc: '光标前 / 后插入' },
    { key: 'o / O', desc: '下方 / 上方新开行' },
    { key: 'v / V', desc: '字符 / 行可视模式' },
    { key: 'Esc', desc: '返回普通模式' },
  ]},
  { category: '编辑操作', items: [
    { key: 'x / dd', desc: '删除字符 / 删除整行' },
    { key: 'yy / p', desc: '复制整行 / 粘贴' },
    { key: 'u / Ctrl+r', desc: '撤销 / 重做' },
    { key: ':wq', desc: '保存并退出' },
  ]},
];

export default function KeyboardHelpPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger when not in an editor context
      const target = e.target as HTMLElement;
      if (target.closest('.vim-editor') || target.closest('[role="textbox"]')) return;

      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--surface-hover)',
          color: 'var(--text-secondary)',
        }}
        aria-label="快捷键帮助 (按 ? 打开)"
        title="快捷键帮助 (?)"
      >
        <Keyboard size={18} />
      </button>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed z-50 bottom-16 right-4 w-80 max-h-[70vh] overflow-y-auto rounded-xl shadow-lg"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--surface-hover)',
              }}
              role="dialog"
              aria-label="快捷键参考"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 sticky top-0"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderBottom: '1px solid var(--surface-hover)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Keyboard size={16} style={{ color: 'var(--green)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    快捷键参考
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded cursor-pointer transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="关闭"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 space-y-3">
                {shortcuts.map(section => (
                  <div key={section.category}>
                    <h3 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--cyan)' }}>
                      {section.category}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between text-xs">
                          <code
                            className="font-mono px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--bg)', color: 'var(--green)' }}
                          >
                            {item.key}
                          </code>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div
                className="px-4 py-2 text-center text-xs"
                style={{
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--surface-hover)',
                }}
              >
                按 <kbd className="font-mono px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg)', color: 'var(--yellow)' }}>?</kbd> 切换 · <kbd className="font-mono px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg)', color: 'var(--yellow)' }}>Esc</kbd> 关闭
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
