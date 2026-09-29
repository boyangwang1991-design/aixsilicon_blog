# 第 12 期量化数据流图

- 用途：正文“芯片有没有用上压缩后的字节”小节的概念讲解图。
- 生成：2026-09-29，Codex 内置 imagegen，单次文生图。
- 成图：`assets/generated/quantization-dataflow-12-zh.png`。
- 图片哈希 SHA-256：`3fdaf0d6ca44e05b7a7605e85b3b2f97986452daadf11be64ea81524329862df`。
- 估算来源：`notes/12-quantization-sources.md`。图中的 4 bit + scale 为构造格式，不是 E4B 官方 Q4_0 定义或设备实测。
- 目视核对：图中文字为简体中文；上路由打包权重进入外存读取，再到片上解包/缩放与矩阵乘；下路由提前展开 BF16 并存回外存，再按 BF16 规模读取。50 MiB、约 13.3 MiB、约 1→3.8 FLOP/byte 与正文算术一致。图中文字有少量补充说明，不改变技术关系。

## 完整生成提示词

```text
Use case: infographic-diagram. Asset type: information-dense Chinese teaching diagram for a Gemma 4 E4B chip-engineering blog, 16:9 slide composition, polished high-resolution raster illustration. Primary request: explain exactly when 4-bit weight quantization reduces off-chip memory traffic. Design one coherent left-to-right flow with a clearly labeled fork, not a decorative chip image. At left a BF16 gate weight block, label EXACTLY 'BF16 权重 50 MiB'. Next a compressed packed block, label EXACTLY '4 bit 权重 + scale 约 13.3 MiB'. Small subtitle EXACTLY '构造例子：E4B gate 投影 [2560,10240]，每 64 个值共用一个 BF16 scale'. From compressed block, show an upper favorable path: packed data travels from external memory, then a small ON-CHIP unpack-and-scale unit, then matrix-multiply array. Label the three stages EXACTLY '外存保持打包' → '片上解包与缩放' → '矩阵乘'; end callout EXACTLY '外存少搬字节'. Show a lower unfavorable path branching from packed weights: unpack the entire matrix before external-memory storage, then read full-width BF16 again. Label EXACTLY '先展开成 BF16 并放回外存' → '每步仍读约 50 MiB'; end callout EXACTLY '带宽收益可能流失'. At bottom a strong compact comparison EXACTLY '单行 Decode：理想算术强度约 1 → 3.8 FLOP/byte'. Footer EXACTLY '只计一次权重读取；构造格式，非官方量化格式或设备实测'. Title EXACTLY '量化省下的字节，怎样变成硬件收益'. Chinese simplified text must be crisp, legible and accurate, only these labels, no fake measurements. Arrows must move left-to-right. The upper path must keep packed weights in external memory until reaching the on-chip unpack unit; the lower path must show full BF16 weight storage/reads from external memory. Emphasize the relationship of storage format, off-chip bytes, decompression location and compute. Use balanced navy/teal/amber palette and refined technical PPT infographic style with tactile hardware blocks and sharp typography; no simple SVG aesthetics, no glowing generic chip decoration, no tiny body text, no extra English labels, no numbers other than specified. Preserve generous cropping safety margins.
```
