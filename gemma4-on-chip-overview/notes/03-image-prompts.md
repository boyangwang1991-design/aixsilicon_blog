# 第 03 期配图记录

日期：2026-09-28。两张图片由 Codex 内置 imagegen 生成。封面突出“索引一行—得到向量—同表用于输出”的概念；正文图说明同一张参数表的两种访问方式。均为原理示意，不是模型权重、运行截图或设备测量。原有仅显示 `[1,2]→[1,2,2560]` 的局部 torchview 图信息量不足，已从正文和本系列图集中移除。

## 独立封面

- 路径：`assets/generated/cover-03-zh.png`。
- 用途：第 03 期公众号入口。
- 最终提示词：

```text
Use case: scientific-educational. Asset type: independent Chinese technical blog cover for Gemma 4 series chapter 03, landscape 16:9, safe for WeChat wide crop and mobile thumbnail. Topic: a token ID selects one row from a huge embedding parameter table, yielding a long vector; later the same table is reused at the output side to score candidate tokens. One coherent editorial visual focus: an illuminated row selected from a structured matrix, becoming a horizontal stream of vector values, with a subtle return arc suggesting shared weights. This is conceptual, not a hardware memory screenshot or actual weights. Deep navy base, restrained teal and warm gold, crisp engineering graphic style, no generic chip prop, no numerical benchmark. Exact large title: “一个 ID，为什么能变成 2560 个数？” Exact small subtitle: “读懂 Gemma 4 的 Embedding”. Text large, correct Chinese glyphs, crop-safe margins. No other words, no invented IDs or values, no logo, no watermark.
```

## 同表双用途讲解图

- 路径：`assets/generated/embedding-shared-table-zh.png`。
- 用途：输入端的按行索引与输出端的词表候选打分并排解释。
- 核对：`E:[262144,2560]`；输入 `[1,6]→[1,6,2560]`，乘 `√2560` 后进入 decoder；末尾状态 `[1,2560]` 经绑定权重得到 `[1,262144]` logits。图内 `1–6` 只示意六个输入位置，表中高亮行不是第 02 期实际 ID 地址；正文图注已注明。最终 softcap、PLE 和运行时具体存储位置未画。
- 最终提示词：

```text
Use case: infographic-diagram. Asset type: substantive Chinese educational figure inside Gemma 4 Embedding chapter, landscape 16:9, readable when opened on a phone. Explain the surprising difference between two uses of the SAME trained embedding table E, shape [262144, 2560]. Two parallel lanes sharing one central table drawn only once. Upper lane labeled “输入：按 ID 查行”: six IDs [1,6] point to six selected rows of E, then scale by √2560, yielding six vectors [1,6,2560] that enter the decoder. Lower lane labeled “输出：给候选打分”: last decoder state [1,2560] is compared with the same table E across 262144 candidate rows, yielding logits [1,262144]. Make a clear arrow from decoder output back toward the same E in the lower lane, with no second independent table. Below, one concise conclusion label exactly “同一套参数，两种访问方式”. Exact numbers and bracketed shapes are essential; no other numbers. Illustrate selected rows vs all candidate rows visually, avoid tiny cell labels and decorative chip props. Calm ivory background, navy text, teal input path, amber output path, clean precise editorial vector style, large Chinese text. Conceptual computational diagram; not measured data or a model screenshot. Do not draw PLE or RoPE here.
```
