# Maarten Grootendorst《A Visual Guide to Gemma 4》中文摘记与图片筛选

本文件是内部编辑材料，不是原文翻译，也不代替各期公开正文。来源：[原文及原图](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-gemma-4)（Maarten Grootendorst，2026-04-03，后续增补了 MTP 与 12B 信息）。下列判断以 E4B 为本系列主角；尺寸和执行顺序还需以固定 E4B 配置和 Transformers 实现核对。

## 可纳入系列的主线

1. **先分清模型家族。** E2B/E4B 是带 PLE 的稠密小模型；31B 是没有 PLE 的稠密模型；26B A4B 走 MoE，名称里的 A 描述每步激活参数，不能用作完整权重容量。文章发表后家族又加入 12B Unified，所以不能沿原文“四种模型”的旧枚举更新本系列。对应第 01、18 期。
2. **局部与全局注意力交错。** 局部层限制每个查询可见的历史，节省长序列的比较与 KV 读取；全局层定期建立更远的直接联系。E4B 的固定配置是五局部、一全局，42 层最后一层为全局，局部窗口 512。全局层的 K/V 宽度及 RoPE 规则也不同。原文的通用 GQA “几个 Q 共用一个 KV”示意不能代替 E4B 实际头数；E4B 配置为 8 个 Q 头、2 个 KV 头，`attention_k_eq_v=false`，不能把原文的全局 K=V 结论套用进本篇缓存账。对应第 06–08、11 期。
3. **p-RoPE 解决的是位置编码作用在哪些特征维度，不是哪些 token 可见。** E4B 的全局层只对配置规定的部分维度旋转；可见集合仍由因果/滑窗 mask 决定。原文用低频维度保留更多内容信息作直观解释，正文应保留为设计动机，而非将每一维的语义功能说成可测结论。对应第 07 期。
4. **PLE 是每层按位置取得的一份额外输入。** 身份查表与主输入投影先形成逐层输入；当前层用门控处理主状态，与该层的 256 维输入逐元素相乘，回投影、归一化，再接回残差。按 ID 查表与对整张表做稠密乘法的访存模式不同；“effective”参数不能当完整模型装载容量。原文把 PLE 画成 decoder 框之间的独立块，是教学简化；固定 Transformers 的 `Gemma4TextDecoderLayer.forward` 把它放在同一层的 Attention 和 MLP 之后。原文一处正文把 E4B 主宽度写作 2056；本系列按官方配置使用 **2560**。对应第 04、09、12 期。
5. **图像和音频输入先改变表示，再进入文本主干。** 图像的二维 patch 位置、可变长宽比、3×3 pooling 与视觉 token 预算共同影响软 token 数；可选预算为 70、140、280、560、1120，不应把“一张图”当固定成本。音频从波形变成特征帧，经卷积/Conformer 编码后投影到语言宽度；采样点、特征帧与最终软 token 是三种长度。对应第 15、16 期。[Google 视觉说明](https://ai.google.dev/gemma/docs/capabilities/vision)可核对预算与 pooling。
6. **MTP 属于可选的生成加速路径，不改变第 04 期单个目标 decoder 层。** 小 drafter 先顺序提出若干候选，目标模型并行验证；Gemma 4 的配套模型可利用目标末层激活和共享输入 embedding，E2B/E4B 的 drafter 还可用聚类缩小输出候选范围。收益受接受率、额外模型存储和验证时的数据移动影响，MoE 在 batch=1 时也未必提速。对应第 10、18 期；[Google MTP 官方说明](https://ai.google.dev/gemma/docs/mtp/overview)为事实核对入口。

## 图片筛选与使用边界

原文页脚标有“© 2026 Maarten Grootendorst”，页面没有查到可翻译、改图或转载的开放许可。用户明确要求将原图**仅用于内部草稿**，所以已把全部 52 张原图复制到 `assets/draft-newsletter/`；其中 51 张技术图按论述插入中文章节，图 01 是作者个人照片，仅保留在参考快照。该目录被 Git 忽略，不作为公开发布素材。发布前必须移除或另行取得许可。第 04 期精确单层结构仍采用依据官方实现独立绘制的中文图。

| 原文图（直达原图） | 本系列用途 | 结论 |
| --- | --- | --- |
| [E2B/E4B 全景](https://substack-post-media.s3.amazonaws.com/public/images/faff88e2-4cd6-4669-8211-7d5b6039559c_5082x5160.png) | 第 04 期 | Attention、FFNN 与 PLE 可辨，但 PLE 画在 decoder 框外；不直接替换精确单层图 |
| [全局/滑窗可见性](https://substack-post-media.s3.amazonaws.com/public/images/fea15481-672a-4fe2-b803-5f4d493998d5_4770x2460.png) | 第 08 期 | 用来参考两种 mask 的教学分栏；窗口大小是构造例子，不是 E4B 配置图 |
| [部分旋转的 RoPE](https://substack-post-media.s3.amazonaws.com/public/images/c204db00-74ba-46c6-9747-b1203bf2e666_4080x2400.png) | 第 07 期 | 可参考“部分维度旋转”的视觉表达，具体比例另据配置核对 |
| [逐层表的三维形状](https://substack-post-media.s3.amazonaws.com/public/images/e6c18411-5f64-4843-8809-9aa581b4ee7f_4130x3810.png) | 第 09 期 | 可参考词表 × 层 × 256 的视觉组织；需独立绘制中文图 |
| [PLE 门控路径](https://substack-post-media.s3.amazonaws.com/public/images/2e78b43b-e615-4ba0-a3de-7361138b28e2_5560x8280.png) | 第 09 期 | 原图混用 E2B 的 1536 维与 E4B 标注；本系列不直接沿用数值 |
| [图像分辨率对 patch 数的影响](https://substack-post-media.s3.amazonaws.com/public/images/63325403-8aec-4269-86ed-cee314e78d76_5600x2180.png) | 第 15 期 | 构造样例清楚，数值不应当作 E4B 任意图像的固定 token 数 |
| [音频波形到软 token](https://substack-post-media.s3.amazonaws.com/public/images/93de9d19-38b6-4487-964c-1faa79971366_1856x1660.png) | 第 16 期 | 可参考三段流程；原文中的真实录音频谱不改作本系列实测数据 |

图片目前的“可用”指**本地内部草稿**，不代表已取得二次发布授权。独立中文讲解图必须按 E4B 源码重画，不能把作者的图仅换字或描摹后宣称原创。
