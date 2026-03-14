# Way2Vim 实施总规划（Definitive Plan）

> 文档定位：**唯一实施依据（Single Source of Truth）**
>
> 项目名称：Way2Vim  
> 项目类型：前端交互式教学网站（No Backend）  
> 目标用户：中文（简体）零基础 Vim 学习者  
> 部署平台：Vercel  
> 技术基线：Next.js 14+（App Router）+ TypeScript + Tailwind CSS 4 + Zustand + Framer Motion + Lucide React + Vitest

---

## 目录

1. [项目愿景与范围](#1-项目愿景与范围)
2. [产品目标与非目标](#2-产品目标与非目标)
3. [目标用户画像与学习路径](#3-目标用户画像与学习路径)
4. [技术选型与版本策略](#4-技术选型与版本策略)
5. [系统架构总览](#5-系统架构总览)
6. [目录结构与模块职责](#6-目录结构与模块职责)
7. [核心引擎设计（Vim Simulator Engine）](#7-核心引擎设计vim-simulator-engine)
8. [Editor UI 设计规范](#8-editor-ui-设计规范)
9. [Lesson 系统设计](#9-lesson-系统设计)
10. [Gamification 体系设计](#10-gamification-体系设计)
11. [12 课完整课程大纲（逐步可实现）](#11-12-课完整课程大纲逐步可实现)
12. [UI/UX 规范（视觉、布局、动效、响应式）](#12-uiux-规范视觉布局动效响应式)
13. [关键技术挑战与工程解决方案](#13-关键技术挑战与工程解决方案)
14. [实施阶段计划（Phase 0 - 8）](#14-实施阶段计划phase-0---8)
15. [支持的 Vim 命令清单（完整）](#15-支持的-vim-命令清单完整)
16. [测试策略与质量标准](#16-测试策略与质量标准)
17. [性能预算与监控指标](#17-性能预算与监控指标)
18. [可访问性（A11y）与国际化策略](#18-可访问性a11y与国际化策略)
19. [SEO、部署与发布流程](#19-seo部署与发布流程)
20. [风险清单、回退策略与里程碑验收](#20-风险清单回退策略与里程碑验收)
21. [附录：关键接口、数据结构与伪代码](#21-附录关键接口数据结构与伪代码)

---

## 1. 项目愿景与范围

### 1.1 项目愿景

Way2Vim 的核心愿景是：

- 通过「**浏览器内模拟 Vim 编辑器**」+「**可验证的交互式课程**」，帮助从未接触过 Vim 的中文用户建立可迁移、可长期使用的 Vim 思维。
- 让用户不仅“知道命令”，更能“在具体编辑任务中正确组合命令”。
- 提供低门槛、低挫败感、可持续激励的学习体验。

### 1.2 范围（In Scope）

- 纯前端 Web 应用（无后端）
- 基于 App Router 的页面结构与静态渲染（SSG）
- 交互式 Vim 模拟器（核心命令覆盖初学者完整路径）
- 12 课循序渐进课程体系（每课 5–10 步）
- 学习进度、勋章、连续学习天数（localStorage 持久化）
- Playground 自由练习页面
- Cheatsheet 速查页

### 1.3 非范围（Out of Scope）

- 多人协作/账号系统/云端同步
- 服务端存储与推荐系统
- 全量 Vim 兼容（插件生态、宏录制、复杂 Ex 指令）
- 移动端完整编辑体验（移动端以阅读模式为主）

---

## 2. 产品目标与非目标

### 2.1 量化目标（MVP + v1）

| 目标 | 指标 |
|---|---|
| 学习可完成性 | 80% 以上用户可在 2 次会话内完成 Lesson 1-4 |
| 引擎正确性 | Engine 单元测试覆盖率 >= 90% |
| 交互性能 | keystroke-to-render 延迟 < 16ms（主流桌面设备） |
| 页面性能 | Lighthouse Performance > 90 |
| 可访问性 | WCAG AA 颜色对比达标 |

### 2.2 体验目标

- 新手在 5 分钟内理解 Vim 的 modal editing 基础。
- 每一步骤都给出明确目标、即时反馈和可恢复提示。
- 允许多种正确路径（如 `dd` 与 `Vd` 都可以实现删除整行任务）。

### 2.3 非目标

- 不追求与真实 Vim 100% 行为一致。
- 不做“高阶玩家专属”复杂定制（例如录制宏、寄存器高级命名策略、文本对象全覆盖）。

---

## 3. 目标用户画像与学习路径

### 3.1 用户画像

1. **零基础开发者**：从 GUI 编辑器转向终端工具，第一次接触 modal editing。
2. **想提高效率的工程师**：知道 Vim 名字但不会用，想建立基础 muscle memory。
3. **中文学习者**：更习惯中文解释与中文提示，不希望被英文教程阻挡。

### 3.2 学习阻碍

- “不知道当前模式”导致乱输入。
- “退出 Vim 恐慌”（`:q`、`:q!`、`:wq` 混淆）。
- 命令组合记不住（`d` + `motion`、`count` 前缀）。

### 3.3 课程路径策略

- 先建立“模式意识”（Normal / Insert / Visual / Command）。
- 再引入“动作 + 操作符 + 计数”组合模式。
- 最后给“工作流建议 + 配置启蒙”形成可迁移闭环。

---

## 4. 技术选型与版本策略

### 4.1 核心技术栈

| 技术 | 版本策略 | 作用 | 选型理由 |
|---|---|---|---|
| Next.js | 14+ | 路由、SSG、页面框架 | App Router 成熟、生态稳定、Vercel 原生支持 |
| TypeScript | strict | 类型系统 | 降低复杂状态机与课程数据的维护风险 |
| Tailwind CSS | 4 | 样式系统 | Utility-first、主题管理方便、快速统一视觉 |
| Zustand | latest stable | 全局状态 + 持久化 | 轻量、无样板、适合课程进度和勋章状态 |
| Framer Motion | latest stable | 动画 | 声明式动画，适合步骤完成反馈和过渡 |
| Lucide React | latest stable | 图标 | 风格统一、tree-shaking 友好 |
| JetBrains Mono | latest | 编辑器字体 | 终端感强、可读性高 |
| Vitest | latest stable | 单元测试 | 与 TS/ESM 配合良好，执行速度快 |

### 4.2 版本与依赖管理原则

- 锁定主版本（major）稳定，允许小版本升级。
- 通过 `package-lock.json`/`pnpm-lock.yaml` 固定可重复安装。
- 升级策略：每两周一次依赖审查（安全 + 破坏性变更评估）。

### 4.3 为什么不使用后端

- 课程与引擎均可在客户端运行。
- 学习进度用 `localStorage` 即可满足 MVP。
- 减少开发复杂度，加快迭代。

---

## 5. 系统架构总览

### 5.1 架构图（ASCII）

```text
┌────────────────────────────────────────────────────────────────────┐
│                           Next.js App Router                      │
│  / (Landing)  /lessons  /lessons/[lessonId]  /playground  /cheatsheet │
└───────────────┬───────────────────────────────┬────────────────────┘
                │                               │
                ▼                               ▼
      ┌──────────────────────┐         ┌────────────────────────┐
      │   Lesson Components  │         │   Editor Components    │
      │ LessonPlayer         │         │ VimEditor / EditorLine │
      │ InstructionPanel     │         │ Cursor / StatusBar     │
      │ HintSystem ...       │         │                        │
      └──────────┬───────────┘         └───────────┬────────────┘
                 │                                 │
                 └──────────────┬──────────────────┘
                                ▼
                      ┌──────────────────┐
                      │  useVimEditor    │
                      │  useKeyCapture   │
                      └────────┬─────────┘
                               ▼
                      ┌──────────────────┐
                      │   VimEngine      │  (Pure TS)
                      │ processKey(...)  │
                      └────────┬─────────┘
                               ▼
                      ┌──────────────────┐
                      │ EditorState      │
                      │ + CommandResult  │
                      └──────────────────┘

                ┌──────────────────────────────────┐
                │ Zustand progressStore (persist)  │
                │ completed lessons / badges / ... │
                └──────────────────────────────────┘
```

### 5.2 关键原则

- **Engine 与 UI 解耦**：Engine 完全纯函数风格，不依赖 React/DOM。
- **Lesson 数据强类型**：`.ts` 文件定义，编译期校验。
- **状态最小化**：UI 状态与引擎状态分层，避免重复事实源。

---

## 6. 目录结构与模块职责

> 以下结构为实施目标结构，开发需严格对齐。

```text
src/
  app/
    layout.tsx
    page.tsx
    lessons/
      page.tsx
      [lessonId]/
        page.tsx
    playground/
      page.tsx
    cheatsheet/
      page.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
    editor/
      VimEditor.tsx
      EditorLine.tsx
      StatusBar.tsx
      Cursor.tsx
      editor.css
    lesson/
      LessonPlayer.tsx
      InstructionPanel.tsx
      KeyVisualizer.tsx
      HintSystem.tsx
      StepCompletionOverlay.tsx
      LessonNavigation.tsx
    gamification/
      ProgressBar.tsx
      BadgeDisplay.tsx
      StreakTracker.tsx
      LessonSummary.tsx
  engine/
    VimEngine.ts
    normalMode.ts
    insertMode.ts
    visualMode.ts
    commandMode.ts
    motionParser.ts
    registers.ts
    __tests__/
  lessons/
    data/
      lesson-01-what-is-vim.ts
      lesson-02-enter-exit.ts
      lesson-03-hjkl-movement.ts
      lesson-04-insert-mode.ts
      lesson-05-save-quit.ts
      lesson-06-delete-undo.ts
      lesson-07-copy-paste.ts
      lesson-08-search-replace.ts
      lesson-09-visual-mode.ts
      lesson-10-advanced-movement.ts
      lesson-11-compound-commands.ts
      lesson-12-tips-config.ts
    lessonRegistry.ts
  store/
    progressStore.ts
  hooks/
    useVimEditor.ts
    useKeyCapture.ts
  types/
    vim.ts
    lesson.ts
    gamification.ts
  utils/
    helpers.ts
public/
  fonts/
  images/
```

### 6.1 模块职责分解

| 模块 | 职责 | 约束 |
|---|---|---|
| `engine/` | Vim 状态转移与命令执行 | 不可引用 React，不可访问 window/document |
| `components/editor/` | 视觉渲染、输入反馈 | 不直接实现 Vim 逻辑 |
| `components/lesson/` | 教学流程与步骤编排 | 不直接修改底层引擎规则 |
| `lessons/data` | 课程定义 | 必须符合 `LessonDefinition` 类型 |
| `store/` | 进度与勋章状态 | 仅存展示与学习状态，不存引擎临时态 |

---

## 7. 核心引擎设计（Vim Simulator Engine）

### 7.1 设计目标

- Pure TypeScript，零框架依赖。
- 可预测、可回放、可测试。
- 对未知命令有稳定失败行为（不崩溃）。

### 7.2 核心类型（建议）

```ts
export type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';

export interface CursorPosition {
  line: number;
  col: number;
}

export interface VisualSelection {
  anchor: CursorPosition;
  active: CursorPosition;
  kind: 'CHAR' | 'LINE';
}

export interface EditorState {
  lines: string[];
  cursor: CursorPosition;
  mode: VimMode;
  commandBuffer: string;       // COMMAND mode input, e.g. ':wq'
  pendingKeys: string[];       // parser buffer for NORMAL mode
  visualSelection?: VisualSelection;
  registers: RegisterState;
  searchQuery?: string;
  searchMatches?: CursorPosition[];
  lastChange?: RepeatableChange;
  history: EditorSnapshot[];
  future: EditorSnapshot[];
  statusMessage?: string;
}

export interface CommandResult {
  state: EditorState;
  consumed: boolean;
  feedback?: {
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    message: string;
  };
}
```

### 7.3 纯函数入口约定

```ts
processKey(key: string, state: EditorState): EditorState
```

- 输入：规范化 key（来自 `useKeyCapture`）+ 当前 state
- 输出：新 state（不可变）
- 禁止副作用（不触发 DOM、不写 localStorage）

### 7.4 模式处理分层

```text
processKey
 ├─ route by mode
 │   ├─ handleNormalMode
 │   ├─ handleInsertMode
 │   ├─ handleVisualMode
 │   └─ handleCommandMode
 └─ finalize state (cursor clamp, message, history)
```

### 7.5 Normal mode 支持项

- 移动：`h j k l w b e 0 $ gg G f t`
- 删除：`x X dd dw d$`
- 修改：`cc cw c$`
- 复制：`yy yw y$`
- 粘贴：`p P`
- 撤销重做：`u` / `Ctrl-r`
- 模式切换：`i I a A o O`
- 搜索：`/`、`n`、`N`
- 其他：`.`（repeat）、`r`（replace char）、`J`（join line）

### 7.6 Insert mode

- 直接字符插入
- `Enter` 新行拆分
- `Backspace` 删除并可跨行合并
- `Tab` 插入空格（建议 2 或 4，可配置）
- `Escape` 返回 Normal

### 7.7 Visual mode

- `v` 字符选择，`V` 行选择
- 移动命令扩展选区
- 对选区执行 `d/y/c`
- `Escape` 退出 Visual

### 7.8 Command mode

- 基础命令：`:w` `:q` `:wq` `:q!`
- 替换：`:s/pat/rep/g`
- 行跳转：`:10`
- 可扩展：`:set number`（可先提示未支持）

### 7.9 Motion Parser 状态机

```text
IDLE
 ├─(count)────────────► COUNT_PENDING
 ├─(operator d/c/y)───► OPERATOR_PENDING
 └─(motion)───────────► EXECUTE

OPERATOR_PENDING
 ├─(count)────────────► COUNT_PENDING
 ├─(motion)───────────► EXECUTE
 └─(same operator)────► EXECUTE  (dd/cc/yy line-wise)

COUNT_PENDING
 ├─(more digits)──────► COUNT_PENDING
 ├─(operator)─────────► OPERATOR_PENDING
 └─(motion)───────────► EXECUTE
```

> 实现策略：优先覆盖课程相关语法；未知组合统一反馈 `该命令暂未支持`。

### 7.10 Register 系统

- 未命名寄存器 `"`：最近一次 yank/delete/change
- `0` 寄存器：最近一次 yank
- 命名寄存器 `a-z`：先保留接口（MVP 可不暴露 UI）

### 7.11 Undo/Redo

- `history` 作为 past stack，`future` 作为 redo stack
- 每次“可变更操作”入栈快照
- Undo: pop history -> push current to future
- Redo: pop future -> push current to history

### 7.12 错误与反馈策略

| 场景 | 行为 |
|---|---|
| 未支持命令 | 状态栏黄色提示，不抛异常 |
| 越界移动 | 光标 clamp 到合法范围 |
| 空缓冲区操作 | 无副作用，显示说明 |
| 搜索无结果 | 红色提示 `Pattern not found` |

---

## 8. Editor UI 设计规范

### 8.1 渲染策略

- 使用 `div` 行渲染，**不使用** `textarea/contenteditable`。
- 每行由 `EditorLine` 渲染，左侧 gutter 显示行号。
- 光标单独层渲染，避免重排。

### 8.2 组件职责

| 组件 | 职责 |
|---|---|
| `VimEditor.tsx` | 容器、焦点、模式样式、键盘事件分发 |
| `EditorLine.tsx` | 单行文本 + 选区高亮 + 行号 |
| `Cursor.tsx` | 根据模式绘制 block/bar/highlight cursor |
| `StatusBar.tsx` | 展示 mode、command buffer、message |

### 8.3 输入归一化（`useKeyCapture`）

规范输出样例：

- 普通字符：`a`、`/`、`:`
- 特殊键：`<Esc>`、`<Enter>`、`<Backspace>`、`<Tab>`、`<C-r>`
- 方向键可映射为 `h/j/k/l`（可选，默认不鼓励）

IME 处理：

- 若 `event.isComposing === true`，Normal mode 忽略编辑动作。
- Insert mode 允许中文输入合成提交。

### 8.4 性能要求

- `React.memo(EditorLine)`
- 行级 key 稳定
- 尽量避免每次按键重建大型对象
- 光标闪烁使用纯 CSS 动画

---

## 9. Lesson 系统设计

### 9.1 Lesson 数据结构（强类型）

```ts
export interface LessonDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites?: string[];
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  instruction: string;
  hint?: string;
  explanation?: string;
  initialContent: string[];
  initialCursor: { line: number; col: number };
  initialMode: 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';
  expectedActions: ExpectedAction[];
  validation: ValidationRule;
  successMessage: string;
}
```

### 9.2 验证原则

- **优先状态验证（State-based validation）**：判断“目标是否达到”，而非硬编码按键序列。
- 允许多路径（例如删行可以 `dd` / `Vd`）。
- 关键教学步骤可附加“命令使用要求”（如必须体验 `:q!`）。

### 9.3 验证层级

1. `STRICT_KEY_SEQUENCE`（少量使用）
2. `STATE_MATCH`（默认）
3. `STATE_OR_COMMAND_SET`（推荐，用于多解）

### 9.4 Lesson Registry

- 统一维护顺序、难度、解锁关系。
- 默认顺序解锁：完成上一课 >= 80% 步骤才解锁下一课。

---

## 10. Gamification 体系设计

### 10.1 持久化字段

```ts
interface ProgressState {
  completedLessons: string[];
  completedSteps: Record<string, string[]>; // lessonId -> stepIds
  currentStreakDays: number;
  lastActiveDate?: string; // YYYY-MM-DD
  totalKeystrokes: number;
  totalCommandsExecuted: number;
  lessonBestTimeMs: Record<string, number>;
  lessonMistakeCount: Record<string, number>;
  unlockedBadges: string[];
}
```

### 10.2 勋章定义（8 个）

| Badge ID | 名称 | 解锁条件 |
|---|---|---|
| beginner | 初学者 | 完成 Lesson 1 |
| hjkl-master | HJKL大师 | Lesson 3 全步完成 |
| insert-pro | 插入达人 | Lesson 4 全步完成 |
| command-expert | 命令行专家 | Lesson 5 & 8 完成 |
| persistence-3d | 坚持不懈 | 连续学习 3 天 |
| vim-ninja | Vim忍者 | 12 课全部通关 |
| speed-star | 速度之星 | 任一课程 < 2 分钟完成 |
| flawless | 零失误 | 任一课程错误数 = 0 |

### 10.3 反馈组件

- `ProgressBar`：课程完成度动画推进
- `BadgeDisplay`：新勋章解锁动画（scale + glow）
- `StreakTracker`：GitHub 风格打卡热力图
- `LessonSummary`：本课时长、命令数、错误数、掌握建议

---

## 11. 12 课完整课程大纲（逐步可实现）

> 说明：每课包含标题、目标、命令、步骤数、实践内容、验证策略。

---

### Lesson 1：什么是 Vim？为什么学 Vim？

- **目标**：理解 modal editing 与 Vim 学习价值。
- **命令**：`i`（体验）
- **步骤数**：5（其中 1 个互动）
- **初始内容**：

```text
欢迎来到 Way2Vim！
按 i 进入插入模式。
```

- **步骤拆解**：
  1. 动画介绍 Vim 历史
  2. 解释模式编辑思想
  3. 展示现实开发场景（SSH/服务器）
  4. 互动：按 `i`
  5. 结语 + 下一课预告

- **验证**：步骤 4 使用 `STATE_OR_COMMAND_SET`，要求 mode 变为 `INSERT`。

---

### Lesson 2：进入和退出 Vim

- **目标**：掌握退出相关核心命令，消除心理恐惧。
- **命令**：`:q` `:q!` `:wq`
- **步骤数**：5
- **初始内容**：

```text
这是一个未保存的文件。
尝试退出它。
```

- **步骤拆解**：
  1. 尝试 `:q`（应提示未保存）
  2. 学习 `:q!` 强制退出
  3. 进入插入模式修改文本
  4. 使用 `:wq` 保存并退出
  5. StackOverflow 梗图/文案收尾

- **验证**：命令模式结果码验证（`quitDenied` / `quitForced` / `writeAndQuit`）。

---

### Lesson 3：普通模式 - 移动光标（h, j, k, l）

- **目标**：建立 HJKL 肌肉记忆。
- **命令**：`j` `k` `h` `l`
- **步骤数**：8
- **初始内容（迷宫布局）**：

```text
起点 S . . .
# # . # .
. . . # ★
. # # . .
★ . . . 终点 E
```

- **步骤拆解**：
  1. 仅 `j`/`k` 上下移动
  2. 加入 `h`/`l` 左右移动
  3. 定点移动到目标字符
  4. 小迷宫导航
  5. 收集第一个 ★
  6. 收集第二个 ★
  7. 限步挑战
  8. 总结最短路径

- **验证**：目标光标位置 + 允许路径集合。

---

### Lesson 4：插入模式（i, a, o, I, A, O）

- **目标**：理解不同插入入口语义。
- **命令**：`i` `a` `o` `I` `A` `O` `<Esc>`
- **步骤数**：7
- **初始内容**：

```text
TODO: 学习 Vim
第一行内容
第二行内容
```

- **步骤拆解**：
  1. `i` 在光标前插入
  2. `a` 在光标后追加
  3. `I` 行首插入
  4. `A` 行尾追加
  5. `o` 下方新开行
  6. `O` 上方新开行
  7. `Esc` 回 Normal 并确认

- **验证**：文档内容比对 + mode 切换校验。

---

### Lesson 5：保存和退出（:w, :q, :wq, ZZ）

- **目标**：掌握命令行模式基础与文件生命周期。
- **命令**：`:w` `:q` `:wq` `ZZ`
- **步骤数**：5
- **初始内容**：

```text
修改这行后进行保存与退出练习。
```

- **步骤拆解**：
  1. 修改内容
  2. `:w` 保存
  3. `:q` 退出（已保存可成功）
  4. 重新进入练习后使用 `:wq`
  5. 使用 `ZZ` 快捷保存退出

- **验证**：命令执行结果 + “dirty flag” 变化。

---

### Lesson 6：删除和撤销（x, dd, u, Ctrl-r）

- **目标**：掌握删除与历史回退。
- **命令**：`x` `dd` `u` `<C-r>`
- **步骤数**：8
- **初始内容**：

```text
abcde
删除这一行
保留这一行
```

- **步骤拆解**：
  1. `x` 删除字符
  2. 连续 `x` 删除多个字符
  3. `dd` 删除整行
  4. `u` 撤销一次
  5. 连续撤销
  6. `<C-r>` 重做
  7. 组合练习
  8. 小测验（先删再恢复）

- **验证**：history/future 栈行为 + 内容快照匹配。

---

### Lesson 7：复制粘贴（yy, yw, p, P）

- **目标**：理解 yank 与 put 的位置差异。
- **命令**：`yy` `yw` `p` `P`
- **步骤数**：6
- **初始内容**：

```text
第一行：苹果
第二行：香蕉
第三行：葡萄
```

- **步骤拆解**：
  1. `yy` 复制整行
  2. `p` 在后粘贴
  3. `P` 在前粘贴
  4. `yw` 复制单词
  5. 指定位置粘贴单词
  6. 迷你排版任务

- **验证**：寄存器内容 + 最终文本结构。

---

### Lesson 8：搜索和替换（/, n, N, :s）

- **目标**：定位重复文本并替换。
- **命令**：`/` `n` `N` `:s/pat/rep/g`
- **步骤数**：7
- **初始内容**：

```text
vim is fast
vim is modal
I love vim
```

- **步骤拆解**：
  1. `/vim` 搜索
  2. `n` 跳下一个
  3. `N` 跳上一个
  4. 单行替换 `:s/vim/Vim/`
  5. 全局替换 `:s/vim/Vim/g`
  6. 错误模式演示（无匹配）
  7. 综合替换任务

- **验证**：search index、匹配计数、替换结果。

---

### Lesson 9：可视模式（v, V）

- **目标**：掌握可视选区与批量操作。
- **命令**：`v` `V` `d` `y` `c`
- **步骤数**：6
- **初始内容**：

```text
hello vim world
line two content
line three content
```

- **步骤拆解**：
  1. `v` 字符选区
  2. 扩展选区并删除 `d`
  3. 撤销再进入 `V`
  4. 行选区复制 `y`
  5. 粘贴验证
  6. `c` 修改选区并输入新文本

- **验证**：visualSelection 边界 + 操作结果。

---

### Lesson 10：高级移动（w, b, e, 0, $, gg, G, f, t）

- **目标**：提升大文本定位效率。
- **命令**：`w` `b` `e` `0` `$` `gg` `G` `f<char>` `t<char>`
- **步骤数**：10
- **初始内容**：多行多词段落（含重复字符以练习 `f/t`）
- **步骤拆解**：
  1. `w` 前进到词首
  2. `b` 回到词首
  3. `e` 到词尾
  4. `0` 到行首
  5. `$` 到行尾
  6. `gg` 到文件首
  7. `G` 到文件尾
  8. `fx` 定位字符
  9. `tx` 定位到字符前
  10. 综合路线挑战

- **验证**：目标位置 + 限定命令集合。

---

### Lesson 11：组合命令（数字+动作，操作符+动作）

- **目标**：理解 Vim 语法组合能力。
- **命令**：`3j` `2w` `5dd` `dw` `d$` `cw`
- **步骤数**：8
- **初始内容**：

```text
one two three four five six seven
alpha beta gamma delta epsilon
line A
line B
line C
line D
line E
```

- **步骤拆解**：
  1. `3j` 跨行移动
  2. `2w` 跨词移动
  3. `5dd` 删除五行
  4. `dw` 删除词
  5. `d$` 删除到行尾
  6. `cw` 改词
  7. 组合挑战
  8. 语法总结图示

- **验证**：解析树结果 + 文本终态。

---

### Lesson 12：实用技巧与配置

- **目标**：建立可持续实践习惯。
- **命令/主题**：`.vimrc` 基础、常见插件概念、工作流建议
- **步骤数**：5
- **初始内容**：

```text
" .vimrc 示例
set number
set relativenumber
set ignorecase
```

- **步骤拆解**：
  1. 解释 `.vimrc` 作用
  2. 常用配置项含义
  3. 插件生态概念（如 telescope / treesitter / lsp）
  4. 每日 15 分钟练习方案
  5. 全课程回顾 + 毕业勋章

- **验证**：信息理解型 + 最终通关标记。

---

## 12. UI/UX 规范（视觉、布局、动效、响应式）

### 12.1 色板（Tokyo Night Inspired）

| Token | Color |
|---|---|
| Background | `#1a1b26` |
| Surface | `#24283b` |
| Surface Hover | `#414868` |
| Text Primary | `#c0caf5` |
| Text Secondary | `#565f89` |
| Green (success/normal) | `#9ece6a` |
| Blue (insert) | `#7aa2f7` |
| Purple (visual) | `#bb9af7` |
| Yellow (warning/command) | `#e0af68` |
| Red (error/delete) | `#f7768e` |
| Orange (accent) | `#ff9e64` |
| Cyan (info) | `#7dcfff` |

### 12.2 布局规范

- Header：`56px`、sticky、backdrop blur
- Landing Hero：满屏居中
- Lesson Player：Desktop 双栏 35% / 65%
- Editor：最小高度 `400px`
- Status Bar：`32px` 固定于 editor 底部
- Footer：`48px` 简约信息

### 12.3 字体规范

- 标题：Inter / SF Pro / system sans
- 正文：system sans，`16px`
- 代码与编辑器：JetBrains Mono，`14px`，line-height `1.6`

### 12.4 动效规范

| 场景 | 动效 |
|---|---|
| 页面切换 | fade + 8px slide，200ms |
| 步骤完成 | 绿色边框闪烁 300ms + 勾选弹入 |
| 课程完成 | confetti + summary slide-up |
| 进度条推进 | spring fill |
| 勋章解锁 | scale + glow pulse |
| 光标闪烁 | CSS 1s |
| 按键可视化 | spring press |

### 12.5 响应式策略

| 断点 | 策略 |
|---|---|
| `>1024px` | 全功能双栏 |
| `768-1024px` | 纵向堆叠（先说明后编辑器） |
| `<768px` | 阅读优先，提示使用桌面端练习 |

---

## 13. 关键技术挑战与工程解决方案

### 13.1 IME（中文输入法）

**问题**：Normal mode 下中文输入法会拦截按键，导致命令失真。  
**方案**：

- 监听 `keydown`，若 `isComposing` 则在 Normal/Visual/Command 下不处理字符命令。
- Insert mode 下允许 composition 提交。
- 必要时使用隐藏 input + `inputmode="none"` 降低浏览器行为差异。

### 13.2 Vim 语法解析复杂度

**问题**：`d2w` 与 `2dw` 都合法，语义接近但解析路径不同。  
**方案**：

- 引入 parser state machine（见 7.9）。
- 限制 MVP 支持范围为课程命令。
- 对未支持组合返回统一提示。

### 13.3 浏览器差异

**问题**：特殊键在不同浏览器值不一致。  
**方案**：

- 统一 `event.key` 归一化映射表。
- 禁止使用已废弃 `keyCode`。
- 集成测试覆盖 Chrome / Safari / Firefox。

### 13.4 焦点管理

**问题**：编辑器与说明面板焦点争夺。  
**方案**：

- 点击 editor 才聚焦（click-to-focus）。
- 聚焦态展示绿色 glow ring。
- `Esc` 支持 defocus（回到阅读状态）。

### 13.5 性能

**问题**：每次按键触发全量重渲染。  
**方案**：

- `React.memo` + 行级比较。
- 减少对象重建与闭包抖动。
- 大文本场景可预研 windowing（MVP 可不启用）。

---

## 14. 实施阶段计划（Phase 0 - 8）

### Phase 0（Day 1）：Project Scaffolding

- `create-next-app` 初始化（TS + App Router）
- 安装依赖：Tailwind 4、Zustand、Framer Motion、Lucide、Vitest
- 配置 strict TS、ESLint、Prettier（可选）
- 建立目录与占位文件

**交付物**：可运行空壳页面 + CI 基础命令。

### Phase 1（Day 2-5）：Vim Engine

- 定义 `types/vim.ts`
- 实现 `VimEngine.ts` 主入口
- 实现 normal/insert/visual/command handlers
- 实现 motion parser + register + undo/redo
- 编写 50+ 测试（后续扩展到 90%+ 覆盖）

**交付物**：可在 Node 环境运行并通过单测的引擎。

### Phase 2（Day 4-6）：Editor UI

- 完成 `VimEditor`、`EditorLine`、`Cursor`、`StatusBar`
- `useVimEditor` 连接 engine + React state
- `useKeyCapture` 做 KeyboardEvent normalization
- 完成 editor.css 模式样式

**交付物**：在页面中可真实输入并看到状态变化。

### Phase 3（Day 5-7）：Lesson System

- 定义 `types/lesson.ts`
- 实现验证引擎（state-based）
- 编写 12 课数据文件
- 实现 `lessonRegistry.ts`

**交付物**：课程数据可加载、可执行步骤验证。

### Phase 4（Day 7-9）：Lesson Player

- `LessonPlayer` 编排步骤流程
- `InstructionPanel` 指令展示
- `KeyVisualizer` 键位反馈
- `HintSystem` 提示分级
- `StepCompletionOverlay` 完成反馈
- `LessonNavigation` 上下步导航

**交付物**：完整单课学习流程可闭环。

### Phase 5（Day 8-10）：Gamification

- `progressStore.ts` + persist
- 勋章规则引擎
- `ProgressBar`、`BadgeDisplay`、`StreakTracker`、`LessonSummary`

**交付物**：学习进度可记录，勋章可解锁。

### Phase 6（Day 9-11）：Pages & Navigation

- `app/layout.tsx` 全站框架
- Landing / Lessons Index / Lesson Detail / Playground / Cheatsheet
- Header / Footer 完成

**交付物**：全站信息架构可访问。

### Phase 7（Day 10-12）：Polish

- 页面过渡动画
- 响应式细节优化
- 空状态/加载状态
- 快捷键支持与提示
- SEO meta tags

**交付物**：可发布质量 UI。

### Phase 8（Day 12-14）：Testing & Deploy

- Engine 单测扩充到 90%+
- 组件测试 + 集成测试
- 跨浏览器回归
- Vercel 部署与 smoke check

**交付物**：线上可用版本（v1.0.0）。

---

## 15. 支持的 Vim 命令清单（完整）

### 15.1 Normal Mode

| 类别 | 命令 |
|---|---|
| 基础移动 | `h` `j` `k` `l` |
| 词移动 | `w` `b` `e` |
| 行移动 | `0` `$` |
| 文档移动 | `gg` `G` |
| 字符查找 | `f<char>` `t<char>` |
| 删除 | `x` `X` `dd` `dw` `d$` |
| 修改 | `cc` `cw` `c$` |
| 复制 | `yy` `yw` `y$` |
| 粘贴 | `p` `P` |
| 撤销重做 | `u` `<C-r>` |
| 模式切换 | `i` `I` `a` `A` `o` `O` |
| 搜索 | `/` `n` `N` |
| 其他 | `.` `r<char>` `J` |

### 15.2 Insert Mode

- 可见字符输入
- `<Enter>` `<Backspace>` `<Tab>` `<Esc>`

### 15.3 Visual Mode

- 进入：`v` `V`
- 移动：`h j k l w b e 0 $`
- 操作：`d` `y` `c`
- 退出：`<Esc>`

### 15.4 Command Mode

- `:w`
- `:q`
- `:wq`
- `:q!`
- `:s/pat/rep/g`
- `:<lineNumber>`（跳转）

---

## 16. 测试策略与质量标准

### 16.1 测试金字塔

1. **Unit（Vitest）**：Engine parser、mode handlers、registers、undo/redo
2. **Component**：Editor 渲染、状态栏反馈、LessonPlayer 步骤流
3. **Integration**：从按键输入到步骤完成的端到端流程（可用 Playwright 预留）

### 16.2 覆盖重点

| 模块 | 覆盖目标 |
|---|---|
| `engine/` | >= 90% |
| `hooks/` | >= 80% |
| `components/lesson` | 关键路径 >= 75% |

### 16.3 质量门禁

- TypeScript strict 全绿
- ESLint 零 error
- 关键路径测试通过
- Lighthouse > 90

---

## 17. 性能预算与监控指标

### 17.1 性能预算

- keystroke-to-render：P95 < 16ms
- 首屏 JS（gzip）：尽量 < 200KB（不含框架共享包）
- 初始渲染 FCP：< 1.8s（桌面）

### 17.2 优化手段

- 路由级代码分割
- 非关键动画延迟加载
- 图标按需导入
- 课程数据静态导入并可分包

### 17.3 监控

- 开发期：React Profiler + Performance 面板
- 发布后：Vercel Analytics（可选）

---

## 18. 可访问性（A11y）与国际化策略

### 18.1 A11y

- 所有交互按钮可键盘访问
- 可见 focus ring
- 文本与背景对比满足 WCAG AA
- 状态变化使用 ARIA live region（如步骤完成提示）

### 18.2 国际化

- 当前版本主语言简体中文
- 文案层预留 i18n key（后续可扩展英文）

---

## 19. SEO、部署与发布流程

### 19.1 SEO

- 每页独立 `metadata`（title/description/open graph）
- 课程页面结构化标题（H1/H2）
- sitemap 与 robots（可选）

### 19.2 Vercel 部署

- main 分支自动部署
- Preview 部署用于 PR 验证
- 环境变量最小化（本项目几乎无）

### 19.3 发布流程

1. 合并前跑 `lint + test + build`
2. 合并 main 后自动部署
3. smoke 测试：Landing、Lesson 3、Lesson 8、Playground

---

## 20. 风险清单、回退策略与里程碑验收

### 20.1 主要风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| 解析器复杂度膨胀 | 开发延期 | 范围收敛到课程命令，分阶段扩展 |
| IME 差异导致误判 | 中文用户体验受损 | 专项测试矩阵 + fallback 输入策略 |
| 动画过多影响性能 | 按键延迟上升 | 将动画限定在非输入关键路径 |
| 课程验证过严 | 学习挫败感 | state-based + 多路径认可 |

### 20.2 回退策略

- 对高风险命令可临时降级为“提示未支持”。
- 若移动端编辑体验差，默认切换阅读模式。

### 20.3 里程碑验收

| 里程碑 | 验收标准 |
|---|---|
| M1（Phase 1） | Engine 核心命令 + 50 单测通过 |
| M2（Phase 4） | Lesson 1-6 可完整游玩 |
| M3（Phase 6） | 全站页面可导航、课程可解锁 |
| M4（Phase 8） | 覆盖率与性能达标，Vercel 上线 |

---

## 21. 附录：关键接口、数据结构与伪代码

### 21.1 `useVimEditor` Hook（伪代码）

```ts
function useVimEditor(initial: EditorState) {
  const [state, setState] = useState(initial);

  const onKey = useCallback((key: string) => {
    setState(prev => processKey(key, prev));
  }, []);

  return {
    state,
    onKey,
    mode: state.mode,
    lines: state.lines,
    cursor: state.cursor,
    status: state.statusMessage,
  };
}
```

### 21.2 Step 验证伪代码

```ts
function validateStep(step: LessonStep, before: EditorState, after: EditorState, key: string): boolean {
  switch (step.validation.type) {
    case 'STATE_MATCH':
      return matchState(step.validation.targetState, after);
    case 'STATE_OR_COMMAND_SET':
      return (
        matchState(step.validation.targetState, after) ||
        step.validation.acceptedCommands.includes(key)
      );
    case 'STRICT_KEY_SEQUENCE':
      return matchSequence(step.validation.sequence, key);
    default:
      return false;
  }
}
```

### 21.3 课程步骤对象示例

```ts
const step: LessonStep = {
  id: 'l3-step-collect-star-1',
  instruction: '使用 hjkl 将光标移动到第一个 ★ 上。',
  hint: '先向下，再向右，避开 #。',
  initialContent: [
    'S . . .',
    '# # . # .',
    '. . . # ★',
  ],
  initialCursor: { line: 0, col: 0 },
  initialMode: 'NORMAL',
  expectedActions: [{ type: 'MOVE_CURSOR' }],
  validation: {
    type: 'STATE_MATCH',
    targetState: { cursor: { line: 2, col: 8 } }
  },
  successMessage: '很好！你已经掌握了基础移动。',
  explanation: '在 Vim 中，移动是最高频操作。'
};
```

### 21.4 Done Definition（DoD）

- [ ] 12 课全部可访问且可通过
- [ ] Engine 覆盖率 >= 90%
- [ ] `npm run build` 无错误
- [ ] 桌面端主要浏览器通过手测
- [ ] 性能、可访问性达到约定标准

---

## 最终结论

本计划定义了 Way2Vim 从架构、引擎、课程、UI/UX、测试、部署到风险控制的全链路实施标准。  
**执行团队应将本文件作为唯一权威文档**，在开发过程中若出现冲突，以“教学效果优先、引擎可测试优先、性能与可维护性优先”为决策准则。
