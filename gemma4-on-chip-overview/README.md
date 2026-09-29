# Gemma 4 从算法到端侧芯片

> 中文内部改稿，保存在公开 GitHub 仓库中，尚未完成正式发布审阅。Maarten Grootendorst 的原图放在 `assets/draft-newsletter/` 供逐章核对；正式用于公众号等平台前仍需取得图片使用许可或替换。英文版和英文配图暂缓。

第 01 期建立 Gemma 4 的多模态与生成全景，第 02 期沿官方 Tokenizer 追踪一句话的真实输入，第 03 期接着看 ID 怎样进入主 Embedding 表。第 04 期用合并实现与逻辑说明的 `torchview` 总图解释 decoder 主线，第 04A 期展开其中反复出现的 RMSNorm。其余章节按这条主线逐步拆解，当前仍在中文编辑阶段。

如果你不熟悉 Transformer，可以从第 01 期读起。第 01–03 期看推理、Tokenizer 和 Embedding；第 04 期进入 E4B 的 decoder 层，第 04A 期解释 RMSNorm，第 05 期再拆开层内的矩阵乘；第 06–09 期继续看 Attention、RoPE、局部/全局层与 PLE；第 10–14 期追踪 Prefill、Decode、KV Cache、权重和数据搬运；最后接入图像、音频，并讨论端侧持续运行和家族型号的差异。各期使用同一 E4B 案例，标题和顺序服务于这条故事线。

| 期 | 中文章节 | 状态 |
| --- | --- | --- |
| 01 | [Gemma 4 E4B 推理全景：多模态输入如何生成文本](01-input-to-next-token.md) | 中文总览稿；封面与两张概念图已配 |
| 02 | [聊天模板与 Tokenizer：一句提问如何变成模型输入](02-tokenizer.md) | 中文稿；封面与两张讲解图已配 |
| 03 | [Embedding：Token ID 如何变成 2560 维向量](03-embedding.md) | 中文稿；封面与双用途讲解图已配 |
| 04 | [Decoder Layer：Attention、MLP 与 PLE 如何更新状态](04-decoder-layer.md) | 中文总览改稿；封面、合并逻辑说明的 torchview 总图及三段局部图已配 |
| 04A | [RMSNorm：Gemma 4 为什么反复调整向量尺度](04a-rmsnorm.md) | 中文新稿；独立封面与原理图已配；英文待补 |
| 05 | [Gemma 4 的矩阵乘：特征怎样进入 Cube](05-tensor-matmul-basics.md) | 中文改稿；封面、MLP 局部图及两张文生讲解图已配；英文暂缓 |
| 06 | [Attention：当前位置怎样读取上下文](06-attention-tensors.md) | 中文改稿；封面、完整 Attention torchview 原图、压缩讲解图与 GQA 示意图已配；KV Cache 细节转第 11 期 |
| 07 | [RoPE：Q、K 的绝对位置怎样变成相对位移](07-rope-position.md) | 中文重写；封面与两张横向 PPT 风格文生讲解图已配 |
| 08 | [Hybrid Attention：局部层、全局层与 KV 共享如何分工](08-hybrid-attention.md) | 中文改稿；封面与 3 张原创 imagegen 讲解图已配 |
| 09 | [PLE：一枚 Token 怎样给每层不同的输入](09-ple.md) | 中文精简改稿；封面、完整算法路径文生图与 PLE 局部 torchview 已配 |
| 10 | [Prefill 与 Decode：同一模型的两种计算形态](10-prefill-decode.md) | 中文改稿；封面与讲解图已配 |
| 11 | [KV Cache：保存什么，容量如何增长](11-kv-cache.md) | 中文改稿；封面、跨步复用、单步读写、容量流量对照与硬件存储层级图已配 |
| 12 | [E4B 权重与量化：从参数容量到芯片带宽](12-weights-ple-quantization.md) | 中文改稿；封面与两张讲解图已配 |
| 13 | [E4B Attention 加速：分块、滑窗与长上下文 Decode 怎样分工](13-attention-acceleration.md) | 中文重梳；按层类型与推理阶段说明加速选型，封面与讲解图已配 |
| 14 | [数据搬运与 Roofline：权重复用如何改变瓶颈](14-compute-and-data-movement.md) | 中文改稿；封面与讲解图已配 |
| 15 | [视觉输入：照片如何变成软 Token](15-vision-path.md) | 中文改稿；封面与两张原创 PPT 风格讲解图已配；英文暂缓 |
| 16 | [音频输入：波形如何变成软 Token](16-audio-path.md) | 中文改稿；封面与两张原创 PPT 风格讲解图已配；英文暂缓 |
| 17 | [功耗、散热与供电：端侧推理能否持续输出](17-power-thermal-pi.md) | 中文改稿；封面与讲解图已配 |
| 18 | [Gemma 4 型号比较：结构变化怎样重算资源需求](18-family-and-next-steps.md) | 中文改稿；封面与草稿讲解图已配 |

## 读图约定

本文的 `B` 为请求批量、`S` 为本次输入 token 数、`T` 为已有历史长度，`D=2560` 为 E4B 文本主宽度。张量形状按 `[batch, position, feature]` 或在 Attention 中按 `[batch, head, position, head_dim]` 写明。图若只展示 `B=1,S=2`，只是为了让局部计算路径在手机上可读；不会把示例长度当作模型上下文上限。

`torchview` 图追踪官方 Transformers 的 E4B 模块，采用 meta tensor，不加载模型权重，也不产生数值预测。第 04 期采用第 0 层追踪的上下布局压缩图，在同一图中说明三段更新、主状态与残差，并从同一追踪中截取 Attention、MLP、PLE 三张局部图；未压缩追踪图保留供核对。第 05 期放大单层 MLP，第 06 期同时展示完整局部层 Attention 的原始 `torchview` 图与压缩讲解图，说明从 Q/K/V 到输出投影的整条路径；第 03 期使用主 Embedding 双用途概念图。外部原图已按论述放入对应章节，涉及家族比较或教学简化的地方由图注说明 E4B 的适用边界。图上的节点列出了各线的 tensor size；正文同时说明每个轴和图的截取边界。

## 事实口径

以 [Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)、[E4B 配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)和 [Transformers 的 Gemma 4 实现](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)核对结构。E4B 的“4.5B effective”不能直接当作完整权重参数数；缓存容量与性能也必须连同精度、batch、序列长度和设备条件阅读。文中的构造例子、解析估算与模型事实分别标示，不将示意图或公式当作设备实测。

19 期中文稿均已有独立封面。正文中的配图提示注释已逐一处理：已有原图支撑的章节清理旧占位，仍缺独立机制图的第 06、10–14、17 期补入中文文生图。生成图只用于讲解机制，不代表模型运行截图或芯片实测；其提示词和生成记录保存在系列编辑资料中。英文正文与英文配图按当前安排暂缓。
