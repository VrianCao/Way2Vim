# Way2Vim TODO（细分化可执行清单）

> 基于 Plan.md 拆解，按 Phase 顺序排列。每个任务应可在 1–4 小时内独立完成。
> 
> 状态标记：`[ ]` 待办 · `[~]` 进行中 · `[x]` 已完成 · `[!]` 阻塞

---

## Phase 0：项目脚手架（Day 1）

### P0-1 项目初始化
- [x] 使用 `create-next-app` 初始化项目（TypeScript + App Router + Tailwind CSS 4）
- [x] 确认 `tsconfig.json` 开启 `strict: true`
- [x] 配置 ESLint（Next.js 默认规则 + 自定义 strict rules）
- [x] 可选：配置 Prettier

### P0-2 依赖安装
- [x] 安装 Zustand（`zustand`）
- [x] 安装 Framer Motion（`framer-motion`）
- [x] 安装 Lucide React（`lucide-react`）
- [x] 安装 Vitest + @testing-library/react + jsdom（`vitest @testing-library/react jsdom`）
- [x] 配置 `vitest.config.ts`（支持 TypeScript + path alias + jsdom 环境）

### P0-3 目录结构搭建
- [x] 创建 `src/engine/` 及 `__tests__/` 子目录
- [x] 创建 `src/components/layout/`、`src/components/editor/`、`src/components/lesson/`、`src/components/gamification/`
- [x] 创建 `src/lessons/data/`
- [x] 创建 `src/store/`
- [x] 创建 `src/hooks/`
- [x] 创建 `src/types/`
- [x] 创建 `src/utils/`
- [x] 在各目录下建占位 `index.ts` 文件

### P0-4 基础配置
- [x] 配置 Tailwind 主题色板（Tokyo Night 色系，见 Plan §12.1）
- [x] 引入 JetBrains Mono 字体（`public/fonts/` 或 Google Fonts / next/font）
- [x] 配置全局 CSS 变量（背景色、Surface、文本色等）
- [x] 验证 `npm run dev` 能正常启动空白页面
- [x] 验证 `npm run build` 零错误
- [x] 验证 `npx vitest run` 能执行（即使无测试用例）

---

## Phase 1：Vim Engine 核心引擎（Day 2–5）

### P1-1 类型定义
- [x] 编写 `src/types/vim.ts`：定义 `VimMode`、`CursorPosition`、`VisualSelection`、`EditorState`、`CommandResult`、`RegisterState`、`EditorSnapshot`、`RepeatableChange`
- [x] 编写 `src/types/lesson.ts`：定义 `LessonDefinition`、`LessonStep`、`ExpectedAction`、`ValidationRule`
- [x] 编写 `src/types/gamification.ts`：定义 `ProgressState`、`Badge` 相关类型

### P1-2 Engine 主入口
- [x] 实现 `src/engine/VimEngine.ts`：`processKey(key: string, state: EditorState): EditorState`
- [x] 实现模式路由分发逻辑（根据 `state.mode` 分发到不同 handler）
- [x] 实现 `createInitialState(lines: string[], cursor?: CursorPosition): EditorState` 工厂函数
- [x] 实现 state finalization 逻辑（cursor clamp、statusMessage 清理）
- [x] 编写测试：模式路由分发正确性、初始状态工厂（≥5 cases）

### P1-3 Normal Mode - 基础移动
- [x] 实现 `src/engine/normalMode.ts`：`handleNormalMode(key, state): EditorState`
- [x] 实现基础移动：`h`（左）、`l`（右）、`j`（下）、`k`（上）
- [x] 实现行内移动：`0`（行首）、`$`（行尾）
- [x] 实现文档移动：`gg`（首行）、`G`（尾行）
- [x] 实现词移动：`w`（词首前进）、`b`（词首后退）、`e`（词尾前进）
- [x] 实现字符查找：`f<char>`、`t<char>`
- [x] 编写测试：每个移动命令 ≥3 cases（含边界：行首、行尾、文件首尾、空行）

### P1-4 Motion Parser 状态机
- [x] 实现 `src/engine/motionParser.ts`：解析 count + operator + motion 组合
- [x] 支持 parser 状态：`IDLE` → `COUNT_PENDING` → `OPERATOR_PENDING` → `EXECUTE`
- [x] 支持 count prefix（如 `3j`、`2w`、`5dd`）
- [x] 支持 operator + motion（如 `dw`、`d$`、`cw`、`yw`）
- [x] 支持 operator double（如 `dd`、`cc`、`yy` 为行级操作）
- [x] 支持 count + operator + motion（如 `2dw`、`d2w`）
- [x] 编写测试：各组合解析正确性 ≥15 cases

