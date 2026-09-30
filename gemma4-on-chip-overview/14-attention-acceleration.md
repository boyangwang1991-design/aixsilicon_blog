# E4B Attention 加速：分块、滑窗与长上下文 Decode 怎样分工

![Attention 分块计算与片上累积的概念封面](assets/generated/cover-13-zh.png)

[系列索引](README.md) · 第 14 期

同样是 Attention，Prefill 要同时处理整段输入里的许多 query，Decode 通常只为新 token 处理一个 query。前者容易生成巨大的分数与概率中间表；后者的中间表很短，却可能要反复读取越来越长的 KV Cache。若再把 E4B 的 512 token 局部窗口与全局层混在一起谈，“用某个加速算法”就成了一句没有执行条件的话。

本期的结论先说清楚：**E4B 应保留模型已有的滑窗、GQA 和跨层 KV 共享；Prefill 以分块融合 Attention 为主，局部层还须跳过窗口外 tile；Decode 用直接读取 KV Cache 的单 query 内核，只有全局层在长历史、并行度不足时才考虑 Split-K。** PagedAttention 负责多请求场景的缓存管理，可以与上述计算内核组合，不是它们的替代品。下面沿着“少算哪些位置、少搬哪些中间量、怎样喂饱硬件”把选择展开。

## Attention 加速先分清四笔账

Attention 的输出是 `softmax(QKᵀ·scale + mask)V`。对一段长度为 `S` 的全局 Prefill，若把分数完整物化，其逻辑形状为 `[B,Hq,S,S]`。例如 `B=1、Hq=8、S=4096`，仅一份 BF16 分数表就约 256 MiB，还没有概率表、mask 和其他工作区。因果约束使有效位置约占三角区域，但朴素密集实现仍可能分配完整矩形。

主流加速思路改变的是不同对象，不能把收益重复计算：

| 思路 | 省下的主要开销 | 对 E4B 的位置 |
| --- | --- | --- |
| 限制可见范围：滑窗、块稀疏等 | 不再计算或读取被排除的 query–key 配对 | E4B 的局部层已有 512 token 滑窗；全局层仍须覆盖完整可见历史 |
| 减少 KV 份数：MQA/GQA、跨层共享 | KV 生成与保存的字节数；GQA 也减少每个位置的 KV 读取量 | E4B 已用 8 个 Q 头配 2 个 KV 头；后 18 层复用此前同类型层的 KV |
| 改计算顺序：分块融合、online softmax | 分数与概率中间表的外存往返 | Prefill 的基础方案，局部和全局层都需要 |
| 改缓存与并行调度：KV Cache、分页、Split-K | 重算历史、缓存碎片，或单 query 并行度不足 | 主要影响 Decode；不同技术解决的问题也不同 |

这里的第一、二行涉及模型结构。任意再缩小 E4B 全局层的可见范围，或把精确注意力换成线性注意力，并非直接替换一个推理内核，而是改变模型计算。KV 量化可进一步降带宽，但引入数值误差，须单独验证质量；它也不替代正确的 Attention 调度。

![E4B Attention 加速路线图：模型结构、Prefill 分块融合与 Decode 缓存并行](assets/generated/attention-acceleration-map-13-zh.png)

*图：概念示意。左侧先缩小可见位置与 KV 份数；中间用分块融合避免 Prefill 落地分数/概率表；右侧区分局部 Decode 的单 query 融合、长历史全局 Decode 可选的 Split-K，以及多请求场景的分页缓存管理。图中箭头表示数据路径，不代表某款设备的实测加速。*

## Prefill：先别把分数表写回外存

