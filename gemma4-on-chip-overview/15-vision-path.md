# 一张照片进入问题后，模型多走了哪段路

[系列索引](README.md) · 第 15 期

当用户问“这张图里有什么？”，文字 token 只承载了问题，图片本身还要另走一条输入链。E4B 的视觉路径先按官方 processor 处理图片，再由视觉编码器产生特征，经过投影变成语言 decoder 可接收的软 token，按位置与文本 token 一起送入后续计算。它并不是把 JPEG 的字节直接塞进文字词表，也不是让大模型先生成一段隐藏的文字描述再阅读。

理解图像开销至少要区分四个大小：原图像素、预处理后的 patch/裁剪序列、视觉编码器中间特征、进入 decoder 的软 token 数。不同图片尺寸和处理策略会影响这些长度；在固定 processor revision 与输入样例之前，本章不伪造“一张图固定多少 token”。软 token 与文本向量在 decoder 中占据位置，因此会影响 Prefill 长度及后续上下文预算；视觉编码器还要有自己的权重与临时工作区，这些不能全塞进“KV Cache”一项。

<!-- 配图提示词｜图 15-A：一张照片与文本提问两条路径汇合。照片→预处理尺寸/patch结构→视觉编码器输出 [B,S_vision,D_vision]→投影后软 token [B,S_image,2560]；文本→Tokenizer ID [B,S_text]→Embedding [B,S_text,2560]；合流 [B,S_total,2560]。每条线标 shape、dtype、是否中间暂存。未固定的尺寸用符号，不写假数字；图为机制示意，不能伪装产品截图。 -->

## “一张图”进入模型前已有多种长度

E4B 固定配置给出视觉编码器 hidden width 768、16 层，并设置 `vision_soft_tokens_per_image=280`。这三个数描述不同位置：768 是视觉编码器的特征宽度，16 是其层数，280 是配置中的软 token 数设置；它们都不是原始图像像素数。实际处理流程还要看 processor 对尺寸、裁剪和有效图像单元的规则，不能只凭 280 推出任意高分辨率输入的总 decoder token 数。

到 decoder 汇合时，视觉特征必须投影到文本主宽度 2560，才可能与文本向量处于同一个 `[B,S_total,2560]` 序列。原始图像、视觉中间激活与最后的软 token 生命周期不同：图像处理完成后某些工作区可以释放，软 token 已参与 Prefill 并影响后续文本生成。容量预算要按这些阶段的**同时存在**情况求峰值，不能把所有最大值简单相加，也不能只看最后输出的 token 数。

## 把官方前向的四个接口对上

在 `Gemma4Model.forward` 中，文字侧提供 `input_ids:[B,S_total]`，图片侧提供 `pixel_values` 与 `image_position_ids`。`image_position_ids` 给 patch 的二维 `(x,y)` 坐标，填充 patch 用 `(-1,-1)` 标记。视觉模型先做 patch embedding、视觉 encoder 和 pooling；pooling 后剔除 padding，得到真正有效的软 token。随后 `Gemma4MultimodalEmbedder` 先做 RMSNorm，再用线性投影把视觉宽度送到文本主宽度 2560。

合流不是简单把两张张量无条件拼在末尾；如果问题的文字在图片前后都有内容，软 token 还必须占据处理器安排的对应位置。处理后的 `input_ids` 中已经有供图像软 token 放入的**占位槽**。官方代码检查图像特征元素数与这些槽的元素数是否一致，再用 `masked_scatter` 把视觉特征写入对应位置。于是对 decoder 而言，整条输入仍是 `[B,S_total,2560]`，但其中某些位置的主向量来自图像，而不是普通词 ID 的主查表结果。若占位数与编码器实际输出数不匹配，应该报错而不是静默截断。

视觉路径还有位置的第二层含义：图像内部 patch 的二维坐标用于视觉编码；合流后的软 token 也在语言序列里占位置。它们不是同一种位置编码。对含视觉块的注意力，官方实现还可能按 `mm_token_type_ids` 建立视觉块的局部 mask；不能直接沿用纯文本“一律只看过去”的图。做硬件容量预算时应分别数 patch 数、pooling 后的软 token 数与 decoder 总序列长。

E4B 使用独立视觉编码路径；家族里的 12B Unified 采用不同的无独立编码器思路，不能画进 E4B 这一张图。多模态性能也不能只报告文本 decode token/s：图片解码、预处理、视觉编码和追加的 Prefill 都影响用户从上传图片到看到回答的时间。下一章沿声音的时间轴看另一条媒体链。

资料：[Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4) · [E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 源码](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)
