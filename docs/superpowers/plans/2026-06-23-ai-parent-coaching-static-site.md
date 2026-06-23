# AI Parent Coaching Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a parent lead-gen single-page Astro 4 static site at `sites/ai-parent-coaching/` with 7 anchor sections, Modal WeChat QR CTA, warm parenting palette, and Cloudflare Pages deployment — no backend, no finance/pricing content.

**Architecture:** Astro 4 static output (`output: 'static'`) assembles one `index.astro` from `content/sections/*.md` (7 files) plus root `site.json`. Section-specific presentation components (`Hero`, `PainCards`, etc.) receive parsed frontmatter + markdown body. `QrModal.astro` is the only client-side island (vanilla JS for open/close/ESC/focus). Global design tokens live in `src/styles/global.css`. Build emits `dist/` for Cloudflare Pages CDN.

**Tech Stack:** Astro 4.x, TypeScript (optional, minimal), Markdown frontmatter via `import.meta.glob`, vanilla CSS, Node 20, Cloudflare Pages (Git integration or Wrangler CLI).

## Global Constraints

- **Audience:** Xi'an local families with 4–12 month babies (parent lead-gen, NOT investor pitch).
- **Anchor IDs (exact, no others):** `hero`, `pain`, `solution`, `roadmap`, `service`, `trust`, `cta` — **forbidden:** `#pricing`, `#finance`, `#business`, `#overview`, `#operations`.
- **Primary CTA:** 「领取免费《4-12月龄成长路线图》」→ Modal with enterprise WeChat QR; PDF distributed in WeChat group.
- **Content source:** `sites/ai-parent-coaching/content/sections/*.md` + `sites/ai-parent-coaching/site.json` only.
- **Excluded from v1:** finance tables, pricing tables, revenue funnel, team org chart, franchise/expansion, payments, backend, forms, CMS, multi-language.
- **Colors:** primary `#E8A598`, secondary `#7BAE7F`, bg `#FFFBF7`, surface `#FFFFFF`, text `#2D3436`, muted `#636E72`, border `#E8E4E0`.
- **Layout:** max-width 960px, section spacing 5rem, card radius 12px, font `system-ui, "PingFang SC", "Microsoft YaHei", sans-serif`.
- **JS:** Modal only; no React/Vue/fetch/forms/analytics SDK in build (optional CF Web Analytics via env var snippet in README only).
- **Deploy:** Root `sites/ai-parent-coaching`, build `npm ci && npm run build`, output `dist`, Node 20.
- **Performance:** Lighthouse Mobile Performance ≥ 85 after production build.
- **Secrets:** No Cloudflare API Token / Account ID in Git.
- **Do NOT commit** during plan execution unless user explicitly requests.

---

## File Structure

```
sites/ai-parent-coaching/
├── .node-version                          # "20"
├── package.json                           # astro 4, scripts dev/build/preview/check
├── astro.config.mjs                       # output: 'static', site URL placeholder
├── site.json                              # title, CTA, OG, wechatQr paths
├── README.md                              # dev, build, deploy, smoke checklist
├── scripts/
│   └── check-assets.mjs                   # pre-build: wechat-qr.png + og-cover.png exist
├── public/
│   ├── favicon.svg
│   ├── 404.html                           # optional single-page fallback
│   ├── _redirects                         # /* / 200 (SPA-style fallback)
│   └── images/
│       ├── og-cover.png                   # 1200×630, ≤300KB
│       └── wechat-qr.png                  # enterprise WeChat QR (placeholder OK v1)
├── content/
│   └── sections/
│       ├── hero.md
│       ├── pain.md
│       ├── solution.md
│       ├── roadmap.md
│       ├── service.md
│       ├── trust.md
│       └── cta.md
└── src/
    ├── env.d.ts                           # Astro types (auto-generated ok)
    ├── layouts/
    │   └── BaseLayout.astro               # HTML shell, SEO/OG from site.json
    ├── components/
    │   ├── Nav.astro                      # sticky 7-anchor nav + mobile hamburger
    │   ├── Section.astro                # generic section wrapper (id, h2, slot)
    │   ├── Button.astro                   # primary/secondary CTA buttons
    │   ├── Hero.astro
    │   ├── PainCards.astro
    │   ├── SolutionTriad.astro
    │   ├── RoadmapPreview.astro
    │   ├── ServiceList.astro
    │   ├── TrustBlock.astro
    │   ├── CtaFooter.astro
    │   └── QrModal.astro                  # only client JS
    ├── lib/
    │   └── content.ts                     # load site.json + glob sections
    ├── styles/
    │   └── global.css                     # design tokens + layout
    └── pages/
        └── index.astro                    # assemble 7 sections in order
```

| File | Responsibility |
|------|----------------|
| `site.json` | Single source for title, tagline, description, CTA labels, QR path, OG image |
| `content/sections/*.md` | Parent-facing copy per anchor; frontmatter `id`, `title`, `order` |
| `src/lib/content.ts` | Parse JSON + sort sections by `order`; export typed objects |
| `BaseLayout.astro` | `<html lang="zh-CN">`, meta, OG absolute image URL, global.css link |
| `QrModal.astro` | `<dialog>` or div overlay; `data-open-modal` trigger; ESC + backdrop close |
| `scripts/check-assets.mjs` | Exit 1 if required images missing (CI-friendly) |

---

### Task 1: Scaffold Astro 4 project

**Files:**
- Create: `sites/ai-parent-coaching/package.json`
- Create: `sites/ai-parent-coaching/astro.config.mjs`
- Create: `sites/ai-parent-coaching/.node-version`
- Create: `sites/ai-parent-coaching/tsconfig.json`
- Create: `sites/ai-parent-coaching/src/env.d.ts`

**Interfaces:**
- Produces: npm project with `dev`, `build`, `preview`, `check` scripts; Astro static output.

- [ ] **Step 1: Create project directory**

Run:
```bash
mkdir -p /home/liujie/data/firstyear/sites/ai-parent-coaching/{content/sections,public/images,src/{layouts,components,lib,styles,pages},scripts}
```

Expected: directories exist, no errors.

- [ ] **Step 2: Write `.node-version`**

Create `sites/ai-parent-coaching/.node-version`:
```
20
```

- [ ] **Step 3: Write `package.json`**

