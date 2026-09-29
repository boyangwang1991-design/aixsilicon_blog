# 第 15 期视觉路径配图记录

2026-09-29 使用 Codex 内置 imagegen 生成两张中文横向 PPT 风格原理图。旧稿引用的九张 `assets/draft-newsletter/` 图片不再进入正文；原文件及导入记录保留供内部追溯。新图不是模型运行截图、实测结果或对具体图片的推理输出。

## 图 1：完整输入路径

- 路径：`assets/generated/vision-path-overview-15-zh.png`。
- 目的：让读者按 Processor → 视觉编码器 → 空间汇聚 → RMSNorm/Linear → 图文合流的顺序认识每个环节的作用。
- 生成提示词：

```text
Use case: scientific-educational. Original 16:9 Chinese PPT-style overview slide for a Gemma 4 E4B technical blog. White background, navy headline, teal image stream and purple decoder, polished flat vector diagram, readable on a phone. Exact title “一张图片怎样成为语言输入”. A wide left-to-right pipeline with FIVE evenly spaced large cards and clear arrows: 1 “Processor” with input photo and simple patch-grid icon, explanation “按预算缩放；切 patch；记录二维坐标”; 2 “视觉编码器” with a few patch feature bars, explanation “让各处图像信息互相联系”; 3 “空间汇聚” with several small feature bars reducing to fewer larger bars, explanation “相邻区域合成更少的特征”; 4 “RMSNorm → Linear” with bars changing width, explanation “投影到语言主宽度 2560”; 5 “语言 Decoder” with a single ordered strip that contains text tokens and violet image soft-token slots together, explanation “图像向量填入预留位置，与文字一起处理”. Small bottom sentence exactly “原图像素不会直接进入词表；软 token 也不是隐藏的文字描述。” Do NOT draw a numbered 3x3 grid in this overview, and do not specify numerical token counts except 2560. No captions of generated answer, no performance claims, no decorative globe, circuits or chip models. Ensure arrow order is correct and all simplified Chinese text is accurate.
```

初次生成的示例文本不通顺，随后通过 imagegen 对同一图做局部编辑：

```text
Edit the provided Chinese technical overview slide. Preserve title, five-card layout, palette, all arrows and all explanatory text. Only change the tiny example token strip in the fifth card: replace the current nonsensical text token labels with a clear ordered strip containing left text token block labeled “这张图片” then three violet image-token placeholders then right text block labeled “是什么？”. Keep labels under the strip: “文本 token”, “图像软 token”, “文本 token”. Remove any other incidental token words such as '今天气' or '真美'. Image-token placeholders remain in the middle of the language sequence; everything else unchanged.
```

## 图 2：预算与空间汇聚

- 路径：`assets/generated/vision-budget-pooling-15-zh.png`。
- 目的：对照低高预算的细节保留，并画清 `3×3` 个相邻特征到一个视觉软 token；`280×9=2520` 是初始 patch 上限。
- 生成提示词：

```text
Use case: scientific-educational. Create an original Chinese 16:9 PPT-style teaching diagram, not a cover. White background, navy title, teal and amber annotations, large readable typography, clean vector/grid design. Exact title: “视觉预算：先保留细节，再压缩长度”. Two large side-by-side panels and a bottom takeaway. LEFT: A photo illustration of a document with small text is resized under an image token budget, then converted into a regular patch grid. Show two choices marked “低预算：较少 patch，细节少” and “高预算：较多 patch，细节多”. Make it obviously a conceptual comparison, without claiming exact performance. RIGHT: a precise square of exactly NINE small squares arranged in THREE rows and THREE columns (3×3), arrow to ONE larger square, label “相邻 3×3 patch 特征 → 1 个视觉软 token”. Next to it a compact exact E4B budget notation “上限 280 个软 token → 最多 2520 个初始 patch”; add small label “实际有效数量由图像尺寸与处理结果决定”. Bottom takeaway: “预算影响视觉细节和后续 Prefill 长度”. No additional numbers, no other grids, no 2x2 highlighted group, no fabricated measurements, no decorative chips, no pseudo-English. Ensure exact simplified Chinese and technically accurate arrow direction. Visual must be spacious and slide-like, not an overcrowded poster.
```

## 核对

- 两张图与固定版本 E4B 实现的阶段顺序一致；图 2 的汇聚示意确为九格到一格。
- 数字核对：E4B 视觉编码器宽度 768、16 层、patch 边长 16、pooling kernel 3、语言主宽度 2560；配置默认视觉预算为 280，`280×9=2520` 只作上限。
- 图内样例照片与 token 条仅解释机制，不代表真实输入或推理结果。标题、主要文字、箭头方向与色彩分组人工检查。
- 生成中另有总览九格错误版与坐标错位版，均未使用。
