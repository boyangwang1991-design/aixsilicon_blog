# Decoder 概览章的任务与后文分工

日期：2026-09-28。本笔记供编辑审阅，不作为公开正文的依赖。

## 第 04 期要回答的问题

Embedding 给出各位置的 2560 维起始表示后，E4B 的一层怎样更新它们？读者应能说出三段更新的顺序和各自用途：Attention 从可见位置取得信息，MLP 在当前位置加工特征，PLE 给本层补入逐层输入。每段通过残差接回主路，层的输入和输出保持 `[B,S,2560]`。42 层沿同一主路递进，但局部/全局可见范围及 K/V 共享不同。整层不负责最终 token 选择。

## 深度边界

| 章节 | 专门解释 | 第 04 期只保留 |
| --- | --- | --- |
| 05：Linear 与 MLP | 加权求和、同权重逐位置应用、gate/up/down 门控、10240 中间宽度、静态权重规模 | MLP 加工当前位置；中间扩宽后回到主路 |
| 06：Attention | Q/K/V、头、点积、softmax、加权 V 与张量形状 | 当前位置信息来自可见位置 |
| 07：RoPE | Q/K 位置旋转与分数变化 | 位置影响 Attention 的匹配 |
| 08：混合注意力 | 滑动窗口、全局层、K/V 共享与缓存生产 | 层之间的可见范围与 K/V 来源不同 |
| 09：PLE | 身份表与内容分量、按层切片、门控投影、参数容量 | 每层收到准备好的逐层输入，并在第三段注入 |

第 04 期仍需交代归一化的存在与位置：Attention、MLP 前后各有独立的 RMSNorm，PLE 更新加回前归一化；展开公式和具体数值留给后续精度或实现讨论。公开正文不使用本笔记作跳转入口。

核对依据：固定 revision 的 `modeling_gemma4.py` 中 `Gemma4TextDecoderLayer.forward`；E4B 配置的 `hidden_size=2560`、`intermediate_size=10240`、`hidden_size_per_layer_input=256`、`num_hidden_layers=42`、`enable_moe_block=false`。本地原始快照路径与 SHA-256 在 `04-code-snapshot.json`。

## 第 04 期结构图记录

`assets/diagrams/generate_decoder_torchview.py` 用 `torchview 0.2.7` 追踪 Transformers `5.17.0` 的 `Gemma4TextDecoderLayer`。已将该安装版本中的整个类与固定 revision 的源码逐行比较，未发现差异。配置取固定 E4B 快照，输入为 meta tensor：主状态 `[1,2,2560]`、提前算好的逐层输入 `[1,2,256]`，位置旋转和 mask 作为固定侧输入，不加载参数权重。追踪第 0 层（局部注意力、无共享 K/V），输出形状 `[1,2,2560]`。公开图取 depth 2 并省略中间张量节点，保留所有可见模块、残差和 PLE 支路。`assets/diagrams/render-dot.mjs` 将 torchview DOT 渲染为 SVG 和 PNG；正文使用 PNG。图中第二个 Attention 输出是追踪到的注意力权重，不进入后续主路。

## 显示方式评估与当前正文图

自动 torchview 图适合作为结构核对材料，但 depth 2 仍按单个运算纵向排列，宽高比约 0.32，PLE 没有与 Attention、MLP 同等级的视觉分组。文生图能改善外观，却难以稳定保证三次残差、归一化位置和逐层输入的箭头方向，之前两张试图已有结构错误。纯 Graphviz 缩写节点可缩短图，但仍让读者按运算遍历，不如按概念分组。

当前正文主图是 **官方代码与 torchview 核对结构、人工布局的手机纵向 SVG 成图**。`assets/diagrams/generate-decoder-portrait-study.mjs` 生成 `decoder-portrait-study.svg/png`，宽高比约 0.60：清楚标出 Attention、MLP、PLE 三块及其用途，保留输入/输出、三次残差、前后 RMSNorm、PLE 的额外输入和末尾层缩放。它刻意收起 Attention/MLP 内部细节，适合第 04 期总览；原 torchview 图仍作为可核对的详细图源。以 390 像素宽缩小检查，模块标题可辨识，内部字比横向三栏试版更清晰。Maarten Grootendorst 的 E2B/E4B 家族总览图已移到第 18 期型号比较，不再与本章的准确单层图并排。

2026-09-28 文生图试版已生成，仅留在 Codex 的生成图记录中，未加入正文和文章资源。它清楚分出三块，但错误地把 PLE 的逐层输入框同时连向第三个残差加法；各模块到加法节点的箭头也未明确从最后的 RMSNorm 出发。按源码，这些箭头会误导读者，因此不能作为架构图使用。随后尝试针对该错误修图时，内置 imagegen 返回使用额度已达上限，未产生修订版。
