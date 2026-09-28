# Gemma 4 从算法到端侧芯片：系列写作规划

> 状态：中文系列已形成逐章改稿，仍属内部审阅稿。部分章节已有封面、讲解图及参考文章原图；参考文章原图仅供内部审阅，发布前需处理授权或替换。英文正文和英文配图按当前安排暂缓，设备实测及正式发布审阅仍待补。

这个系列从用户输入开始，沿 **Gemma 4 E4B 的一次推理**追踪 token、张量、算子和状态。每当算法决定了数据量、访问方式或执行依赖，再解释它对端侧硬件提出的要求。以 E4B 为贯穿案例，是因为它含逐层嵌入（PLE）、局部/全局混合注意力、跨层 KV 共享和图像/音频输入；其他 Gemma 4 型号在最后比较，避免把不同结构混称为一种模型。

## 先把问题摊开，再排故事线

初步头脑风暴把问题分成六组，不按术语名直接排章节：

1. **用户看到的回答从哪来？** 模板、tokenizer、embedding、42 层、logits、采样；“一个 token”究竟是什么。
2. **一个位置凭什么读到另一个位置？** Q/K/V、头与轴、softmax、因果 mask、RoPE、滑窗与全局层、GQA、跨层 KV 共享。RoPE 要解释旋转后的点积，不能只说“加入位置信息”。
3. **回答为何越生成越贵？** Prefill/Decode 的形状变化、KV Cache 的生产/读取/追加/回收、局部与全局缓存的不同增长、长上下文。KV Cache 要讲清保存的具体张量，不能画成模糊的“记忆库”。
4. **哪些计算和存储真正占资源？** PLE 对有效/总参数的影响、混合位宽、MLP、注意力分块与在线 softmax、矩阵复用、权重及 KV 的字节账、Roofline。Attention 加速要分别说明减少中间 IO、缩小可见范围与减少 KV 份数。
5. **输入不再是文字时发生什么？** 图像 patch/视觉编码/软 token，音频采样/特征/编码/软 token；两者分别占用工作区和 decoder 上下文。
6. **这些负载能持续跑吗？** 首 token 延迟、持续 token/s、内存带宽、能耗、热和供电；不同 Gemma 4 型号是否需要重算。

由此形成一条连续故事：**先看一次回答的全貌（01）→ 拆开 Tokenizer 与 Embedding（02–03）→ 进入 E4B 的 decoder，并逐步解释矩阵乘、Attention、RoPE、混合层与 PLE（04–09）→ 第一个回答 token 出现，KV 状态随回答增长（10–11）→ 算清权重、Attention 加速与整体访存（12–14）→ 图像、音频进入同一条回答链（15–16）→ 问它能否在端侧持续运行，并比较家族型号（17–18）**。前四期给零基础读者建立必要的算法直觉，仍沿同一次推理前进；之后每遇到一个机制就展开到能解释输入、运算与输出。章节边界服从解释需要，18 期不是固定配额。

## 阅读顺序（篇数随讲解需要调整）

| 期 | 中文章节 | 本章追踪的输入 → 输出 | 触发的硬件问题 | 状态 |
| --- | --- | --- | --- | --- |
| 01 | [Gemma 4 E4B 推理全景：多模态输入如何生成文本](../01-input-to-next-token.md) | `文本/媒体 → 向量 → logits → token` | 完整推理链路 | 中文内部改稿 |
| 02 | [聊天模板与 Tokenizer：一句提问如何变成模型输入](../02-tokenizer.md) | `消息/模板 → token 字符串与 ID` | 输入长度与上下文预算 | 中文内部改稿 |
| 03 | [Embedding：Token ID 如何变成 2560 维向量](../03-embedding.md) | `ID → 主 embedding 向量` | 词表容量与索引访问 | 中文内部改稿 |
| 04 | [Decoder Layer：Attention、MLP 与 PLE 如何更新状态](../04-decoder-layer.md) | `[B,S,D] → Attention/MLP/PLE 三段更新` | 主路形状、顺序与残差 | 中文内部改稿 |
| 05 | [Linear 与 MLP：矩阵乘如何重组特征](../05-tensor-matmul-basics.md) | `向量/权重 → MLP 门控结果` | 特征组合、张量形状与权重规模 | 中文内部改稿 |
| 06 | [Attention：Q、K、V 如何读取上下文](../06-attention-tensors.md) | `Q/K/V → 分数 → 概率 → 输出` | 头、轴与归约 | 中文内部改稿 |
| 07 | [RoPE 与 p-RoPE：位置信息如何改变注意力分数](../07-rope-position.md) | `位置 → Q/K 旋转 → 分数` | 位置计算与维度 | 中文内部改稿 |
| 08 | [Hybrid Attention：局部层、全局层与 KV 共享如何分工](../08-hybrid-attention.md) | `层类型/可见范围 → KV 共享` | 长上下文状态 | 中文内部改稿 |
| 09 | [PLE：逐层嵌入如何注入 Decoder](../09-ple.md) | `token 身份/当前内容 → 逐层注入` | 嵌入表与索引 | 中文内部改稿 |
| 10 | [Prefill 与 Decode：同一模型的两种计算形态](../10-prefill-decode.md) | `整段提示词 → 逐 token 生成` | 两种负载与延迟 | 中文内部改稿 |
| 11 | [KV Cache：保存什么，容量如何增长](../11-kv-cache.md) | `新 K/V → 缓存 → 下一步读取` | KV 生命周期与容量 | 中文内部改稿 |
| 12 | [E4B 权重容量：为什么不能按有效参数估算](../12-weights-ple-quantization.md) | `参数/位宽 → 容量预算` | DRAM/SRAM 与量化 | 中文内部改稿 |
| 13 | [分块 Attention：Online Softmax 如何减少中间访存](../13-attention-acceleration.md) | `分块 Q/K/V → 在线 softmax → 输出` | Attention 中间 IO | 中文内部改稿 |
| 14 | [数据搬运与 Roofline：权重复用如何改变瓶颈](../14-compute-and-data-movement.md) | `算子形状 → 运算量/字节量` | 带宽与 Roofline | 中文内部改稿 |
| 15 | [视觉输入：照片如何变成软 Token](../15-vision-path.md) | `图像 → 特征 → 软 token` | 视觉工作区与上下文 | 中文内部改稿 |
| 16 | [音频输入：波形如何变成软 Token](../16-audio-path.md) | `音频 → 特征 → 软 token` | 时间长度与状态 | 中文内部改稿 |
| 17 | [功耗、散热与供电：端侧推理能否持续输出](../17-power-thermal-pi.md) | `执行时间线 → 电流/温度` | 持续性能与供电 | 中文内部改稿 |
| 18 | [Gemma 4 型号比较：结构变化怎样重算资源需求](../18-family-and-next-steps.md) | `家族型号 → 各自负载` | MoE 与推测解码 | 中文内部改稿 |

