## ADDED Requirements

### Requirement: v2 现代简洁 design token

站点 SHALL 在 `src/styles/global.css` 使用 v2 design token：背景 `#FAFAFA`、正文 `#1A1A1A`、边框 `#E5E5E5`；暖色 `#E8A598` SHALL 仅用于主 CTA 按钮、链接与小型标签，不得作为整页大面积背景色。

#### Scenario: 页面背景与正文对比

- **WHEN** 访客打开首页
- **THEN** 页面背景为浅中性灰白，正文为深色，区块间分隔清晰

#### Scenario: 主色克制使用

- **WHEN** 访客浏览 `#pain` 或 `#roadmap` 等非 CTA 区块
- **THEN** 区块背景不以珊瑚色大面积铺底，主色仅出现在按钮或可点击元素

---

### Requirement: 顶栏现代简洁导航

`Nav.astro` SHALL 提供 sticky 顶栏：白底半透明 + `backdrop-filter` 模糊、1px 底边框、右侧主 CTA 按钮；移动端 SHALL 提供可展开的汉堡菜单，触控目标 ≥ 44px。

#### Scenario: 桌面 sticky 导航

- **WHEN** 访客在宽度 ≥ 1024px 滚动页面
- **THEN** 顶栏保持可见，锚点链接与「免费领取」按钮可点击

#### Scenario: 移动端导航可用

- **WHEN** 访客在宽度 ≤ 768px 打开菜单
- **THEN** 可访问全部 7 个锚点链接且无横向滚动

---

### Requirement: Hero 左对齐层级排版

`Hero.astro` SHALL 在桌面（≥ 1024px）采用左对齐布局：胶囊形地域/月龄标签、主标题 `clamp(2rem,5vw,3rem)`、副标题 muted 色；主 CTA 按钮位于文案下方。移动端（≤ 768px）SHALL 居中排列以避免溢出。

#### Scenario: 桌面 Hero 左对齐

- **WHEN** 访客使用宽度 ≥ 1024px 的设备
- **THEN** Hero 文案左对齐，标题层级明显强于正文

#### Scenario: 移动 Hero 居中

- **WHEN** 访客使用宽度 375px 的设备
- **THEN** Hero 内容居中且无横向滚动条

---

### Requirement: Solution 三列极简卡片

`SolutionTriad.astro` SHALL 以三列（移动单列堆叠）展示安全感、陪伴感、可执行方案；卡片使用白底 + 1px `#E5E5E5` 描边，无重阴影，可选顶部 accent 线或序号。

#### Scenario: 三列方案可见

- **WHEN** 访客浏览 `#solution`
- **THEN** 可见三项核心理念卡片且风格与 Hero 一致

---

### Requirement: Trust 对比背书样式

`TrustBlock.astro` SHALL 以网格或对比列表展示竞争优势（如对比月子中心、宝妈群、纯 AI），使用简洁勾选/对比标记，并保留医疗免责声明。

#### Scenario: 信任对比可读

- **WHEN** 访客浏览 `#trust`
- **THEN** 可见至少两项对比要点及免责声明

---

### Requirement: 次要区块 token 统一

`PainCards.astro`、`RoadmapPreview.astro`、`ServiceList.astro`、`CtaFooter.astro` SHALL 继承 v2 global token（字体、间距、按钮、卡片边框），SHALL NOT 改变 v1 的 DOM 结构与锚点 ID。

#### Scenario: 痛点区块风格一致

- **WHEN** 访客从 Hero 滚动至 `#pain`
- **THEN** 字体与间距与新版 Hero 一致，无旧版暖色大色块残留

---

### Requirement: v2 视觉回归与性能

变更后 SHALL 通过 `npm run build`；Lighthouse Mobile Performance SHALL ≥ 85；7 锚点、Modal CTA、静态二维码降级路径 SHALL 保持 v1 行为。

#### Scenario: 构建成功

- **WHEN** 维护者运行 `npm ci && npm run build`
- **THEN** 命令以 exit code 0 完成并生成 `dist/index.html`

#### Scenario: CTA 行为不变

- **WHEN** 访客点击主 CTA
- **THEN** 企微二维码 Modal 正常打开与关闭