FlashAttention 一类**精确分块 Attention**把一块 Q 与若干块 K/V 放进片上快存储，块内完成点积、softmax 更新和乘 V。关键在于 softmax 可以在线合并：每个 query 只需保留当前最大分数 `m`、指数和 `l`、加权 V 的部分输出 `o`。下一块若出现更大的分数，旧的 `l` 和 `o` 同时按新最大值重缩放；最后输出 `o/l`。这样不必为完整分数表和概率表安排外存空间。实数运算与一次算完整 softmax 等价，有限精度的舍入可能不同。[FlashAttention 论文](https://arxiv.org/abs/2205.14135)讨论的是这类 IO 收益；[FlashAttention-2](https://arxiv.org/abs/2307.08691)还改进了工作划分与并行效率。

![一个 query 顺序处理两块 K/V，维护 online softmax 状态](assets/generated/online-softmax-zh.png)

*图：概念示意。两块 K/V 依次更新 `m、l、o`，最后输出 `o/l`。图中的小块只为看清合并关系；真实内核会并行处理多个 query 和 head。分块减少中间表搬运，不会让可见 K/V 的读取自动消失。*

局部层还可以再省一步：只调度落在 512 token 窗口内的 K/V 块。若仍对整段 `S×S` 做点积、最后才把窗口外位置 mask 掉，计算量并没有随窗口缩小。局部层的有效配对量随 `S×512` 增长；全局层仍随 `S²` 增长。因此 E4B 的局部 Prefill 应采用**真正跳过窗口外 tile**的因果分块内核，全局 Prefill 则采用支持其 head 维度的因果分块内核。两者都保留原模型的可见范围。

分块大小还受片上 SRAM、寄存器、head 维度与并行单元数量约束。块过大放不下或压低并行度；块过小会让调度和重复读取占上风。这里没有一个对所有设备都成立的 tile 尺寸，应该按局部层和全局层分别测量。

## Decode：中间表不大，历史 KV 才重

KV Cache 让新 token 直接使用已经算好的历史 K/V，省去每步重新投影整个前缀。局部层只读最近窗口；全局层必须读可见历史。此时每个 head 通常只有一个新 query，能并行铺开的 query 行很少，Prefill 那套以消除 `S×S` 中间表为主要收益的解释已不适用。Decode 内核仍可用分块与 online softmax 稳定合并结果，但优化重点转为 **KV 读取、访存连续性和足够的并行任务**。

短历史或局部 512 窗口，直接用单 query 的融合内核通常最合适：按 2 个 KV 头读取缓存，供各自的 4 个 Q 头复用，算完就输出，避免把 KV 物理复制成 8 份。局部缓存可按滚动窗口组织；全局缓存则要保留长历史。E4B 的跨层共享减少了需要生产和常驻的 KV 份数，但共享层仍各自计算 Q、读取共享 KV、执行 Attention 与输出投影。

全局层在很长历史下可能遇到另一个瓶颈：一个 query、少量 head 产生的任务不够多，硬件有计算单元闲着。**Split-K** 将历史 KV 切成多段并行处理，每段产出局部最大值、指数和与部分输出，再合并为同一个 softmax 结果。它增加并行度，也增加一次部分结果合并和工作区；只有长历史、设备确实缺少并行任务时才值得开启。相反，多请求服务中常见的 **PagedAttention** 把 KV Cache 按页管理，减少动态长度带来的碎片并方便请求调度；它没有减少单个请求必须访问的历史位置，也可以与融合或 Split-K 内核一起使用。[PagedAttention 论文](https://arxiv.org/abs/2309.06180)和 [FlashInfer 的 Attention 接口](https://docs.flashinfer.ai/api/attention.html)分别展示了这两类工程方向。

## 落到 E4B：四种负载，四个内核条件

E4B 共 42 层，其中 35 层局部 Attention、7 层全局 Attention；局部窗口为 512，局部 head_dim 为 256，全局 head_dim 为 512。下表是**基于模型结构的选型建议，不是某款芯片上的性能实测**。

| 负载 | 优先采用 | 为什么 |
| --- | --- | --- |
| 局部 Prefill | 因果滑窗分块融合内核，跳过窗口外 tile | 同时省去密集中间表与无效配对；工作范围由窗口限定 |
| 全局 Prefill | 支持 head_dim=512 的因果分块融合内核 | 不落地 `S×S` 中间表；全局可见关系仍需计算 |
| 局部 Decode | 直接消费滚动 KV Cache 的单 query 融合内核 | 最多读取窗口内 KV，额外 Split-K 合并常不划算 |
| 全局 Decode | 短历史先用单 query 融合内核；长历史且并行度不足时试 Split-K | 长上下文主要受 KV 读取与并行度制约，切段是否获益取决于设备和批量 |

这个建议不能简写成“E4B 全部使用 FlashAttention-2”。[FlashAttention 官方实现说明](https://github.com/Dao-AILab/flash-attention#nvidia-cuda-support)写明其 CUDA FlashAttention-2 支持的 head_dim 上限为 256：局部层刚好在范围内，**全局层的 512 不在该实现的支持范围内**。这不否定分块 online softmax 算法；它说明全局层要找确实支持 512 的后端、自行实现，或退回正确的通用内核，并检查实际 dispatch，不能只看接口名。端侧 NPU 的实现还需按片上存储和算子支持重新选 tile。

接入任何后端前还要核对算子语义：Q/K 的归一化与 RoPE 由模型按原顺序完成；8 个 Q 头与 2 个 KV 头的对应关系正确；局部 512 窗口、全局因果 mask 和共享 KV 的索引正确；K、V 是独立张量。尤其注意 E4B 在 Q/K 归一化后使用的 Attention `scale=1.0`，许多通用内核默认 `1/√head_dim`，必须显式覆盖。先用参考实现对局部/全局、Prefill/Decode、窗口边界和长上下文输出做数值对照，再谈吞吐。

所以选择顺序是：先执行 E4B 原有的可见范围与 KV 共享，再用分块融合减少 Prefill 中间 IO，最后按 Decode 的历史长度和设备并行度决定是否拆分全局 KV。下一期把 Attention、MLP 与权重读取放到同一张字节账里，看整机瓶颈如何随 Prefill 和 Decode 切换。

资料：[E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 实现](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py) · [FlashAttention](https://arxiv.org/abs/2205.14135) · [FlashAttention-2](https://arxiv.org/abs/2307.08691) · [PagedAttention](https://arxiv.org/abs/2309.06180) · [FlashInfer Attention 接口](https://docs.flashinfer.ai/api/attention.html)
