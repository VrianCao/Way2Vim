import type { LessonDefinition } from '../../types/lesson';

export const lesson10: LessonDefinition = {
  id: 'lesson-10',
  title: '高级移动（w, b, e, 0, $, gg, G, f, t）',
  description:
    '掌握 Vim 中各种高效的光标移动命令，包括按单词移动、行首行尾跳转、文件首尾跳转以及字符查找。',
  difficulty: 3,
  estimatedMinutes: 12,
  objectives: [
    '掌握单词级移动：w（下一个词首）、b（上一个词首）、e（词尾）',
    '掌握行内跳转：0（行首）、$（行尾）',
    '掌握文件级跳转：gg（文件首行）、G（文件末行）',
    '掌握字符查找：f（find 跳到字符）、t（till 跳到字符前）',
  ],
  prerequisites: ['lesson-09'],
  steps: [
    {
      id: 'lesson-10-step-01',
      instruction:
        '按 `w` 向前移动一个单词。光标会跳到下一个单词的开头。',
      hint: '直接按 w，光标会从 "The" 的 T 跳到 "quick" 的 q。',
      explanation:
        'w（word）将光标移到下一个单词的开头。Vim 中"单词"由字母、数字和下划线组成，空格和标点符号是分隔符。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '向前移动一个单词' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 4 } },
      },
      successMessage: '光标已移动到 "quick" 的开头！w 是最常用的移动命令之一。',
    },
    {
      id: 'lesson-10-step-02',
      instruction:
        '按 `b` 向后移动一个单词。光标会跳到前一个单词的开头。',
      hint: '直接按 b，光标会从当前位置向左跳到上一个单词开头。',
      explanation:
        'b（back）与 w 相反，将光标移到前一个单词的开头。w 和 b 是一对互补的移动命令。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 10 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '向后移动一个单词' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 4 } },
      },
      successMessage: '光标已回到 "quick" 的开头！b 让你可以快速回退。',
    },
    {
      id: 'lesson-10-step-03',
      instruction:
        '按 `e` 移动到当前单词的末尾。光标会停在单词的最后一个字符上。',
      hint: '直接按 e，光标会移动到 "The" 的最后一个字母 e 上。',
      explanation:
        'e（end）将光标移到当前单词（或下一个单词）的最后一个字符。与 w 不同的是，e 停在词尾而非词首。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '移动到词尾' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 2 } },
      },
      successMessage: '光标已到达 "The" 的末尾！e 在很多组合命令中非常有用。',
    },
    {
      id: 'lesson-10-step-04',
      instruction: '按 `0`（数字零）跳到当前行的第一个字符。',
      hint: '按键盘上的数字 0，光标会立即跳到行首。',
      explanation:
        '0 将光标移到当前行的第一列（第 0 列）。这是最快的回到行首的方法。还有 ^ 可以跳到行首的第一个非空白字符。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 1, col: 10 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到行首' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 0 } },
      },
      successMessage: '光标已跳到行首！0 是快速回到行开头的利器。',
    },
    {
      id: 'lesson-10-step-05',
      instruction: '按 `$` 跳到当前行的最后一个字符。',
      hint: '按 Shift+4（即 $），光标会跳到行尾的最后一个字符。',
      explanation:
        '$ 将光标移到当前行的最后一个字符。0 和 $ 是一对，分别代表行首和行尾。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到行尾' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 24 } },
      },
      successMessage: '光标已到达行尾！$ 让你瞬间到达一行的末端。',
    },
    {
      id: 'lesson-10-step-06',
      instruction: '按 `gg` 跳到文件的第一行。',
      hint: '快速连按两次 g，光标会跳到文件的最开头。',
      explanation:
        'gg 将光标移到文件的第一行。这在浏览长文件时非常有用，可以快速回到文件开头。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 3, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到文件首行' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 0 } },
      },
      successMessage: '你已跳到文件的第一行！gg 是最快到达文件开头的方法。',
    },
    {
      id: 'lesson-10-step-07',
      instruction: '按 `G`（大写）跳到文件的最后一行。',
      hint: '按 Shift+g，光标会跳到文件的最后一行。',
      explanation:
        'G 将光标移到文件的最后一行。gg 和 G 是一对，分别代表文件首行和文件末行。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到文件末行' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 4 } },
      },
      successMessage: '你已跳到文件的最后一行！G 让你瞬间到达文件底部。',
    },
    {
      id: 'lesson-10-step-08',
      instruction:
        '按 `fo` 查找当前行中下一个字母 o，光标会直接跳到该字符上。',
      hint: '先按 f，再按 o。光标会跳到第一行中第一个出现的字母 o。',
      explanation:
        'f{char}（find）在当前行内向右查找指定字符，并将光标移到该字符上。这是行内精准定位的利器。按 ; 可以重复查找下一个。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '查找字符 o' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 12 } },
      },
      successMessage:
        '光标已跳到 "brown" 中的字母 o！f 是行内快速定位的绝佳命令。',
    },
    {
      id: 'lesson-10-step-09',
      instruction:
        '按 `to` 移动到字母 o 的前一个字符。与 f 不同，t 会停在目标字符之前。',
      hint: '先按 t，再按 o。光标会停在字母 o 之前的那个字符上。',
      explanation:
        't{char}（till）与 f 类似，但光标停在目标字符的前一个位置。t 在与操作符（如 d、c）组合时特别有用，例如 dt) 可以删除到右括号之前的所有内容。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '移动到字符 o 之前' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { col: 11 } },
      },
      successMessage:
        '光标停在了 o 之前！t 比 f 少走一步，在组合命令中很常用。',
    },
    {
      id: 'lesson-10-step-10',
      instruction:
        '综合挑战：使用 `G` 跳到文件末尾。试着记住今天学到的所有移动命令！',
      hint: '按 Shift+g 即可跳到文件的最后一行。',
      explanation:
        '恭喜你学完了所有高级移动命令！总结一下：w/b/e 按单词移动，0/$ 在行内跳转，gg/G 在文件间跳转，f/t 精准查找字符。这些命令可以自由组合，大幅提升编辑效率。',
      initialContent: [
        'The quick brown fox jumps',
        'over the lazy dog today',
        'alpha beta gamma delta',
        'epsilon zeta eta theta',
        'final line here end',
      ],
      initialCursor: { line: 0, col: 0 },
      initialMode: 'NORMAL',
      expectedActions: [{ type: 'MOVE_CURSOR', description: '跳到文件末尾' }],
      validation: {
        type: 'STATE_MATCH',
        targetState: { cursor: { line: 4, col: 0 } },
      },
      successMessage:
        '太棒了！你已经掌握了所有高级移动命令，编辑效率将大幅提升！',
    },
  ],
};
