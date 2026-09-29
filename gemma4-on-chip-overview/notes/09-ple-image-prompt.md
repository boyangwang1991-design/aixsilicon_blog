# 第 09 期 PLE 配图记录

日期：2026-09-28。只制作中文版。正文原先引用四张 `assets/draft-newsletter/` 参考文章图片，现改为一张独立设计的完整算法路径图。原图仍保存在编辑资源目录供来源追溯，正文不再依赖它们。本次使用 Codex 内置 imagegen 文生图；已有 `assets/diagrams/decoder-ple-local.png` 随后插入正文作为图 2，核对第 0 层注入段的实际算子路径。该 torchview 图不包含进入层堆叠前的查表和内容投影，因此与图 1 分工。

- 用途：回答 PLE 从哪里来、每层怎样取不同切片、当前状态如何门控，以及收益和代价分别是什么。
- 文章路径：`assets/generated/ple-full-path-09-zh.png`。
- 原始生成文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-af093543-0c2c-4abc-9528-faec62cc83dc.png`。
- SHA-256：`03a3e9f623ff507d2e1166912bcccd7af29037efa152f498f6e8651e1fdd1918`。
- 属性：中文概念图，非真实模型运行截图、芯片连线或测量结果。

最终提示词：

```text
Use case: scientific-educational
Asset type: a single original high-information Chinese teaching infographic for a Gemma 4 E4B PLE blog chapter; portrait editorial layout readable on mobile, like one carefully designed technical presentation page.
Primary question to answer completely: Where do Per-Layer Embeddings come from, how does layer l inject its own slice, and what benefit/tradeoff does this create?
Exact three-stage top-to-bottom data flow:
STAGE 1 "进入层堆叠前：准备逐层输入": two PARALLEL branches from the same token position. Left token ID indexes ONE packed learnable PLE table with shape [词表, 42×256], retrieving just ONE row, then reshape to identity component I[42,256]. Right main Embedding vector [2560] passes through ONE projection to [42×256], reshape and RMSNorm to content component C[42,256]. The two branches MERGE once with formula P=(I+C)/√2. Do not draw 42 repeated lookups or 42 repeated projections.
STAGE 2 "每层只取自己的切片": a single P[42,256] stack with clearly different colored thin slices. Highlight layer l selecting P[l,256]; other layers select their own different slices. No broadcast of same vector.
STAGE 3 "第 l 层：按当前状态门控注入": after Attention and MLP, current hidden state x_l[2560] forks into a residual bypass and a gate path. Gate path: Linear 2560→256, GELU, elementwise multiplication ⊙ with selected P[l,256], Linear 256→2560, RMSNorm, then residual add with bypass, resulting x_(l+1)[2560]. Arrows exact; P[l] enters ONLY the elementwise multiplication, never goes directly into residual add. This operation is inside each decoder layer after MLP, not an independent layer between decoder layers.
Bottom two concise conclusions in Chinese: "收益：每层获得专属 token 信息，当前状态决定如何使用" and "代价：逐层表很大；按 ID 查行而非整表稠密乘法". Optional small line "E4B：42 层，每层 256 维".
Visual style: dimensional paper-cut technical diagram with polished typography and depth, warm ivory background, navy main path, teal identity branch, amber content branch, purple selected layer, no generic chip decorations, no borrowed diagram composition, no fake measurements, no watermark. Large simplified Chinese, minimal text outside stated labels. All arrows point forward and dimensions correct.
```

目视核对：左上只有一张 `[词表,42×256]` 打包表、一条按 ID 查出的行；右上主 Embedding 通过一次投影形成内容分量；合并式为 `P=(I+C)/√2`。中间展示不同层取不同切片。下方 `P[l]` 只进入逐元素相乘，主状态残差绕过门控路径，在回投影和 RMSNorm 后相加。收益与存储代价均有明确标注。图中数值是 E4B 固定配置的宽度和层数，不是性能测量。

核对依据：[E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)、[固定版本 Transformers 实现](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py)、[Gemma 4 模型说明](https://ai.google.dev/gemma/docs/core)。