### P1-5 Normal Mode - 编辑操作
- [x] 实现删除：`x`（删当前字符）、`X`（删前一字符）、`dd`（删整行）、`dw`（删词）、`d$`（删到行尾）
- [x] 实现修改：`cc`（改整行）、`cw`（改词）、`c$`（改到行尾）—— 删除后自动切 INSERT
- [x] 实现复制：`yy`（复制整行）、`yw`（复制词）、`y$`（复制到行尾）
- [x] 实现粘贴：`p`（光标后粘贴）、`P`（光标前粘贴），区分行级/字符级
- [x] 实现其他：`r<char>`（替换字符）、`J`（合并行）、`.`（重复上次修改）
- [x] 编写测试：每个编辑命令 ≥3 cases（含空行、单字符行、多行操作）

### P1-6 Register 系统
- [x] 实现 `src/engine/registers.ts`：`RegisterState` 管理
- [x] 实现未命名寄存器 `"`：记录最近一次 yank/delete/change
- [x] 实现 `0` 寄存器：仅记录最近一次 yank
- [x] 预留命名寄存器 `a-z` 接口（MVP 不暴露 UI）
- [x] 编写测试：yank/delete 后寄存器内容正确 ≥8 cases

### P1-7 Undo/Redo
- [x] 实现 undo（`u`）：从 `history` 栈弹出快照，当前状态推入 `future`
- [x] 实现 redo（`Ctrl-r`）：从 `future` 栈弹出快照，当前状态推入 `history`
- [x] 确定快照点策略（每次可变更操作生成 snapshot）
- [x] 编写测试：undo/redo 链式操作、边界（空栈）≥8 cases

### P1-8 Insert Mode
- [x] 实现 `src/engine/insertMode.ts`：`handleInsertMode(key, state): EditorState`
- [x] 支持可见字符直接插入
- [x] 支持 `Enter`：拆分当前行
- [x] 支持 `Backspace`：删除前一字符，跨行合并
- [x] 支持 `Tab`：插入空格（默认 2）
- [x] 支持 `Escape`：切回 NORMAL，光标左移一格（不超出行首）
- [x] 实现模式切换入口：`i`/`I`/`a`/`A`/`o`/`O` 各自的光标定位逻辑
- [x] 编写测试：插入、删除、换行、退出 ≥12 cases

### P1-9 Visual Mode
- [x] 实现 `src/engine/visualMode.ts`：`handleVisualMode(key, state): EditorState`
- [x] `v` 进入字符选择模式，`V` 进入行选择模式
- [x] 移动命令扩展/收缩选区（`h j k l w b e 0 $`）
- [x] 选区操作：`d`（删除）、`y`（复制）、`c`（修改）—— 执行后回 NORMAL
- [x] `Escape` 退出 Visual，清除选区
- [x] 编写测试：选区边界计算、跨行选区操作 ≥10 cases

### P1-10 Command Mode
- [x] 实现 `src/engine/commandMode.ts`：`handleCommandMode(key, state): EditorState`
- [x] `:`  从 NORMAL 进入 COMMAND mode，初始化 `commandBuffer`
- [x] 支持字符输入追加到 `commandBuffer`
- [x] `Enter` 执行命令并回到 NORMAL
- [x] `Escape` 取消命令回到 NORMAL
- [x] `Backspace` 删除 buffer 末位字符，空 buffer 时退回 NORMAL
- [x] 实现 `:w`（模拟保存，statusMessage 反馈）
- [x] 实现 `:q`（检查 dirty flag，决定是否允许退出）
- [x] 实现 `:wq`（保存+退出）
- [x] 实现 `:q!`（强制退出）
- [x] 实现 `:<number>`（行跳转）
- [x] 实现 `:s/pat/rep/g`（当前行替换，支持 `/g` 标志）
- [x] 编写测试：每个命令 ≥2 cases + 边界处理

### P1-11 搜索功能
- [x] 实现 `/` 进入搜索输入（复用或扩展 COMMAND mode 逻辑）
- [x] `Enter` 确认搜索，高亮所有匹配，光标跳到第一个匹配
- [x] `n` 跳到下一个匹配
- [x] `N` 跳到上一个匹配
- [x] 无匹配时 statusMessage 提示 `Pattern not found`
- [x] 编写测试：搜索匹配、循环跳转、无匹配 ≥6 cases

