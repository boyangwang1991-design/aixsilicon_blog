# Gemma 4 从算法到端侧芯片｜11 篇版

这是一套按问题重新组织的中文编辑稿。以 Gemma 4 E4B 为共同案例，先追踪输入与 Decoder，再看矩阵乘、Attention 和缓存怎样落到硬件，最后讨论多模态输入、持续运行及型号差异。正文直接引用上层目录已有配图；[19 章原版](../README.md)保留供逐项核对。

| 篇 | 问题 | 从原版吸收的主题 |
| --- | --- | --- |
| 01 | [输入怎样进入模型：从提问到向量](01-inputs-and-representations.md) | 01、02、03 |
| 02 | [Decoder 怎样更新状态：Attention、MLP、RMSNorm 与 PLE](02-decoder-state.md) | 04、04A、09 |
| 03 | [矩阵乘怎样落到 Cube：内积、外积与 Tiling](03-matmul-cube.md) | 05 |
| 04 | [Attention 怎样读到正确位置：Q/K/V 与 RoPE](04-attention-and-position.md) | 06、07 |
| 05 | [历史信息怎样保存：混合 Attention 与 KV Cache](05-hybrid-attention-kv-cache.md) | 08、11 |
| 06 | [Prefill 与 Decode 怎样加速 Attention](06-prefill-decode-acceleration.md) | 10、13 |
| 07 | [权重和数据怎样穿过芯片：量化、带宽与复用](07-weights-quantization-data.md) | 12、14 |
| 08 | [视觉输入：照片与视频帧怎样进入 E4B](08-vision-path.md) | 15 |
| 09 | [音频输入：波形怎样变成软 Token](09-audio-path.md) | 16 |
| 10 | [持续运行的边界：功耗、散热与供电](10-power-thermal-pi.md) | 17 |
| 11 | [换一个 Gemma 4 型号，资源账怎样重算](11-family.md) | 18 |

本版只调整中文篇章组织。`torchview` 图展示构造输入下的模块与形状，不代表加载权重后的模型输出；概念图不代表设备测量。公式估算的条件写在相应正文旁。英文版仍按当前安排暂缓。
