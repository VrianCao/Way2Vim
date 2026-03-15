import type { LessonDefinition } from '../../types/lesson';

export const lesson11: LessonDefinition = {
  id: 'lesson-11',
  title: '组合命令（数字+动作，操作符+动作）',
  description:
    '学习 Vim 最强大的特性之一——命令组合。通过"数字+动作"和"操作符+动作"的组合，实现高效文本编辑。',
  difficulty: 4,
  estimatedMinutes: 12,
  objectives: [
    '掌握数字前缀与移动命令的组合（如 3j、2w）',
    '掌握 dd（删除整行）和 dw（删除单词）',
    '掌握 d$（删除到行尾）和 cw（修改单词）',
    '掌握带数字的操作符（如 2dd 删除两行）',
    '理解 Vim 的"操作符 + 动作"语法模型',
  ],
  prerequisites: ['lesson-10'],
  steps: [
    {
      id: 'lesson-11-step-01',
      instruction:
        '按 `3j` 向下移动 3 行。数字前缀可以让任何移动命令重复执行指定次数。',
      hint: '先按 3，再按 j。光标会从第 1 行跳到第 4 行。',
      explanation:
        '在 Vim 中，几乎所有命令都可以加数字前缀。3j 表示"向下移动 3 行"，5w 表示"向前移动 5 个单词"。这是 Vim 高效编辑的基础。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '向下移动 3 行' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 3 } },
      },
      successMessage: '光标已跳到第 4 行！数字前缀让移动更精准高效。',
    },
    {
      id: 'lesson-11-step-02',
      instruction:
        '按 `2w` 向前移动 2 个单词。光标会跳过两个单词到达第三个单词的开头。',
      hint: '先按 2，再按 w。光标会从 "one" 跳过 "two"，到达 "three" 的开头。',
      explanation:
        '2w 表示执行两次 w 命令。从 "one" 开始，第一次 w 到 "two"，第二次 w 到 "three"。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '向前移动 2 个单词' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 8 } },
      },
      successMessage: '光标已到达 "three" 的开头！数字 + w 的组合非常实用。',
    },
    {
      id: 'lesson-11-step-03',
      instruction:
        '按 `dd` 删除当前整行。dd 是 Vim 中最常用的删除命令之一。',
      hint: '快速连按两次 d 即可删除光标所在的整行。',
      explanation:
        'dd 是"操作符重复"的特殊形式——当一个操作符按两次时，它会作用于整行。d 是删除操作符，dd 就是删除整行。类似的还有 yy（复制整行）、cc（修改整行）。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 2, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'EDIT_TEXT', description: '删除整行' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'one two three four five six seven',
            'alpha beta gamma delta epsilon',
            'line B',
            'line C',
            'line D',
            'line E',
          ],
        },
      },
      successMessage: '"line A" 已被删除！dd 是日常编辑中使用频率最高的命令之一。',
    },
    {
      id: 'lesson-11-step-04',
      instruction:
        '按 `dw` 删除光标所在的单词。操作符 d 加上移动命令 w，会删除从光标到下一个单词开头之间的内容。',
      hint: '先按 d，再按 w。光标位置的第一个单词会被删除。',
      explanation:
        'Vim 的核心语法是"操作符 + 动作"。d 是删除操作符，w 是"到下一个词首"的动作，所以 dw = 删除到下一个词首 = 删除当前单词。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'EDIT_TEXT', description: '删除一个单词' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'two three four five six seven',
            'alpha beta gamma delta epsilon',
            'line A',
            'line B',
            'line C',
            'line D',
            'line E',
          ],
        },
      },
      successMessage: '单词 "one " 已被删除！dw 是删除单词的标准方法。',
    },
    {
      id: 'lesson-11-step-05',
      instruction:
        '按 `d$` 删除从光标位置到行尾的所有内容。$ 代表行尾，d$ 就是"删除到行尾"。',
      hint: '先按 d，再按 $（Shift+4）。光标之后的所有内容会被删除。',
      explanation:
        'd$ 中，d 是操作符，$ 是"到行尾"的动作。你也可以用大写 D 来达到同样效果——D 等价于 d$。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 8 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'EDIT_TEXT', description: '删除到行尾' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'one two ',
            'alpha beta gamma delta epsilon',
            'line A',
            'line B',
            'line C',
            'line D',
            'line E',
          ],
        },
      },
      successMessage: '从光标到行尾的内容已删除！d$ 和 D 都能快速清理行尾。',
    },
    {
      id: 'lesson-11-step-06',
      instruction:
        '按 `cw` 修改当前单词。cw 会删除单词并进入插入模式，让你输入新内容。',
      hint: '先按 c，再按 w。单词会被删除，同时进入插入模式。',
      explanation:
        'c（change）是修改操作符。cw = 删除当前单词并进入插入模式。c 的行为类似 d，但会在删除后自动进入插入模式。同理，cc 修改整行，c$ 或 C 修改到行尾。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '删除单词' },
        { type: 'ENTER_MODE', description: '进入插入模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage:
        '单词已删除并进入插入模式！cw 是快速替换单词的最佳方式。',
    },
    {
      id: 'lesson-11-step-07',
      instruction:
        '按 `Escape` 回到普通模式，然后按 `2dd` 一次删除 2 行。数字前缀同样适用于组合命令。',
      hint: '先按 Escape，然后依次按 2、d、d。两行内容会同时被删除。',
      explanation:
        '数字前缀可以和任何命令组合。2dd 表示"删除 2 行"，3dw 表示"删除 3 个单词"。掌握数字前缀后，你可以用最少的按键完成大量编辑。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 2, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'EDIT_TEXT', description: '删除 2 行' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'one two three four five six seven',
            'alpha beta gamma delta epsilon',
            'line C',
            'line D',
            'line E',
          ],
        },
      },
      successMessage: '两行已同时删除！数字 + dd 让批量删除变得轻而易举。',
    },
    {
      id: 'lesson-11-step-08',
      instruction:
        '综合练习：将光标移到第 3 行（使用 2j），然后用 `dd` 删除该行。完成后文件应该只剩 6 行。',
      hint: '先按 2j 向下移动到第 3 行，再按 dd 删除当前行。',
      explanation:
        'Vim 的强大之处在于命令的可组合性。任何移动命令都可以加数字前缀，任何操作符都可以与移动命令组合。这种"语法"让你只需记住少量基本命令，就能完成几乎所有编辑操作。',
      initialContent: [
        'one two three four five six seven',
        'alpha beta gamma delta epsilon',
        'line A',
        'line B',
        'line C',
        'line D',
        'line E',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'MOVE_CURSOR', description: '移动到目标行' },
        { type: 'EDIT_TEXT', description: '删除当前行' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'one two three four five six seven',
            'alpha beta gamma delta epsilon',
            'line B',
            'line C',
            'line D',
            'line E',
          ],
        },
      },
      successMessage:
        '恭喜你掌握了组合命令！记住：操作符 + 动作 = Vim 的核心语法。',
    },
  ],
};
