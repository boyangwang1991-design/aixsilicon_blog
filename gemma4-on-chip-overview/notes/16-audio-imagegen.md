# 第 16 期音频路径配图记录

2026-09-29 使用 Codex 内置 imagegen 生成两张中文横向 PPT 风格原理图。原文三张 `assets/draft-newsletter/` 图片不再进入正文，旧文件与导入记录保留供内部追溯。新图并非录音实测波形、实测频谱或模型运行截图。

## 图 1：完整音频输入路径

- 路径：`assets/generated/audio-path-overview-16-zh.png`。
- 目的：让读者看清波形、Log-Mel、两次时间下采样、音频编码器、RMSNorm/Linear 与语言序列合流的顺序。
- 生成提示词：

```text
Use case: scientific-educational. Original 16:9 Chinese PPT-style technical overview slide, white background, navy headings, teal audio pathway, purple language pathway, flat vector design and large legible text. Exact title “一段语音怎样进入语言 Decoder”. Show a precise left-to-right pipeline of FIVE large cards with arrows: 1 “波形 → Log-Mel” with waveform and time-frequency heatmap, caption “单声道 16 kHz；20 ms 窗、10 ms 步进；128 个频带”; 2 “卷积下采样” with long strip of frames becoming a shorter strip, caption “两次 stride-2，时间长度约缩为 1/4”; 3 “音频编码器” with left-looking attention arcs and a small local convolution motif, caption “结合局部声音与前面片段”; 4 “RMSNorm → Linear” with audio feature bars turning into purple bars, caption “投影到语言主宽度 2560”; 5 “语言 Decoder” with one ordered input strip containing blue text-token blocks, purple audio-soft-token blocks, blue text-token blocks, caption “有效软 token 填入预留位置”. A small bottom row contrasts lengths: “采样点 → Mel 帧 → 音频软 token → 文本回答”. Do not show raw sound directly turning into text; no audio generation or speaker output. No invented transcript, benchmark, or processing time. Config for E4B audio attention has right context 0, so attention arcs must point only left/backward, never to future audio chunks. Technically accurate, beautiful, spacious PPT, no decorative chip render. Use correct simplified Chinese. This is a conceptual explainer, not a model screenshot.
```

初版下采样卡片的画面长度比与 `T/4` 不吻合，并把音频后的输入文字标成“继续生成”。通过 imagegen 局部编辑：

```text
Make two precise corrections to this Chinese technical slide while preserving title, five-card layout, color, arrows, all other text and the bottom timeline. In card 2, visual example must show exactly 12 small teal Mel-frame tiles on the upper row and exactly 3 small teal encoded-frame tiles on the lower row, to visually match two stride-2 layers and T/4. Remove any extra lower-row tiles. In card 5, change only the tiny explanatory text below the rightmost blue text-token group from “继续生成” to “音频后的提问”; these blue blocks are prompt input, not generated output. Preserve the label '文本 token'. Do not alter technical order or other elements.
```

## 图 2：Mel 频谱

- 路径：`assets/generated/audio-mel-explainer-16-zh.png`。
- 目的：说明波形、短时频率分析和时间—频带图之间的关系，以及坐标轴与颜色的意义。
- 生成提示词：

```text
Use case: scientific-educational. Create an ORIGINAL 16:9 landscape PPT-style Chinese teaching diagram on white background, navy headings, teal waveform, amber frequency features, purple mel spectrogram, generous spacing and mobile-readable text. Exact title “Mel 频谱：声音的时间—频率地图”. Show one clear three-stage left-to-right process. LEFT: a single one-dimensional waveform over time; highlight overlapping short windows, label exactly “20 ms 短窗，10 ms 步进”. CENTER: one selected window expanded into frequency components, with low and high frequency bands; label “短时频率分析”. RIGHT: a broad rectangular heatmap with x-axis “时间” and y-axis “Mel 频带（低→高）”; show a speech-like illustrative pattern: changing horizontal bands and vertical bursts, not arbitrary rainbow noise. A small legend says “颜色越亮＝该时刻该频带越强”. Above the heatmap label “128 个 Mel 频带（E4B 默认）”. Bottom one-sentence takeaway: “波形只画振幅随时间变化；Mel 频谱同时显示何时出现哪些频率成分”. Make explicit that this is a conceptual illustration, not a real measurement. No audio transcript, no decoder yet, no made-up phoneme annotations, no decorative chip render, no numerical axes except 20 ms, 10 ms and 128. Preserve correct left-to-right arrows and clear axis orientation.
```

## 核对

- 两张图均为中文，轴、箭头与输入输出顺序已检查。图 1 的注意力箭头只向左，符合固定 E4B 配置 `attention_context_right=0`。
- 特征提取实现默认单声道 16 kHz、20 ms 窗、10 ms 步进、128 个 Mel 频带；音频塔两层 stride-2 卷积将时间长度约缩为四分之一。
- 图中的谱纹与采样条仅表达机制，不是具体录音的测量结果。正文用“约”说明下采样长度，实际有效数受边界和 mask 影响。
