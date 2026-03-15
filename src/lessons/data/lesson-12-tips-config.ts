import type { LessonDefinition } from '../../types/lesson';

export const lesson12: LessonDefinition = {
  id: 'lesson-12',
  title: '实用技巧与配置',
  description:
    '了解 Vim 的配置文件、常用设置和实用技巧，为日常使用 Vim 打下基础。',
  difficulty: 2,
  estimatedMinutes: 5,
  objectives: [
    '了解 .vimrc 配置文件的作用',
    '认识常用的 Vim 设置选项',
    '学习 Vim 的学习路径和练习建议',
    '完成 Way2Vim 基础教程',
  ],
  prerequisites: ['lesson-11'],
  steps: [
    {
      id: 'lesson-12-step-01',
      instruction:
        '这是一个示例 .vimrc 配置文件。按 `j` 向下移动，浏览这些常用配置。',
      hint: '按 j 向下移动一行，看看 Vim 的配置选项。',
      explanation:
        '.vimrc 是 Vim 的配置文件，位于用户主目录下（~/.vimrc）。你可以在其中设置行号、缩进、搜索行为等选项，让 Vim 更符合你的使用习惯。',
      initialContent: [
        '" .vimrc 示例',
        'set number',
        'set relativenumber',
        'set ignorecase',
        'set smartcase',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '浏览配置文件' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 1 } },
      },
      successMessage: '你已开始浏览配置文件！继续向下了解更多设置。',
    },
    {
      id: 'lesson-12-step-02',
      instruction:
        'set number 显示行号，set relativenumber 显示相对行号（便于使用数字前缀）。按 `j` 继续浏览。',
      hint: '按 j 向下移动到下一个配置项。',
      explanation:
        '行号设置能帮助你快速定位。相对行号显示当前行到其他行的距离，配合数字前缀（如 5j）使用非常高效。',
      initialContent: [
        '" .vimrc 示例',
        'set number',
        'set relativenumber',
        'set ignorecase',
        'set smartcase',
      ],
      initialCursor: { line: 1, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '继续浏览' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 2 } },
      },
      successMessage: '相对行号是 Vim 高手的常用配置！',
    },
    {
      id: 'lesson-12-step-03',
      instruction:
        'set ignorecase 让搜索忽略大小写，set smartcase 在搜索包含大写字母时自动区分大小写。按 `j` 继续。',
      hint: '按 j 向下移动。',
      explanation:
        '这两个选项配合使用，让搜索更智能：搜索 "vim" 会匹配 "Vim" 和 "VIM"，但搜索 "Vim" 只会精确匹配大写 V 的情况。',
      initialContent: [
        '" .vimrc 示例',
        'set number',
        'set relativenumber',
        'set ignorecase',
        'set smartcase',
      ],
      initialCursor: { line: 2, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '继续浏览' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 3 } },
      },
      successMessage: '智能搜索让 Vim 使用更加便捷！',
    },
    {
      id: 'lesson-12-step-04',
      instruction:
        '学习 Vim 的最佳方式是每天练习。建议每天花 10-15 分钟练习基本命令，逐步形成肌肉记忆。按任意移动键继续。',
      hint: '按 j、k、h 或 l 中的任意一个。',
      explanation:
        'Vim 的学习曲线较陡，但一旦掌握，编辑效率会大幅提升。建议从基本移动和编辑开始，逐步学习高级功能。不要试图一次记住所有命令，而是在实际使用中慢慢积累。',
      initialContent: [
        '" .vimrc 示例',
        'set number',
        'set relativenumber',
        'set ignorecase',
        'set smartcase',
      ],
      initialCursor: { line: 3, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '确认理解' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '坚持练习是掌握 Vim 的关键！',
    },
    {
      id: 'lesson-12-step-05',
      instruction:
        '恭喜你完成 Way2Vim 的所有基础课程！按 `G` 跳到最后一行，象征你的 Vim 学习之旅才刚刚开始。',
      hint: '按 Shift+g（即大写 G）跳到文件末尾。',
      explanation:
        '你已经掌握了 Vim 的核心概念：模式切换、移动命令、操作符与动作的组合、可视模式等。接下来，在日常编辑中多加练习，你会发现 Vim 的强大和优雅。继续探索更多高级功能，如宏录制、窗口分割、插件系统等。祝你在 Vim 的世界里越走越远！',
      initialContent: [
        '" .vimrc 示例',
        'set number',
        'set relativenumber',
        'set ignorecase',
        'set smartcase',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到文件末尾' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 4, col: 0 } },
      },
      successMessage:
        '🎉 恭喜毕业！你已完成 Way2Vim 基础教程。继续练习，Vim 会成为你最得力的编辑工具！',
    },
  ],
};
