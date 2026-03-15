import type { LessonDefinition } from '../../types/lesson';

export const lesson02: LessonDefinition = {
  id: 'lesson-02',
  title: '进入和退出 Vim',
  description:
    '学习如何使用命令模式退出 Vim。掌握 :q、:q! 和 :wq 这三个最常用的退出命令。',
  difficulty: 1,
  estimatedMinutes: 5,
  objectives: [
    '学会使用 :q 正常退出',
    '学会使用 :q! 强制退出（放弃修改）',
    '学会使用 :wq 保存并退出',
  ],
  prerequisites: ['lesson-01'],
  steps: [
    // Step 1 — :q quit
    {
      id: 'step-1',
      instruction:
        '很多初学者打开 Vim 后不知道怎么退出——这甚至成了一个经典笑话！让我们来学习退出 Vim 的方法。请依次输入 : q 然后按回车，即输入命令 :q 来退出。',
      hint: '先按 :（冒号）进入命令模式，然后输入 q，最后按回车（Enter）执行。',
      explanation:
        ':q 是 quit（退出）的缩写。冒号 : 会进入命令模式，你会在编辑器底部看到输入区域。输入完成后按回车执行命令。',
      initialContent: [
        '如何退出 Vim？',
        '',
        '输入 :q 然后按回车。',
        '',
        '这是最基本的退出命令。',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :q 命令' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'q', '<Enter>'],
      },
      successMessage: '做得好！:q 会退出 Vim（前提是你没有未保存的修改）。',
    },

    // Step 2 — :q! force quit
    {
      id: 'step-2',
      instruction:
        '如果你修改了文件但不想保存，:q 会报错。这时需要用 :q! 强制退出。请依次输入 : q ! 然后按回车。',
      hint: '先按 :（冒号），然后依次输入 q 和 !（感叹号），最后按回车。',
      explanation:
        ':q! 中的 ! 表示"强制"。这个命令会丢弃所有未保存的修改并退出。当你不小心做了不想要的修改时，这个命令很有用。',
      initialContent: [
        '这个文件已被修改。',
        '',
        '使用 :q! 可以放弃修改并退出。',
        '! 表示"强制"的意思。',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :q! 命令' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'q', '!', '<Enter>'],
      },
      successMessage: '很好！:q! 可以在有未保存修改时强制退出。',
    },

    // Step 3 — Enter insert mode and type text
    {
      id: 'step-3',
      instruction:
        '在学习 :wq 之前，我们先做一些修改。请按 i 进入插入模式，然后随意输入一些文字。',
      hint: '按 i 进入插入模式。进入后你可以像普通编辑器一样输入文字。',
      explanation:
        '当你修改了文件内容后，Vim 会追踪这些变化。退出前通常需要决定是保存还是丢弃这些修改。',
      initialContent: [
        '请在这里输入一些文字。',
        '',
        '按 i 进入插入模式后开始输入。',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 i 进入插入模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '你已进入插入模式，可以自由输入文字了。',
    },

    // Step 4 — Escape then :wq
    {
      id: 'step-4',
      instruction:
        '现在让我们保存修改并退出。首先按 Esc 回到普通模式，然后输入 :wq 并按回车。:wq 的意思是"写入（write）并退出（quit）"。',
      hint: '先按 Esc，然后按 :（冒号），输入 wq，最后按回车。',
      explanation:
        ':wq 是最常用的退出方式。w 代表 write（保存），q 代表 quit（退出）。也可以用 :x 或 ZZ 作为替代。',
      initialContent: [
        '修改完成后，用 :wq 保存退出。',
        '',
        'w = write（保存）',
        'q = quit（退出）',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '执行 :wq 命令' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [':', 'w', 'q', '<Enter>'],
      },
      successMessage: '太棒了！:wq 会保存文件并退出 Vim。',
    },

    // Step 5 — Summary
    {
      id: 'step-5',
      instruction:
        '恭喜！你已经学会了退出 Vim 的三种方式。来回顾一下：:q 正常退出，:q! 强制退出，:wq 保存并退出。按 j 或 k 移动光标完成本课。',
      hint: '按 j 或 k 移动光标即可完成。',
      explanation:
        '小贴士：你也可以用 :w 只保存不退出，或用 ZZ（两个大写 Z）作为 :wq 的快捷方式。',
      initialContent: [
        '退出 Vim 的方式总结：',
        '',
        '  :q   — 退出（无修改时）',
        '  :q!  — 强制退出（丢弃修改）',
        '  :wq  — 保存并退出',
        '',
        '按 j 或 k 完成本课。',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '移动光标确认理解' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage:
        '恭喜你完成了第二课！你再也不用担心被困在 Vim 里了。',
    },
  ],
};