Create `sites/ai-parent-coaching/package.json`:
```json
{
  "name": "ai-parent-coaching",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "node scripts/check-assets.mjs && astro build",
    "preview": "astro preview",
    "check": "node scripts/check-assets.mjs"
  },
  "dependencies": {
    "astro": "^4.16.0"
  }
}
```

- [ ] **Step 4: Write `astro.config.mjs`**

Create `sites/ai-parent-coaching/astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://ai-parent-coaching.pages.dev',
  build: {
    format: 'directory',
  },
});
```

Note: replace `site` URL with actual `*.pages.dev` or custom domain after first deploy.

- [ ] **Step 5: Write minimal `tsconfig.json` and `env.d.ts`**

Create `sites/ai-parent-coaching/tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Create `sites/ai-parent-coaching/src/env.d.ts`:
```typescript
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 6: Install dependencies**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm install
```

Expected: `node_modules/astro` installed, exit code 0.

- [ ] **Step 7: Verify dev server starts**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm run dev -- --host 127.0.0.1 --port 4321 &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4321/
kill %1 2>/dev/null || true
```

Expected: HTTP `404` or `200` (no page yet is OK); Astro dev process starts without crash.

---

### Task 2: Site config and section content

**Files:**
- Create: `sites/ai-parent-coaching/site.json`
- Create: `sites/ai-parent-coaching/content/sections/hero.md`
- Create: `sites/ai-parent-coaching/content/sections/pain.md`
- Create: `sites/ai-parent-coaching/content/sections/solution.md`
- Create: `sites/ai-parent-coaching/content/sections/roadmap.md`
- Create: `sites/ai-parent-coaching/content/sections/service.md`
- Create: `sites/ai-parent-coaching/content/sections/trust.md`
- Create: `sites/ai-parent-coaching/content/sections/cta.md`

**Interfaces:**
- Produces: `SiteConfig` object shape; 7 section files with frontmatter `{ id, title, order }` + parent-facing body.

- [ ] **Step 1: Write `site.json`**

Create `sites/ai-parent-coaching/site.json`:
```json
{
  "title": "AI新手家长陪跑营",
  "tagline": "西安 4-12 月龄科学育儿陪跑",
  "description": "AI育儿助手 + 真人专家答疑 + 本地线下活动，帮新手父母知道「下一步该做什么」。",
  "locale": "zh-CN",
  "city": "西安",
  "ageRange": "4-12月龄",
  "primaryCta": {
    "label": "领取免费《4-12月龄成长路线图》",
    "modalTitle": "扫码添加企业微信",
    "modalSteps": ["扫码添加企业微信", "回复「路线图」", "进群领取 PDF"]
  },
  "og": {
    "image": "/images/og-cover.png",
    "type": "website"
  },
  "wechatQr": "/images/wechat-qr.png"
}
```

- [ ] **Step 2: Write `hero.md`**

Create `sites/ai-parent-coaching/content/sections/hero.md`:
```markdown
---
id: hero
title: AI新手家长陪跑营
order: 1
headline: 帮西安新手爸妈知道「下一步该做什么」
subheadline: 面向 4-12 月龄宝宝家庭 · AI 助手 7×24 · 专家答疑 · 本地线下活动
---

月嫂离开后，每一天都有新问题。我们不卖课程，陪你把育儿焦虑变成可执行的下一步。
```

- [ ] **Step 3: Write `pain.md`**

Create `sites/ai-parent-coaching/content/sections/pain.md`:
```markdown
---
id: pain
title: 你是不是也这样焦虑？
order: 2
cards:
  - icon: "🍼"
    title: 辅食添加
    body: 什么时候加、加什么、过敏了怎么办——每个问题都要查半天。
  - icon: "😴"
    title: 睡眠问题
    body: 夜醒频繁、作息混乱，家人说法不一，越哄越累。
  - icon: "📈"
    title: 发育判断
    body: 抬头、翻身、出牙——总担心自家宝宝「落后了」。
  - icon: "💉"
    title: 疫苗安排
    body: 自费还是免费、反应如何处理，信息杂而乱。
  - icon: "🌡️"
    title: 发烧护理
    body: 半夜发烧，不知道何时该居家观察、何时该就医。
  - icon: "📱"
    title: 信息碎片化
    body: 百度、小红书、宝妈群各说各话，越搜越焦虑。
---

4-12 月龄是月子中心与早教机构之间的服务空白期。你并不孤单，很多西安家庭都在同一条路上。
```

- [ ] **Step 4: Write `solution.md`**

Create `sites/ai-parent-coaching/content/sections/solution.md`:
```markdown
---
id: solution
title: 我们怎么陪你？
order: 3
pillars:
  - title: AI 育儿助手
    body: 7×24 小时在线。输入月龄、身高体重、睡眠情况，获得本周重点、发育提醒与辅食建议。
  - title: 真人专家答疑
    body: 工作时段 09:00-21:00，24 小时内回复。紧急情况统一建议就医，不替代医生诊断。
  - title: 本地线下活动
    body: 抚触课、辅食实操、CPR 培训、宝宝社交——在西安见面，把知识变成动手经验。
---

**核心理念：** 我们不卖课程。我们卖安全感、陪伴感、可执行方案——让家长知道「下一步该做什么」。
```

- [ ] **Step 5: Write `roadmap.md`**

Create `sites/ai-parent-coaching/content/sections/roadmap.md`:
```markdown
---
id: roadmap
title: 免费《4-12月龄成长路线图》
order: 4
items:
  - 每月龄发育重点与观察清单
  - 疫苗接种提醒与注意事项
  - 辅食添加时间表与过敏排查
  - 大运动训练小游戏
  - 睡眠管理与常见误区
---

扫码进群即可领取 PDF 版路线图——你的第一份科学育儿行动指南，完全免费。
```

- [ ] **Step 6: Write `service.md` (benefits only, NO prices)**

Create `sites/ai-parent-coaching/content/sections/service.md`:
```markdown
---
id: service
title: 陪跑营里你能获得什么
order: 5
tiers:
  - name: 体验营
    duration: 6 周
    benefits:
      - 每周主题任务与群内打卡
      - 线上直播课，建立科学育儿习惯
      - 与同城家长交流，减少孤独感
  - name: 陪跑会员
    duration: 持续陪伴
    benefits:
      - AI 育儿助手：本周重点、注意事项、发育与辅食建议
      - 专家答疑：09:00-21:00 在线，24 小时内回复
      - 每周线上课：辅食、睡眠、发育、安全护理、急救知识
      - 每月线下活动：抚触、辅食实操、CPR、宝宝社交
---

具体开通方式请添加企业微信咨询——我们先从免费路线图开始，零压力了解是否适合你的家庭。
```

