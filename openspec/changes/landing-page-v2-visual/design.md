## Context

v1 站点已部署（Cloudflare Workers + Astro 静态）。本变更为**纯视觉层**升级，不改变信息架构与转化逻辑。

## Goals / Non-Goals

**Goals:**
- 现代简洁（中性底 + 单点暖色 CTA）
- 重点升级 Nav、Hero、#solution、#trust
- 桌面 Hero 左对齐；移动 375px 无横向滚动
- Lighthouse Mobile ≥ 85

**Non-Goals:**
- 新页面/锚点、表单、分析、文案策略重写
- 更换技术栈或部署方式

## Decisions

### 1. Design token v2

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FAFAFA` | 页面背景 |
| `--color-surface` | `#FFFFFF` | 卡片 |
| `--color-text` | `#1A1A1A` | 标题/正文 |
| `--color-text-muted` | `#6B7280` | 副标题 |
| `--color-border` | `#E5E5E5` | 卡片描边 |
| `--color-primary` | `#E8A598` | **仅** CTA、链接、小标签 |
| `--color-secondary` | `#7BAE7F` | icon/徽章，面积 ≤5% |
| `--radius-button` | `8px` | 按钮 |
| `--radius-card` | `12px` | 卡片 |
| `--section-spacing` | `5rem` | 普通区块 |
| `--hero-spacing` | `6rem` | Hero 区块 |

### 2. 组件改造范围

| 组件 | 改动级别 |
|------|----------|
| `Nav.astro` | 全量：毛玻璃 sticky、细底边、移动菜单 |
| `Hero.astro` | 全量：左对齐布局、胶囊 meta、字号层级 |
| `SolutionTriad.astro` | 全量：三列描边卡片 |
| `TrustBlock.astro` | 全量：对比网格/勾选样式 |
| `Button.astro` | 全量：圆角与 hover |
| `PainCards` 等 | token 级 |

### 3. 实现约束

- 纯 CSS，不新增 npm 包
- 保持 `MarkdownBody` + `Content` 渲染路径
- 不引入 `_redirects`（Workers 静态资源已知坑）

## Risks / Trade-offs

- 中性底可能略减「育儿暖感」→ 靠文案与 CTA 暖色补偿
- Hero 左对齐在极窄屏改居中 → `@media (max-width: 768px)` 覆盖

## Migration

1. 本地 `npm run build && npm run preview`
2. `git push` 触发 Cloudflare 自动部署
3. 回滚：`git revert` 对应 commit