---

## Phase 2：Editor UI 组件（Day 4–6）

### P2-1 useKeyCapture Hook
- [x] 实现 `src/hooks/useKeyCapture.ts`
- [x] 监听 `keydown` 事件，归一化输出：普通字符 → `a`、`/`、`:` 等；特殊键 → `<Esc>`、`<Enter>`、`<Backspace>`、`<Tab>`、`<C-r>`
- [x] IME 处理：`isComposing === true` 时，非 INSERT 模式忽略
- [x] Insert mode 允许中文 composition 提交
- [x] 阻止浏览器默认行为（如 `Ctrl-r` 刷新页面）
- [x] 编写测试：key 归一化映射 ≥10 cases

### P2-2 useVimEditor Hook
- [x] 实现 `src/hooks/useVimEditor.ts`
- [x] 接收 `initialState: EditorState`，内部管理 state
- [x] 暴露 `onKey(key: string)`：调用 `processKey` 并更新 state
- [x] 暴露只读派生值：`mode`、`lines`、`cursor`、`statusMessage`、`visualSelection`
- [x] 支持 `resetState(newState)` 方法（供 Lesson 切步骤使用）

### P2-3 EditorLine 组件
- [x] 实现 `src/components/editor/EditorLine.tsx`
- [x] 渲染单行文本 + 行号 gutter
- [x] 支持 Visual mode 选区高亮（根据当前行是否在选区内）
- [x] 搜索匹配高亮
- [x] 使用 `React.memo` 优化，仅在行内容/选区/搜索变化时重渲染
- [x] 使用 JetBrains Mono 字体，`14px`，`line-height: 1.6`

### P2-4 Cursor 组件
- [x] 实现 `src/components/editor/Cursor.tsx`
- [x] NORMAL mode：block cursor（覆盖字符）
- [x] INSERT mode：bar cursor（竖线）
- [x] VISUAL mode：同 NORMAL block
- [x] 纯 CSS 闪烁动画（1s 周期）
- [x] 绝对定位，根据 `cursor.line` 和 `cursor.col` 计算位置

### P2-5 StatusBar 组件
- [x] 实现 `src/components/editor/StatusBar.tsx`
- [x] 左侧显示当前模式（带颜色标识：Normal=绿、Insert=蓝、Visual=紫、Command=黄）
- [x] 中间显示 statusMessage / commandBuffer（Command mode 时显示 `:` + buffer）
- [x] 右侧显示行号/列号 `Ln X, Col Y`
- [x] 高度 32px，固定于 editor 底部

### P2-6 VimEditor 容器组件
- [x] 实现 `src/components/editor/VimEditor.tsx`
- [x] 渲染所有 `EditorLine` + `Cursor` + `StatusBar`
- [x] 容器管理焦点（click-to-focus）
- [x] 聚焦态绿色 glow ring
- [x] 将 `useKeyCapture` 绑定到容器
- [x] 将按键传递给 `useVimEditor.onKey`
- [x] 最小高度 `400px`，背景色 `#1a1b26`

### P2-7 editor.css 样式
- [x] 编写 `src/components/editor/editor.css`
- [x] 模式对应的 border/accent 颜色
- [x] 光标闪烁 keyframes
- [x] 行号 gutter 样式
- [x] 搜索高亮样式
- [x] Visual 选区高亮样式

### P2-8 集成验证
- [x] 在 `app/page.tsx` 临时放置 `VimEditor`，传入测试文本
- [x] 验证：可输入 `i` 进入 INSERT，输入字符，`Esc` 回 NORMAL
- [x] 验证：`hjkl` 移动光标、`dd` 删行、`u` 撤销
- [x] 验证：`:wq` 命令模式反馈
- [x] 验证：Visual mode 选区高亮

---

## Phase 3：Lesson 系统核心（Day 5–7）

### P3-1 验证引擎
- [ ] 实现 `src/lessons/validationEngine.ts`
- [ ] 支持 `STATE_MATCH`：比对目标 state 字段（cursor、lines、mode）
- [ ] 支持 `STATE_OR_COMMAND_SET`：state 匹配 OR 命令在允许集合中
- [ ] 支持 `STRICT_KEY_SEQUENCE`：严格匹配按键序列
- [ ] 编写测试：每种验证类型 ≥3 cases