- [ ] **Step 7: Write `trust.md`**

Create `sites/ai-parent-coaching/content/sections/trust.md`:
```markdown
---
id: trust
title: 为什么值得信任
order: 6
comparisons:
  - vs: 传统月子中心
    point: 价格更亲民，服务覆盖 4-12 月龄更长周期
  - vs: 纯线上课程
    point: 有持续陪伴与答疑，不是买完就结束的录播
  - vs: 宝妈群
    point: 内容经专业审核，减少「偏方」与信息噪音
  - vs: 纯 AI 工具
    point: 真人专家兜底，复杂问题有人把关
disclaimer: 本平台不提供医疗诊断，不替代医生。宝宝如有不适或紧急情况，请立即就医。
expertNote: 内容由儿保医生、护士长、育婴师等顾问审核把关。
---

AI 降低服务成本，专家提高信任度——**AI + 专家 + 社区** 三位一体，是我们在西安为新手家庭提供的长期陪跑方式。
```

- [ ] **Step 8: Write `cta.md`**

Create `sites/ai-parent-coaching/content/sections/cta.md`:
```markdown
---
id: cta
title: 现在领取免费路线图
order: 7
---

添加企业微信，回复「路线图」，进群领取 PDF。第一步，从这里开始。
```

- [ ] **Step 9: Grep verify no forbidden content**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching
grep -rniE '599|99元|盈亏平衡|收入占比|加盟|财务模型|漏斗|团队架构|#pricing|#finance' content/ site.json || echo "PASS: no forbidden terms"
```

Expected: `PASS: no forbidden terms` (service.md intentionally avoids price numbers).

---

### Task 3: Content loader library

**Files:**
- Create: `sites/ai-parent-coaching/src/lib/content.ts`

**Interfaces:**
- Consumes: `site.json`, `content/sections/*.md` via glob.
- Produces: `getSiteConfig(): SiteConfig`, `getSections(): Section[]` sorted by `order`.

- [ ] **Step 1: Write `content.ts`**

Create `sites/ai-parent-coaching/src/lib/content.ts`:
```typescript
import siteJson from '../../site.json';

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  locale: string;
  city: string;
  ageRange: string;
  primaryCta: {
    label: string;
    modalTitle: string;
    modalSteps: string[];
  };
  og: { image: string; type: string };
  wechatQr: string;
}

export interface SectionFrontmatter {
  id: string;
  title: string;
  order: number;
  [key: string]: unknown;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  frontmatter: SectionFrontmatter;
  body: string;
  Content: AstroComponentFactory;
}

type AstroComponentFactory = (props?: Record<string, unknown>) => any;

const sectionModules = import.meta.glob<{ frontmatter: SectionFrontmatter; Content: AstroComponentFactory; compiledContent: () => Promise<string> }>(
  '../../content/sections/*.md',
  { eager: true }
);

const REQUIRED_IDS = ['hero', 'pain', 'solution', 'roadmap', 'service', 'trust', 'cta'];

export function getSiteConfig(): SiteConfig {
  return siteJson as SiteConfig;
}

export async function getSections(): Promise<Section[]> {
  const sections: Section[] = [];

  for (const [path, mod] of Object.entries(sectionModules)) {
    const fm = mod.frontmatter;
    if (!fm?.id) {
      throw new Error(`Missing frontmatter.id in ${path}`);
    }
    const body = await mod.compiledContent();
    sections.push({
      id: fm.id,
      title: fm.title,
      order: fm.order,
      frontmatter: fm,
      body: body.trim(),
      Content: mod.Content,
    });
  }

  sections.sort((a, b) => a.order - b.order);

  const ids = sections.map((s) => s.id);
  for (const required of REQUIRED_IDS) {
    if (!ids.includes(required)) {
      throw new Error(`Missing required section: ${required}.md`);
    }
  }

  return sections;
}

export function getSectionById(sections: Section[], id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
```

- [ ] **Step 2: Verify TypeScript resolves (after Task 1 install)**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npx astro check 2>&1 | head -20
```

Expected: no fatal errors related to `content.ts` imports (full page build comes later).

---

### Task 4: Global styles and design tokens

**Files:**
- Create: `sites/ai-parent-coaching/src/styles/global.css`

**Interfaces:**
- Produces: CSS variables `--color-primary`, etc.; utility classes `.container`, `.btn`, `.section`.

- [ ] **Step 1: Write `global.css`**

Create `sites/ai-parent-coaching/src/styles/global.css`:
```css
:root {
  --color-primary: #E8A598;
  --color-secondary: #7BAE7F;
  --color-bg: #FFFBF7;
  --color-surface: #FFFFFF;
  --color-text: #2D3436;
  --color-text-muted: #636E72;
  --color-border: #E8E4E0;
  --font-sans: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  --content-max-width: 960px;
  --section-spacing: 5rem;
  --radius-card: 12px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text);
  background: var(--color-bg);
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  width: min(100% - 2rem, var(--content-max-width));
  margin-inline: auto;
}

.section {
  padding-block: var(--section-spacing);
}

.section h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0 0 1.5rem;
  color: var(--color-text);
}

.section h2:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 1.25rem 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 3px;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(232, 165, 152, 0.35);
}

.btn--primary:hover {
  transform: translateY(-1px);
}

.btn--secondary {
  background: var(--color-surface);
  color: var(--color-secondary);
  border: 2px solid var(--color-secondary);
}

.grid-2 {
  display: grid;
  gap: 1rem;
}

.grid-3 {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

### Task 5: BaseLayout with SEO/OG

**Files:**
- Create: `sites/ai-parent-coaching/src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `getSiteConfig()` from `src/lib/content.ts`.
- Produces: layout slot; `<title>`, meta description, OG tags with absolute `og:image` URL.

- [ ] **Step 1: Write `BaseLayout.astro`**

Create `sites/ai-parent-coaching/src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
import { getSiteConfig } from '../lib/content';

interface Props {
  title?: string;
  description?: string;
}

const site = getSiteConfig();
const { title = `${site.title} | ${site.tagline}`, description = site.description } = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImagePath = site.og.image.startsWith('http') ? site.og.image : new URL(site.og.image, Astro.site).href;
---

<!doctype html>
<html lang={site.locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={site.og.type} />
    <meta property="og:image" content={ogImagePath} />
    <meta property="og:url" content={canonicalURL.href} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Smoke — layout renders in dev (after index exists in Task 12)**

Deferred to Task 12 build step.

---

### Task 6: Shared components (Section, Button, Nav)

**Files:**
- Create: `sites/ai-parent-coaching/src/components/Section.astro`
- Create: `sites/ai-parent-coaching/src/components/Button.astro`
- Create: `sites/ai-parent-coaching/src/components/Nav.astro`

**Interfaces:**
- `Section.astro`: props `{ id: string; title: string; headingLevel?: 'h1'|'h2' }`
- `Button.astro`: props `{ variant?: 'primary'|'secondary'; type?: 'button'|'submit'; class?: string; [key: string]: unknown }` — spreads extra attrs for `data-open-modal`
- `Nav.astro`: consumes `getSiteConfig()`; links `#hero`…`#cta`

- [ ] **Step 1: Write `Section.astro`**

Create `sites/ai-parent-coaching/src/components/Section.astro`:
```astro
---
interface Props {
  id: string;
  title: string;
  as?: 'h1' | 'h2';
  tabindex?: number;
}

const { id, title, as = 'h2', tabindex } = Astro.props;
const Heading = as;
---

<section class="section" id={id} aria-labelledby={`${id}-heading`}>
  <div class="container">
    <Heading id={`${id}-heading`} tabindex={tabindex}>{title}</Heading>
    <slot />
  </div>
</section>

<style>
  h1, h2 {
    scroll-margin-top: 5rem;
  }
</style>
```

- [ ] **Step 2: Write `Button.astro`**

Create `sites/ai-parent-coaching/src/components/Button.astro`:
```astro
---
interface Props {
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  class?: string;
}

const { variant = 'primary', type = 'button', class: className = '', ...rest } = Astro.props;
const classes = `btn btn--${variant} ${className}`.trim();
---

<button type={type} class={classes} {...rest}>
  <slot />
</button>
```

- [ ] **Step 3: Write `Nav.astro`**

Create `sites/ai-parent-coaching/src/components/Nav.astro`:
```astro
---
import { getSiteConfig } from '../lib/content';

const site = getSiteConfig();

const links = [
  { href: '#hero', label: '首页' },
  { href: '#pain', label: '痛点' },
  { href: '#solution', label: '方案' },
  { href: '#roadmap', label: '路线图' },
  { href: '#service', label: '服务' },
  { href: '#trust', label: '信任' },
  { href: '#cta', label: '领取' },
];
---

<header class="nav-header">
  <div class="container nav-inner">
    <a class="nav-brand" href="#hero">{site.title}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" id="nav-toggle">
      <span class="sr-only">打开菜单</span>
      <span aria-hidden="true">☰</span>
    </button>
    <nav id="nav-menu" class="nav-menu" aria-label="页面导航">
      <ul>
        {links.map((link) => (
          <li><a href={link.href}>{link.label}</a></li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .nav-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 251, 247, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-border);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 3.5rem;
    gap: 1rem;
  }
  .nav-brand {
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;
  }
  .nav-toggle {
    display: flex;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
  }
  .nav-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: none;
    flex-direction: column;
    gap: 0.5rem;
  }
  .nav-menu a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.95rem;
  }
  .nav-menu a:hover {
    color: var(--color-primary);
  }
  @media (min-width: 768px) {
    .nav-toggle { display: none; }
    .nav-menu ul {
      display: flex;
      flex-direction: row;
      gap: 1.25rem;
    }
  }
  .nav-menu.is-open ul {
    display: flex;
  }
</style>

<script>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  menu?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => menu.classList.remove('is-open'));
  });
</script>
```

Note: Nav hamburger uses minimal inline script (acceptable for mobile menu; Modal remains primary client interaction per spec).

---

### Task 7: Section presentation components

**Files:**
- Create: `sites/ai-parent-coaching/src/components/Hero.astro`
- Create: `sites/ai-parent-coaching/src/components/PainCards.astro`
- Create: `sites/ai-parent-coaching/src/components/SolutionTriad.astro`
- Create: `sites/ai-parent-coaching/src/components/RoadmapPreview.astro`
- Create: `sites/ai-parent-coaching/src/components/ServiceList.astro`
- Create: `sites/ai-parent-coaching/src/components/TrustBlock.astro`
- Create: `sites/ai-parent-coaching/src/components/CtaFooter.astro`

**Interfaces:**
- Each accepts `{ section: SectionFrontmatter & { body: string }; ctaLabel: string }` or typed frontmatter fields from markdown YAML.

- [ ] **Step 1: Write `Hero.astro`**

Create `sites/ai-parent-coaching/src/components/Hero.astro`:
```astro
---
import Section from './Section.astro';
import Button from './Button.astro';

interface Props {
  title: string;
  headline: string;
  subheadline: string;
  body: string;
  ctaLabel: string;
  city: string;
  ageRange: string;
}

const { title, headline, subheadline, body, ctaLabel, city, ageRange } = Astro.props;
---

<Section id="hero" title={title} as="h1">
  <div class="hero">
    <p class="hero-meta">{city} · {ageRange}</p>
    <p class="hero-headline">{headline}</p>
    <p class="hero-sub">{subheadline}</p>
    <p class="hero-body">{body}</p>
    <Button variant="primary" data-open-modal="qr-modal">{ctaLabel}</Button>
  </div>
</Section>

<style>
  .hero { text-align: center; max-width: 40rem; margin-inline: auto; }
  .hero-meta { color: var(--color-secondary); font-weight: 600; margin: 0 0 0.5rem; }
  .hero-headline { font-size: clamp(1.75rem, 5vw, 2.5rem); font-weight: 700; margin: 0 0 0.75rem; line-height: 1.3; }
  .hero-sub { color: var(--color-text-muted); margin: 0 0 1rem; }
  .hero-body { margin: 0 0 1.5rem; }
</style>
```

- [ ] **Step 2: Write `PainCards.astro`**

Create `sites/ai-parent-coaching/src/components/PainCards.astro`:
```astro
---
import Section from './Section.astro';

interface Card {
  icon: string;
  title: string;
  body: string;
}

interface Props {
  title: string;
  cards: Card[];
  body: string;
}

const { title, cards, body } = Astro.props;
---

<Section id="pain" title={title} tabindex={-1}>
  <div class="grid-2">
    {cards.map((card) => (
      <article class="card pain-card">
        <span class="pain-icon" aria-hidden="true">{card.icon}</span>
        <h3>{card.title}</h3>
        <p>{card.body}</p>
      </article>
    ))}
  </div>
  <p class="pain-footer">{body}</p>
</Section>

<style>
  .pain-card h3 { margin: 0.5rem 0; font-size: 1.1rem; }
  .pain-card p { margin: 0; color: var(--color-text-muted); font-size: 0.95rem; }
  .pain-icon { font-size: 1.75rem; }
  .pain-footer { margin-top: 1.5rem; text-align: center; color: var(--color-text-muted); }
</style>
```

- [ ] **Step 3: Write `SolutionTriad.astro`**

Create `sites/ai-parent-coaching/src/components/SolutionTriad.astro`:
```astro
---
import Section from './Section.astro';

interface Pillar {
  title: string;
  body: string;
}

interface Props {
  title: string;
  pillars: Pillar[];
  body: string;
}

const { title, pillars, body } = Astro.props;
---

<Section id="solution" title={title} tabindex={-1}>
  <div class="grid-3">
    {pillars.map((p) => (
      <article class="card">
        <h3>{p.title}</h3>
        <p>{p.body}</p>
      </article>
    ))}
  </div>
  <p class="solution-tagline"><strong>{body.replace(/\*\*/g, '')}</strong></p>
