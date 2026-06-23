# AI 新手家长陪跑营静态营销站 — 合并设计规格

> **文档类型**：Brainstorming 合并设计规格（Superpowers）  
> **日期**：2026-06-23  
> **状态**：已批准，待进入 writing-plans / 实现  
> **关联 OpenSpec**：`openspec/changes/ai-parent-coaching-static-site/`

---

## 1. 摘要与目标

### 1.1 背景

《AI新手家长陪跑营商业计划书 V2.0》目前仅有 Markdown 源文件。v1 站点**不是**面向投资人/合伙人的完整商业计划书展示页，而是面向**西安本地 4–12 月龄宝宝家庭**的**家长获客落地页**（parent lead-gen）。

### 1.2 核心目标

| 目标 | 说明 |
|------|------|
| **获客** | 引导家长领取免费《4–12月龄成长路线图》（微信群内发放 PDF） |
| **信任** | 传达「AI + 专家 + 社区」陪跑价值，降低育儿焦虑 |
| **低成本上线** | Astro 静态站 + Cloudflare Pages 免费托管 |
| **可维护** | 内容以 `content/sections/*.md` + `site.json` 为单一事实来源 |

### 1.3 成功标准（v1）

- 单页 7 区块信息架构完整，锚点导航可用
- 主 CTA「领取免费路线图」打开 Modal 展示企业微信二维码
- 移动端首屏可读，Lighthouse Performance ≥ 85
- Cloudflare Pages 部署成功，SEO/OG/微信分享元数据正确
- **不包含**财务、团队架构、收入表、加盟扩张、支付、后端

---

## 2. 用户决策表（已批准）

| 维度 | 决策 | 备注 |
|------|------|------|
| **受众** | 家长获客（西安，4–12 月龄家庭） | 非投资人路演站 |
| **主 CTA** | 领取免费《4–12月龄成长路线图》 | Modal 内企业微信二维码；PDF 在群内发放 |
| **页面形态** | Approach A：中等体量单页 + Modal QR | 非多页、非完整 BP 翻页 |
| **信息架构** | 7 锚点：`#hero` `#pain` `#solution` `#roadmap` `#service` `#trust` `#cta` | **禁止**使用 `#pricing`、`#finance`、`#business` 等旧锚点 |
| **技术栈** | Astro 4.x + 组件化 + 最小 JS | Modal 为唯一必要客户端交互 |
| **配色** | 暖色育儿风（见 §4） | 避免泛 AI 紫色渐变 |
| **内容源** | `sites/ai-parent-coaching/content/sections/*.md` + `site.json` | 与 7 锚点一一对应 |
| **部署** | Cloudflare Pages（Git 集成或 Wrangler） | `output: static`，Node 20 |
| **v1 排除** | 财务、团队组织、收入表、加盟/扩张、支付、后端 | 商业计划书相关章节仅作**文案素材**，不整章上站 |

---

## 3. 信息架构（7 区块）

单页 `index.astro` 按固定顺序组装；`Nav.astro` 锚点链接与下表 ID **必须一致**。

| 锚点 ID | 区块名 | 用户目标 | 内容要点（源自商业计划书，家长向改写） |
|---------|--------|----------|----------------------------------------|
| `#hero` | 首屏 | 3 秒内理解「为谁、解决什么」 | 项目名、西安、4–12 月龄；价值主张「下一步该做什么」；**主 CTA 按钮**（触发 Modal） |
| `#pain` | 痛点共鸣 | 感到被理解 | 月嫂离开后辅食/睡眠/发育/疫苗/发烧等具体问题；信息碎片化焦虑（百度/小红书/宝妈群） |
| `#solution` | 解决方案 | 知道我们怎么帮 | 「不卖课程，卖安全感、陪伴感、可执行方案」；AI 7×24 + 专家答疑 + 本地线下活动三位一体 |
| `#roadmap` | 免费路线图 | 理解引流品价值 | 《4–12月龄成长路线图》内容预览：发育重点、疫苗、辅食、大运动、睡眠；**再次 CTA** |
| `#service` | 陪跑服务 | 了解会员能做什么 | 体验营与陪跑会员**权益描述**（主题任务、打卡、直播课、AI 助手、专家答疑、线下活动）；**不写具体价格表、不写收入占比** |
| `#trust` | 信任背书 | 降低顾虑 | 竞争优势（对比月子中心/线上课/宝妈群/纯 AI）；医疗免责声明（不替代医生）；可选专家资质一句话（非团队组织架构图） |
| `#cta` | 行动号召 | 完成转化动作 | 强化领取路线图；企业微信二维码（页内展示 + 与 Modal 同源图片）；简短步骤「扫码 → 进群 → 领 PDF」 |

### 3.1 导航行为

- Sticky 顶栏；移动端 hamburger 折叠
- `scroll-behavior: smooth`（CSS）；锚点跳转后焦点可至目标 `h2`（`tabindex="-1"` 可选）
- 导航文案示例：首页 / 痛点 / 方案 / 路线图 / 服务 / 信任 / 领取

