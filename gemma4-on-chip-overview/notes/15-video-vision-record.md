# 第 15 期视频路径配图与追踪记录

2026-09-29。图 3 用 Codex 内置 imagegen 文生图，讲清 Processor 侧的抽帧、时间戳字符串和视觉占位槽。图 4 由实际 `torchview` 追踪生成，讲清模型侧的帧维展平、视觉编码、空间汇聚与投影。两图分工明确：概念图不冒充运行截图；`torchview` 图不声称覆盖模型外的视频解码、抽帧或文字格式化。

## 图 3：Processor 概念图

- 文件：`assets/generated/video-processor-timeline-15-zh.png`
- SHA-256：`d49405600d62a98bbf793c68d8b7abd258dc351cbd723c5fab09ed22ba99fba2`
- 核对：帧保持先后顺序；每帧有时间标记和一组视频占位槽；图内三帧、`t₁/t₂/t₃` 仅作示意，不代表固定帧数、采样率、实际时间戳格式或软 token 数。

原始提示词：

```text
Use case: scientific-educational. Asset type: original Chinese explanatory image for chapter 15 of a Gemma 4 E4B technical blog, landscape presentation slide, polished editorial infographic, high information density yet legible on a phone. Explain ONLY the processor side of video input, before neural-network operations. Exact title: “视频先变成有时间顺序的帧输入”. Left-to-right flow in three large zones: (1) a short video filmstrip with many unlabeled frames; arrow labelled “按采样策略抽帧” to three visibly different selected frame thumbnails (e.g. moving object at different moments), each with a simple time tag t₁, t₂, t₃. These three frames are a conceptual sample, not the fixed model frame count or frame rate. (2) under each selected frame show a small timestamp text marker and a GROUP of multiple purple empty video placeholder slots, not just a single slot; caption “时间戳字符串 + 本帧对应的视觉占位槽”. The placeholder groups must correspond one-to-one with selected frames and stay in frame order; no numerical count claimed. (3) show a single ordered language input strip: blue Chinese text-token blocks → time tag + purple placeholder group for frame 1 → time tag + purple placeholder group for frame 2 → time tag + purple placeholder group for frame 3 → blue Chinese text-token blocks. Short caption: “占位槽随后由视觉软 token 填入”. Small footer: “抽帧与时间戳由 Processor 准备；视觉编码见下一张 torchview 图”. The arrows must show video to sampled frames to ordered prompt, with no arrow jumping directly from raw pixels to final answer. Simplified Chinese, large clean typography, white background, navy headings, teal video frames, purple placeholder groups, subtle tactile depth and generous margins, matching professional engineering PPT. Avoid invented frame rate, exact timestamp values, fixed soft-token counts, network screenshots, decorative chip props, logos, SVG-like stick figures, or long paragraphs.
```

## 图 4：模型模块 `torchview` 追踪

- 源码：`assets/diagrams/generate_video_vision_torchview.py`；生成 `assets/diagrams/video_vision_2frames_e4b.dot`，再由 `render-dot.mjs` 输出同名 SVG/PNG。
- 成图 PNG SHA-256：`4bc6ba32ea108d0ce2a7d91efcffdbd0610a5621f6c5045eb8d067a12e7b9443`。
- 环境：PyTorch `2.8.0+cpu`、Transformers `5.17.0`、torchview `0.2.7`。安装版 `modeling_gemma4.py` 全文件哈希与固定快照不同，但 AST 核对 `Gemma4VisionModel`、`Gemma4VisionPatchEmbedder`、`Gemma4VisionEncoder`、`Gemma4VisionPooler`、`Gemma4MultimodalEmbedder` 五个实际追踪类与固定快照完全相同。
- 配置：固定 E4B 的 `vision_config` 与 `text_config`。不加载模型 checkpoint。用初始化参数与构造的两帧、每帧 3×3 patch 运行结构与形状追踪。输入像素块为 `[1,2,9,768]`，二维坐标为 `[1,2,9,2]`；输出为 `[2,2560]`。不是数值预测或真实视频长度。
- 边界：wrapper 遵循 `Gemma4Model.get_video_features` 中的 `flatten(0,1) → vision_tower → embed_vision` 模块顺序；`get_video_features` 后续按有效长度切回视频的 Python 分割、占位槽填充与 Processor 的抽帧/时间戳不在这张图内。`Gemma4VisionEncoder` 在 depth 2 图上折为单节点，内部实际 16 层。

运行命令（需要相同依赖环境）：

```powershell
python gemma4-on-chip-overview/assets/diagrams/generate_video_vision_torchview.py
node gemma4-on-chip-overview/assets/diagrams/render-dot.mjs "$env:TEMP\gemma-viz\node_modules" video_vision_2frames_e4b
```

依据：固定 E4B 配置；固定 Transformers revision `8445b13cd24961e47f25a649fb113580f71a8d11` 的 `modeling_gemma4.py`、`processing_gemma4.py` 与 `video_processing_gemma4.py`；详细快照见 `notes/04-code-snapshot.json`。`reference/` 只读。