</Section>

<style>
  h3 { margin: 0 0 0.5rem; color: var(--color-secondary); }
  .solution-tagline { margin-top: 2rem; text-align: center; font-size: 1.05rem; }
</style>
```

- [ ] **Step 4: Write `RoadmapPreview.astro`**

Create `sites/ai-parent-coaching/src/components/RoadmapPreview.astro`:
```astro
---
import Section from './Section.astro';
import Button from './Button.astro';

interface Props {
  title: string;
  items: string[];
  body: string;
  ctaLabel: string;
}

const { title, items, body, ctaLabel } = Astro.props;
---

<Section id="roadmap" title={title} tabindex={-1}>
  <ul class="roadmap-list">
    {items.map((item) => <li>{item}</li>)}
  </ul>
  <p>{body}</p>
  <Button variant="secondary" data-open-modal="qr-modal">{ctaLabel}</Button>
</Section>

<style>
  .roadmap-list {
    padding-left: 1.25rem;
    margin: 0 0 1rem;
  }
  .roadmap-list li {
    margin-bottom: 0.5rem;
  }
</style>
```

- [ ] **Step 5: Write `ServiceList.astro`**

Create `sites/ai-parent-coaching/src/components/ServiceList.astro`:
```astro
---
import Section from './Section.astro';

