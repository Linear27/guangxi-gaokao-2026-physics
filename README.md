# 广西 2026 物理类招生计划查询

面向考生的静态查询站，整理自《2026年广西高考指南招生计划篇（物理类）》。站点支持按院校、专业、批次检索，并展示 PDF 页码/书页码，方便回到官方材料核对。

## 技术栈

- Vite
- React
- TypeScript
- MUI Material
- MUI X Data Grid Community
- React Router

## 数据

公共数据位于 `public/data/`：

- `site.json`：公共主数据
- `summary.json`：首页和筛选摘要
- `programs.json`：检索页专业计划数据
- `schools.json`、`schools/*.json`：院校索引和院校详情切片
- `batches/*.json`：批次详情切片
- `schema.json`、`manifest.json`：公开数据说明

仓库只包含公共站代码和公共数据，不包含原始材料或内部工作产物。

## 开发

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `public/_redirects`

## 发布口径

本项目为非官方整理版。正式填报前，请以官方材料、高校招生章程和招生考试院发布信息为准。
