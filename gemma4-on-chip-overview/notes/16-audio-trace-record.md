# 第 16 期 Processor 与音频塔配图记录

2026-09-29。正文图 3 是 Codex 内置 imagegen 生成的 Processor 概念图；图 4 来自真实模块的 `torchview` 结构追踪。两图分别解释预处理与模型计算，不代表录音测量或加载权重后的推理结果。

## 图 3：特征、mask 与占位槽

- 路径：`assets/generated/audio-processor-slots-16-zh.png`。
- 要回答的问题：音频塔运行之前，Processor 怎样准备音频特征和语言输入中的占位位置？
- 生成提示词：

```text
Use case: scientific-educational. Asset type: original Chinese technical infographic for Gemma 4 E4B audio chapter, wide 16:9 PPT-like image, intended for mobile reading. Explain ONLY the Processor side of incoming audio and how it prepares the model inputs and language placeholders; do not depict neural network internals as if they were Processor operations. Exact title: “音频先变成带有效长度的特征序列”. A single left-to-right three-stage visual narrative with substantial information but few words. Stage 1: one microphone waveform, label “原始波形”; beneath it small caption “单声道采样”. Stage 2: overlapping short-time windows become a horizontal log-Mel heatmap with axes time and Mel frequency; show some real colored frames and grey padding frames to align a batch, plus a parallel binary validity mask (teal cells for valid, grey for padding). Exact labels “Log-Mel 特征” and “有效帧 mask”. Stage 3: a small separate Processor bookkeeping lane shows the validity mask going through a dotted calculation box labelled “预估下采样后的有效长度”, producing an ordered group of purple empty audio placeholder slots within a single text prompt, blue text tokens before and after; label “音频占位槽”. The dotted calculation is a count estimate, not the actual convolution. At far right a clearly marked handoff arrow to “音频塔输入：特征 + mask” and a second handoff arrow to “语言输入：文字 + 占位槽”. Bottom takeaway exactly: “Mel 帧不是语言 token；有效软 token 的数量决定占位槽数量”. All text simplified Chinese except Log-Mel and mask. Use navy headings, teal waveform/Mel, purple language slots, restrained professional colors, crisp large readable text, clear arrows, generous white space, subtle dimensional depth. No fake transcription, no numeric benchmark, no invented exact recording duration, no claim that Processor performs the audio encoder convolution, no photorealistic chip decorations or logos. The figure is a concept illustration, not a real waveform capture.
```

核对：左右两条交接线分别指向音频塔的特征与 mask、语言序列的文字与占位槽；占位长度是按 mask 推算，不是 Processor 执行卷积。图中帧数仅为说明关系。

## 图 4：音频塔 torchview

- 追踪脚本：`assets/diagrams/generate_audio_path_torchview.py`。
- 原始图源：`assets/diagrams/audio_path_16mel_e4b.dot`，同名 SVG/PNG 为完整追踪。
- 压缩排版脚本：`assets/diagrams/render-audio-compact-trace.mjs`，输出 `audio_path_16mel_e4b_compact.dot/.svg/.png`。脚本读取原始 DOT，先检查模块计数和关键形状，再把连续的 12 个编码层合并为一格。正文嵌入压缩 PNG，链接完整 PNG 供放大核对。
- 环境：PyTorch 2.8.0+cpu、Transformers 5.17.0、torchview 0.2.7、graphviz；CPU 构造输入 `[1,16,128]`、有效 mask `[1,16]`，无 checkpoint。`Gemma4AudioModel` 与 `Gemma4MultimodalEmbedder` 及依赖的音频模块类经 AST 比对，与固定的 `reference/transformers-gemma4-8445b13/modeling_gemma4.py` 对应类一致。
- 形状核对：前向输出 `[1,4,2560]`，下采样后 mask `[1,4]`。完整图含两个 stride-2 卷积、12 个 `Gemma4AudioLayer`、1536 维音频塔输出、RMSNorm 和到 2560 维的 Linear。相对位置表示 `[1,13,1024]` 是内部上下文表示，不是 13 个语言占位位置。
- 边界：追踪只覆盖音频塔与语言宽度投影。波形到 Log-Mel、占位槽数量推算属于 Processor；有效向量写入语言序列发生在模型合流逻辑中，由正文与代码说明。初始化参数只验证结构和形状，不验证识别能力。