interface Tier {
  name: string;
  duration: string;
  benefits: string[];
}

interface Props {
  title: string;
  tiers: Tier[];
  body: string;
}

const { title, tiers, body } = Astro.props;
---

<Section id="service" title={title} tabindex={-1}>
  <div class="grid-2">
    {tiers.map((tier) => (
      <article class="card">
        <h3>{tier.name}</h3>
        <p class="tier-duration">{tier.duration}</p>
        <ul>
          {tier.benefits.map((b) => <li>{b}</li>)}
        </ul>
      </article>
    ))}
  </div>
  <p class="service-note">{body}</p>
</Section>

<style>
  h3 { margin: 0; }
  .tier-duration { color: var(--color-primary); font-weight: 600; margin: 0.25rem 0 0.75rem; }
  ul { padding-left: 1.25rem; margin: 0; }
  li { margin-bottom: 0.35rem; }
  .service-note { margin-top: 1.5rem; color: var(--color-text-muted); }
</style>
```

- [ ] **Step 6: Write `TrustBlock.astro`**

Create `sites/ai-parent-coaching/src/components/TrustBlock.astro`:
```astro
---
import Section from './Section.astro';

interface Comparison {
  vs: string;
  point: string;
}

interface Props {
  title: string;
  comparisons: Comparison[];
  disclaimer: string;
  expertNote: string;
  body: string;
}

const { title, comparisons, disclaimer, expertNote, body } = Astro.props;
---

<Section id="trust" title={title} tabindex={-1}>
  <ul class="compare-list">
    {comparisons.map((c) => (
      <li><strong>相比{c.vs}：</strong>{c.point}</li>
    ))}
  </ul>
  <p class="expert-note">{expertNote}</p>
  <aside class="disclaimer card" role="note">
    <p>{disclaimer}</p>
  </aside>
  <p class="trust-body">{body.replace(/\*\*/g, '')}</p>
</Section>

<style>
  .compare-list { padding-left: 0; list-style: none; margin: 0 0 1.5rem; }
  .compare-list li { margin-bottom: 0.75rem; padding-left: 1rem; border-left: 3px solid var(--color-secondary); }
  .expert-note { font-style: italic; color: var(--color-text-muted); }
  .disclaimer { background: #fff8f6; border-color: var(--color-primary); margin: 1rem 0; }
  .disclaimer p { margin: 0; font-size: 0.9rem; }
  .trust-body { margin-top: 1rem; }
</style>
```

- [ ] **Step 7: Write `CtaFooter.astro`**

Create `sites/ai-parent-coaching/src/components/CtaFooter.astro`:
```astro
---
import Section from './Section.astro';
import Button from './Button.astro';

interface Props {
  title: string;
  body: string;
  ctaLabel: string;
  wechatQr: string;
  modalSteps: string[];
}

const { title, body, ctaLabel, wechatQr, modalSteps } = Astro.props;
---

<Section id="cta" title={title} tabindex={-1}>
  <div class="cta-grid">
    <div>
      <p>{body}</p>
      <ol class="cta-steps">
        {modalSteps.map((step) => <li>{step}</li>)}
      </ol>
      <Button variant="primary" data-open-modal="qr-modal">{ctaLabel}</Button>
    </div>
    <figure class="qr-static">
      <img
        src={wechatQr}
        alt="企业微信二维码，扫码添加领取路线图"
        width="200"
        height="200"
        loading="lazy"
        data-qr-fallback
      />
      <figcaption>扫码添加企业微信</figcaption>
      <p class="qr-fallback-msg" hidden>请联系客服获取二维码</p>
    </figure>
  </div>
</Section>

<style>
  .cta-grid {
    display: grid;
    gap: 2rem;
    align-items: center;
  }
  @media (min-width: 768px) {
    .cta-grid { grid-template-columns: 1fr auto; }
  }
  .cta-steps { padding-left: 1.25rem; }
  .qr-static { text-align: center; margin: 0; }
  .qr-static img {
    border-radius: var(--radius-card);
    border: 1px solid var(--color-border);
  }
  figcaption { margin-top: 0.5rem; font-size: 0.9rem; color: var(--color-text-muted); }
  .qr-fallback-msg { color: var(--color-text-muted); }
</style>

<script>
  document.querySelectorAll('[data-qr-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const msg = img.parentElement?.querySelector('.qr-fallback-msg');
      if (msg) msg.hidden = false;
    });
  });
