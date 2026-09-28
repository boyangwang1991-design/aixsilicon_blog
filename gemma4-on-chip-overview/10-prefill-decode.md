# 第一个回答还没出口，计算节奏已经变了

![Prefill 与 Decode 两种节奏的概念封面](assets/generated/cover-10-zh.png)

[系列索引](README.md) · 第 10 期

同样调用一套 Gemma 4 权重，用户发送提示词的那一刻与模型持续吐字时，计算形状并不一样。提示词已经全部给定，模型可以一次处理其中许多位置。这段叫 Prefill：线性层接收多行 `[S_prompt,D]`，同一权重服务多行，Attention 同时建立这些位置的 K/V。首个回答 token 的等待时间通常包含这段工作。首个 token 选出后，模型才知道下一步要喂回哪个 ID；batch=1 的典型 Decode 步在线性层只有一行 `[1,D]`。一条回答的各个生成步因此有前后依赖。

两段工作共享权重，字节账却不同。Prefill 的矩阵乘有较多 token 行可复用一块权重；Decode 每步仍要访问大量权重，同时读取可见历史 K/V。当前 token 的 Q 只是一行，注意力却可能要读很多历史键。不能简单说“Prefill 全是算力瓶颈、Decode 全是带宽瓶颈”：具体上限还受上下文、batch、量化位宽、缓存与设备带宽影响。

![Prefill 一次处理已知提示词，Decode 逐步生成并读取历史 KV](assets/generated/prefill-decode-hardware-zh.png)

*图：两阶段使用同一套权重。图中 `S` 是提示词位置数、`B=1`；每个 Decode 步读取当时可见的历史 K/V，具体读取量还取决于层类型和上下文长度。*

## 为什么两个阶段不能只报一个速度

设提示词长 `S=128`，回答准备生成 64 个 token。Prefill 处理的是已知的 128 个位置，可以把这些位置组成矩阵，并由末尾 logits 选出首个回答 token；此后常规自回归生成还需 63 次依次进行的 Decode 前向。若实现另有调用或 MTP 优化，前向次数会变化，但后一枚 token 的内容仍依赖已有输出。如果只测后续 Decode 的平均速度，用户等首 token 的时间就消失了；若只报端到端 token/s，又可能掩盖稳定生成速率。两项都要给出输入长度、输出长度、batch 与设备条件。

Prefill 的大矩阵形状使权重更有机会复用，代价是较大的中间激活和注意力工作集；Decode 的小 `M` 使权重字节更难摊薄，但它也可能因短上下文、缓存命中或较大 batch 而表现不同。阶段名称描述算法依赖，瓶颈归因仍须看实际数据移动和设备测量。

## 同一层在两阶段的矩阵形状

看 E4B 的一张 gate 投影矩阵，按数学约定是 `[2560,10240]`。Prompt 长 `S=128`、batch=1 时，Prefill 可写成 `[128,2560]×[2560,10240]→[128,10240]`；Decode 新增一个位置时是 `[1,2560]×[2560,10240]→[1,10240]`。两次都要用同一张权重，却分别为 128 行和 1 行产出结果。前者是大型矩阵乘，后者更接近矩阵向量乘，这解释了权重复用机会的差别。注意这里的数学矩阵方向与 PyTorch `Linear.weight` 的保存方向可能转置，算子语义一致。

Attention 的变化更明显。Prefill 局部层让 128 个查询分别看允许的前缀；因为 `128<512`，窗口尚未截断这段提示词。全局层也看完整因果前缀。Decode 到第 129 个位置时，只有一个新 Q，但要读取先前位置的 K/V；当序列超过 512，局部层的可见长度被窗口限制，全局层仍可能继续增长。每步把新 K/V 加入缓存的成本与读取历史的成本应分开测量。

若首 token 的抽样由 Prefill 最后位置 logits 直接完成，首 token 的时间通常无需再额外计一次完整单 token Decode；测量时仍要说明是否把模板、Tokenizer、设备传输和输出解码算进去。第二个 token 开始的稳定 Decode 速率也应给出上下文长度，因为全局 K/V 读取随长度变化。一个 `tokens/s` 数字若没有这些条件，很难跨设备或跨模型比较。

可选的多 token 预测（MTP）会改变目标模型后续前向的安排，第 18 期结合 drafter 再谈；它不改变这里的基本对比：已知提示词可成批处理，常规生成必须依次确定新 token。评测仍要分开记录首 token 延迟、后续 token/s 和整段耗时。现在留下一个关键问题：后续一步只输入一个新 token，前面那些 K/V 从哪里来？

资料：[Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4) · [E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 源码](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)
