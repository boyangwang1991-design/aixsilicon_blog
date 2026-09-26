# 博客封面生成记录

- 日期：2026-09-26
- 工具：Codex 内置 imagegen（文生图）
- 用途：公众号及公开平台文章头图；概念性编辑插画，不代表实际界面、版图或测量结果。
- 输出：`assets/generated/cover-zh.png`
- 设计：横向宽幅，醒目的中文短标题；系列配色一致，每篇主题独立。

## 完整提示词

Use case: ads-marketing. 为中文AI辅助芯片研发博客制作一张独立、高完成度、令人想点开阅读的编辑封面。横向宽幅约2.35:1。统一系列视觉：深海军蓝背景、暖白粗体中文标题、青绿主体、少量琥珀强调，有质感的三维技术插画与克制杂志排版结合。主标题醒目占画面左侧约55%，右侧单一清晰技术视觉焦点，标题和主体均离边缘至少8%，缩略图仍清楚。只写指定主标题、副标题，以及小号系列名“AI 辅助芯片研发”。不增加说明小字、编号、英文标语、logo、水印、二维码、代码、统计数字。中文准确。封面是概念性编辑插画，不是讲解流程图；不堆满方框和箭头，不画机器人或人脸。
主标题（按两行排版）：权限更新到一半
芯片该听谁的？
副标题：AI 辅助 Secure APB Demux 设计
视觉内容：两套分层策略卡片，一套青色正在服务下方芯片分发网络，另一套琥珀色在上层完整准备，明确单次整体切换的视觉意象。不要混合两套卡片，不画伪截图。


## English edition — 2026-09-26

Tool: Codex built-in imagegen. Source: `assets/generated/cover-zh.png`. Output: `assets/generated/cover-en.png`.

English cover text and localization specification are retained in `notes/english-image-prompts.md`, section `cover-en.png`. Original Chinese cover retained. The cover is conceptual illustration, not a real product screenshot or measurement.

## English 4:3 variant

Additional cover: `assets/generated/cover-en-4x3.png`. Original widescreen cover retained. Exact prompt: `notes/cover-en-4x3-prompt.md`. Tool: Codex built-in imagegen; actual dimensions and SHA-256 are recorded in sources.json.
