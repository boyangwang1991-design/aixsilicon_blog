# Gemma 4 从算法到端侧芯片

> 中文内部改稿，保存在公开 GitHub 仓库中，尚未完成正式发布审阅。Maarten Grootendorst 的原图放在 `assets/draft-newsletter/` 供逐章核对；正式用于公众号等平台前仍需取得图片使用许可或替换。英文版和英文配图暂缓。

第 01 期建立 Gemma 4 的多模态与生成全景，第 02 期沿官方 Tokenizer 追踪一句话的真实输入，第 03 期接着看 ID 怎样进入主 Embedding 表。第 04 期以独立中文单层图和 `torchview` 追踪解释 decoder 主线。其余章节按这条主线逐步拆解，当前仍在中文编辑阶段。

如果你不熟悉 Transformer，可以从第 01 期读起。第 01–03 期看推理、Tokenizer 和 Embedding；第 04 期进入 E4B 的 decoder 层，第 05 期再拆开层内的矩阵乘；第 06–09 期继续看 Attention、RoPE、局部/全局层与 PLE；第 10–14 期追踪 Prefill、Decode、KV Cache、权重和数据搬运；最后接入图像、音频，并讨论端侧持续运行和家族型号的差异。各期使用同一 E4B 案例，标题和顺序服务于这条故事线。

| 期 | 中文章节 | 状态 |
| --- | --- | --- |
| 01 | [Gemma 4 怎样把文字、图片和声音变成回答](01-input-to-next-token.md) | 中文总览稿；封面与两张概念图已配 |
| 02 | [一句提问，怎么变成 15 个 Token？](02-tokenizer.md) | 中文稿；封面与两张讲解图已配 |
| 03 | [一个 ID，为什么能变成 2560 个数？](03-embedding.md) | 中文稿；封面与双用途讲解图已配 |
| 04 | [42 层里的这一层：Gemma 4 怎样更新一个向量？](04-decoder-layer.md) | 中文总览改稿；封面、主干图与 torchview 核对图已配 |
| 05 | [Decoder 里的 Linear 在算什么？](05-tensor-matmul-basics.md) | 中文改稿；封面、两张讲解图及 MLP 局部图已配；英文待补 |
| 06 | [“它”指向谁：沿着 Q、K、V 看一次注意力](06-attention-tensors.md) | 中文改稿；封面、torchview 局部图和原理图已配 |
| 07 | [词序怎么进入注意力：Gemma 4 的 RoPE 旋转](07-rope-position.md) | 中文改稿；封面与草稿讲解图已配 |
| 08 | [五层看近处，一层看全局：E4B 如何分配注意力](08-hybrid-attention.md) | 中文改稿；封面与草稿讲解图已配 |
| 09 | [同一个词，42 次提醒：E4B 的额外参数藏在哪](09-ple.md) | 中文改稿；封面与草稿讲解图已配 |
| 10 | [Prefill 与 Decode：同一模型的两种计算形态](10-prefill-decode.md) | 中文改稿；封面与讲解图已配 |
| 11 | [回答越长，模型随身带的“笔记”越厚](11-kv-cache.md) | 中文改稿；封面与讲解图已配 |
| 12 | [叫作 E4B，为什么不能按 4B 装权重](12-weights-ple-quantization.md) | 中文改稿；封面与讲解图已配 |
| 13 | [不写下整张注意力表，还能算出同一个答案吗](13-attention-acceleration.md) | 中文改稿；封面与讲解图已配 |
| 14 | [乘加阵列跑得快，数据为什么还在路上](14-compute-and-data-movement.md) | 中文改稿；封面与讲解图已配 |
| 15 | [一张照片进入问题后，模型多走了哪段路](15-vision-path.md) | 中文改稿；封面与草稿讲解图已配 |
| 16 | [听到一句话之前，Gemma 4 先处理了什么](16-audio-path.md) | 中文改稿；封面与草稿讲解图已配 |
| 17 | [从峰值到持续输出：功耗和供电给推理划了什么边界](17-power-thermal-pi.md) | 中文改稿；封面与讲解图已配 |
| 18 | [换个 Gemma 4 型号，前面的账还算数吗](18-family-and-next-steps.md) | 中文改稿；封面与草稿讲解图已配 |

## 读图约定

本文的 `B` 为请求批量、`S` 为本次输入 token 数、`T` 为已有历史长度，`D=2560` 为 E4B 文本主宽度。张量形状按 `[batch, position, feature]` 或在 Attention 中按 `[batch, head, position, head_dim]` 写明。图若只展示 `B=1,S=2`，只是为了让局部计算路径在手机上可读；不会把示例长度当作模型上下文上限。

`torchview` 图追踪官方 Transformers 的 E4B 模块，采用 meta tensor，不加载模型权重，也不产生数值预测。第 04 期以按源码独立绘制的中文图解释完整单层，再提供 torchview 追踪供核对；第 05 期放大单层 MLP，第 06 期放大局部层 Q/K/V 投影；第 03 期使用主 Embedding 双用途概念图。外部原图已按论述放入对应章节，涉及家族比较或教学简化的地方由图注说明 E4B 的适用边界。图上的节点列出了各线的 tensor size；正文同时说明每个轴和图的截取边界。

## 事实口径

以 [Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)、[E4B 配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)和 [Transformers 的 Gemma 4 实现](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)核对结构。E4B 的“4.5B effective”不能直接当作完整权重参数数；缓存容量与性能也必须连同精度、batch、序列长度和设备条件阅读。文中的构造例子、解析估算与模型事实分别标示，不将示意图或公式当作设备实测。

18 期中文稿均已有独立封面。正文中的配图提示注释已逐一处理：已有原图支撑的章节清理旧占位，仍缺独立机制图的第 06、10–14、17 期补入中文文生图。生成图只用于讲解机制，不代表模型运行截图或芯片实测；其提示词和生成记录保存在系列编辑资料中。英文正文与英文配图按当前安排暂缓。