### P3-2 Lesson Registry
- [ ] 实现 `src/lessons/lessonRegistry.ts`
- [ ] 维护 12 课的顺序列表、元信息（id/title/difficulty/prerequisites）
- [ ] 提供 `getLessonById(id)`、`getNextLesson(currentId)`、`isLessonUnlocked(id, progress)` 方法
- [ ] 解锁逻辑：完成上一课 ≥80% 步骤

### P3-3 课程数据 - Lesson 1–4（基础课）
- [ ] 编写 `src/lessons/data/lesson-01-what-is-vim.ts`（5 步）
- [ ] 编写 `src/lessons/data/lesson-02-enter-exit.ts`（5 步）
- [ ] 编写 `src/lessons/data/lesson-03-hjkl-movement.ts`（8 步）
- [ ] 编写 `src/lessons/data/lesson-04-insert-mode.ts`（7 步）

### P3-4 课程数据 - Lesson 5–8（进阶课）
- [ ] 编写 `src/lessons/data/lesson-05-save-quit.ts`（5 步）
- [ ] 编写 `src/lessons/data/lesson-06-delete-undo.ts`（8 步）
- [ ] 编写 `src/lessons/data/lesson-07-copy-paste.ts`（6 步）
- [ ] 编写 `src/lessons/data/lesson-08-search-replace.ts`（7 步）

### P3-5 课程数据 - Lesson 9–12（高级课）
- [ ] 编写 `src/lessons/data/lesson-09-visual-mode.ts`（6 步）
- [ ] 编写 `src/lessons/data/lesson-10-advanced-movement.ts`（10 步）
- [ ] 编写 `src/lessons/data/lesson-11-compound-commands.ts`（8 步）
- [ ] 编写 `src/lessons/data/lesson-12-tips-config.ts`（5 步）

### P3-6 课程数据验证
- [ ] 编写自动化脚本/测试：校验所有课程数据符合 `LessonDefinition` 类型
- [ ] 校验步骤 ID 唯一性
- [ ] 校验 `initialCursor` 在 `initialContent` 范围内
- [ ] 校验 `prerequisites` 引用的课程 ID 存在

---

## Phase 4：Lesson Player 交互组件（Day 7–9）

### P4-1 InstructionPanel 组件
- [x] 实现 `src/components/lesson/InstructionPanel.tsx`
- [x] 显示当前步骤的 `instruction` 文案
- [x] 显示步骤进度（`Step 3 / 8`）
- [x] 显示 `explanation`（可折叠/展开）
- [x] 样式：左侧面板，宽度 35%（桌面端）

### P4-2 HintSystem 组件
- [x] 实现 `src/components/lesson/HintSystem.tsx`
- [x] 分级提示：用户卡住 10s 后显示「需要提示吗？」按钮
- [x] 点击后显示 `step.hint`
- [x] 30s 后自动显示提示（可配置）
- [x] 提示样式：黄色 info box

### P4-3 KeyVisualizer 组件
- [x] 实现 `src/components/lesson/KeyVisualizer.tsx`
- [x] 实时显示用户按下的键（类似按键可视化工具）
- [x] 使用 Framer Motion spring 动画模拟按键按下效果
- [x] 显示最近 5–8 个按键历史

### P4-4 StepCompletionOverlay 组件
- [x] 实现 `src/components/lesson/StepCompletionOverlay.tsx`
- [x] 步骤完成时显示 `successMessage`
- [x] 绿色边框闪烁 + 勾选图标弹入动画
- [x] 自动 1.5s 后进入下一步（或点击「下一步」按钮）

### P4-5 LessonNavigation 组件
- [x] 实现 `src/components/lesson/LessonNavigation.tsx`
- [x] 「上一步」/「下一步」按钮
- [x] 步骤点状进度指示器（dot indicator）
- [x] 「重新开始」按钮
- [x] 「退出课程」返回课程列表

### P4-6 LessonPlayer 主组件
- [x] 实现 `src/components/lesson/LessonPlayer.tsx`
- [x] 加载 `LessonDefinition`，初始化第一步
- [x] 管理当前步骤索引
- [x] 每步初始化 editor state（`initialContent` + `initialCursor` + `initialMode`）
- [x] 每次按键后调用验证引擎判断步骤是否完成
- [x] 步骤完成后触发 overlay → 自动推进到下一步
- [x] 全部步骤完成后显示课程完成画面
- [x] 编排子组件：InstructionPanel + VimEditor + KeyVisualizer + HintSystem + StepCompletionOverlay + LessonNavigation

