import type { LessonDefinition } from '../../types/lesson';

export const lesson05: LessonDefinition = {
  id: 'lesson-05',
  title: '保存和退出（:w, :q, :wq, ZZ）',
  description: '学习如何在 Vim 中保存文件和退出编辑器。掌握 :w、:q、:wq 和 ZZ 等常用命令。',
  difficulty: 2,
  estimatedMinutes: 5,
  objectives: [
    '学会使用 :w 保存文件',
    '学会使用 :q 退出编辑器',
    '学会使用 :wq 保存并退出',
    '学会使用 ZZ 快捷键保存并退出',
  ],
  prerequisites: ['lesson-04'],
  steps: [
    {
      id: 'lesson-05-step-1',
      instruction: '首先，按 i 进入插入模式，准备编辑文本。',
      hint: '按下小写字母 i 即可进入插入模式。',
      explanation:
        '在 Vim 中，你需要先进入插入模式才能编辑文本。编辑完成后，通常需要保存文件。',
      initialContent: ['Hello, Vim!', '学习保存和退出'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '进入插入模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '很好！你已经进入了插入模式。接下来学习如何保存文件。',
    },
    {
      id: 'lesson-05-step-2',
      instruction:
        '按 Escape 回到普通模式，然后输入 :w 并按回车来保存文件。',
      hint: '先按 Escape，再依次输入 : w 然后按 Enter。',
      explanation:
        ':w 命令会将当前缓冲区的内容写入文件。w 代表 write（写入）。',
      initialContent: ['Hello, Vim!', '学习保存和退出'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :w 保存文件' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'w', '<Enter>'],
      },
      successMessage: '文件已保存！:w 是 Vim 中最常用的保存命令。',
    },
    {
      id: 'lesson-05-step-3',
      instruction: '输入 :q 并按回车来退出编辑器。',
      hint: '依次输入 : q 然后按 Enter。',
      explanation:
        ':q 命令会退出 Vim。如果文件有未保存的修改，Vim 会阻止退出并提示你先保存。',
      initialContent: ['Hello, Vim!', '学习保存和退出'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :q 退出编辑器' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'q', '<Enter>'],
      },
      successMessage: '成功退出！在已保存的情况下，:q 可以正常退出。',
    },
    {
      id: 'lesson-05-step-4',
      instruction: '输入 :wq 并按回车，一步完成保存并退出。',
      hint: '依次输入 : w q 然后按 Enter。',
      explanation:
        ':wq 将 :w（保存）和 :q（退出）合并为一个命令，这是最常用的退出方式之一。',
      initialContent: ['Hello, Vim!', '学习保存和退出'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :wq 保存并退出' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'w', 'q', '<Enter>'],
      },
      successMessage: '完美！:wq 是保存退出的最常用方法。',
    },
    {
      id: 'lesson-05-step-5',
      instruction:
        '在普通模式下按 ZZ（两次大写 Z），这是 :wq 的快捷方式。',
      hint: '确保在普通模式下，连续按两次大写 Z。',
      explanation:
        'ZZ 等同于 :wq，但更快捷。注意是大写 Z，需要按住 Shift 键。这是高效 Vim 用户常用的退出方式。',
      initialContent: ['Hello, Vim!', '学习保存和退出'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '使用 ZZ 保存并退出' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: ['Z', 'Z'],
      },
      successMessage:
        '太棒了！你已经掌握了所有保存和退出的方法。ZZ 是最快的保存退出方式！',
    },
  ],
};
