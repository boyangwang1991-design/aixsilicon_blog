# 第 01 期配图生成记录

生成方式：Codex 内置 imagegen。三张图片均为中文概念图，不是模型运行截图、芯片实测或真实产品界面。日期：2026-09-28。图 2 的第一次生成含不自然的示例 token 和不完整的 KV 箭头，未纳入文章；文中使用重新生成的版本。

## 独立封面

- 用途：第 01 期公众号头图；路径：`assets/generated/cover-zh.png`。
- 检查：横幅构图；主标题“Gemma 4 怎样回答问题”、副标题“从多模态输入到逐 Token 生成”可读；文字、图像、音频三路汇入生成主线；不含性能数字。
- 最终提示词：

```text
Use case: scientific-educational. Asset type: wide Chinese technical blog cover for chapter 01 of a Gemma 4 on-device AI series. Primary request: introduce the full journey of a multimodal decoder-only language model. Landscape 16:9, elegant engineering editorial illustration, not a product screenshot. Single visual focus: three distinct inputs (Chinese text lines, an image tile, an audio waveform) converge as small token tiles into one layered inference ribbon; at the right edge one new token emerges, with a subtle loop suggesting repeated generation. Accurate high-level concept; do not show an encoder-decoder architecture or a fake chip die. Refined dark navy, teal, warm amber, off-white palette; clean geometry and restrained depth. Exact short Chinese cover title in large legible type: “Gemma 4 怎样回答问题” and small subtitle “从多模态输入到逐 Token 生成”. Keep all title letters exact and within broad crop-safe margins; very little other text. No logos, no benchmark numbers, no watermark. Original conceptual illustration, not a real model visualization.
```

## 多模态输入全景图

- 用途：解释文字、图片、音频如何进入 E4B 文本解码器；路径：`assets/generated/multimodal-overview-zh.png`。
- 检查：三条输入路径分开，文字走 Tokenizer/Embedding，图片和音频走专用编码器；合流为有序表示；输出为文本 token。
- 最终提示词：

```text
Use case: infographic-diagram. Asset type: Chinese educational figure inside a technical blog, chapter 01 macro overview of Gemma 4. Create a clean, wide 16:9, self-contained flow diagram, large typography readable on a phone. Question answered: how can text, image, and audio enter one decoder-only model and produce a text reply? Four left-to-right stages, exact Chinese headers only: “输入”, “转为模型可读的表示”, “Gemma 4 文本解码器”, “逐个生成文本”. Stage 1 has three distinct rows labeled “文字”, “图片”, “音频”, with simple icons. Stage 2 shows text through “Tokenizer + Embedding”; image through “视觉编码器”; audio through “音频编码器”. These three paths converge into one ordered sequence of small colored tokens, then one large stack labeled “Decoder × 多层”, then an output token leading to a loop for the next token. Arrows must all point left to right, with only a loop from output token back to decoder input. Show that image/audio features become soft tokens, not image/audio output. Use a precise editorial vector infographic look, off-white background, navy text, restrained teal/amber accents. No fake chip image, no benchmark numbers, no technical dimensions, no tiny body text, no decorative elements. All Chinese text must be exactly as quoted; English technical words Tokenizer, Embedding, Decoder retained. Original concept diagram, not a screenshot or measured result.
```

## Prefill / Decode 时间图

- 用途：解释已知提示词并行处理与输出 token 的逐步依赖；路径：`assets/generated/prefill-decode-zh.png`。
- 检查：P1–P4 在 Prefill 中已知；O1–O4 依次产生；因果矩阵为下三角；Decode 从历史 KV 读取并写入新 KV。图中未画 Prefill 建立初始 KV，正文图注补充这一点。
- 最终提示词：