### P4-7 集成验证
- [x] 用 Lesson 1 数据端到端测试 LessonPlayer 流程
- [x] 验证：步骤推进、提示显示、完成反馈、全课完成
- [x] 用 Lesson 3（迷宫移动）测试多步骤复杂流程

---

## Phase 5：Gamification 系统（Day 8–10）

### P5-1 Progress Store
- [x] 实现 `src/store/progressStore.ts`（Zustand + persist middleware → localStorage）
- [x] 实现 actions：`completeStep(lessonId, stepId)`、`completeLesson(lessonId)`、`recordKeystroke()`、`recordMistake(lessonId)`、`updateStreak()`、`unlockBadge(badgeId)`
- [x] 实现 selectors：`isLessonCompleted(id)`、`getLessonProgress(id)`、`getUnlockedBadges()`
- [x] 编写测试：state 更新正确性 ≥8 cases

### P5-2 勋章规则引擎
- [x] 定义 8 个勋章的解锁条件函数（见 Plan §10.2）
- [x] 实现 `checkBadges(state: ProgressState): string[]`，返回新解锁的 badge IDs
- [x] 在 `completeLesson` / `completeStep` 后自动触发勋章检查
- [x] 编写测试：每个勋章的解锁/未解锁条件

### P5-3 ProgressBar 组件
- [x] 实现 `src/components/gamification/ProgressBar.tsx`
- [x] 显示当前课程完成步骤比例
- [x] Framer Motion spring 填充动画

### P5-4 BadgeDisplay 组件
- [x] 实现 `src/components/gamification/BadgeDisplay.tsx`
- [x] 网格展示所有 8 个勋章（未解锁灰色，已解锁彩色）
- [x] 新解锁时触发 scale + glow pulse 动画
- [x] 勋章 hover 显示名称与解锁条件

### P5-5 StreakTracker 组件
- [x] 实现 `src/components/gamification/StreakTracker.tsx`
- [x] GitHub 风格打卡热力图（最近 30 天）
- [x] 显示当前连续天数

### P5-6 LessonSummary 组件
- [x] 实现 `src/components/gamification/LessonSummary.tsx`
- [x] 课程完成后展示：用时、命令数、错误数、勋章解锁
- [x] 「下一课」/「回到课程列表」按钮
- [x] Confetti 动画 + summary slide-up

---

## Phase 6：页面与导航（Day 9–11）

### P6-1 Layout 与 Header/Footer
- [ ] 实现 `src/app/layout.tsx`：全局字体加载、Tailwind provider、dark theme
- [ ] 实现 `src/components/layout/Header.tsx`：56px sticky、backdrop blur、Logo + 导航链接（课程/练习场/速查表）
- [ ] 实现 `src/components/layout/Footer.tsx`：48px 简约，版权 + GitHub 链接

### P6-2 Landing Page
- [ ] 实现 `src/app/page.tsx`
- [ ] Hero 区域：标题 + 副标题 + CTA 按钮（「开始学习」→ `/lessons`）
- [ ] 特性展示区（3–4 个卡片：交互学习、渐进课程、勋章系统、免费开源）
- [ ] 课程预览区（展示 12 课标题列表）
- [ ] 响应式布局

### P6-3 Lessons Index Page
- [ ] 实现 `src/app/lessons/page.tsx`
- [ ] 卡片网格展示 12 课（标题、难度、预计用时、完成状态）
- [ ] 已解锁课程可点击进入
- [ ] 未解锁课程灰色 + 锁图标 + 解锁条件提示
- [ ] 集成 progressStore 读取完成状态

### P6-4 Lesson Detail Page
- [ ] 实现 `src/app/lessons/[lessonId]/page.tsx`
- [ ] 根据 `lessonId` 加载课程数据
- [ ] 渲染 `LessonPlayer` 组件
- [ ] 课程不存在时 404 处理
- [ ] 课程未解锁时跳转或提示

### P6-5 Playground Page
- [ ] 实现 `src/app/playground/page.tsx`
- [ ] 自由模式 VimEditor（预填示例文本）
- [ ] 无步骤验证，纯练习
- [ ] 可选：右侧显示命令参考面板
- [ ] 可选：提供几个预设文本模板（代码片段、散文等）