### 3.2 明确不上站的内容（来自商业计划书）

以下章节**不得**作为独立区块或完整表格出现在 v1：

- 四、商业模式（收入表、漏斗转化率）
- 五、运营模式（团队角色分工）
- 六、财务模型（启动投入、盈亏平衡、阶段收入目标）
- 九、未来规划中的加盟/多城复制表述（可省略或一句带过，不做时间轴专题）

---

## 4. 视觉与组件

### 4.1 设计令牌（Design Tokens）

```css
/* 品牌色 */
--color-primary:    #E8A598;  /* 暖珊瑚 — 主色、CTA */
--color-secondary:  #7BAE7F;  /* 柔和绿 — 成长、强调 */
--color-bg:         #FFFBF7;  /* 暖白背景 */
--color-surface:    #FFFFFF;  /* 卡片底 */
--color-text:       #2D3436;  /* 正文 */
--color-text-muted: #636E72;  /* 次要文案 */
--color-border:     #E8E4E0;  /* 分隔线 */

/* 字体 */
--font-sans: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;

/* 布局 */
--content-max-width: 960px;
--section-spacing: 5rem;      /* 区块垂直间距 */
--radius-card: 12px;
```

### 4.2 Astro 组件清单

| 组件 | 职责 |
|------|------|
| `BaseLayout.astro` | HTML 壳、SEO/OG、全局样式引入 |
| `Nav.astro` | 7 锚点导航，sticky + 移动菜单 |
| `Hero.astro` | 首屏 + 主 CTA 按钮 |
| `Section.astro` | 通用 section 包装（id、标题、slot） |
| `PainCards.astro` | 痛点卡片网格 |
| `SolutionTriad.astro` | AI / 专家 / 社区三列 |
| `RoadmapPreview.astro` | 路线图要点列表 + 次级 CTA |
| `ServiceList.astro` | 服务权益列表（无价格） |
| `TrustBlock.astro` | 对比要点 + 免责声明 |
| `CtaFooter.astro` | 底部 CTA 区 + 二维码 |
| `QrModal.astro` | 企业微信二维码 Modal（唯一需少量 JS） |
| `Button.astro` | 主/次按钮样式复用 |

**v1 不实现**：`PricingTable.astro`、`Funnel.astro`、`FinanceTable.astro`、`TeamOrg.astro`。

### 4.3 JavaScript 策略

- Astro `output: 'static'`，默认零 JS
- **唯一客户端脚本**：`QrModal` — 打开/关闭 Modal、ESC 关闭、`aria-modal` / `role="dialog"`、焦点陷阱（轻量实现，无 React/Vue）
- 无表单提交、无 fetch、无 Analytics SDK（可选 Cloudflare Web Analytics 通过 HTML snippet 注入，无构建时依赖）

### 4.4 响应式

- Mobile-first；断点建议：`768px`（平板）、`1024px`（桌面）
- 长列表卡片化；**不使用**宽表格展示财务/收入数据
- 图片 `loading="lazy"`，`alt` 必填

---

## 5. 内容结构与工作流

### 5.1 目录结构

```
sites/ai-parent-coaching/
├── package.json
├── astro.config.mjs
├── site.json                    # 站点元数据（见 §5.2）
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── og-cover.png         # OG 分享图（建议 1200×630）
│   │   └── wechat-qr.png        # 企业微信二维码
│   └── _redirects               # 可选：404 → /
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
    ├── layouts/
    │   └── BaseLayout.astro
    ├── components/              # 见 §4.2
    ├── styles/
    │   └── global.css
    └── pages/
        └── index.astro          # 读取 sections + site.json 组装
```

### 5.2 `site.json`  schema

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

### 5.3 Section Markdown 约定

每个 `content/sections/<name>.md` 对应一个锚点，frontmatter 示例：

```yaml
---
id: pain
title: 你是不是也这样焦虑？
order: 2
---
```

正文为家长向中文；从 `AI新手家长陪跑营商业计划书V2.md` **摘录改写**，非整章粘贴。实现阶段可用 Astro Content Collections 或直接 `import.meta.glob` 读取。

### 5.4 内容更新流程

1. 编辑 `content/sections/*.md` 或 `site.json`
2. 本地 `npm run dev` 预览
3. `npm run build` 通过后 push → Cloudflare Pages 自动部署
4. 按 §8 测试清单冒烟

---

## 6. Cloudflare Pages 部署

| 配置项 | 值 |
|--------|-----|
| Root directory | `sites/ai-parent-coaching` |
| Framework preset | Astro |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Node version | 20（`.node-version` 或 `NODE_VERSION=20`） |
| Production branch | `main`（或团队约定分支） |

**方式 A（推荐）**：Git 仓库连接 Cloudflare Pages，push 触发构建。

**方式 B**：本地 `npm run build` 后 `npx wrangler pages deploy dist --project-name=ai-parent-coaching`。

