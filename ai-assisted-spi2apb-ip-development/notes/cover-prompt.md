# 博客封面生成记录

## 最终修订提示词

精确修改这张博客封面，仅修改右侧模块的两个标签：CPU 改成“配置寄存器”，存储器 改成“状态寄存器”。SPI2APB 桥后连接的是 APB 外设寄存器，避免让人误以为直接连接 CPU 或主存。其他标题、文字、布局、色彩和图形全部保持不变。中文清晰准确。最终采用此修订版。

- 日期：2026-09-26
- 工具：Codex 内置 imagegen（文生图）
- 用途：公众号及公开平台文章头图；概念性编辑插画，不代表实际界面、版图或测量结果。
- 输出：`assets/generated/cover-zh.png`
- 设计：横向宽幅，醒目的中文短标题；系列配色一致，每篇主题独立。

## 完整提示词

Use case: ads-marketing. 为中文AI辅助芯片研发博客制作一张独立、高完成度、令人想点开阅读的编辑封面。横向宽幅约2.35:1。统一系列视觉：深海军蓝背景、暖白粗体中文标题、青绿主体、少量琥珀强调，有质感的三维技术插画与克制杂志排版结合。主标题醒目占画面左侧约55%，右侧单一清晰技术视觉焦点，标题和主体均离边缘至少8%，缩略图仍清楚。只写指定主标题、副标题，以及小号系列名“AI 辅助芯片研发”。不增加说明小字、编号、英文标语、logo、水印、二维码、代码、统计数字。中文准确。封面是概念性编辑插画，不是讲解流程图；不堆满方框和箭头，不画机器人或人脸。
主标题（按两行排版）：一条串行链路
怎样接入片上总线？
副标题：AI 辅助 SPI2APB 设计与验证
视觉内容：一股串行脉冲光路进入中心协议桥，变成清晰有序的片上外设互连，窄到宽的结构构成强视觉焦点。不要乱画协议时序数字。


## English edition — 2026-09-26

Tool: Codex built-in imagegen. Source: `assets/generated/cover-zh.png`. Output: `assets/generated/cover-en.png`.

English cover text and localization specification are retained in `notes/english-image-prompts.md`, section `cover-en.png`. Original Chinese cover retained. The cover is conceptual illustration, not a real product screenshot or measurement.

## English 4:3 variant

Additional cover: `assets/generated/cover-en-4x3.png`. Original widescreen cover retained. Exact prompt: `notes/cover-en-4x3-prompt.md`. Tool: Codex built-in imagegen; actual dimensions and SHA-256 are recorded in sources.json.
