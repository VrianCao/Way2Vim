import type { LessonDefinition } from '../../types/lesson';

export const lesson09: LessonDefinition = {
  id: 'lesson-09',
  title: '可视模式（v, V）',
  description: '学习使用可视模式选择文本，并对选区执行操作，如删除、复制和修改。',
  difficulty: 3,
  estimatedMinutes: 8,
  objectives: [
    '掌握字符可视模式（v）的进入与退出',
    '学会在可视模式下扩展选区',
    '掌握行可视模式（V）的使用',
    '学会对选区执行删除（d）、复制（y）、粘贴（p）和修改（c）操作',
  ],
  prerequisites: ['lesson-08'],
  steps: [
    {
      id: 'lesson-09-step-01',
      instruction: '按 `v` 进入字符可视模式。注意左下角的模式指示器会变为 VISUAL。',
      hint: '直接按小写字母 v 即可进入字符可视模式。',
      explanation:
        '可视模式允许你先选择文本区域，再对其执行操作。按 v 进入字符可视模式后，移动光标即可扩展选区。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'ENTER_MODE', description: '进入可视模式' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'VISUAL' },
      },
      successMessage: '你已进入可视模式！现在可以移动光标来选择文本。',
    },
    {
      id: 'lesson-09-step-02',
      instruction:
        '在可视模式下，用 `l` 或 `w` 扩展选区，然后按 `d` 删除选中的文本。',
      hint: '先按 v 进入可视模式，然后按 w 选择一个单词，最后按 d 删除。',
      explanation:
        '在可视模式下，所有移动命令（如 l、w、e 等）都会扩展或缩小选区。选好文本后，按 d 删除选区内容。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '进入可视模式' },
        { type: 'MOVE_CURSOR', description: '扩展选区' },
        { type: 'EDIT_TEXT', description: '删除选区' },
      ],
      validation: {
        type: 'STATE_OR_COMMAND_SET',
        targetState: { lines: ['vim world', 'line two content', 'line three content'] },
        acceptedCommands: ['d'],
      },
      successMessage: '太棒了！你成功用可视模式选择并删除了文本。',
    },
    {
      id: 'lesson-09-step-03',
      instruction:
        '先按 `u` 撤销刚才的删除，然后按 `V`（大写）进入行可视模式。',
      hint: '先按 u 撤销，再按 Shift+v 进入行可视模式。行可视模式会选中整行。',
      explanation:
        '行可视模式（V）与字符可视模式不同，它会自动选中整行。上下移动光标时，会以行为单位扩展选区。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '撤销操作' },
        { type: 'ENTER_MODE', description: '进入行可视模式' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'VISUAL' },
      },
      successMessage: '你已进入行可视模式！注意整行都被高亮选中了。',
    },
    {
      id: 'lesson-09-step-04',
      instruction:
        '在行可视模式下，按 `y` 复制（yank）当前选中的行。复制后会自动返回普通模式。',
      hint: '直接按 y 即可复制选中的行。',
      explanation:
        'y（yank）是 Vim 中的复制命令。在可视模式下按 y，会复制选区内容到寄存器，同时自动退出可视模式回到普通模式。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'VISUAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '复制选区' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '复制成功！文本已保存到寄存器中，可以用 p 粘贴。',
    },
    {
      id: 'lesson-09-step-05',
      instruction:
        '按 `p` 粘贴刚才复制的行。粘贴后文档应该会多出一行。',
      hint: '在普通模式下直接按 p 即可在光标下方粘贴。',
      explanation:
        'p（paste/put）会将寄存器中的内容粘贴出来。如果复制的是整行（行可视模式下复制），粘贴时会在当前行下方插入新行。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '粘贴文本' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            'hello vim world',
            'hello vim world',
            'line two content',
            'line three content',
          ],
        },
      },
      successMessage: '粘贴成功！你可以看到新的一行已经被插入。',
    },
    {
      id: 'lesson-09-step-06',
      instruction:
        '按 `v` 进入可视模式，用 `w` 扩展选区，然后按 `c` 修改选中的文本。注意 c 会删除选区并进入插入模式。',
      hint: '依次按 v、w、c。c 会删除选区内容并切换到插入模式，让你输入新文本。',
      explanation:
        'c（change）是"修改"命令。在可视模式下按 c，会删除选中的文本并立即进入插入模式，让你输入新内容来替换。这比先删除再插入更高效。',
      initialContent: ['hello vim world', 'line two content', 'line three content'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'ENTER_MODE', description: '进入可视模式' },
        { type: 'MOVE_CURSOR', description: '扩展选区' },
        { type: 'EDIT_TEXT', description: '修改选区' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'INSERT' },
      },
      successMessage:
        '你已掌握可视模式的修改操作！c 命令在可视模式下非常实用。',
    },
  ],
};
