# Landing Page v2 Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `sites/ai-parent-coaching/` to a modern minimal visual style (neutral base + accent CTA) without changing 7-anchor IA or WeChat Modal CTA.

**Architecture:** Pure CSS token + Astro component style updates in Nav, Hero, SolutionTriad, TrustBlock, Button; secondary sections inherit tokens only. No new dependencies.

**Tech Stack:** Astro 4 static, vanilla CSS, existing Markdown content pipeline.

## Global Constraints

- **Anchor IDs (unchanged):** `hero`, `pain`, `solution`, `roadmap`, `service`, `trust`, `cta`
- **Colors:** bg `#FAFAFA`, text `#1A1A1A`, border `#E5E5E5`, primary `#E8A598` (CTA/links only), secondary `#7BAE7F` (≤5% area)
- **No new npm packages**; no `_redirects` file
- **Deploy:** unchanged Workers Builds (`npm ci && npm run build` + `wrangler deploy`)
- **Lighthouse Mobile Performance ≥ 85**

**Traceability (sddflow):**
- plan-ready: `openspec/changes/landing-page-v2-visual/plan-ready.md`
- tasks: `openspec/changes/landing-page-v2-visual/tasks.md`
- plan: `docs/superpowers/plans/2026-06-24-landing-page-v2-visual.md`

---

## File Structure

```
sites/ai-parent-coaching/src/
├── styles/global.css          # v2 tokens (Task 1)
├── components/
│   ├── Nav.astro              # Task 2
│   ├── Button.astro           # Task 2
│   ├── Hero.astro             # Task 3
│   ├── SolutionTriad.astro    # Task 4
│   ├── TrustBlock.astro       # Task 4
│   ├── PainCards.astro        # Task 5 (styles only)
│   ├── RoadmapPreview.astro   # Task 5
│   ├── ServiceList.astro      # Task 5
│   └── CtaFooter.astro        # Task 5
public/images/
└── hero-accent.svg            # optional Task 3
```

---

### Task 1: Design token v2

> **trace:** plan-ready.md → `### Task 1: Design token v2` | tasks.md → `- [ ] 1.1 更新 src/styles/global.css 为 v2 token（背景 #FAFAFA、正文 #1A1A1A、边框 #E5E5E5、主色仅 CTA）`
> **sync:** tasks.md → `- [ ] 1.1 更新 src/styles/global.css 为 v2 token（背景 #FAFAFA、正文 #1A1A1A、边框 #E5E5E5、主色仅 CTA）` | plan-ready.md → `### Task 1: Design token v2`

**Files:**
- Modify: `sites/ai-parent-coaching/src/styles/global.css`

- [x] **Step 1: Replace `:root` tokens**

```css
:root {
  --color-primary: #E8A598;
  --color-secondary: #7BAE7F;
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #6B7280;
  --color-border: #E5E5E5;
  --font-sans: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  --content-max-width: 960px;
  --section-spacing: 5rem;
  --hero-spacing: 6rem;
  --radius-card: 12px;
  --radius-button: 8px;
}
```

- [x] **Step 2: Update `body` and `.card`**

Set `body { background: var(--color-bg); color: var(--color-text); }`. Cards: `border: 1px solid var(--color-border); box-shadow: none; border-radius: var(--radius-card);`

- [x] **Step 3: Verify preview**

Run: `cd sites/ai-parent-coaching && npm run preview`
Expected: neutral gray-white page background, dark text, no coral page wash

- [x] **Task complete**（本 Task 全部 Step 为 `[x]` 后勾选；与 plan-ready **任务完成**、tasks.md 对应行同步）

---

### Task 2: Nav 与 Button

> **trace:** plan-ready.md → `### Task 2: Nav 与 Button` | tasks.md → `- [ ] 2.1 重构 Nav.astro：毛玻璃 sticky、细底边、移动汉堡菜单`
> **sync:** tasks.md → `- [ ] 2.1 重构 Nav.astro：毛玻璃 sticky、细底边、移动汉堡菜单` | plan-ready.md → `### Task 2: Nav 与 Button`

**Files:**
- Modify: `sites/ai-parent-coaching/src/components/Nav.astro`
- Modify: `sites/ai-parent-coaching/src/components/Button.astro`

- [x] **Step 1: Nav sticky glass styles**

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}
.nav a, .nav button { min-height: 44px; min-width: 44px; }
```

- [x] **Step 2: Button primary/secondary**

Primary: `background: var(--color-primary); border-radius: var(--radius-button);` Secondary: outline with `var(--color-border)`.

- [x] **Step 3: Mobile menu check at 375px**

Run preview, toggle hamburger, click `#roadmap` anchor
Expected: scroll works, no horizontal overflow

- [x] **Task complete**

---

### Task 3: Hero 版式