```text
Use case: scientific-educational. Asset type: final Chinese technical explainer diagram for Gemma 4 chapter 01. Recreate a rigorous prefill/decode timeline from scratch, 16:9 wide, no decorative imagery. Top half: heading exactly “Prefill：处理整段已知输入”. Four teal prompt tiles labeled P1 P2 P3 P4 enter one box labeled “同一个 Decoder”; right side one amber tile labeled O1 with caption “首个输出”. A small accurate four-by-four lower-triangular causal visibility grid may appear under the input, clearly separated from output; omit it if it risks confusion. Bottom half: heading exactly “Decode：逐步生成”. Three left-to-right decoder steps using the same model: O1 goes into step 1 and produces O2; O2 goes into step 2 and produces O3; O3 goes into step 3 and produces O4. Put all step boxes under a small caption “同一套模型权重”. Below, one shared box labeled “KV Cache：历史 K/V”, with clear upward arrows labeled “读取” from cache to each step and downward arrows labeled “写入” from each step to cache. Inputs teal, outputs amber. Exact labels only as specified; no Chinese sentence fragments, no arbitrary extra token letters, no invented benchmark numbers. Precise arrow directions and sequence are more important than decoration. Large legible type, white background, navy outlines, calm teal/amber palette, clean editorial vector infographic. Conceptual algorithm diagram, not a real runtime screenshot.
```

## 第 05 期（原第 04 期制作）

中文封面采用版本化文件名 assets/generated/cover-04-zh.png；完整提示词与图文核对记录见 [第04期配图记录](04-image-prompts.md)。按用户要求英文暂不制作。

## 第 04、06–18 期中文封面（2026-09-29）

工具：Codex 内置 imagegen，每期独立生成一张 16:9 中文概念封面。通用提示词约束：深蓝、青、紫的系列视觉语言；单一焦点、宽幅构图、裁切安全边距；只写下表指定的醒目短标题，不加小字、虚构性能数字或真实产品/测试截图。封面用于识别主题，不承担正文机制图的精确数据流职责。图内标题与主题已逐张人工检查；图片路径及 SHA-256 见 `sources.json`。

| 期 | 路径 | 封面短标题 | 独立主题提示词 |
| --- | --- | --- | --- |
| 04 | `assets/generated/cover-decoder-04-zh.png` | Decoder 一层的三次更新 | Attention 取上下文、MLP 加工特征、PLE 从侧支路补入逐层信息；不要将 PLE 画在 Embedding 与 Decoder 之间。 |
| 06 | `assets/generated/cover-06-zh.png` | Q、K、V 如何找到关联 | 一个当前位置向可见历史发出查询，Q/K 决定关联、V 携带内容。 |
| 07 | `assets/generated/cover-07-zh.png` | 位置怎样改变匹配 | 二维坐标中的 Q/K 按位置旋转并形成相对角度；V 不旋转。 |
| 08 | `assets/generated/cover-08-v2-zh.png` | 五层局部，一层全局 | 同一条 token 历史时间线上，五层只连接近处位置，第六层连接完整可见历史；旧版 `cover-08-zh.png` 保留供编辑追溯。完整提示词和核对记录见 [第08期封面记录](08-cover-imagegen.md)。 |
| 09 | `assets/generated/cover-09-zh.png` | PLE：每层的一份输入 | 一枚 token 的身份从参数表取出不同分层向量，作为 decoder 侧支路输入。 |
| 10 | `assets/generated/cover-10-zh.png` | Prefill 与 Decode | 已知提示词成批处理，回答逐 token 接续生成；两阶段使用同一模型。 |
| 11 | `assets/generated/cover-11-zh.png` | KV Cache 的增长 | K/V 历史状态随生成延续；局部窗口有界，全局历史可增长。 |
| 12 | `assets/generated/cover-12-zh.png` | E4B 不只 4B | 有效参数、总参数和运行时资源是不同口径，不写额外数字。 |
| 13 | `assets/generated/cover-13-zh.png` | Attention 不落地整张表 | 分块处理 K/V，中间状态靠近计算，完整分数表无需落地；仍要读取 K/V。 |
| 14 | `assets/generated/cover-14-zh.png` | 算力之外是搬运 | 同一权重瓦片被多行复用，与单行复用机会少形成对照。 |
| 15 | `assets/generated/cover-15-zh.png` | 一张照片的输入路径 | 照片经 patch 与视觉编码变成软 token，与文字问题汇合。 |
| 16 | `assets/generated/cover-16-zh.png` | 一段语音的输入路径 | 波形经特征帧与音频编码变成软 token，与文字汇合，最后输出文字。 |
| 17 | `assets/generated/cover-17-zh.png` | 持续输出的电力边界 | Prefill 与 Decode 活动节奏、概念热趋势与供电路径；无实测曲线。 |
| 18 | `assets/generated/cover-18-zh.png` | 换型号，重算资源账 | 稠密、MoE、多模态路径各异，切换型号要重新填写资源账。 |
