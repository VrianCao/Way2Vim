import type { LessonDefinition } from '../../types/lesson';

export const lesson03: LessonDefinition = {
  id: 'lesson-03',
  title: '普通模式 - 移动光标（h, j, k, l）',
  description:
    '学习 Vim 最基本的光标移动方式。h j k l 四个键可以让你的双手保持在键盘主区，无需使用方向键。',
  difficulty: 1,
  estimatedMinutes: 10,
  objectives: [
    '掌握 h j k l 四个基本移动键',
    '理解为什么 Vim 使用这些键而不是方向键',
    '能够流畅地在文本中导航',
  ],
  prerequisites: ['lesson-02'],
  steps: [
    // Step 1 — j to move down
    {
      id: 'step-1',
      instruction:
        '在 Vim 中，j 键用于向下移动光标。请按 j 键将光标向下移动至少一行。',
      hint: '按一次 j 键，光标会向下移动一行。',
      explanation:
        'j 键的位置在键盘主区，你的右手食指自然放置的位置。这样你就不需要移动手去按方向键了。',
      initialContent: [
        '这是第一行',
        '这是第二行',
        '这是第三行',
        '这是第四行',
        '这是第五行',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '按 j 向下移动' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 1 },
          mode: 'NORMAL',
        },
      },
      successMessage: '很好！j 键可以向下移动光标。',
    },

    // Step 2 — k to move up
    {
      id: 'step-2',
      instruction:
        'k 键用于向上移动光标。你的光标现在在第 4 行，请按 k 键向上移动至少一行。',
      hint: '按一次 k 键，光标会向上移动一行。',
      explanation:
        'k 在 j 的上方，所以 k 向上，j 向下。这个设计很符合直觉。',
      initialContent: [
        '这是第一行',
        '这是第二行',
        '这是第三行',
        '这是第四行',
        '这是第五行',
      ],
      initialCursor: { line: 3, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '按 k 向上移动' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 2 },
          mode: 'NORMAL',
        },
      },
      successMessage: '做得好！k 键可以向上移动光标。',
    },

    // Step 3 — l to move right
    {
      id: 'step-3',
      instruction:
        'l 键（小写字母 L）用于向右移动光标。请按 l 键将光标向右移动至少一个字符。',
      hint: '按一次 l 键，光标会向右移动一个字符。',
      explanation:
        'l 在键盘的右侧，所以 l 向右移动。记忆方法：l = right（右）。',
      initialContent: [
        'abcdefghij',
        'klmnopqrst',
        'uvwxyz1234',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '按 l 向右移动' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { col: 1 },
          mode: 'NORMAL',
        },
      },
      successMessage: '太棒了！l 键可以向右移动光标。',
    },

    // Step 4 — h to move left
    {
      id: 'step-4',
      instruction:
        'h 键用于向左移动光标。你的光标现在在第 6 列，请按 h 键向左移动至少一个字符。',
      hint: '按一次 h 键，光标会向左移动一个字符。',
      explanation:
        'h 在键盘的左侧，所以 h 向左移动。现在你已经学会了全部四个方向：h 左，j 下，k 上，l 右。',
      initialContent: [
        'abcdefghij',
        'klmnopqrst',
        'uvwxyz1234',
      ],
      initialCursor: { line: 0, col: 5 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '按 h 向左移动' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { col: 4 },
          mode: 'NORMAL',
        },
      },
      successMessage: '完美！h 键可以向左移动光标。',
    },

    // Step 5 — Move to target position
    {
      id: 'step-5',
      instruction:
        '现在让我们综合练习。请使用 h j k l 键将光标移动到第 3 行第 4 列的位置（字符 "x" 上）。',
      hint: '先用 j 向下移动到第 3 行，再用 l 向右移动到第 4 列。',
      explanation:
        '你可以连续按同一个键来移动多次。例如按 3 次 j 就能向下移动 3 行。',
      initialContent: [
        'abcdefg',
        'hijklmn',
        'opqrstu',
        'vwxyz12',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '移动到目标位置' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 2, col: 3 },
          mode: 'NORMAL',
        },
      },
      successMessage: '干得漂亮！你已经能够精确控制光标位置了。',
    },

    // Step 6 — Navigate to first star
    {
      id: 'step-6',
      instruction:
        '让我们来玩一个小游戏！请使用 h j k l 移动光标到第一个星星 ★ 的位置。',
      hint: '观察星星的位置，使用 j 向下，l 向右来到达。',
      explanation:
        '在实际使用中，你会发现 hjkl 比方向键快得多，因为你的手指不需要离开主键盘区。',
      initialContent: [
        '起点 . . . .',
        '# # . # .',
        '. . . # ★',
        '. # # . .',
        '★ . . . 终点',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '导航到第一个星星' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 2, col: 8 },
          mode: 'NORMAL',
        },
      },
      successMessage: '找到了！继续前往下一个星星。',
    },

    // Step 7 — Navigate to second star
    {
      id: 'step-7',
      instruction:
        '很好！现在请移动到第二个星星 ★ 的位置（在左下角）。',
      hint: '使用 j 向下移动，然后用 h 向左移动。',
      explanation:
        '随着练习，你会形成肌肉记忆，移动光标将变得像呼吸一样自然。',
      initialContent: [
        '起点 . . . .',
        '# # . # .',
        '. . . # ★',
        '. # # . .',
        '★ . . . 终点',
      ],
      initialCursor: { line: 2, col: 8 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '导航到第二个星星' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 4, col: 0 },
          mode: 'NORMAL',
        },
      },
      successMessage: '太棒了！你已经掌握了基本的导航技巧。',
    },

    // Step 8 — Navigate to end point
    {
      id: 'step-8',
      instruction:
        '最后一步！请移动光标到"终点"这个词的位置（第 5 行第 8 列）。',
      hint: '从当前位置使用 l 向右移动到"终点"。',
      explanation:
        '恭喜！你已经完成了 hjkl 的基础训练。在后续课程中，你会学到更多高效的移动方式，但 hjkl 永远是基础。',
      initialContent: [
        '起点 . . . .',
        '# # . # .',
        '. . . # ★',
        '. # # . .',
        '★ . . . 终点',
      ],
      initialCursor: { line: 4, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '移动到终点' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          cursor: { line: 4, col: 8 },
          mode: 'NORMAL',
        },
      },
      successMessage:
        '恭喜你完成了第三课！你已经掌握了 Vim 最基本的移动方式。记住：h 左，j 下，k 上，l 右。',
    },
  ],
};
