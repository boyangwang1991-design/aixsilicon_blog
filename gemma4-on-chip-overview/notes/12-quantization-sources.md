# 第 12 期量化与硬件口径

- 核对日期：2026-09-29。
- [Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)：E4B 约 4.5B effective、约 8B 含 embedding 参数。参数为近似值。
- [Google Gemma 4 模型概览](https://ai.google.dev/gemma/docs/core)：E4B BF16/SFP8/Q4_0 装载内存估算分别为 17.9/8.9/4.5 GB；移动版和纯文本移动版分别为 2.5/2.2 GB。官方表注含约 20% 附加装载开销，并说明上下文 KV 另计、结果随工具和环境变化。该页还列出 QAT Q4_0、W4A16 和 E4B 移动混合位宽/优化 KV 发布格式。
- 本章的 8B×2 字节、8B×0.5 字节是用近似总参数数做的理想净荷算术，不等于官方格式的文件大小或运行时峰值。
- 分组量化算例是假设每 64 个 4 bit 权重值共用一个 BF16 scale：平均 `0.5+2/64=0.53125` 字节/参数。gate 权重 `2560×10240=26,214,400` 元素；BF16 为 `52,428,800` 字节（50 MiB），构造量化净荷为 `13,926,400` 字节（约 13.3 MiB）。单行矩阵乘 `52,428,800` FLOP 除以各自权重字节，算术强度为 1 与约 3.76 FLOP/byte。该假设不是官方 Q4_0 格式声明。
- 硬件分析中的“低比特权重若长期展开存放，外存权重读取可能接近 BF16”“若近计算处解包，外存流量才有机会下降”等是基于数据流的推论，不是 E4B 设备测试结果。
- [Google Gemma 4 模型概览](https://ai.google.dev/gemma/docs/core)列出移动 `wNa8o8` 与 `W4A16` 两类不同发布格式；不能把其中一个执行路径当作全部 E4B 后端。
- [Google E4B 移动模型配置](https://huggingface.co/google/gemma-4-E4B-it-qat-mobile-transformers/blob/main/config.json)显示模块采用混合位宽，包括 MLP 的 4 bit、部分 PLE 投影的 8 bit 与部分嵌入表的 2 bit。配置给出量化存储规则，不单独证明某个芯片的实际算子调度。
- [LiteRT 8 位量化规范](https://developers.google.com/edge/litert/conversion/tensorflow/quantization/quantization_spec)明确 INT8 激活、INT8 权重与 INT32 偏置/累加的整数算子语义。这支持正文的典型整数数据流解释；具体 4 bit 权重如何解包并接入 INT8 单元仍由后端实现决定。
