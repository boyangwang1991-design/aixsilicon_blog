# PLE：一枚 Token 怎样给每层不同的输入

![PLE 为不同 Decoder 层提供逐层输入的概念封面](assets/generated/cover-09-zh.png)

[系列索引](README.md) · 第 10 期

一个 token 进入 Gemma 4 E4B 时，主 Embedding 已经给它一条 2560 维向量。随后每层的 Attention 和 MLP 不断改写这条主状态。PLE（Per-Layer Embeddings，逐层嵌入）为同一个 token ID 在不同 decoder 层各备一组参数：**每组是训练得到的 256 个数，推理时按 token ID 和层号取出。** 它们不是 256 个 token，也不是能读成文字含义的标签；同一 ID 在各层有各自的一组参数。

查出的这组数是 token 身份分量。模型还会从最初的主 Embedding 投影出另一组 256 维数值，两者合成该层实际收到的 PLE 输入。这样，每层都有与原始 token 有关的专属信号可用，再由该层当前状态决定怎样把它接入主路；这不要求最初的 Embedding 独自沿 42 层保存全部身份信息。

这条路的代价也很明确：要保存一张很大的逐层表。PLE 的价值在于把一部分可学习容量放进按 token ID 访问的表，而不是让每个位置都与整张表做稠密矩阵乘。它并不保证某个任务一定提升多少，也不意味着这些参数在设备上不占空间。

## 一次准备，逐层取用

E4B 有 42 层，每层的 PLE 宽度为 256。实现中不存 42 张独立的表，而把它们打包成一张 `[词表大小, 42×256]` 的参数表。给定文本 token ID，只查出对应的一行，再整理成 `[B,S,42,256]`；第 `l` 层取得自己的 `[B,S,256]` 切片。**同一 token 在各层读到的是不同切片，并非一条向量重复送进 42 层。**

这第二组数值的计算也只做一次：模型把进入 decoder 的主 Embedding 投影为 `42×256` 维，按层整理并做 RMSNorm，得到内容分量 `C`。查表并按实现缩放得到的身份分量记为 `I`；文本路径把二者合成 `P=(I+C)/√2`。`C` 不会在每经过一层时重新计算。对单个位置，可以把准备过程读成：

`token ID → I[42,256]`，`主 Embedding[2560] → C[42,256]`，再得到 `P[42,256]`。

这一步只备好 42 份侧输入。PLE 真正改变主状态，还要等相应的 decoder 层使用自己的那一份。

![PLE 的身份查表、输入投影、逐层切片与层内门控注入全路径](assets/generated/ple-full-path-09-zh.png)

*图 1：E4B 文本路径的 PLE 原理示意。身份分量和内容分量在进入层堆叠前形成；每层只取自己的切片，按当前主状态门控后经回投影、归一化与残差接回。图中宽度和层数来自固定 E4B 配置，不是运行测量。*

## 当前状态决定怎样注入

在第 `l` 层，Attention 和 MLP 更新后的主状态仍为 2560 维。PLE 不会把 256 维切片直接加上去：当前主状态先经过 `per_layer_input_gate` 投影到 256 维并激活，再与 `P[l]` 逐元素相乘。乘积经 `per_layer_projection` 回到 2560 维，做 RMSNorm 后通过残差加回主状态。这样，**逐层表提供可用的 token 信息，门控路径决定它如何参与本层更新**；这是一条可学习的条件注入，而非每层无条件加同一个偏置。

![Gemma 4 E4B 第 0 层 PLE 局部 torchview：主状态经门控、逐元素乘法、回投影、RMSNorm 和残差更新](assets/diagrams/decoder-ple-local.png)

*图 2：固定 E4B 实现的第 0 层局部 torchview 追踪。图从已备好的 `PLE input-tensor` 开始，展示层内门控、逐元素相乘、回投影、归一化和残差；末尾 `mul_` 是该层输出缩放。图采用 `B=1,S=2` 的 meta tensor 追踪形状，没有加载权重或运行数值推理。上方图 1 负责说明逐层输入如何形成。*

这一设计还有计算与存储的区别。E4B 固定配置的词表为 262144，逐层表含 `262144×42×256≈28.2 亿` 个元素；仅按 BF16 原始权重计算约为 **5.25 GiB**，实际加载量取决于量化和文件格式。一次文本输入按 ID 取出所需行，不会对这 28.2 亿元素全部执行乘加；但查表、准备内容分量和各层门控/回投影仍有实际成本。Google 将 E4B 区分为约 4.5B effective 参数和约 8B 含嵌入的总参数，正说明**计算口径不能直接当作权重装载容量**。

图像和音频位置还需额外小心：主路可能换入软 token，而 PLE 的身份查表并不等同于“拿软 token 再查一次同样的表”。固定实现会为这些位置准备相应的 ID 与逐层输入；具体媒体调用链留到第 16、17 期。对本文，抓住两个事实就够了：PLE 在层堆叠前备好逐层输入，在各 decoder 层的 Attention、MLP 后通过门控残差接入。

PLE 让小模型通过打包查表、逐层取片获得额外的可学习参数，再由各层当前状态选择如何使用；代价是一张不能忽略的大表。下一章讨论 Prefill 与 Decode 时，就要把“表很大”和“每步实际做了什么计算”分开看。

资料：[Gemma 4 模型说明](https://ai.google.dev/gemma/docs/core) · [Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4) · [E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 固定实现](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py)
