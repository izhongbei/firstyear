## 1. Design token

- [x] 1.1 更新 `src/styles/global.css` 为 v2 token（背景 `#FAFAFA`、正文 `#1A1A1A`、边框 `#E5E5E5`、主色仅 CTA）
- [x] 1.2 统一 `.card`、`.section` 间距与圆角（按钮 8px、卡片 12px）
- [x] 1.3 本地 `npm run preview` 抽查全局背景/正文字色

## 2. 顶栏与按钮

- [x] 2.1 重构 `Nav.astro`：毛玻璃 sticky、细底边、移动汉堡菜单
- [x] 2.2 重构 `Button.astro`：主/次按钮圆角与 hover 态
- [x] 2.3 验证 375px 触控区 ≥ 44px、锚点链接可跳转

## 3. Hero

- [x] 3.1 重构 `Hero.astro`：桌面左对齐、胶囊 meta 标签、标题层级
- [x] 3.2 添加 `@media (max-width: 768px)` 居中布局
- [x] 3.3 可选：添加 `public/images/hero-accent.svg` 并在 Hero 引用

## 4. Solution 与 Trust

- [x] 4.1 重构 `SolutionTriad.astro`：三列描边极简卡片
- [x] 4.2 重构 `TrustBlock.astro`：对比网格/勾选样式，保留免责
- [x] 4.3 验证 `#solution`、`#trust` 与 Hero 视觉一致

## 5. 次要区块 token 统一

- [x] 5.1 调整 `PainCards.astro`、`RoadmapPreview.astro`、`ServiceList.astro`、`CtaFooter.astro` 仅样式（不改 DOM）
- [x] 5.2 确认无旧版大面积珊瑚色背景残留

## 6. 质量与部署回归

- [x] 6.1 `npm run build` 无 error；`dist/` 无 `_redirects`
- [x] 6.2 7 锚点、Modal CTA、静态二维码降级路径手动冒烟
- [ ] 6.3 Lighthouse Mobile Performance ≥ 85
- [ ] 6.4 `git push` 后确认 Cloudflare 部署成功
