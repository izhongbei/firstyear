## Why

v1 静态获客站（`sites/ai-parent-coaching/`）已上线，转化路径可用，但视觉偏「模板感」，不利于微信分享场景下的品牌信任。需要在**不改变 7 锚点 IA 与企微 Modal CTA** 的前提下，将落地页升级为现代简洁风格，提升专业感。

## What Changes

- 更新 `global.css` design token：中性底 `#FAFAFA`、深色正文、暖珊瑚色**仅用于 CTA/链接**
- 视觉重构 `Nav.astro`、`Hero.astro`（桌面左对齐 + 胶囊标签）、`SolutionTriad.astro`、`TrustBlock.astro`、`Button.astro`
- 其余 section 组件（`PainCards`、`RoadmapPreview`、`ServiceList`、`CtaFooter`）仅继承新 token，不改 DOM 结构
- 可选新增 `public/images/hero-accent.svg` 装饰
- 无新 npm 依赖、无后端、无部署配置变更

## Capabilities

### New Capabilities

- `landing-visual-v2`: v2 现代简洁视觉层—design token、重点区块版式、响应式与性能回归

### Modified Capabilities

<!-- marketing-site 行为不变，仅视觉层叠加；delta 见 landing-visual-v2 -->

## Impact

- **改动目录**：`sites/ai-parent-coaching/src/styles/`、`src/components/`（Nav、Hero、SolutionTriad、TrustBlock、Button 及 token 级调整）
- **无影响**：`content/sections/*.md` 语义、`site.json` CTA 路径、`wrangler.toml` 部署链路
- **外部依赖**：无新增

## Out of Scope

新锚点、表单、分析 SDK、SEO 文案大改、`firstyear.cn` 域名绑定、财务/定价内容。
