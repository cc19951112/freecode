# 高尿酸人生

《高尿酸人生》的 **互动小说** 网页端：以阅读为主、轻量数值为氛围壳，在关键节点做选择，推进一条「县城机械系男生 + 遗传性高尿酸」的故事线。题材偏现实向，不替代任何医疗建议。

## 核心体验

- **互动小说模式**：以章节为单位阅读；正文按「节拍（Beat）」逐段出现，可配合打字机效果。
- **软分支**：第 1–4 章已实装可选分支；全篇规划为 15 章，第 5 章起目前为章首占位（可浏览标题与引语，正文待续）。
- **轻量状态**：健康、羞耻、与几位核心角色的关系等会随选择变化，用于氛围与后续结局走向，不强调「肝数值」。
- **存档**：数据保存在浏览器 `localStorage`（见下方键名）。纯前端、无登录。

## 技术栈

- React 19 + TypeScript
- Vite 6
- Zustand（`src/stores/useNovelStore.ts`）
- Tailwind CSS

## 项目结构（精简）

- `src/data/chapters/`：各章数据（场景、对白、选择、效果）
- `src/types/novel.ts`：互动小说与状态类型
- `src/components/`：阅读器 UI（`ReaderView`、`Typewriter`、选择面板、状态侧栏等）
- `STORY_BIBLE.md`：人物、章纲、与后续写作/扩展用的故事母本
- `.plan`：与当前实现对应的执行/迭代记录

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 <http://localhost:5173>）。

## 生产构建

```bash
npm run build
```

产物在 `dist/`。`vite.config.ts` 中 `base: './'`，可部署到 GitHub Pages、Cloudflare Pages、Vercel 等任意静态站点，以 `dist` 为站点根目录即可。

## 存档与旧版说明

- **当前**存档键：`highUricAcidNovelV5`
- 若本机曾存在更早期的 `highUricAcidGameV1`–`V4` 键，进入新版时会被清理并提示（阅读模式不兼容旧经营存档）。

## 合规说明

作品为剧情与轻科普向互动内容，**不替代医疗诊断、治疗与个体化处方**。如有不适或指标异常，请以医疗机构与医生意见为准。

## 仓库

<https://github.com/cc19951112/freecode>
