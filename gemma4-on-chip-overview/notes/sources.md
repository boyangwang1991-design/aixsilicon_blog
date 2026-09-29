# Gemma 4 首轮稿事实与绘图记录

- 模型与参数：Google [Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)；E4B 配置 revision `ee0ef6023621cff504d758262d4e04895a5af4a2`。
- Tokenizer：同一 revision，`AutoTokenizer.from_pretrained(..., revision=...)` 对未套聊天模板的“为什么天空是蓝色的？”得到 ID `[38157,141370,237026,240123,40074,237536]`、token `['为什么','天空','是','蓝','色的','？']`。同一 revision 下，单条 `user` 消息配合 `add_generation_prompt=True` 得到 15 个 ID：`[2,105,2364,107,38157,141370,237026,240123,40074,237536,106,107,105,4368,107]`。本结果只对这个模板调用成立。
- 第 02 期重新用本地缓存中的同一官方 revision 核对上述结果。当前安装的 Transformers 版本里，`apply_chat_template` 返回含 `input_ids` 与 `attention_mask` 的 `BatchEncoding`；正文示例兼容列表或映射。完整可读 token 序列为 `['<bos>','<|turn>','user','\n','为什么','天空','是','蓝','色的','？','<turn|>','\n','<|turn>','model','\n']`。正文图中的 `↵` 是 `\n` 的教学符号。
- 固定 E4B 配置已核对：hidden=2560、MLP intermediate=10240、42 层、8 个 Q 头、局部/全局 KV 头均为 2、head dim 分别为 256/512、共享 KV 层数 18、局部窗口 512、`use_double_wide_mlp=False`、最终 logit softcap 30。
- 结构图：官方 Hugging Face Transformers `gemma4` 源码快照 commit `8445b13cd24961e47f25a649fb113580f71a8d11`；运行环境 PyTorch `2.8.0+cpu`、Transformers `5.18.0.dev0`、torchview `0.2.7`。已核对该源码文件与环境中实际导入的 `modeling_gemma4.py` SHA-256 相同：`ED5794973EE39B0216E1A0FF0D9DB5B2BE84078A18A88A70D8C301130DC21C79`。图使用 `meta` 参数/输入，只追踪结构，不加载 E4B checkpoint，也不做数值推理。
- DOT 渲染：`@viz-js/viz 3.30.0`、`sharp 0.35.5`。源文件、DOT、SVG 和 PNG 均位于 `assets/diagrams/`；PNG/SVG 哈希见 `sources.json`。
- 第 03 期主 Embedding：固定配置 `vocab_size=262144`、`hidden_size=2560`、`tie_word_embeddings=true`；官方 `Gemma4TextScaledWordEmbedding.forward` 在查表后乘以按权重 dtype 转换的 `√hidden_size`。主表元素数 `671088640`；假设 BF16 原始存储为 `1.25 GiB`，单行 `5 KiB`，六行 `30 KiB`。输出词表头在完整候选计算下约 `671088640` 次 MAC/位置。均为解析算术，不是 E4B 设备测量。原局部 Embedding torchview 图只有一次查表的形状，已从文章与图集移除，正文改用同表双用途原理图。
- KV 容量示例：公式仅计前 24 个独立 KV 生产层的 BF16 原始张量。前 24 层包含 20 个局部、4 个全局；`B=1,Hkv=2`，局部 `d=256,T=512`，全局 `d=512,T=131072`。局部约 20 MiB、全局约 2 GiB。未计元数据、临时状态、系统与设备限制，非实际峰值。

## 待核对

- 多模态 processor 的固定图像、音频样例及各阶段位置长度。
- 各发布量化版本的实际模块位宽、KV dtype、额外存储与质量。
- 后部共享层临时全长 KV 对峰值资源的影响。
- 设备级性能、功耗、热与供电数据；本稿仅讨论负载引出的测量问题。
