# 实现计划：landing-page-v2-visual

## 来源

- 提案：`openspec/changes/landing-page-v2-visual/proposal.md`
- 设计：`openspec/changes/landing-page-v2-visual/design.md`
- 规格：`openspec/changes/landing-page-v2-visual/specs/landing-visual-v2/spec.md`
- 任务：`openspec/changes/landing-page-v2-visual/tasks.md`

## 实现步骤

### Task 1: Design token v2

- [x] **任务完成**（与 superpowers plan `Task 1`、`tasks.md` 1.x 同步勾选）
- 目标：将 `global.css` 切换为 v2 中性简洁 token，统一卡片/区块基础样式
- 改动文件：`sites/ai-parent-coaching/src/styles/global.css`
- 验证方式：`npm run preview`，检查背景 `#FAFAFA`、正文深色、主色仅出现在按钮

### Task 2: Nav 与 Button

- [x] **任务完成**
- 目标：现代 sticky 顶栏 + 统一按钮样式
- 改动文件：`src/components/Nav.astro`、`src/components/Button.astro`
- 验证方式：375px/1280px 下导航可点击、汉堡菜单可用、CTA ≥ 44px

### Task 3: Hero 版式

- [x] **任务完成**
- 目标：桌面左对齐 Hero + 移动居中；可选装饰 SVG
- 改动文件：`src/components/Hero.astro`、可选 `public/images/hero-accent.svg`
- 验证方式：1280px 左对齐、375px 居中无横向滚动

### Task 4: Solution 与 Trust

- [x] **任务完成**
- 目标：三列极简卡片 + 信任对比网格
- 改动文件：`src/components/SolutionTriad.astro`、`src/components/TrustBlock.astro`
- 验证方式：浏览 `#solution`、`#trust`，风格与 Hero 一致，免责仍在

### Task 5: 次要区块 token 统一

- [x] **任务完成**
- 目标：Pain/Roadmap/Service/CtaFooter 继承新 token，不改 DOM
- 改动文件：`PainCards.astro`、`RoadmapPreview.astro`、`ServiceList.astro`、`CtaFooter.astro`
- 验证方式：全页滚动无旧暖色大色块残留

### Task 6: 构建与部署回归

- [ ] **任务完成**
- 目标：构建通过、CTA 行为不变、性能达标、部署成功
- 改动文件：无（验证为主）
- 验证方式：`npm run build`；Modal/锚点冒烟；Lighthouse ≥ 85；Cloudflare 部署绿
