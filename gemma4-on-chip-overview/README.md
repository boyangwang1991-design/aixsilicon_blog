# Gemma 4 从算法到端侧芯片

> 中文系列改稿。第 01 期建立 Gemma 4 的多模态与生成全景，第 02 期沿官方 Tokenizer 追踪一句话的真实输入，第 03 期接着看 ID 怎样进入主 Embedding 表。前三期已有独立封面和讲解图；系列另有两张局部 `torchview` 图。其余概念图保留中文提示词，英文版和发布审阅待补。

如果你不熟悉 Transformer，可以从第 01 期读起。前四期把推理、Tokenizer、Embedding、张量和矩阵乘讲清楚；第 05–09 期打开 E4B 的 decoder、Attention、RoPE、局部/全局层与 PLE；第 10–14 期追踪 Prefill、Decode、KV Cache、权重和数据搬运；最后接入图像、音频，并讨论端侧持续运行和家族型号的差异。各期使用同一 E4B 案例，标题和顺序服务于这条故事线。

| 期 | 中文章节 | 状态 |
| --- | --- | --- |
| 01 | [Gemma 4 怎样把文字、图片和声音变成回答](01-input-to-next-token.md) | 中文总览稿；封面与两张概念图已配 |
| 02 | [一句提问，怎么变成 15 个 Token？](02-tokenizer.md) | 中文稿；封面与两张讲解图已配 |
| 03 | [一个 ID，为什么能变成 2560 个数？](03-embedding.md) | 中文稿；封面与双用途讲解图已配 |
| 04 | [2560 个数进入一层：先把矩阵乘这笔账算清](04-tensor-matmul-basics.md) | 中文改稿；概念图待补 |
| 05 | [42 层里的这一层：信息沿哪几条路走](05-decoder-layer.md) | 中文改稿；概念图待补 |
| 06 | [“它”指向谁：沿着 Q、K、V 看一次注意力](06-attention-tensors.md) | 中文改稿；概念图待补 |
| 07 | [词序怎么进入注意力：Gemma 4 的 RoPE 旋转](07-rope-position.md) | 中文改稿；概念图待补 |
| 08 | [五层看近处，一层看全局：E4B 如何分配注意力](08-hybrid-attention.md) | 中文改稿；概念图待补 |
| 09 | [同一个词，42 次提醒：E4B 的额外参数藏在哪](09-ple.md) | 中文改稿；概念图待补 |
| 10 | [第一个回答还没出口，计算节奏已经变了](10-prefill-decode.md) | 中文改稿；概念图待补 |
| 11 | [回答越长，模型随身带的“笔记”越厚](11-kv-cache.md) | 中文改稿；概念图待补 |
| 12 | [叫作 E4B，为什么不能按 4B 装权重](12-weights-ple-quantization.md) | 中文改稿；概念图待补 |
| 13 | [不写下整张注意力表，还能算出同一个答案吗](13-attention-acceleration.md) | 中文改稿；概念图待补 |
| 14 | [乘加阵列跑得快，数据为什么还在路上](14-compute-and-data-movement.md) | 中文改稿；概念图待补 |
| 15 | [一张照片进入问题后，模型多走了哪段路](15-vision-path.md) | 中文改稿；概念图待补 |
| 16 | [听到一句话之前，Gemma 4 先处理了什么](16-audio-path.md) | 中文改稿；概念图待补 |
| 17 | [从峰值到持续输出：功耗和供电给推理划了什么边界](17-power-thermal-pi.md) | 中文改稿；概念图待补 |
| 18 | [换个 Gemma 4 型号，前面的账还算数吗](18-family-and-next-steps.md) | 中文改稿；概念图待补 |

## 读图约定

本文的 `B` 为请求批量、`S` 为本次输入 token 数、`T` 为已有历史长度，`D=2560` 为 E4B 文本主宽度。张量形状按 `[batch, position, feature]` 或在 Attention 中按 `[batch, head, position, head_dim]` 写明。图若只展示 `B=1,S=2`，只是为了让局部计算路径在手机上可读；不会把示例长度当作模型上下文上限。

`torchview` 图追踪官方 Transformers 的 E4B 局部模块，采用 meta tensor，不加载模型权重，也不产生数值预测。两张图分别限制在第 05 期单层 MLP、第 06 期局部层 Q/K/V 投影；第 03 期改用信息更完整的主 Embedding 双用途概念图。完整 Attention、RoPE、KV Cache 和多模态路径仍由文字及待补概念图解释。图上的节点列出了各线的 tensor size；正文同时说明每个轴、数据类型和图的截取边界。

## 事实口径

以 [Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)、[E4B 配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)和 [Transformers 的 Gemma 4 实现](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)核对结构。E4B 的“4.5B effective”不能直接当作完整权重参数数；缓存容量与性能也必须连同精度、batch、序列长度和设备条件阅读。文中的构造例子、解析估算与模型事实分别标示，不将示意图或公式当作设备实测。

前三期已生成独立封面和中文讲解图，提示词与来源记录保存在系列编辑资料中。其他章节的 HTML 注释仍保留待补图片提示词。后续补图时要核对中文图内文字、箭头方向、张量形状与对应段落；生成图只作为机制示意。
