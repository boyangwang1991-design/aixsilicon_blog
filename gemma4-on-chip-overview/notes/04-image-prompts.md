# 第 05 期配图与编辑记录（原第 04 期制作）

日期：2026-09-28。按用户最新要求，本期仅交付中文正文和中文配图，英文版暂不制作。保留既有章节路径，不迁移整个系列。

## 文章定位

承接 Embedding 的起始表示，解释 Decoder 为什么需要可学习的特征组合。先说明用途，再解释乘法机制、位置独立性及官方代码中的应用。算量仅作为末尾硬件引子；不把“升维”当作矩阵乘的全部目的，不把投影当作理解上下文的充分条件。

## 中文封面

- 路径：assets/generated/cover-04-zh.png
- 工具：Codex 内置 imagegen。
- 主题：输入特征通过一张矩阵形成新的特征组合。概念插画，非真实权重或硬件测量。
- 原始文件：C:/Users/wangb/.codex/generated_images/01a0e856-4bf8-7c00-a695-feafe97bd8c4/exec-15670ebc-8a94-49a7-aabb-4a76a516a5ad.png
- 最终提示词：

```text
Create a wide landscape editorial cover for a Chinese engineering blog. Refined cream background, navy typography, teal input row of tiles flowing through one amber matrix grid into a longer teal output row. A single strong visual metaphor for a linear projection, not a real chip or interface. Very legible large Chinese title exactly "矩阵乘怎样变换 Token" and smaller subtitle exactly "2560 → 10240". Generous safe margins. No other text, no fake performance data. Elegant technical illustration, restrained dimensional paper style. Save generated image.
```

## 正文两图与一张备选概念图

采用确定性 SVG 绘图并用 sharp 导出 PNG，非 AI 生成数值图。可编辑生成器：assets/diagrams/generate-matmul-figures.mjs。图内使用简体中文；数字与运算结果由正文构造例子确定。

1. projection-role-04-zh：备选概念图，当前正文未引用。回答“Embedding 之后为什么还要投影”。区分 Attention 的匹配/内容准备与 MLP 的位置内加工；图注明确非完整执行图，且 K/V 共享层不重新计算 K/V。
2. matmul-04-zh：回答“一个输出怎样算出来”。输入 [2,3]，权重 [[1,4,2],[5,6,-1]]，输出 [17,26,1]；三列颜色与三个计算式对应。
3. shared-weights-04-zh：回答“同时处理多个 token 会不会混合位置”。两行输入 [2,3] 与 [1,0]，输出 [17,26,1] 与 [1,4,2]；同一 W 分别连入两条计算路径，权重线绕开上方输出避免误解为串行依赖。

逐张查看 PNG，核对中文文字、乘法结果、形状与箭头。正文目前引用 matmul-04-zh 与 shared-weights-04-zh；projection-role-04-zh 留作编辑备选，不随正文发布。封面标题及数字准确，四周有裁切余量。图片均为原理/概念示意，不代表真实权重、运行截图或测量结果。文件 SHA-256 记录在 sources.json。
