# 广西 2026 物理类招生计划查询

面向广西 2026 年普通高考物理类考生的静态查询站。项目将《2026年广西高考指南招生计划篇（物理类）》中的招生计划整理为可浏览、可检索的网页，支持按院校、专业、批次查看，并保留 PDF 页码和书页码，方便回到原材料核对。

## 功能

- 按关键词检索院校、专业、专业代码、专业组和备注。
- 按本科提前批、本科普通/预科、高职高专提前批、高职高专普通批分层浏览。
- 按院校查看不同批次下的专业计划。
- 按批次查看该批次下的院校和专业计划。
- 展示计划数、学制、学费、校区、选科要求、备注、PDF 页码和书页码。
- 展示 2025 年同批次同院校专业组投档最低分和对应位次，作为志愿参考。
- 提供 `/llms.txt`、`/data/schema.json`、`/data/manifest.json`，方便公开数据被机器读取。

## 数据口径

公共数据位于 `public/data/`：

- `site.json`：公共主数据。
- `summary.json`：首页统计和筛选摘要。
- `programs.json`：检索页专业计划数据。
- `schools.json`、`schools/*.json`：院校索引和院校详情切片。
- `batches/*.json`：批次详情切片。
- `history/2025/*.json`：2025 年物理类院校专业组投档最低分和位次参考。
- `schema.json`、`manifest.json`：公开数据说明。

## 技术栈

- Vite
- React
- TypeScript
- MUI Material
- MUI X Data Grid Community
- React Router

## 本地开发

```bash
npm install
npm run dev
```

常用检查：

```bash
npm run lint
npm run build
```

## 部署

推荐部署到 Cloudflare Pages。根据 Cloudflare Pages 官方构建配置，选择：

- Framework preset: `React (Vite)`
- Build command: `npm run build`
- Build output directory: `dist`

项目使用 `public/_redirects` 提供单页应用路由回退：

```text
/* /index.html 200
```

## 说明

本项目为非官方整理版，仅用于辅助浏览和检索。正式填报前，请以官方材料、高校招生章程和招生考试院发布信息为准。