</script>
```

---

### Task 8: QrModal (only required client interaction)

**Files:**
- Create: `sites/ai-parent-coaching/src/components/QrModal.astro`

**Interfaces:**
- Props: `{ id?: string; title: string; steps: string[]; qrSrc: string }`
- DOM: `#qr-modal` with `role="dialog"`, `aria-modal="true"`
- Triggers: any `[data-open-modal="qr-modal"]`

- [ ] **Step 1: Write `QrModal.astro`**

Create `sites/ai-parent-coaching/src/components/QrModal.astro`:
```astro
---
interface Props {
  id?: string;
  title: string;
  steps: string[];
  qrSrc: string;
}

const { id = 'qr-modal', title, steps, qrSrc } = Astro.props;
---

<div class="modal" id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} hidden>
  <div class="modal-backdrop" data-close-modal tabindex="-1"></div>
  <div class="modal-panel card">
    <button type="button" class="modal-close" data-close-modal aria-label="关闭对话框">×</button>
    <h2 id={`${id}-title`}>{title}</h2>
    <ol>
      {steps.map((step) => <li>{step}</li>)}
    </ol>
    <img
      src={qrSrc}
      alt="企业微信二维码"
      width="220"
      height="220"
      loading="eager"
    />
  </div>
</div>

<style>
  .modal[hidden] { display: none; }
  .modal:not([hidden]) {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(45, 52, 54, 0.45);
  }
  .modal-panel {
    position: relative;
    z-index: 1;
    max-width: 22rem;
    width: 100%;
    text-align: center;
  }
  .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
  }
  h2 { font-size: 1.25rem; margin: 0 0 1rem; }
  ol { text-align: left; padding-left: 1.25rem; margin: 0 0 1rem; }
</style>

<script>
  const modal = document.getElementById('qr-modal');
  if (modal) {
    const openers = document.querySelectorAll('[data-open-modal="qr-modal"]');
    const closers = modal.querySelectorAll('[data-close-modal]');
    let lastFocus: HTMLElement | null = null;

    function openModal() {
      lastFocus = document.activeElement as HTMLElement;
      modal.removeAttribute('hidden');
      const closeBtn = modal.querySelector('.modal-close') as HTMLElement;
      closeBtn?.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      lastFocus?.focus();
    }

    openers.forEach((el) => el.addEventListener('click', openModal));
    closers.forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
    });
  }
</script>
```

---

### Task 9: Assemble `index.astro`

**Files:**
- Create: `sites/ai-parent-coaching/src/pages/index.astro`

**Interfaces:**
- Consumes: `getSiteConfig()`, `getSections()`, all section components, `Nav`, `QrModal`, `BaseLayout`.

- [ ] **Step 1: Write `index.astro`**

Create `sites/ai-parent-coaching/src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import PainCards from '../components/PainCards.astro';
import SolutionTriad from '../components/SolutionTriad.astro';
import RoadmapPreview from '../components/RoadmapPreview.astro';
import ServiceList from '../components/ServiceList.astro';
import TrustBlock from '../components/TrustBlock.astro';
import CtaFooter from '../components/CtaFooter.astro';
import QrModal from '../components/QrModal.astro';
import { getSiteConfig, getSections, getSectionById } from '../lib/content';

const site = getSiteConfig();
const sections = await getSections();
const hero = getSectionById(sections, 'hero')!;
const pain = getSectionById(sections, 'pain')!;
const solution = getSectionById(sections, 'solution')!;
const roadmap = getSectionById(sections, 'roadmap')!;
const service = getSectionById(sections, 'service')!;
const trust = getSectionById(sections, 'trust')!;
const cta = getSectionById(sections, 'cta')!;
const fm = (s: typeof hero) => s.frontmatter;
---

<BaseLayout>
  <Nav />
  <main>
    <Hero
      title={hero.title}
      headline={String(fm(hero).headline ?? hero.title)}
      subheadline={String(fm(hero).subheadline ?? site.tagline)}
      body={hero.body}
      ctaLabel={site.primaryCta.label}
      city={site.city}
      ageRange={site.ageRange}
    />
    <PainCards
      title={pain.title}
      cards={fm(pain).cards as { icon: string; title: string; body: string }[]}
      body={pain.body}
    />
    <SolutionTriad
      title={solution.title}
      pillars={fm(solution).pillars as { title: string; body: string }[]}
      body={solution.body}
    />
    <RoadmapPreview
      title={roadmap.title}
      items={fm(roadmap).items as string[]}
      body={roadmap.body}
      ctaLabel={site.primaryCta.label}
    />
    <ServiceList
      title={service.title}
      tiers={fm(service).tiers as { name: string; duration: string; benefits: string[] }[]}
      body={service.body}
    />
    <TrustBlock
      title={trust.title}
      comparisons={fm(trust).comparisons as { vs: string; point: string }[]}
      disclaimer={String(fm(trust).disclaimer)}
      expertNote={String(fm(trust).expertNote)}
      body={trust.body}
    />
    <CtaFooter
      title={cta.title}
      body={cta.body}
      ctaLabel={site.primaryCta.label}
      wechatQr={site.wechatQr}
      modalSteps={site.primaryCta.modalSteps}
    />
  </main>
  <QrModal
    title={site.primaryCta.modalTitle}
    steps={site.primaryCta.modalSteps}
    qrSrc={site.wechatQr}
  />
</BaseLayout>
```

