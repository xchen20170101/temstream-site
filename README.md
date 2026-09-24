# temstream

> 一个非官方 Moonlight + Sunshine 中文指南站点 —— 介绍开源自托管游戏串流方案，并提供 Windows / Android 客户端与 Windows 服务端的下载入口。

## ✨ 特性

- **中英双语**：`/zh/` 与 `/en/` 路径前缀，顶部一键切换
- **完全静态**：`next export` 输出，可直接托管在任何 CDN / 静态服务
- **Vercel 一键部署**：仓库 push 即上线
- **无后端依赖**：下载链接直链 GitHub Releases 与 Google Play
- **深色霓虹主题**：纯 CSS + Tailwind，无第三方 UI 库

## 🧱 技术栈

- [Next.js 15](https://nextjs.org/) (App Router, 静态导出)
- [next-intl 3](https://next-intl-docs.vercel.app/) —— 路由级 i18n
- [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS 3](https://tailwindcss.com/)
- 部署：[Vercel](https://vercel.com/)

## 📁 目录结构

```
temstream_site/
├─ app/
│  ├─ [locale]/              # 国际化路由
│  │  ├─ page.tsx            # 首页
│  │  ├─ download/page.tsx   # 下载页
│  │  ├─ tutorial/page.tsx   # 教程页
│  │  └─ faq/page.tsx        # 常见问题
│  ├─ layout.tsx             # 根布局
│  ├─ page.tsx               # 根路径 -> /zh 重定向
│  ├─ not-found.tsx
│  └─ globals.css            # Tailwind + 全局样式
├─ components/               # Navbar / Footer / LocaleSwitcher / Logo
├─ i18n/
│  ├─ request.ts             # next-intl server 配置
│  ├─ routing.ts             # locale 列表
│  └─ messages/
│     ├─ zh.json
│     └─ en.json
├─ lib/
│  └─ downloads.ts           # 下载清单（标签、版本、外链）
├─ middleware.ts             # next-intl 路由中间件
├─ next.config.ts            # 静态导出 + i18n 插件
├─ vercel.json               # Vercel 项目配置
├─ tailwind.config.ts
└─ tsconfig.json
```

## 🚀 本地开发

```bash
# 1. 安装依赖（推荐 pnpm）
pnpm install

# 2. 启动开发服务器
pnpm dev
# -> http://localhost:3000  (自动重定向到 /zh)
```

## 📦 生产构建

```bash
pnpm build
# 生成 out/ 目录，可直接部署到任何静态主机
```

## ☁️ 部署到 Vercel

1. 把仓库 push 到 GitHub / GitLab / Bitbucket。
2. 在 [vercel.com/new](https://vercel.com/new) 导入该仓库。
3. Vercel 会自动识别为 Next.js 项目；因为我们启用了 `output: 'export'`，无需任何额外配置。
4. 部署完成后会得到形如 `https://temstream-<hash>.vercel.app` 的预览地址。
5. （可选）在 Vercel Project Settings → Domains 绑定自定义域名。

> 部署分支推荐使用 `main`，开启自动部署。

## 🛠️ 自定义下载链接

所有下载入口集中在 [`lib/downloads.ts`](./lib/downloads.ts)，每个条目包含：

- `id`、`kind`（`client` / `server`）
- 中英文 `label`
- `platform`、`arch`、`version`
- `url`：GitHub 资产直链 / Google Play / F-Droid
- `releasesUrl`：用于"查看全部版本"按钮

新增条目后，`/download` 页面会自动出现对应卡片。

## 🌐 i18n

- 翻译文件位于 `i18n/messages/<locale>.json`
- 新增语言：在 `i18n/routing.ts` 的 `locales` 中追加，并在 `i18n/messages/` 下提供对应 JSON

## ⚖️ License & 免责声明

本站代码以 MIT 发布。  
Moonlight 与 Sunshine 是 LizardByte / Moonlight 社区的开源项目，遵循各自的 GPLv3 协议。  
本站与 NVIDIA、LizardByte、Moonlight 官方团队无任何隶属关系；所有商标归各自所有者所有。

---

Built with ❤️ for the Chinese-speaking Moonlight / Sunshine community.