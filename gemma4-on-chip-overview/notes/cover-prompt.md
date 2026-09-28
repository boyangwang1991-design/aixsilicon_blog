# 第 01 期配图生成记录

生成方式：Codex 内置 imagegen。三张图片均为中文概念图，不是模型运行截图、芯片实测或真实产品界面。日期：2026-09-28。图 2 的第一次生成含不自然的示例 token 和不完整的 KV 箭头，未纳入文章；文中使用重新生成的版本。

## 独立封面

- 用途：第 01 期公众号头图；路径：`assets/generated/cover-zh.png`。
- 检查：横幅构图；主标题“Gemma 4 怎样回答问题”、副标题“从多模态输入到逐 Token 生成”可读；文字、图像、音频三路汇入生成主线；不含性能数字。
- 最终提示词：

```text
Use case: scientific-educational. Asset type: wide Chinese technical blog cover for chapter 01 of a Gemma 4 on-device AI series. Primary request: introduce the full journey of a multimodal decoder-only language model. Landscape 16:9, elegant engineering editorial illustration, not a product screenshot. Single visual focus: three distinct inputs (Chinese text lines, an image tile, an audio waveform) converge as small token tiles into one layered inference ribbon; at the right edge one new token emerges, with a subtle loop suggesting repeated generation. Accurate high-level concept; do not show an encoder-decoder architecture or a fake chip die. Refined dark navy, teal, warm amber, off-white palette; clean geometry and restrained depth. Exact short Chinese cover title in large legible type: “Gemma 4 怎样回答问题” and small subtitle “从多模态输入到逐 Token 生成”. Keep all title letters exact and within broad crop-safe margins; very little other text. No logos, no benchmark numbers, no watermark. Original conceptual illustration, not a real model visualization.
```

## 多模态输入全景图

- 用途：解释文字、图片、音频如何进入 E4B 文本解码器；路径：`assets/generated/multimodal-overview-zh.png`。
- 检查：三条输入路径分开，文字走 Tokenizer/Embedding，图片和音频走专用编码器；合流为有序表示；输出为文本 token。
- 最终提示词：

```text
Use case: infographic-diagram. Asset type: Chinese educational figure inside a technical blog, chapter 01 macro overview of Gemma 4. Create a clean, wide 16:9, self-contained flow diagram, large typography readable on a phone. Question answered: how can text, image, and audio enter one decoder-only model and produce a text reply? Four left-to-right stages, exact Chinese headers only: “输入”, “转为模型可读的表示”, “Gemma 4 文本解码器”, “逐个生成文本”. Stage 1 has three distinct rows labeled “文字”, “图片”, “音频”, with simple icons. Stage 2 shows text through “Tokenizer + Embedding”; image through “视觉编码器”; audio through “音频编码器”. These three paths converge into one ordered sequence of small colored tokens, then one large stack labeled “Decoder × 多层”, then an output token leading to a loop for the next token. Arrows must all point left to right, with only a loop from output token back to decoder input. Show that image/audio features become soft tokens, not image/audio output. Use a precise editorial vector infographic look, off-white background, navy text, restrained teal/amber accents. No fake chip image, no benchmark numbers, no technical dimensions, no tiny body text, no decorative elements. All Chinese text must be exactly as quoted; English technical words Tokenizer, Embedding, Decoder retained. Original concept diagram, not a screenshot or measured result.
```

## Prefill / Decode 时间图

- 用途：解释已知提示词并行处理与输出 token 的逐步依赖；路径：`assets/generated/prefill-decode-zh.png`。
- 检查：P1–P4 在 Prefill 中已知；O1–O4 依次产生；因果矩阵为下三角；Decode 从历史 KV 读取并写入新 KV。图中未画 Prefill 建立初始 KV，正文图注补充这一点。
- 最终提示词：

```text
Use case: scientific-educational. Asset type: final Chinese technical explainer diagram for Gemma 4 chapter 01. Recreate a rigorous prefill/decode timeline from scratch, 16:9 wide, no decorative imagery. Top half: heading exactly “Prefill：处理整段已知输入”. Four teal prompt tiles labeled P1 P2 P3 P4 enter one box labeled “同一个 Decoder”; right side one amber tile labeled O1 with caption “首个输出”. A small accurate four-by-four lower-triangular causal visibility grid may appear under the input, clearly separated from output; omit it if it risks confusion. Bottom half: heading exactly “Decode：逐步生成”. Three left-to-right decoder steps using the same model: O1 goes into step 1 and produces O2; O2 goes into step 2 and produces O3; O3 goes into step 3 and produces O4. Put all step boxes under a small caption “同一套模型权重”. Below, one shared box labeled “KV Cache：历史 K/V”, with clear upward arrows labeled “读取” from cache to each step and downward arrows labeled “写入” from each step to cache. Inputs teal, outputs amber. Exact labels only as specified; no Chinese sentence fragments, no arbitrary extra token letters, no invented benchmark numbers. Precise arrow directions and sequence are more important than decoration. Large legible type, white background, navy outlines, calm teal/amber palette, clean editorial vector infographic. Conceptual algorithm diagram, not a real runtime screenshot.
```
