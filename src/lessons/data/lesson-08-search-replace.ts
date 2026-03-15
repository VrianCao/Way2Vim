import type { LessonDefinition } from '../../types/lesson';

export const lesson08: LessonDefinition = {
  id: 'lesson-08',
  title: '搜索和替换（/, n, N, :s）',
  description:
    '学习使用 / 搜索文本、n/N 在匹配项之间跳转，以及使用 :s 命令进行文本替换。',
  difficulty: 3,
  estimatedMinutes: 10,
  objectives: [
    '学会使用 / 进行正向搜索',
    '学会使用 n 跳到下一个匹配项',
    '学会使用 N 跳到上一个匹配项',
    '学会使用 :s 进行单行替换',
    '学会使用 :s 的 g 标志进行全行替换',
  ],
  prerequisites: ['lesson-07'],
  steps: [
    {
      id: 'lesson-08-step-1',
      instruction:
        '按 / 进入搜索模式，输入 vim，然后按回车执行搜索。',
      hint: '依次按 / v i m 然后按 Enter。搜索会跳转到第一个匹配的位置。',
      explanation:
        '/ 会进入搜索模式，输入搜索关键词后按回车，光标会跳到第一个匹配的位置。搜索是 Vim 中快速定位文本的核心功能。',
      initialContent: [
        'vim is fast',
        'vim is modal',
        'I love vim',
        'vim is powerful',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '搜索 vim' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: ['/', 'v', 'i', 'm', '<Enter>'],
      },
      successMessage: '搜索成功！光标已跳到第一个 "vim" 的位置。',
    },
    {
      id: 'lesson-08-step-2',
      instruction: '按 n 跳转到下一个 "vim" 匹配项。',
      hint: '按小写 n 可以跳转到搜索结果的下一个匹配位置。',
      explanation:
        'n（next）会按照搜索方向跳转到下一个匹配项。如果到达文件末尾，会自动从头开始继续搜索（环绕搜索）。',
      initialContent: [
        'vim is fast',
        'vim is modal',
        'I love vim',
        'vim is powerful',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '跳到下一个匹配项' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 1, col: 0 },
          mode: 'NORMAL',
        },
      },
      successMessage: '找到了！光标已跳到第二行的 "vim"。',
    },
    {
      id: 'lesson-08-step-3',
      instruction: '按大写 N 跳回到上一个 "vim" 匹配项。',
      hint: '按大写 N（Shift+n）可以反向跳转到上一个匹配位置。',
      explanation:
        'N 的作用与 n 相反，它会按搜索方向的反方向跳转。n 和 N 让你可以在所有匹配项之间自由来回移动。',
      initialContent: [
        'vim is fast',
        'vim is modal',
        'I love vim',
        'vim is powerful',
      ],
      initialCursor: { line: 1, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '跳到上一个匹配项' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 0, col: 0 },
          mode: 'NORMAL',
        },
      },
      successMessage: '反向跳转成功！光标回到了第一行的 "vim"。',
    },
    {
      id: 'lesson-08-step-4',
      instruction:
        '使用替换命令将当前行（第一行）的 "vim" 替换为 "Vim"。输入 :s/vim/Vim/ 并按回车。',
      hint: '依次输入 : s / v i m / V i m / 然后按 Enter。',
      explanation:
        ':s/旧文本/新文本/ 会替换当前行中第一个匹配的文本。s 代表 substitute（替换）。',
      initialContent: [
        'vim is fast',
        'vim is modal',
        'I love vim',
        'vim is powerful',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '替换当前行的 vim' },
      ],
      validation: {
        type: 'STRICT_KEY_SEQUENCE',
        sequence: [
          ':', 's', '/', 'v', 'i', 'm', '/', 'V', 'i', 'm', '/', '<Enter>',
        ],
      },
      successMessage: '替换成功！第一行的 "vim" 已变为 "Vim"。',
    },
    {
      id: 'lesson-08-step-5',
      instruction:
        '移到第三行（"I love vim"），使用 :s/vim/Vim/g 替换该行所有的 "vim"。',
      hint: '先移到第三行，然后输入 :s/vim/Vim/g 并按回车。末尾的 g 表示替换该行所有匹配项。',
      explanation:
        '默认情况下 :s 只替换每行的第一个匹配项。加上 g（global）标志后，会替换该行中所有的匹配项。',
      initialContent: [
        'Vim is fast',
        'vim is modal',
        'I love vim',
        'vim is powerful',
      ],
      initialCursor: { line: 2, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '全行替换 vim' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'Vim is fast',
            'vim is modal',
            'I love Vim',
            'vim is powerful',
          ],
        },
      },
      successMessage: '第三行替换完成！g 标志确保了所有匹配项都被替换。',
    },
    {
      id: 'lesson-08-step-6',
      instruction:
        '尝试搜索一个不存在的文本。输入 /xyz 并按回车。搜索完成后会回到普通模式。',
      hint: '依次按 / x y z 然后按 Enter。',
      explanation:
        '当搜索不到匹配项时，Vim 会显示提示信息。这不会导致错误，你仍然处于普通模式中。',
      initialContent: [
        'Vim is fast',
        'vim is modal',
        'I love Vim',
        'vim is powerful',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '搜索不存在的文本' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '搜索完毕，没有找到 "xyz"，但编辑器状态正常。',
    },
    {
      id: 'lesson-08-step-7',
      instruction:
        '最终任务：将剩余行中所有的 "vim" 替换为 "Vim"。分别在第二行和第四行执行 :s/vim/Vim/ 命令。',
      hint: '先移到第二行执行 :s/vim/Vim/，再移到第四行执行同样的命令。',
      explanation:
        '在实际使用中，你可以用 :%s/vim/Vim/g 一次替换全文。但逐行替换能帮助你更好地理解替换命令的工作方式。',
      initialContent: [
        'Vim is fast',
        'vim is modal',
        'I love Vim',
        'vim is powerful',
      ],
      initialCursor: { line: 1, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '替换所有剩余的 vim' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'Vim is fast',
            'Vim is modal',
            'I love Vim',
            'Vim is powerful',
          ],
        },
      },
      successMessage:
        '恭喜你！所有的 "vim" 都已替换为 "Vim"。你已掌握搜索和替换的基本用法！',
    },
  ],
};
