# 第 06 期 Attention 内容复核

复核基准：`reference/transformers-gemma4-8445b13/` 内的固定源码与 E4B 配置；`reference/` 只读，不是公开正文引用入口。

| 正文结论 | 核对位置 | 处理 |
| --- | --- | --- |
| 第 0 层局部 Attention：8 个 Q 头、2 个 KV 头、每头 256 维、窗口配置 512 | `e4b-config.json` 的 `text_config`；`configuration_gemma4.py:210-223` 的逐层配置 | 正文说明 4:1 分组、相同头宽比较下 K/V 张量为 8 KV 头方案的 1/4；不把这个比例说成整层计算收益 |
| Q/K/V 分开投影，头内 Q/K/V 归一化，只有 Q/K 做 RoPE；K/V 缓存在这些步骤之后更新 | `modeling_gemma4.py:1189-1212,1228-1253` | 补充每路的用途、RoPE 与缓存边界 |
| Q/K 匹配、mask、softmax、V 汇聚、输出投影；本实现 `scaling=1.0` | `modeling_gemma4.py:814-845,1261-1274` | 正文按目的解释每步，不误套默认 `1/√d` 缩放 |
| Attention 模块前后还有层内 RMSNorm 与残差 | `modeling_gemma4.py:1395-1408` | 区分图示的 Attention 模块与完整 decoder 层 |
| 原始 `torchview` 追踪使用恒等 RoPE 输入和全零 mask，不启用缓存 | `assets/diagrams/generate_attention_torchview.py` | 图注明确图只显示算子路径，不展示真实位置旋转或遮挡 |

阅读逻辑复核：开头给出两次汇合；按 Q/K/V、头与 GQA、单次 Attention、形状、KV Cache 的顺序展开。GQA 交代 K/V 头数减少的缓存与读取收益及共享代价；KV Cache 交代免重算与内存、带宽代价。两张 imagegen 图的下标分别表示头号与位置号，图注已说明。
