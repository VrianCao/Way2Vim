import type { LessonDefinition } from '../../types/lesson';

export const lesson01: LessonDefinition = {
  id: 'lesson-01',
  title: '什么是 Vim？为什么学 Vim？',
  description:
    '了解 Vim 编辑器的历史、核心理念以及模式编辑的概念。通过简单的交互体验 Vim 的两种基本模式。',
  difficulty: 1,
  estimatedMinutes: 5,
  objectives: [
    '理解什么是模式编辑（Modal Editing）',
    '理解 Vim 的价值和应用场景',
  ],
  steps: [
    // Step 1 — Read intro text
    {
      id: 'step-1',
      instruction:
        '欢迎来到 Way2Vim！这是一个交互式的 Vim 学习平台。你现在看到的就是一个模拟的 Vim 编辑器。请仔细阅读编辑器中的文字，然后按下任意移动键（如 j）继续。',
      hint: '按下 j 键向下移动一行即可继续。',
      explanation:
        'Vim（Vi IMproved）是一款强大的文本编辑器，诞生于 1991 年。它是 Linux/Unix 系统中最常用的编辑器之一，几乎所有服务器都预装了它。',
      initialContent: [
        '欢迎来到 Way2Vim！',
        '',
        'Vim 是一款高效的文本编辑器。',
        '它的核心理念是：双手不离开键盘。',
        '接下来我们将一步步学习 Vim。',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '阅读文本并移动光标' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '很好！你已经阅读了介绍文字。让我们继续了解 Vim 的模式。',
    },

    // Step 2 — Understand modes
    {
      id: 'step-2',
      instruction:
        'Vim 最大的特点是「模式编辑」。它有多种模式，最重要的两种是：普通模式（NORMAL）和插入模式（INSERT）。普通模式用于导航和操作文本，插入模式用于输入文字。请观察左下角的状态栏，当前显示的模式是 NORMAL。按 j 继续。',
      hint: '按 j 向下移动光标即可。',
      explanation:
        '传统编辑器（如记事本）只有一种模式：输入即写字。Vim 的普通模式让你用简单的按键完成复杂的编辑操作，效率远超鼠标。',
      initialContent: [
        'Vim 的模式：',
        '',
        '  NORMAL  — 导航、删除、复制、粘贴',
        '  INSERT  — 输入文字',
        '  VISUAL  — 选择文本',
        '  COMMAND — 执行命令（如保存、退出）',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '在普通模式下移动光标' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '现在你知道了 Vim 有四种主要模式。',
    },

    // Step 3 — Real-world scenarios
    {
      id: 'step-3',
      instruction:
        '为什么要学 Vim？因为它无处不在：服务器管理、代码编辑、命令行操作都离不开它。很多现代编辑器（VS Code、IntelliJ）也支持 Vim 快捷键。学会 Vim，终身受益！按 j 继续。',
      hint: '按 j 移动光标继续。',
      explanation:
        '据统计，超过 25% 的开发者使用 Vim 或 Vim 快捷键。掌握 Vim 可以显著提高你的编辑效率。',
      initialContent: [
        '学 Vim 的理由：',
        '',
        '1. 服务器上几乎都有 Vim',
        '2. 编辑速度极快，双手不离键盘',
        '3. 高度可定制，插件丰富',
        '4. 思维方式可迁移到其他工具',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '了解 Vim 的应用场景' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '太好了！现在让我们来实际操作一下。',
    },

    // Step 4 — Press i to enter INSERT mode
    {
      id: 'step-4',
      instruction:
        '现在让我们亲自体验模式切换！请按下 i 键进入插入模式（INSERT）。注意观察左下角状态栏的变化。',
      hint: '按下键盘上的 i 键（小写字母 i）。',
      explanation:
        '按 i 是进入插入模式最基本的方式。进入后你就可以像普通编辑器一样输入文字了。',
      initialContent: [
        '请按 i 进入插入模式。',
        '进入后，状态栏会显示 INSERT。',
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
      successMessage: '你成功进入了插入模式！注意看状态栏已经变成 INSERT 了。',
    },

    // Step 5 — Press Escape to return to NORMAL
    {
      id: 'step-5',
      instruction:
        '很好！你现在处于插入模式。请按 Esc 键返回普通模式（NORMAL）。这是 Vim 中最重要的按键之一——随时可以用 Esc 回到安全的普通模式。',
      hint: '按键盘左上角的 Esc 键。',
      explanation:
        'Esc 键是你的"安全出口"。无论在任何模式下，按 Esc 都会回到普通模式。记住这个原则：不确定的时候，先按 Esc。',
      initialContent: [
        '你现在在插入模式。',
        '按 Esc 返回普通模式。',
        '',
        '记住：Esc 是你的安全出口！',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'INSERT',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 Esc 返回普通模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage:
        '恭喜你完成了第一课！你已经学会了 Vim 最基本的模式切换：i 进入插入模式，Esc 回到普通模式。',
    },
  ],
};
