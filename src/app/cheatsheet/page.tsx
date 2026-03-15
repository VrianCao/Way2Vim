import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vim 速查表 - Way2Vim',
  description: 'Vim 常用命令速查参考表',
};

interface CommandEntry {
  key: string;
  desc: string;
}

interface CommandSection {
  title: string;
  color: string;
  commands: CommandEntry[];
}

const sections: CommandSection[] = [
  {
    title: '基础移动',
    color: 'var(--blue)',
    commands: [
      { key: 'h', desc: '向左移动' },
      { key: 'j', desc: '向下移动' },
      { key: 'k', desc: '向上移动' },
      { key: 'l', desc: '向右移动' },
      { key: 'w', desc: '下一个词首' },
      { key: 'b', desc: '上一个词首' },
      { key: 'e', desc: '当前/下一个词尾' },
      { key: '0', desc: '行首' },
      { key: '$', desc: '行尾' },
      { key: 'gg', desc: '文件首行' },
      { key: 'G', desc: '文件末行' },
      { key: 'f{char}', desc: '移动到字符 {char}' },
      { key: 't{char}', desc: '移动到字符 {char} 前' },
    ],
  },
  {
    title: '模式切换',
    color: 'var(--green)',
    commands: [
      { key: 'i', desc: '在光标前插入' },
      { key: 'I', desc: '在行首插入' },
      { key: 'a', desc: '在光标后追加' },
      { key: 'A', desc: '在行尾追加' },
      { key: 'o', desc: '在下方新开行' },
      { key: 'O', desc: '在上方新开行' },
      { key: 'v', desc: '字符可视模式' },
      { key: 'V', desc: '行可视模式' },
      { key: ':', desc: '命令行模式' },
      { key: 'Esc', desc: '返回普通模式' },
    ],
  },
  {
    title: '编辑操作',
    color: 'var(--red)',
    commands: [
      { key: 'x', desc: '删除光标处字符' },
      { key: 'X', desc: '删除光标前字符' },
      { key: 'dd', desc: '删除整行' },
      { key: 'dw', desc: '删除到下一个词首' },
      { key: 'd$', desc: '删除到行尾' },
      { key: 'cc', desc: '修改整行' },
      { key: 'cw', desc: '修改到词尾' },
      { key: 'c$', desc: '修改到行尾' },
      { key: 'r{char}', desc: '替换当前字符' },
      { key: 'J', desc: '合并下一行' },
    ],
  },
  {
    title: '复制与粘贴',
    color: 'var(--purple)',
    commands: [
      { key: 'yy', desc: '复制整行' },
      { key: 'yw', desc: '复制到词尾' },
      { key: 'y$', desc: '复制到行尾' },
      { key: 'p', desc: '在光标后粘贴' },
      { key: 'P', desc: '在光标前粘贴' },
    ],
  },
  {
    title: '撤销与重做',
    color: 'var(--orange)',
    commands: [
      { key: 'u', desc: '撤销' },
      { key: 'Ctrl+r', desc: '重做' },
      { key: '.', desc: '重复上次修改' },
    ],
  },
  {
    title: '搜索与替换',
    color: 'var(--cyan)',
    commands: [
      { key: '/pattern', desc: '向下搜索' },
      { key: 'n', desc: '下一个匹配' },
      { key: 'N', desc: '上一个匹配' },
      { key: ':s/old/new/', desc: '替换当前行第一个' },
      { key: ':s/old/new/g', desc: '替换当前行所有' },
    ],
  },
  {
    title: '命令行模式',
    color: 'var(--yellow)',
    commands: [
      { key: ':w', desc: '保存' },
      { key: ':q', desc: '退出' },
      { key: ':wq', desc: '保存并退出' },
      { key: ':q!', desc: '强制退出（不保存）' },
      { key: ':{n}', desc: '跳转到第 n 行' },
    ],
  },
  {
    title: '组合命令',
    color: 'var(--orange)',
    commands: [
      { key: '{n}{motion}', desc: '重复动作 n 次（如 3j）' },
      { key: '{op}{motion}', desc: '操作符 + 动作（如 dw）' },
      { key: '{n}{op}{motion}', desc: '计数 + 操作符 + 动作（如 2dw）' },
      { key: '{op}{op}', desc: '操作整行（如 dd, yy, cc）' },
    ],
  },
];

export default function CheatsheetPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Vim 速查表
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Way2Vim 支持的所有命令参考
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--surface-hover)',
            }}
          >
            {/* Section header */}
            <div
              className="px-4 py-2.5 text-sm font-semibold"
              style={{
                color: section.color,
                borderBottom: '1px solid var(--surface-hover)',
              }}
            >
              {section.title}
            </div>

            {/* Commands */}
            <div className="divide-y" style={{ borderColor: 'var(--surface-hover)' }}>
              {section.commands.map((cmd) => (
                <div
                  key={cmd.key}
                  className="flex items-center justify-between px-4 py-2"
                  style={{ borderColor: 'rgba(65, 72, 104, 0.4)' }}
                >
                  <code
                    className="font-mono text-sm px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--bg)',
                      color: section.color,
                    }}
                  >
                    {cmd.key}
                  </code>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {cmd.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