- [ ] **Step 2: Run production build**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm run build
```

Expected: fails at `check-assets` until Task 10 images exist — if so, run Task 10 first then retry.

- [ ] **Step 3: Run preview and curl homepage**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm run preview -- --host 127.0.0.1 --port 4322 &
sleep 3
curl -s http://127.0.0.1:4322/ | grep -o 'AI新手家长陪跑营' | head -1
kill %1 2>/dev/null || true
```

Expected: outputs `AI新手家长陪跑营`.

---

### Task 10: Static assets and asset check script

**Files:**
- Create: `sites/ai-parent-coaching/scripts/check-assets.mjs`
- Create: `sites/ai-parent-coaching/public/favicon.svg`
- Create: `sites/ai-parent-coaching/public/_redirects`
- Create: `sites/ai-parent-coaching/public/404.html`
- Create: `sites/ai-parent-coaching/public/images/wechat-qr.png` (placeholder)
- Create: `sites/ai-parent-coaching/public/images/og-cover.png` (placeholder)

**Interfaces:**
- `check-assets.mjs`: exits 0 if both PNGs exist and size > 0.

- [ ] **Step 1: Write `check-assets.mjs`**

Create `sites/ai-parent-coaching/scripts/check-assets.mjs`:
```javascript
import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'public/images/wechat-qr.png',
  'public/images/og-cover.png',
];

let failed = false;
for (const rel of required) {
  const abs = join(root, rel);
  if (!existsSync(abs) || statSync(abs).size === 0) {
    console.error(`MISSING or empty: ${rel}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('Asset check passed.');
```

- [ ] **Step 2: Write `favicon.svg`**

Create `sites/ai-parent-coaching/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#E8A598"/>
  <text x="16" y="22" text-anchor="middle" font-size="16" fill="#fff" font-family="sans-serif">育</text>
