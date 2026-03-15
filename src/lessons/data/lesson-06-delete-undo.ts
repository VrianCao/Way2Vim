import type { LessonDefinition } from '../../types/lesson';

export const lesson06: LessonDefinition = {
  id: 'lesson-06',
  title: '删除和撤销（x, dd, u, Ctrl-r）',
  description:
    '学习使用 x 删除字符、dd 删除整行，以及使用 u 撤销和 Ctrl-r 重做操作。',
  difficulty: 2,
  estimatedMinutes: 10,
  objectives: [
    '学会使用 x 删除光标处的字符',
    '学会使用 dd 删除整行',
    '学会使用 u 撤销操作',
    '学会使用 Ctrl-r 重做操作',
    '理解撤销和重做的关系',
  ],
  prerequisites: ['lesson-05'],
  steps: [
    {
      id: 'lesson-06-step-1',
      instruction:
        '光标在第一行的 "a" 上。按 x 删除光标处的字符 "a"。',
      hint: '按一次 x 即可删除光标所在位置的字符。',
      explanation:
        'x 命令会删除光标所在位置的字符，相当于键盘上的 Delete 键。删除后，后面的字符会向前移动。',
      initialContent: ['abcdefgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '删除字符 a' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['bcdefgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '字符 "a" 已被删除！x 是最简单的删除命令。',
    },
    {
      id: 'lesson-06-step-2',
      instruction:
        '继续按 x 删除字符，直到第一行变成 "efgh"。你需要再删除 3 次。',
      hint: '连续按 x 三次，分别删除 "b"、"c"、"d"。',
      explanation:
        '你可以多次按 x 来删除多个字符。也可以用数字前缀如 3x 一次删除 3 个字符。',
      initialContent: ['bcdefgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '连续删除多个字符' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '很好！你也可以用 3x 一次性删除 3 个字符，效率更高。',
    },
    {
      id: 'lesson-06-step-3',
      instruction:
        '将光标移到第二行（"删除这一行"），然后按 dd 删除整行。',
      hint: '先按 j 移动到下一行，然后按两次 d（即 dd）来删除整行。',
      explanation:
        'dd 命令会删除光标所在的整行。被删除的行会保存到寄存器中，之后可以用 p 粘贴。',
      initialContent: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 1, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '使用 dd 删除整行' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['efgh', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '"删除这一行" 已被删除！dd 是删除整行的快捷方式。',
    },
    {
      id: 'lesson-06-step-4',
      instruction: '按 u 撤销刚才的删除操作，恢复被删除的行。',
      hint: '按一次 u 即可撤销上一步操作。',
      explanation:
        'u 是 Vim 中的撤销命令（undo）。它会撤销最近的一次操作，可以多次按 u 来撤销更早的操作。',
      initialContent: ['efgh', '保留这一行', '这行也保留'],
      initialCursor: { line: 1, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '撤销删除操作' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '撤销成功！"删除这一行" 已恢复。u 是非常重要的命令。',
    },
    {
      id: 'lesson-06-step-5',
      instruction: '再按一次 u，继续撤销，恢复之前删除的字符。',
      hint: '继续按 u，可以一步步回到更早的状态。',
      explanation:
        'Vim 的撤销是多级的，你可以连续按 u 回到很早之前的状态。撤销的历史非常深，不用担心丢失操作。',
      initialContent: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '继续撤销' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['bcdefgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '连续撤销成功！第一行已恢复到更早的状态。',
    },
    {
      id: 'lesson-06-step-6',
      instruction: '按 Ctrl-r 重做刚才被撤销的操作。',
      hint: '同时按住 Ctrl 键和 r 键。',
      explanation:
        'Ctrl-r 是重做命令（redo），它会恢复最近一次被 u 撤销的操作。u 和 Ctrl-r 可以在撤销历史中自由前进和后退。',
      initialContent: ['bcdefgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '重做操作' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage: '重做成功！Ctrl-r 恢复了被撤销的操作。',
    },
    {
      id: 'lesson-06-step-7',
      instruction:
        '综合练习：先用 dd 删除第一行 "efgh"，然后按 u 撤销，确认恢复。',
      hint: '先按 dd 删除当前行，再按 u 撤销。',
      explanation:
        '熟练运用删除和撤销的组合，可以让你在编辑时无所畏惧——随时可以撤销错误的操作。',
      initialContent: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '删除后撤销' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
          mode: 'NORMAL',
        },
      },
      successMessage: '做得好！删除后立即撤销，内容完好如初。',
    },
    {
      id: 'lesson-06-step-8',
      instruction:
        '最终挑战：通过多次按 u 将内容恢复到最初状态。第一行应该恢复为 "abcdefgh"。',
      hint: '连续按 u 直到第一行变回 "abcdefgh"。',
      explanation:
        'Vim 的撤销历史可以让你回到文件最初被打开时的状态。善用撤销功能是安全编辑的关键。',
      initialContent: ['efgh', '删除这一行', '保留这一行', '这行也保留'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '恢复到初始状态' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['abcdefgh', '删除这一行', '保留这一行', '这行也保留'],
        },
      },
      successMessage:
        '太棒了！你已完全掌握了删除（x、dd）、撤销（u）和重做（Ctrl-r）！',
    },
  ],
};