### P6-6 Cheatsheet Page
- [ ] 实现 `src/app/cheatsheet/page.tsx`
- [ ] 分类展示所有支持的 Vim 命令（表格或卡片）
- [ ] 按类别分组：移动、编辑、搜索、模式切换、命令行
- [ ] 支持搜索/过滤
- [ ] 响应式布局

### P6-7 页面导航与路由
- [ ] Header 导航链接跳转验证
- [ ] 课程列表 → 课程详情跳转
- [ ] 课程完成后的导航流程（Summary → 下一课 / 列表）
- [ ] 404 页面

---

## Phase 7：Polish 细节优化（Day 10–12）

### P7-1 页面过渡动画
- [x] 使用 Framer Motion `AnimatePresence` 实现页面切换 fade + slide（200ms）
- [x] 步骤切换过渡动画

### P7-2 响应式优化
- [x] `>1024px`：全功能双栏验证
- [x] `768-1024px`：纵向堆叠（先指令后编辑器）验证
- [x] `<768px`：阅读优先，提示使用桌面端练习

### P7-3 空状态与加载
- [x] 课程加载中 skeleton/loading 状态
- [x] 无进度时的欢迎引导
- [x] 错误边界组件（Error Boundary）

### P7-4 快捷键提示
- [x] 编辑器聚焦时显示可用命令 tooltip（可选开关）
- [x] 全局快捷键：`?` 打开快捷键帮助面板

### P7-5 SEO
- [x] 每页配置 `metadata`（title / description / Open Graph）
- [x] 课程页动态 metadata（课程标题+描述）
- [x] `robots.txt` + `sitemap.xml`

### P7-6 可访问性（A11y）
- [x] 所有按钮可键盘访问（Tab / Enter）
- [x] 可见 focus ring
- [x] 颜色对比度 WCAG AA 验证
- [x] 步骤完成提示使用 `aria-live` region

---

## Phase 8：测试与部署（Day 12–14）

### P8-1 Engine 单测扩充
- [ ] 扩充 Engine 测试至覆盖率 ≥ 90%
- [ ] 补充边界 case：空文档、超长行、特殊字符
- [ ] 补充组合命令 case：`d2w`、`3dd`、`cw` 后输入等
- [ ] 验证 `.`（dot repeat）在各种操作后的行为

### P8-2 组件测试
- [ ] 编写 VimEditor 组件测试（渲染、焦点、按键响应）
- [ ] 编写 LessonPlayer 集成测试（步骤推进、验证、完成）
- [ ] 编写 StatusBar 测试（模式显示、消息更新）

### P8-3 端到端测试（可选 Playwright）
- [ ] 配置 Playwright（若时间允许）
- [ ] E2E：Landing → 课程列表 → Lesson 1 完整通关
- [ ] E2E：Playground 自由输入
- [ ] E2E：Cheatsheet 搜索功能

### P8-4 质量门禁
- [ ] `npx tsc --noEmit` 零错误
- [ ] `npm run lint` 零 error
- [ ] `npx vitest run --coverage` 覆盖率达标
- [ ] `npm run build` 成功
- [ ] Lighthouse Performance > 90

### P8-5 Vercel 部署
- [ ] 连接 Git 仓库到 Vercel
- [ ] 配置构建命令与输出目录
- [ ] main 分支自动部署
- [ ] Preview 部署验证

### P8-6 上线验收
- [ ] Smoke 测试：Landing 页加载正常
- [ ] Smoke 测试：Lesson 3（HJKL 迷宫）完整可玩
- [ ] Smoke 测试：Lesson 8（搜索替换）完整可玩
- [ ] Smoke 测试：Playground 自由输入正常
- [ ] 跨浏览器验证：Chrome / Safari / Firefox
- [ ] 确认 localStorage 持久化正常（刷新后进度保留）

---

## 里程碑检查点

| 里程碑 | 对应 Phase | 验收标准 |
|---|---|---|
| **M1** | Phase 1 完成 | Engine 核心命令实现 + ≥50 单测通过 |
| **M2** | Phase 4 完成 | Lesson 1–6 可完整游玩 |
| **M3** | Phase 6 完成 | 全站页面可导航、课程可解锁 |
| **M4** | Phase 8 完成 | 覆盖率 ≥90%、Lighthouse >90、Vercel 上线 |