前三期建立整体推理、Tokenizer 与 Embedding 的基础，第 04 期进入 Decoder，第 05 期再拆解层内反复出现的线性投影。每期先讲清**算法输入、变换、输出和张量形状**，再讲它为什么产生特定硬件诉求。第 01 期保留完整旅程的简图；后续逐处打开。RoPE 与 Attention 加速单独讲透：前者要让读者看懂旋转如何改变分数，后者要算清分块、在线 softmax、局部窗口和 KV 共享各自节省的是什么。篇数不是交付上限；若一章无法让读者独立理解关键机制，继续拆分，而不为凑固定期数压缩推导。第 17 期的功耗与供电是负载推导出的设计约束，不把示意波形说成 E4B 实测。

## 统一案例与符号

- 主模型：Google 发布的 **Gemma 4 E4B**，以官方模型卡、公开 E4B `config.json` 和 Hugging Face Transformers 的 `gemma4` 实现核对。内部工程里的 Python 仿真、适配器和缩维 fixture **不作为模型结构或数值依据**。
- 文本例句可用“为什么天空是蓝色的？”，但 token ID、切词边界和 logits 在真正运行官方 tokenizer/模型前只能写成**示意**；不编造输出值。
- `B` 为 batch，`S` 为本次输入 token 数，`T` 为已有上下文长度，`D=2560` 为 E4B 文本 hidden size；`L=42` 为层数；`P=256` 为每层 PLE 宽度。局部层 35 个、全局层 7 个，按 5 个局部层加 1 个全局层重复。局部窗口 512。下文所有容量数字必须注明权重范围、单位、精度、量化元数据、KV dtype、batch 与上下文长度。
- 画图时明确 `Q` 头数 8、局部层 KV 头数 2、局部 head dim 256、全局 head dim 512；全局层的 KV 头配置按固定版本的官方配置及实现再核对，不直接把局部层形状复制过去。
- 区分 **4.5B effective** 与 **约 8B 含 embedding 总参数**。`effective` 描述每 token 的有效计算规模，不能直接乘位宽当作 E4B 完整权重容量。128K 是模型上下文能力，不是任意端侧设备的已验证部署容量。

## 图与可复核材料的约定

已有图包括概念图、局部 `torchview` 图及参考文章原图。完整 42 层图不适合手机阅读，优先画 embedding、单个 decoder 层或单次 attention，并在必要处用可编辑图源补充 `shape/dtype/位置/是否持久化`。允许 Python 计算**解析式**容量和运算量并作图，但不以 Python 自写 Gemma 仿真替代官方实现，也不把解析估算当测量。每张图必须分清实测、配置事实、公式推导和概念示意。后续制作或替换讲解图时，每个专有机制都要回答“输入是什么、每一步如何变、输出是什么、等价性或近似边界是什么、硬件因此多做或少做了什么”，不能仅给术语定义。

## 事实来源与写作门槛

- [Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4)：型号、参数口径、上下文和模态。
- [Google Gemma 4 模型概览](https://ai.google.dev/gemma/docs/core)：官方容量示例及其口径。
- [Google 发布的 E4B 配置](https://huggingface.co/google/gemma-4-E4B-it/blob/main/config.json)：逐层配置；正式写数值时固定 revision，不能只用会变动的 `main`。
- [Transformers 的 Gemma 4 实现](https://github.com/huggingface/transformers/tree/main/src/transformers/models/gemma4)：`configuration_gemma4.py`、`modeling_gemma4.py`、`processing_gemma4.py`；本地已读取源码快照 commit `8445b13cd24961e47f25a649fb113580f71a8d11`，写稿时应继续核对公开源码与 checkpoint 配置。
- [Gemma 4 技术报告](https://arxiv.org/abs/2607.02770)：模型设计的补充依据。

发表前各章应补齐可读正文、中文封面/讲解图、图源记录和证据核对；数字与图内文字要再次审阅。各章自包含，不要求读者访问内部工程、私有日志或另一章才能理解本章的关键结论。
