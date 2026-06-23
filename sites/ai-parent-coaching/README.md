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
cd sites/ai-parent-coaching
npm ci && npm run build
npx wrangler login          # 首次需浏览器授权
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