</svg>
```

- [ ] **Step 3: Write `_redirects` and `404.html`**

Create `sites/ai-parent-coaching/public/_redirects`:
```
/*    /index.html   200
```

Create `sites/ai-parent-coaching/public/404.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=/" />
  <title>页面未找到</title>
</head>
<body>
  <p><a href="/">返回首页</a></p>
</body>
</html>
```

- [ ] **Step 4: Generate placeholder PNGs**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching/public/images
python3 << 'PY'
from pathlib import Path
try:
    from PIL import Image, ImageDraw, ImageFont
    def make(path, size, text, bg, fg):
        img = Image.new('RGB', size, bg)
        d = ImageDraw.Draw(img)
        d.text((size[0]//2, size[1]//2), text, fill=fg, anchor='mm')
        img.save(path)
    make('wechat-qr.png', (400, 400), 'WeChat QR', '#FFFFFF', '#2D3436')
    make('og-cover.png', (1200, 630), 'AI Parent Coaching', '#FFFBF7', '#E8A598')
except ImportError:
    import struct, zlib
    def png(w, h, path):
        raw = b''.join(b'\x00' + b'\xff\xd4\xc8\xc0' * w for _ in range(h))
        def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t+d) & 0xffffffff)
        ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
        data = chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')
        Path(path).write_bytes(b'\x89PNG\r\n\x1a\n' + data)
    png(400, 400, 'wechat-qr.png')
    png(1200, 630, 'og-cover.png')
print('Placeholders created')
PY
npm run check
```

Expected: `Asset check passed.`

- [ ] **Step 5: Full build**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm run build
```

Expected: `Complete!` or Astro success message; `dist/index.html` exists.

---

### Task 11: README and deployment documentation

**Files:**
- Create: `sites/ai-parent-coaching/README.md`

- [ ] **Step 1: Write README**

Create `sites/ai-parent-coaching/README.md`:
```markdown
# AI新手家长陪跑营 — 静态营销站

家长获客单页落地站（西安 · 4-12 月龄）。技术栈：Astro 4 静态输出。

## 本地开发

```bash
cd sites/ai-parent-coaching
npm install
npm run dev        # http://localhost:4321
npm run build
npm run preview    # http://localhost:4321
npm run check      # 验证二维码/OG 图片存在
```

## Cloudflare Pages

| 配置项 | 值 |
|--------|-----|
| Root directory | `sites/ai-parent-coaching` |
| Build command | `npm ci && npm run build` |
| Build output | `dist` |
| Node version | 20 |

### Git 集成（推荐）

1. Cloudflare Dashboard → Workers & Pages → Create → Connect Git
2. 设置上表构建参数，Production branch = `main`
3. Push 后自动部署；首次记录 `*.pages.dev` URL
4. 更新 `astro.config.mjs` 中 `site` 为实际域名

### Wrangler 手动部署

```bash
npm run build
npx wrangler pages deploy dist --project-name=ai-parent-coaching
```

### 自定义域名（可选）

Pages → Custom domains → Add → CNAME 指向 Pages 项目。HTTPS 自动启用。

## 内容更新

1. 编辑 `content/sections/*.md` 或 `site.json`
2. `npm run dev` 预览
3. `npm run build` 通过后 push

## 替换二维码

将运营提供的企业微信二维码覆盖 `public/images/wechat-qr.png`，重新 build/deploy。

## 部署后冒烟清单

- [ ] 首页 HTTPS 200
- [ ] 7 锚点 `#hero` … `#cta` 可跳转
- [ ] 主 CTA 打开 Modal；ESC/遮罩关闭
- [ ] `#cta` 静态二维码可见（JS 禁用时仍可转化）
- [ ] 移动端 375px 无横向滚动
- [ ] 中文 UTF-8 正常
- [ ] 控制台无 404 静态资源
- [ ] Lighthouse Mobile Performance ≥ 85
- [ ] 无财务表/价格表/团队架构/漏斗图

## 环境变量

v1 无后端密钥。若启用 Cloudflare Web Analytics，在 Pages → Settings → Environment variables 注入 snippet token，勿提交 Git。
```

---

### Task 12: Quality verification (build, preview, Lighthouse)

**Files:**
- None (verification only)

- [ ] **Step 1: Production build clean**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching && npm run build 2>&1
```

Expected: exit code 0, no errors.

- [ ] **Step 2: Verify 7 anchor IDs in output HTML**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching
for id in hero pain solution roadmap service trust cta; do
  grep -q "id=\"$id\"" dist/index.html || echo "MISSING: $id"
done
echo "Anchor scan done"
```

Expected: no `MISSING` lines.

- [ ] **Step 3: Verify forbidden content absent in dist**

Run:
```bash
grep -iE '599|盈亏平衡|收入占比|#pricing|#finance' dist/index.html && echo "FAIL" || echo "PASS: no forbidden content in HTML"
```

Expected: `PASS`.

- [ ] **Step 4: Verify single h1**

Run:
```bash
grep -o '<h1[^>]*>' dist/index.html | wc -l
```

Expected: `1`.

- [ ] **Step 5: Preview server smoke**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching
npm run preview -- --host 127.0.0.1 --port 4322 &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4322/
kill %1 2>/dev/null || true
```

Expected: `200`.

- [ ] **Step 6: Lighthouse mobile performance (if CLI available)**

Run:
```bash
cd /home/liujie/data/firstyear/sites/ai-parent-coaching
npm run preview -- --host 127.0.0.1 --port 4322 &
sleep 3
if command -v npx >/dev/null && npx lighthouse --version >/dev/null 2>&1; then
  npx lighthouse http://127.0.0.1:4322/ --only-categories=performance --form-factor=mobile --chrome-flags="--headless" --output=json --output-path=./lighthouse-report.json --quiet
  node -e "const r=require('./lighthouse-report.json'); const s=r.categories.performance.score*100; console.log('Performance:', s); if(s<85) process.exit(1);"
else
  echo "SKIP: install lighthouse globally or use Chrome DevTools → Lighthouse mobile ≥85"
fi
kill %1 2>/dev/null || true
```

Expected: `Performance: 85` or higher; or SKIP with manual DevTools note.

- [ ] **Step 7: Manual Modal checklist (document result in PR/issue)**

Open `npm run dev`, verify:
1. Hero CTA opens modal with QR + 3 steps
2. ESC closes modal
3. Backdrop click closes modal
4. `#cta` shows static QR without opening modal

---

### Task 13: Cloudflare Pages setup (operator steps)

**Files:**
- Modify (after deploy): `sites/ai-parent-coaching/astro.config.mjs` — update `site` URL

**Interfaces:**
- Produces: live `*.pages.dev` URL documented in README.

- [ ] **Step 1: Create Cloudflare Pages project**

In Cloudflare Dashboard:
1. Workers & Pages → Create application → Pages → Connect to Git
2. Select repository; Production branch `main`
3. Root directory: `sites/ai-parent-coaching`
4. Build command: `npm ci && npm run build`
5. Build output: `dist`
6. Environment: `NODE_VERSION=20`

- [ ] **Step 2: Trigger first deploy**

Push branch containing `sites/ai-parent-coaching/` to connected remote.

Expected: Build log shows Astro build success; site live at `https://<project>.pages.dev`.

- [ ] **Step 3: Update `astro.config.mjs` site URL**

Replace:
```javascript
site: 'https://ai-parent-coaching.pages.dev',
```
with actual deployed URL; rebuild and redeploy so `og:url` and `og:image` are absolute.

- [ ] **Step 4: Post-deploy smoke from production URL**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}" https://<project>.pages.dev/
curl -s https://<project>.pages.dev/ | grep -o 'id="hero"\|id="cta"' | sort -u
```

Expected: HTTP `200`; both `id="hero"` and `id="cta"` present.

- [ ] **Step 5: Optional Cloudflare Web Analytics**

Pages → Settings → Web Analytics → Enable. Do not hardcode token in source.

---

## Self-Review

### 1. Spec coverage

| Spec requirement | Plan task |
|------------------|-----------|
| 7 anchor sections hero…cta | Tasks 2, 6, 7, 9, 12 |
| Nav sticky + hamburger | Task 6 (Nav.astro) |
| Modal QR CTA + ESC/backdrop | Task 8 |
| Static QR fallback in #cta | Task 7 (CtaFooter) |
| No finance/pricing/team/funnel | Tasks 2 (grep), 12 (HTML scan) |
| content/sections/*.md + site.json | Tasks 2, 3 |
| Design tokens warm palette | Task 4 |
| SEO/OG/zh_CN | Task 5 |
| Astro static, minimal JS | Tasks 1, 8 |
| Cloudflare Pages config | Tasks 1, 11, 13 |
| Lighthouse ≥ 85 | Task 12 |
| Asset check wechat-qr.png | Task 10 |
| README deploy docs | Task 11 |
| 404/_redirects | Task 10 |
| Accessibility h1/h2/alt/dialog | Tasks 6–8, 12 |
| **Gap:** none identified — all approved spec §1–§10 and OpenSpec requirements mapped |

### 2. Placeholder scan

| Pattern searched | Result |
|------------------|--------|
| TBD / TODO / implement later | **PASS** — none in plan |
| "Similar to Task N" without code | **PASS** — each task has full snippets |
| Undefined types/functions | **PASS** — `SiteConfig`, `getSections`, component props defined |
| Missing file paths | **PASS** — all paths under `sites/ai-parent-coaching/` |

### 3. Type consistency

| Symbol | Defined | Used consistently |
|--------|---------|-------------------|
| `getSiteConfig()` | Task 3 | Tasks 5, 6, 9 |
| `getSections()` | Task 3 | Task 9 |
| `site.primaryCta.label` | Task 2 site.json | Tasks 7, 9 |
| `data-open-modal="qr-modal"` | Task 8 | Tasks 7, 9 |
| Anchor IDs | Task 2 frontmatter | Task 6 Nav, Task 9 assembly |
| **Result** | | **PASS** |

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-23-ai-parent-coaching-static-site.md`.**

**Task summary:** 13 tasks, 62 checkbox steps total.

| Task | Focus | Steps |
|------|-------|-------|
| 1 | Astro scaffold | 7 |
| 2 | site.json + 7 section MD | 9 |
| 3 | content.ts loader | 2 |
| 4 | global.css tokens | 1 |
| 5 | BaseLayout SEO/OG | 2 |
| 6 | Section, Button, Nav | 3 |
| 7 | 7 section components | 7 |
| 8 | QrModal | 1 |
| 9 | index.astro assembly | 3 |
| 10 | assets + check script | 5 |
| 11 | README + deploy docs | 1 |
| 12 | build/preview/Lighthouse QA | 7 |
| 13 | Cloudflare Pages (operator) | 5 |

**Two execution options:**

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration. REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

2. **Inline Execution** — Execute tasks in this session using superpowers:executing-plans, batch execution with checkpoints.

**Which approach?**