**安全**：API Token、Account ID 不得入库；Analytics token 走 Pages Environment Variables。

**自定义域**：可选；v1 可用 `*.pages.dev` 验证。DNS CNAME → Pages 项目，自动 HTTPS。

**404**：`public/404.html` 或 `_redirects` 将未知路径指向 `/`（单页站策略，在 README 说明）。

---

## 7. SEO 与微信分享

### 7.1 元数据（`BaseLayout.astro` + `site.json`）

```html
<title>AI新手家长陪跑营 | 西安 4-12月龄科学育儿陪跑</title>
<meta name="description" content="..." />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta charset="UTF-8" />
<meta property="og:locale" content="zh_CN" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://<domain>/images/og-cover.png" />
<meta property="og:url" content="https://<domain>/" />
```

### 7.2 微信分享注意

- 微信对 OG 抓取不稳定；**关键转化在页内二维码 + Modal**，不依赖分享卡片
- `og:image` 使用绝对 URL；图片 ≤ 300KB，建议 1200×630
- 可选后续：微信 JS-SDK 自定义分享（v2，需公众号）

### 7.3 结构化数据（可选 v1.1）

- `LocalBusiness` 或 `Organization` JSON-LD（西安、育儿服务）— v1 可省略

---

## 8. 错误处理与测试

### 8.1 运行时错误处理

| 场景 | 行为 |
|------|------|
| 二维码图片 404 | `img` `onerror` 显示占位文案「请联系客服获取二维码」；构建前 CI 检查 `public/images/wechat-qr.png` 存在 |
| Modal JS 失败 | CTA 区仍展示静态二维码，转化路径不中断 |
| 某 section MD 缺失 | 构建失败（显式 import/glob）；开发时 console warning |
| `site.json` 解析失败 | 构建失败，错误信息指向 JSON 行号 |

### 8.2 部署后测试清单

- [ ] 首页 HTTP 200，HTTPS 有效
- [ ] 7 个锚点均可跳转且对应内容可见
- [ ] 主 CTA 打开 Modal，ESC/遮罩可关闭，键盘可访问
- [ ] 移动端（≤375px）首屏无横向滚动
- [ ] 中文无乱码（UTF-8）
- [ ] `og:title` / `og:description` / `og:image` 在分享调试工具中可预览
- [ ] 控制台无 404 静态资源
- [ ] Lighthouse Mobile Performance ≥ 85
- [ ] **确认无**财务表、价格表、团队架构图、收入漏斗图

### 8.3 本地命令

```bash
cd sites/ai-parent-coaching
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

---

## 9. OpenSpec 对齐说明

本合并规格为 brainstorming 批准后的**权威设计**，用于细化并**取代** OpenSpec change 中面向「完整商业计划书展示」的草案：

| OpenSpec 文件 | 对齐动作 |
|---------------|----------|
| `proposal.md` | 受众收窄为家长获客；删除投资人/财务展示目标 |
| `design.md` | IA 重写为 7 区块；组件表移除 Pricing/Funnel；内容路径改为 `content/sections/` |
| `specs/marketing-site/spec.md` | 需求改为 7 锚点、Modal CTA、无财务/商业模式整章 |
| `specs/cloudflare-pages-deploy/spec.md` | 冒烟清单锚点更新为 hero…cta |
| `tasks.md` | 任务列表与 v1 范围一致 |

实现阶段执行 `/opsx:apply` 或按 `tasks.md` 逐项完成。

---

## 10. v1 范围外（Out of Scope）

| 排除项 | 说明 |
|--------|------|
| 财务模型 / 盈亏平衡 | 不上站 |
| 团队组织架构 | 不上站；信任区最多一句专家背书 |
| 收入表 / 价格表 / 转化漏斗图 | 不上站；服务区仅权益描述 |
| 加盟 / 多城扩张 | 不上站 |
| 在线支付 / 订单 | 无 |
| 用户登录 / 后端 API | 无 |
| 微信小程序 | v2 |
| 表单后端 / CMS | v2；v1 仅二维码导流 |
| 多语言 | v1 仅简体中文 |
| 完整商业计划书 PDF 下载 | 仅引流用《路线图》通过微信群发放 |

---

## 附录 A：区块与商业计划书映射（素材来源）

| 站点区块 | 商业计划书参考章节 | 使用方式 |
|----------|-------------------|----------|
| hero | 一、项目概述 | 提炼定位与理念 |
| pain | 二、市场机会 | 痛点与家长场景 |
| solution | 一、核心理念 + 三、产品体系（概念层） | 三位一体，不讲四层定价 |
| roadmap | 三、第一层：免费引流产品 | 路线图内容预览 |
| service | 三、第二～四层（权益描述） | 去掉具体金额与增值服务价目 |
| trust | 七、竞争优势 + 八、风险控制（免责） | 对比 + 医疗声明 |
| cta | 三、第一层 CTA 转化 | 扫码领 PDF |

---

*文档版本：1.0 | 批准日期：2026-06-23*
