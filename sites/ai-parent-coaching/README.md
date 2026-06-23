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

## Cloudflare 部署

本站点为 **Astro 纯静态输出**（`output: 'static'`），产物在 `dist/`。

### 先确认：Workers Builds 还是 Pages？

| 现象 | 你用的产品 | 本文档章节 |
|------|-----------|-----------|
| Dashboard **Deploy command 不能为空**（默认 `npx wrangler deploy`） | **Workers Builds**（Git 连 Worker） | 下一节「Workers Builds」 |
| 只有 Build command + Build output directory，无 Deploy 或 Deploy 可留空 | **Pages**（Connect to Git → Pages） | 「Pages Git（可选）」 |

**常见误配**：在 Workers Builds 里只填 `npx wrangler deploy` 但**没有** `wrangler.toml` 的 `[assets]`，会报错：`Could not detect a directory containing static files`。

---

### Workers Builds（Deploy command 必填 — 推荐按此配置）

仓库已包含 `wrangler.toml`，声明静态资源目录为 `./dist`。Dashboard 中 **Project name** 须与 `wrangler.toml` 的 `name` 一致（`ai-parent-coaching`）。

#### Dashboard 字段（逐项复制）

在 **Workers & Pages** → 你的 Worker → **Settings** → **Build**：

| 配置项 | 复制粘贴值 |
|--------|-----------|
| Root directory | `sites/ai-parent-coaching` |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload`（默认即可） |

**Environment variables**（Settings → Variables，Build 阶段可用）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `20` | 与 `package.json` engines 一致 |

**API Token**：Workers Builds 首次连接 Git 时 Cloudflare 通常**自动生成** Build 用 API Token，一般**无需**手动填 `CLOUDFLARE_API_TOKEN`。若改用自建 Token，需具备 Workers Scripts (edit) 等权限（见 [Workers Builds 文档](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)）。

**本地 / 外部 CI 手动部署**（非 Dashboard 自动构建时）需环境变量：

```bash
export CLOUDFLARE_API_TOKEN="<你的 API Token>"
export CLOUDFLARE_ACCOUNT_ID="<Account ID，Dashboard 右侧栏>"
cd sites/ai-parent-coaching
npm ci && npm run build
npx wrangler deploy
```

Account ID：Dashboard → 任意 Worker → 右侧 **Account ID**。

#### 创建步骤摘要

1. **Workers & Pages** → **Create** → **Worker** → **Connect to Git**
2. 选仓库与 Production branch（如 `main`）
3. **Project name**：`ai-parent-coaching`（与 `wrangler.toml` 的 `name` 一致）
4. 按上表填 Root / Build / Deploy
5. Save and Deploy；成功后访问 `https://ai-parent-coaching.<你的子域>.workers.dev` 或绑定的自定义域
6. 将实际公网 URL 写入 `astro.config.mjs` 的 `site` 后再次 push（影响 canonical / OG URL）

---

### Pages Git（Deploy command 可留空 — 备选）

若项目类型为 **Pages**（创建时选 Pages → Connect to Git），**不要**填 Deploy command；构建完成后 Cloudflare 自动发布 `dist`。

| 配置项 | 值 |
|--------|-----|
| Framework preset | **None** 或 **Astro** |
| Root directory | `sites/ai-parent-coaching` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Deploy command | **留空** |
| `NODE_VERSION` | `20` |

若新版 Pages UI **强制**填写 Deploy command，使用 Pages 专用命令（**不是** `wrangler deploy`）：

```text
npx wrangler pages deploy dist --project-name=ai-parent-coaching
```

此时需在 `package.json` 的 `devDependencies` 中已有 `wrangler`（本仓库已添加）。Git 集成下 Cloudflare 通常注入 `CLOUDFLARE_API_TOKEN`；外部 CI 另需 `CLOUDFLARE_ACCOUNT_ID`。

---

### Wrangler 命令行手动部署（不经 Git 自动构建）

```bash
cd sites/ai-parent-coaching
npm ci && npm run build
npx wrangler login          # 首次需浏览器授权

# Workers 静态资源（与 wrangler.toml 一致）
npx wrangler deploy

# 或 Pages 项目（Direct Upload）
npx wrangler pages deploy dist --project-name=ai-parent-coaching
```

---

### 故障排查

#### `Could not detect a directory containing static files`

- **Workers Builds**：确认仓库根下 `sites/ai-parent-coaching/wrangler.toml` 存在，且含 `[assets] directory = "./dist"`；Build 须成功生成 `dist/`；Root directory 为 `sites/ai-parent-coaching`。
- **误用**：Deploy 填了 `npx wrangler deploy` 但未配置 assets（见上）。
- **Pages**：勿用 `wrangler deploy`；改用留空 Deploy 或 `wrangler pages deploy dist --project-name=...`。

#### `No dependencies detected to cache (likely wrong root directory)`

- **原因**：Root directory 未指向含 `package.json` 的目录。
- **修复**：Root directory = `sites/ai-parent-coaching`。

#### Deploy command 不能为空

- **原因**：创建的是 **Worker + Git Builds**，不是经典 Pages。
- **修复**：Build = `npm ci && npm run build`，Deploy = `npx wrangler deploy`，并保留本目录 `wrangler.toml`。

#### 构建成功但页面 404 / 资源缺失

- 确认 Build 产出为 `dist/`（本地 `npm run build` 后检查 `dist/index.html`）。
- Workers：确认 `[assets] directory` 为 `./dist`，不是 `public`。

#### 打开 URL 显示 “There is nothing here yet”

常见原因（按优先级）：

1. **`wrangler.toml` 未 push 到 GitHub**  
   Cloudflare 从远端仓库构建。若本地有 `wrangler.toml` 但未 `git push`，Deploy 只会发布**空 Worker**（无静态资源）。  
   本地检查：`git show origin/main:sites/ai-parent-coaching/wrangler.toml` 应能读到文件；若报 `not in origin/main`，执行 `git push` 后 **Retry deployment**。

2. **Build 未生成 `dist/`**  
   构建日志里须有 `astro build` 成功；Root directory 必须是 `sites/ai-parent-coaching`。

3. **`workers.dev` 子域被禁用**  
   Worker → **Settings** → **Domains & Routes** → 确认 `workers.dev` 为 **Enabled**（未禁用）。

4. **访问了错误 URL**  
   Workers 静态站地址形如 `https://ai-parent-coaching.<你的子域>.workers.dev`，不是 Pages 的 `*.pages.dev`（除非另建了 Pages 项目）。

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
