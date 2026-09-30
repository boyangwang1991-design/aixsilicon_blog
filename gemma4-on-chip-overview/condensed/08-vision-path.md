# 视觉输入：照片与视频帧怎样进入 E4B

![图片成为 patch 并进入语言模型的概念封面](../assets/generated/cover-15-zh.png)

[11 篇版索引](README.md) · 第 08 篇

文字可以先切成 ID，图片却没有现成词表行。E4B 为视觉内容走一条单独的前端：Processor 整理图片尺寸和 patch，视觉编码器加工 patch 间的关系，空间汇聚缩短序列，最后投影成语言主宽度的软 token。视频没有另造一套视觉塔，而是在进入这条路径前先抽帧、排时间。

![从图片预处理到视觉软 token 与文字合流](../assets/generated/vision-path-overview-15-zh.png)

*图 1：五段路径分别改变输入表示、特征与位置数。图中方块数量只是讲解用，不能据此推断任意图片的实际 token 数。*

## 图片的细节预算从哪里花掉

Processor 先按所选预算处理图片，再切成 `16×16` patch，为每块保留帧内 `(x,y)` 坐标。更多初始 patch 能保留更细的空间细节，也让视觉编码器面对更长的序列。E4B 配置中的 `280×9=2520` 是某预算下的**初始 patch 上限**，不是每张图片都固定产生 2520 块，更不是最终语言序列必然增加 2520 个位置。

视觉编码器处理这些 patch 后，空间汇聚把邻近 `3×3` 的九个 patch 特征归到一个位置；后续 RMSNorm 和 Linear 将向量对齐到语言宽度 2560。只有经过有效性筛选、真正填入文本序列的向量，才成为本次请求的视觉软 token。**图片越清楚、预算越高，不等于语言 token 按原始像素线性增长**；预处理、视觉编码和汇聚分别改变了长度与工作量。

![图片细节预算与 3×3 空间汇聚的关系](../assets/generated/vision-budget-pooling-15-zh.png)

*图 2：初始 patch 上限与汇聚后的有效位置要分开读。示意网格不是某张真实图片的模型输出。*

语言提示词会预留与有效视觉向量数相符的槽位。模型把投影后的向量写入这些位置，文字与视觉信息才排成同一条输入序列。软 token 占语言 Prefill 的位置，但它形成之前还有一整段独立视觉计算；只数最后的语言序列长度会漏掉前端成本。

## 视频先增加时间，再复用图片路径

视频是一串画面。`Gemma4VideoProcessor` 先按策略选帧，对每帧缩放、归一化、切 patch 并给出帧内坐标；`Gemma4Processor` 再按帧顺序把时间戳字符串和该帧需要的视觉占位槽放进提问。时间戳是语言输入里的时间线索，帧内 `(x,y)` 是空间线索，两者作用不同。抽了几帧、每帧留下多少有效软 token，要看输入和处理配置。

![抽帧、时间戳字符串与视觉占位槽怎样排列](../assets/generated/video-processor-timeline-15-zh.png)

*图 3：三帧与 `t₁/t₂/t₃` 只为说明顺序，并非固定采样间隔或实际时间戳格式。*

进入模型后，视频的帧维与批维先展平，各帧送入**共享的视觉编码器**，再做空间汇聚和语言宽度投影。下面的 `torchview` 图用 1 段视频、2 帧、每帧 3×3 patch 的构造输入追踪实际模块：`[1,2,9,768]` 展成批量 2，汇聚后每帧留下一个 768 维向量，再投影成 2560 维。这个小输入只用来核对模块连接和形状，不是视频的默认帧数或 patch 数。

![视频帧进入共享视觉编码器的 torchview 追踪](../assets/diagrams/video_vision_2frames_e4b.png)

*图 4：构造输入、初始化模块、未加载 E4B checkpoint。Processor 的抽帧与时间戳不属于这张 PyTorch 模块追踪图。*

视觉路径的硬件账至少分三段：图片或视频预处理，视觉塔对 patch 的计算与工作区，以及软 token 增加的语言 Prefill 长度。视频再乘上选中帧数，并留意时间信息怎样排进提示词。把视频文件大小直接换算成语言 token，或者认为每帧都有独立模型，都不符合 E4B 的实际路径。

资料：[Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4) · [E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 Processor](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/processing_gemma4.py) · [视觉模型实现](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py)
