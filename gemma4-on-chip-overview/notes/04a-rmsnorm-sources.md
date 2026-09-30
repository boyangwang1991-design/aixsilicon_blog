# 第 05 期 RMSNorm 事实与配图记录（原 04A）

状态：中文新稿；英文版按本次用户要求暂不制作。图为概念/原理示意，不是模型运行截图或硬件测量。

## 固定公开来源

- [Transformers Gemma 4 实现，commit `8445b13`](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py)：`Gemma4RMSNorm` 的最后一维平方均值、`eps`、可选 `weight`、float32 计算和输出类型转换；`Gemma4TextDecoderLayer` 的归一化位置；`Gemma4TextAttention` 的 Q/K/V 归一化与共享层分支。
- [E4B 配置，revision `ee0ef602`](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)：文本主宽度 2560，局部/全局 head dim 256/512，`rms_norm_eps=1e-6`，42 层和共享 K/V 配置。
- [RMSNorm 原论文](https://arxiv.org/abs/1910.07467)：以平方均值控制尺度，省去 LayerNorm 的居中步骤；原论文的实验结论不直接迁移为 E4B 性能结论。
- [PyTorch LayerNorm 文档](https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html)：均值、方差和逐维仿射参数的定义。

## 数字与边界

- `[1,2,3]` 的手算为构造例子。RMSNorm 平方均值 `14/3`，忽略 `eps` 且权重为 1 时输出约 `[0.463,0.926,1.389]`。LayerNorm 均值 2、方差 `2/3`，忽略 `eps` 且缩放为 1、偏置为 0 时输出约 `[−1.225,0,1.225]`。不是 checkpoint 激活或预测结果。
- 每条向量的归约轴由 `hidden_states.pow(2).mean(-1, keepdim=True)` 确认。Q/K 有逐维权重；V 使用 `with_scale=False`。共享 K/V 层不在本层重新生成 K/V，但 Q 仍由本层生成。
- 硬件段仅解释算子依赖和可能的融合边界，没有声称设备加速或节省数值。

## 中文封面

- 路径：`assets/generated/cover-rmsnorm-zh.png`
- SHA-256：`7e510272f61ccefdd2e70261f213f23419c42f3bcdb3c9832ded5bd9534ba4e5`
- 工具：Codex 内置 imagegen，2026-09-28。
- 用途：横向文章入口概念封面；左侧多维特征流经尺度节点，右侧保留各维对应关系。图中的数学符号是概念提示，不是完整公式。
- 提示词：`Use case: stylized-concept. Asset type: Chinese wide technology blog cover for a Gemma 4 E4B RMSNorm article. A visual metaphor for per-vector root mean square normalization in a decoder: several parallel feature bars of uneven amplitudes pass through one precise reduction node and emerge at a controlled scale, while retaining their relative pattern. Engineer-grade conceptual illustration, not a real chip screenshot or measured result. Refined technical editorial illustration, crisp geometric depth, restrained teal, deep navy, amber accents. Wide landscape cover, single clear visual focus, generous crop safe margins, readable on mobile thumbnail. Text (verbatim): "RMSNorm：控制向量尺度". Render Simplified Chinese text exactly and legibly; no other words, no numerical labels, no logos, no fake plots, no generic chip prop.`
- 生成后核对：标题文字正确；无数据、测试界面或模型输出的虚构标注。

## 中文讲解图

- 路径：`assets/generated/rmsnorm-vs-layernorm-zh.png`
- SHA-256：`20a414b5ea7751433dbb4b40099f14f98c677fd8f564d6c0ad7e91b7e473ef69`
- 工具：Codex 内置 imagegen，2026-09-28。
- 用途：一图说明 RMSNorm/LayerNorm 对同一输入的差异、E4B 的三种归约宽度，以及端侧实现的归约依赖。图中的柱高只是概念示意，精确数值以正文手算为准；不表示真实激活或实测吞吐。
- 最终采用图的提示词：

  ```text
  Use case: scientific-educational
  Asset type: ONE comprehensive Simplified Chinese engineering explainer for a Gemma 4 E4B RMSNorm blog, portrait page for mobile reading. It should teach the whole issue without needing a second image.
  Primary request: Build one polished, information-rich diagram with three clearly separated zones, large legible type, precise arrows, no decorative chip props.
  Zone 1 title exactly: "同一向量，两种归一化". Show input "[1, 2, 3]" branching to two parallel paths. Teal RMSNorm path labels exactly "平方均值 → 共同缩放" and "不减均值"; its three output bars remain above zero. Amber LayerNorm path labels exactly "减均值 → 标准差缩放" and "居中为零"; its output bars straddle the zero baseline with middle bar at zero. Show the same input feeding both paths, not two different inputs. Do not put exact output numbers on the bars; use conceptual bar heights.
  Zone 2 title exactly: "Gemma 4 E4B 放在哪里". Show three compact, clearly separated module rows with arrows: "Decoder 主状态 · 2560 维"; "Attention 单个头 · 局部 256 维"; "Attention 单个头 · 全局 512 维". Caption exactly "沿最后一维归约；每个 token / 每个头单独计算". Do not show RMSNorm mixing tokens or normalizing across sequence positions.
  Zone 3 title exactly: "端侧实现要处理什么". One horizontal flow of four readable nodes with arrows: "读取特征" → "平方求和" → "求共同尺度" → "逐维输出". Tiny footer exactly "算子路径更简洁，实际速度仍需测量".
  Style/medium: detailed engineering editorial infographic, refined teal/navy and amber/slate palette, subtle dimensionality and tactile texture, crisp hierarchy, generous spacing. More sophisticated than a plain SVG block chart but all relationships technically clear. Portrait aspect ratio, mobile-readable labels.
  Critical constraints: Exact Simplified Chinese text as quoted, plus RMSNorm, LayerNorm, Attention, Decoder, Gemma 4 E4B. No other text. LayerNorm must show centering; RMSNorm must not. No fake benchmarking data, no hardware screenshot, no watermark.
  ```
- 核对：图内两种路径的计算次序、正负号示意、2560/256/512 维标签及数据流箭头与正文一致。图形不按 `[1,2,3]` 的手算比例精确绘制。
