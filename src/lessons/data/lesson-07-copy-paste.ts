import type { LessonDefinition } from '../../types/lesson';

export const lesson07: LessonDefinition = {
  id: 'lesson-07',
  title: '复制粘贴（yy, yw, p, P）',
  description:
    '学习使用 yy 复制整行、yw 复制单词，以及使用 p 和 P 粘贴到不同位置。',
  difficulty: 2,
  estimatedMinutes: 8,
  objectives: [
    '学会使用 yy 复制整行',
    '学会使用 p 在光标后粘贴',
    '学会使用 P 在光标前粘贴',
    '学会使用 yw 复制一个单词',
    '能综合运用复制粘贴来重排文本',
  ],
  prerequisites: ['lesson-06'],
  steps: [
    {
      id: 'lesson-07-step-1',
      instruction:
        '光标在第一行。按 yy 复制当前整行。复制不会改变内容或模式。',
      hint: '按两次 y（即 yy）来复制当前行。屏幕不会有明显变化，但内容已被复制到寄存器中。',
      explanation:
        'yy 会复制（yank）光标所在的整行到寄存器中。y 代表 yank（拉取），是 Vim 中"复制"的术语。复制后光标和文本都不会变化。',
      initialContent: ['第一行：苹果', '第二行：香蕉', '第三行：葡萄'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '使用 yy 复制整行' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '第一行已复制到寄存器中！虽然看不到变化，但内容已准备好粘贴。',
    },
    {
      id: 'lesson-07-step-2',
      instruction:
        '按 p 将刚才复制的行粘贴到当前行的下方。',
      hint: '按小写 p 会在当前行下方插入复制的内容。',
      explanation:
        'p（小写）会在当前行的下方粘贴整行内容。对于行级复制（yy），p 总是在下方新增一行。',
      initialContent: ['第一行：苹果', '第二行：香蕉', '第三行：葡萄'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '使用 p 粘贴到下方' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            '第一行：苹果',
            '第一行：苹果',
            '第二行：香蕉',
            '第三行：葡萄',
          ],
        },
      },
      successMessage: '粘贴成功！复制的行已出现在第一行下方。',
    },
    {
      id: 'lesson-07-step-3',
      instruction:
        '将光标移到第一行（按 gg），然后按大写 P 将内容粘贴到当前行的上方。',
      hint: '先按 gg 回到第一行，然后按大写 P（Shift+p）在上方粘贴。',
      explanation:
        'P（大写）会在当前行的上方粘贴内容。p 和 P 的区别就是粘贴方向：p 在下方，P 在上方。',
      initialContent: [
        '第一行：苹果',
        '第一行：苹果',
        '第二行：香蕉',
        '第三行：葡萄',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '使用 P 粘贴到上方' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: [
            '第一行：苹果',
            '第一行：苹果',
            '第一行：苹果',
            '第二行：香蕉',
            '第三行：葡萄',
          ],
        },
      },
      successMessage: '大写 P 在上方粘贴成功！现在你会区分 p 和 P 了。',
    },
    {
      id: 'lesson-07-step-4',
      instruction:
        '光标在 "apple" 的开头。按 yw 复制一个单词。复制后模式仍然是普通模式。',
      hint: '按 y 然后按 w，即 yw，复制从光标到下一个单词开头之间的内容。',
      explanation:
        'yw 复制从光标位置到下一个单词开头之前的内容。y 是复制操作符，w 是"到下一个单词"的动作。',
      initialContent: ['apple banana cherry'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EXECUTE_COMMAND', description: '使用 yw 复制单词' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: { mode: 'NORMAL' },
      },
      successMessage: '单词 "apple " 已复制！yw 复制会包含单词后的空格。',
    },
    {
      id: 'lesson-07-step-5',
      instruction:
        '将光标移到行尾（按 $），然后按 p 将复制的单词粘贴到光标后面。',
      hint: '先按 $ 移到行尾，然后按 p 在光标后粘贴。',
      explanation:
        '对于字符级复制（如 yw），p 会在光标位置之后插入文本，而不是新增一行。',
      initialContent: ['apple banana cherry'],
      initialCursor: { line: 0, col: 18 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '粘贴单词到光标后' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['apple banana cherryapple '],
        },
      },
      successMessage: '单词粘贴成功！字符级粘贴会直接插入到文本中。',
    },
    {
      id: 'lesson-07-step-6',
      instruction:
        '最终任务：将三行内容重新排列。先用 dd 剪切第三行，再移到第一行用 P 粘贴到上方，使顺序变为：葡萄、苹果、香蕉。',
      hint: '先按 2j 到第三行，dd 剪切，然后按 gg 到第一行，按 P 粘贴到上方。',
      explanation:
        'dd 不仅删除行，还会把内容保存到寄存器中，相当于"剪切"。配合 p/P 使用，就可以实现行的移动和重排。',
      initialContent: ['苹果', '香蕉', '葡萄'],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [
        { type: 'EDIT_TEXT', description: '重排行顺序' },
      ],
      validation: {
        type: 'STATE_MATCH',
        targetState: {
          lines: ['葡萄', '苹果', '香蕉'],
        },
      },
      successMessage:
        '太棒了！你已掌握了复制粘贴的所有基本操作。dd + p 实现剪切粘贴，yy + p 实现复制粘贴！',
    },
  ],
};