> **trace:** plan-ready.md → `### Task 3: Hero 版式` | tasks.md → `- [ ] 3.1 重构 Hero.astro：桌面左对齐、胶囊 meta 标签、标题层级`
> **sync:** tasks.md → `- [ ] 3.1 重构 Hero.astro：桌面左对齐、胶囊 meta 标签、标题层级` | plan-ready.md → `### Task 3: Hero 版式`

**Files:**
- Modify: `sites/ai-parent-coaching/src/components/Hero.astro`
- Create (optional): `sites/ai-parent-coaching/public/images/hero-accent.svg`

- [x] **Step 1: Desktop left-align layout**

```css
.hero { text-align: left; max-width: 36rem; }
.hero-meta {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.hero-headline { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; }
@media (max-width: 768px) { .hero { text-align: center; margin-inline: auto; } }
```

- [x] **Step 2: Verify desktop 1280px and mobile 375px**

Run preview at both widths
Expected: left-align on desktop, centered on mobile

- [x] **Task complete**

---

### Task 4: Solution 与 Trust

> **trace:** plan-ready.md → `### Task 4: Solution 与 Trust` | tasks.md → `- [ ] 4.1 重构 SolutionTriad.astro：三列描边极简卡片`
> **sync:** tasks.md → `- [ ] 4.1 重构 SolutionTriad.astro：三列描边极简卡片` | plan-ready.md → `### Task 4: Solution 与 Trust`

**Files:**
- Modify: `sites/ai-parent-coaching/src/components/SolutionTriad.astro`
- Modify: `sites/ai-parent-coaching/src/components/TrustBlock.astro`

- [x] **Step 1: SolutionTriad CSS grid**

```css
.triad { display: grid; gap: 1.5rem; grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) { .triad { grid-template-columns: 1fr; } }
.triad-card { border: 1px solid var(--color-border); border-top: 3px solid var(--color-secondary); }
```

- [x] **Step 2: TrustBlock comparison grid**

Use CSS grid or flex with checkmark pseudo-elements; keep disclaimer paragraph at bottom.

- [x] **Step 3: Visual consistency check**

Scroll Hero → solution → trust
Expected: consistent borders, typography, no heavy shadows

- [x] **Task complete**

---

### Task 5: 次要区块 token 统一

> **trace:** plan-ready.md → `### Task 5: 次要区块 token 统一` | tasks.md → `- [ ] 5.1 调整 PainCards.astro、RoadmapPreview.astro、ServiceList.astro、CtaFooter.astro 仅样式（不改 DOM）`
> **sync:** tasks.md → `- [ ] 5.1 调整 PainCards.astro、RoadmapPreview.astro、ServiceList.astro、CtaFooter.astro 仅样式（不改 DOM）` | plan-ready.md → `### Task 5: 次要区块 token 统一`

**Files:**
- Modify: `PainCards.astro`, `RoadmapPreview.astro`, `ServiceList.astro`, `CtaFooter.astro` (scoped `<style>` only)

- [x] **Step 1: Remove legacy warm background overrides in each component**

Search for `#FFFBF7` or hardcoded coral backgrounds in component styles; replace with `var(--color-bg)` / `var(--color-surface)`.

- [x] **Step 2: Full-page scroll regression**

Run preview, scroll all 7 sections
Expected: no old coral section backgrounds

- [x] **Task complete**

---

### Task 6: 构建与部署回归

> **trace:** plan-ready.md → `### Task 6: 构建与部署回归` | tasks.md → `- [ ] 6.1 npm run build 无 error；dist/ 无 _redirects`
> **sync:** tasks.md → `- [ ] 6.1 npm run build 无 error；dist/ 无 _redirects` | plan-ready.md → `### Task 6: 构建与部署回归`

**Files:** none (verification)

- [x] **Step 1: Production build**

Run: `cd sites/ai-parent-coaching && npm ci && npm run build`
Expected: exit 0, `dist/index.html` exists, no `dist/_redirects`

- [x] **Step 2: CTA smoke**

Run: `npm run preview`
Click primary CTA → Modal opens; ESC closes; `#cta` shows static QR

- [ ] **Step 3: Lighthouse mobile ≥ 85** (Chrome DevTools or CLI)

- [ ] **Step 4: Push and verify Cloudflare deploy**

Run: `git push origin main`
Expected: Cloudflare build green, live site shows v2 styles

- [ ] **Task complete**

---

## Self-Review

| Check | Result |
|-------|--------|
| Spec coverage | PASS — all landing-visual-v2 requirements mapped to Tasks 1–6 |
| Placeholder scan | PASS — no TBD/TODO |
| Type consistency | PASS — file paths under `sites/ai-parent-coaching/` |
| Checkbox alignment | PASS — 6 tasks match tasks.md sections and plan-ready.md |

**Plan complete.** Use `/sddflow build` to execute.
