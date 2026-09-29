# Decoder 概览章的任务与后文分工

日期：2026-09-28。本笔记供编辑审阅，不作为公开正文的依赖。

## 第 04 期要回答的问题

Embedding 给出各位置的 2560 维起始表示后，E4B 的一层怎样更新它们？读者应能说出三段更新的顺序和各自用途：Attention 从可见位置取得信息，MLP 在当前位置加工特征，PLE 给本层补入逐层输入。每段通过残差接回主路，层的输入和输出保持 `[B,S,2560]`。42 层沿同一主路递进，但局部/全局可见范围及 K/V 共享不同。整层不负责最终 token 选择。

## 深度边界

| 章节 | 专门解释 | 第 04 期只保留 |
| --- | --- | --- |
| 05：矩阵乘与 Cube | 特征组合、同权重逐位置应用、MLP 门控、内积/外积的硬件取舍、M/N/K 分块 | MLP 加工当前位置；中间扩宽后回到主路 |
| 06：Attention | Q/K/V、头、点积、softmax、加权 V 与张量形状 | 当前位置信息来自可见位置 |
| 07：RoPE | Q/K 位置旋转与分数变化 | 位置影响 Attention 的匹配 |
| 08：混合注意力 | 滑动窗口、全局层、K/V 共享与缓存生产 | 层之间的可见范围与 K/V 来源不同 |
| 09：PLE | 身份表与内容分量、按层切片、门控投影、参数容量 | 每层收到准备好的逐层输入，并在第三段注入 |

第 04 期仍需交代归一化的存在与位置：Attention、MLP 前后各有独立的 RMSNorm，PLE 更新加回前归一化；公式、归约轴和数值路径现由第 04A 期单独展开。公开正文不使用本笔记作跳转入口。

核对依据：固定 revision 的 `modeling_gemma4.py` 中 `Gemma4TextDecoderLayer.forward`；E4B 配置的 `hidden_size=2560`、`intermediate_size=10240`、`hidden_size_per_layer_input=256`、`num_hidden_layers=42`、`enable_moe_block=false`。本地原始快照路径与 SHA-256 在 `04-code-snapshot.json`。

## 第 04 期结构图记录

`assets/diagrams/generate_decoder_torchview.py` 用 `torchview 0.2.7` 追踪 Transformers `5.17.0` 的 `Gemma4TextDecoderLayer`。已将该安装版本中的整个类与固定 revision 的源码逐行比较，未发现差异。配置取固定 E4B 快照，输入为 meta tensor：主状态 `[1,2,2560]`、提前算好的逐层输入 `[1,2,256]`，位置旋转和 mask 作为固定侧输入，不加载参数权重。追踪第 0 层（局部注意力、无共享 K/V），输出形状 `[1,2,2560]`。公开图取 depth 2 并省略中间张量节点，保留所有可见模块、残差和 PLE 支路。`assets/diagrams/render-dot.mjs` 将 torchview DOT 渲染为 SVG 和 PNG；正文使用 PNG。图中第二个 Attention 输出是追踪到的注意力权重，不进入后续主路。

## 显示方式评估与当前正文图

自动 torchview 图适合作为结构核对材料，但 depth 2 仍按单个运算纵向排列，宽高比约 0.32，PLE 没有与 Attention、MLP 同等级的视觉分组。文生图能改善外观，却难以稳定保证三次残差、归一化位置和逐层输入的箭头方向，之前两张试图已有结构错误。纯 Graphviz 缩写节点可缩短图，但仍让读者按运算遍历，不如按概念分组。

当前正文使用 `decoder_layer_0_compact.png` 作为唯一总览图：基于第 0 层官方实现的 torchview 追踪压缩重绘，保留 18 个运算/张量节点、20 条原有边和关键形状，并以三个彩色分组框分别包围 Attention、MLP、PLE 各段的多个节点。图内补上三段职责、`X0–X3` 和残差直通标签；分组框是讲解性标注，不是新增算子。尺寸约 2627×6237，仍比未压缩原图约 3093×9735 短；原始 `decoder_layer_0_depth_2.png` 在正文图注中提供核对。原 `decoder-portrait-study.svg/png` 与图源保留在资源目录供编辑，不再单独嵌入正文。该总图以第 0 层为例，不代表全部层具有相同的 Attention 配置；局部/全局和共享 K/V 差异放在第 08 期。

本次按三段重写讲解，并在对应段落插入图 2–4。`assets/diagrams/extract-decoder-stage-traces.mjs` 从图 1 的原始 `decoder_layer_0_depth_2.dot` 按节点 ID 和原有边截出 Attention、MLP、PLE 三张局部视图，另存 DOT、SVG、PNG；为手机阅读增大节点字体和间距，删去节点中的 `depth` 显示字样，并在各段边界节点补充 `X0`、`X1`、`X2`、`PLE` 输入名称。**未重新运行模型、未增加原追踪没有的运算节点或边**。Attention 图保留输入直通残差、两次 RMSNorm 和 Attention 模块；MLP 图保留上一段输出、两次 RMSNorm、MLP 模块和残差；PLE 图保留预备好的 256 维输入、门控乘法、回投影、残差和末尾缩放。MLP/Attention 的模块内部仍收起，文章说明其作用并由第 05/06 期继续展开。

曾将完整实现图改为 LR 作排版比较；长横图约 14592×804 像素，缩为手机正文宽度时文字过小，故已撤回。当前采用 `render-decoder-compact-trace.mjs` 从原始 DOT 中读取节点与边，保持 TB 方向，简化节点标签，分别标注 Attention、MLP、PLE、残差和层缩放。它是原始 torchview 追踪的压缩排版，不是重新运行的数值实验。

曾尝试把第 0 层局部滑窗与第 5 层全局层画成双列比较图，当前正文不再使用，该试版资源已撤回。Maarten Grootendorst 的 E2B/E4B 家族总览图已移到第 18 期型号比较。

2026-09-28 文生图试版已生成，仅留在 Codex 的生成图记录中，未加入正文和文章资源。它清楚分出三块，但错误地把 PLE 的逐层输入框同时连向第三个残差加法；各模块到加法节点的箭头也未明确从最后的 RMSNorm 出发。按源码，这些箭头会误导读者，因此不能作为架构图使用。随后尝试针对该错误修图时，内置 imagegen 返回使用额度已达上限，未产生修订版。
