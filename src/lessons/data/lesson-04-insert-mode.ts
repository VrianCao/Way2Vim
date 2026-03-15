import type { LessonDefinition } from '../../types/lesson';

export const lesson04: LessonDefinition = {
  id: 'lesson-04',
  title: '插入模式（i, a, o, I, A, O）',
  description:
    '学习进入插入模式的六种方式。每种方式会将光标放在不同的位置，让你更高效地编辑文本。',
  difficulty: 2,
  estimatedMinutes: 8,
  objectives: [
    '掌握 i 和 a 的区别（在光标前/后插入）',
    '掌握 I 和 A（在行首/行尾插入）',
    '掌握 o 和 O（在下方/上方新建行）',
  ],
  prerequisites: ['lesson-03'],
  steps: [
    // Step 1 — i insert before cursor
    {
      id: 'step-1',
      instruction:
        '你已经学过 i 键可以进入插入模式。i 的含义是 insert（插入），它会在光标当前位置之前开始插入。请按 i 进入插入模式。',
      hint: '按 i 键即可进入插入模式。',
      explanation:
        'i 是最常用的进入插入模式的方式。光标会停留在当前位置，你输入的内容会插入到光标前面。',
      initialContent: [
        'Hello World',
        '请按 i 进入插入模式',
      ],
      initialCursor: { line: 0, col: 6 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 i 进入插入模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '很好！i 会在光标前插入文本。',
    },

    // Step 2 — a append after cursor
    {
      id: 'step-2',
      instruction:
        'a 键的含义是 append（追加），它会在光标当前位置之后开始插入。光标现在在字母 "W" 上，请按 a 进入插入模式，观察光标位置的变化。',
      hint: '按 a 键，注意光标会向右移动一格。',
      explanation:
        'a 和 i 的区别：i 在光标前插入，a 在光标后插入。当你想在某个字符后面添加内容时，用 a 比 i 更方便。',
      initialContent: [
        'Hello World',
        '请按 a 在光标后插入',
      ],
      initialCursor: { line: 0, col: 6 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 a 进入插入模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          mode: 'INSERT',
          cursor: { col: 7 },
        },
      },
      successMessage: '注意到了吗？a 会让光标向右移动一格，然后开始插入。',
    },

    // Step 3 — I insert at line start
    {
      id: 'step-3',
      instruction:
        'I（大写的 i）会在当前行的开头进入插入模式。无论光标在哪里，按 I 都会跳到行首。请按 I 试试。',
      hint: '按 Shift + i 输入大写的 I。',
      explanation:
        'I 是 i 的增强版。当你想在行首添加内容（比如注释符号）时，I 比先按 0 再按 i 要快得多。',
      initialContent: [
        '    这是一行缩进的文字',
        '请按 I 跳到行首',
      ],
      initialCursor: { line: 0, col: 10 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 I 在行首插入' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '很好！I 会直接跳到行首并进入插入模式。',
    },

    // Step 4 — A append at line end
    {
      id: 'step-4',
      instruction:
        'A（大写的 a）会在当前行的末尾进入插入模式。无论光标在哪里，按 A 都会跳到行尾。请按 A 试试。',
      hint: '按 Shift + a 输入大写的 A。',
      explanation:
        'A 是 a 的增强版。当你想在行尾添加内容（比如分号、逗号）时，A 比先按 $ 再按 a 要快得多。',
      initialContent: [
        'console.log("Hello")',
        '请按 A 跳到行尾',
      ],
      initialCursor: { line: 0, col: 5 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '按 A 在行尾插入' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '完美！A 会直接跳到行尾并进入插入模式。',
    },

    // Step 5 — o open line below
    {
      id: 'step-5',
      instruction:
        'o（小写）会在当前行下方新建一行，并进入插入模式。这是添加新代码行的最快方式。请按 o 试试。',
      hint: '按 o 键，会在下方出现新的一行。',
      explanation:
        'o 相当于：移到行尾 → 按回车 → 进入插入模式。但只需要按一个键！',
      initialContent: [
        'function hello() {',
        '}',
      ],
      initialCursor: { line: 0, col: 10 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '按 o 在下方新建行' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '太好了！o 会在下方新建一行并进入插入模式。',
    },

    // Step 6 — O open line above
    {
      id: 'step-6',
      instruction:
        'O（大写的 o）会在当前行上方新建一行，并进入插入模式。请按 O 试试。',
      hint: '按 Shift + o 输入大写的 O。',
      explanation:
        'O 和 o 的区别：o 在下方新建行，O 在上方新建行。记忆方法：O 在上，o 在下。',
      initialContent: [
        'function hello() {',
        '  console.log("world");',
        '}',
      ],
      initialCursor: { line: 1, col: 5 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '按 O 在上方新建行' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage: '做得好！O 会在上方新建一行并进入插入模式。',
    },

    // Step 7 — Escape back to normal
    {
      id: 'step-7',
      instruction:
        '现在你已经学会了 6 种进入插入模式的方式！让我们回顾一下：i/a（前/后），I/A（行首/行尾），o/O（下方/上方新行）。请按 Esc 返回普通模式完成本课。',
      hint: '按 Esc 键返回普通模式。',
      explanation:
        '小贴士：在实际使用中，i、a、o 是最常用的三个。I、A、O 在特定场景下能节省很多按键。',
      initialContent: [
        '插入模式总结：',
        '',
        '  i — 在光标前插入',
        '  a — 在光标后插入',
        '  I — 在行首插入',
        '  A — 在行尾插入',
        '  o — 在下方新建行',
        '  O — 在上方新建行',
        '',
        '按 Esc 完成本课',
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
        '恭喜你完成了第四课！你现在可以灵活地在任何位置进入插入模式了。',
    },
  ],
};
