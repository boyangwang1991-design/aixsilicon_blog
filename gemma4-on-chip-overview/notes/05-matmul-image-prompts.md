# 第 05 期矩阵乘讲解图生成记录

日期：2026-09-28。仅制作中文版。两图均为 Codex 内置 imagegen 文生图，用于解释数学展开与硬件分块；不是 Gemma 4 的权重、真实芯片结构、性能测试或仿真截图。

## 图 2：内积与外积

- 文章位置：内积、外积与数据流取舍段之后。
- 需回答的问题：同一个 `Y=A×W` 为什么既能从单个输出看，也能从一批贡献看？两种组织各自需要什么硬件资源？
- 现用文件：`assets/generated/matmul-inner-outer-05-zh-v2.png`。
- 原始编辑生成文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-b1f61122-7ca9-4ef1-9bcd-7e3b7698e863.png`。
- SHA-256：`98cab749c85d3260f80276f133a7aa085b0e6f1fbf09337eb71f89cde953d451`。
- 初版文件：`assets/generated/matmul-inner-outer-05-zh.png`，SHA-256 `260f2e05ed91877a0b32e3859cf8729ae350946ee63cc0fe7a954b68d69eda65`；外积高亮只覆盖部分 Y，已退出正文。
- 最终提示词：

```text
Use case: scientific-educational
Asset type: Chinese engineering blog inline teaching infographic, portrait composition optimized for mobile reading.
Primary request: Explain two mathematically equivalent ways to organize large matrix multiplication Y=A×W without any small numeric toy matrices. Show two large matrix panels side by side or stacked. First "内积视角": one highlighted cell of output Y receives a horizontal row from A and vertical column from W along K, visual converging into a single accumulator. Second "外积视角": one highlighted column of A and one highlighted row of W spread as a rank-one contribution over an entire output tile, with many partial sums being updated. Use broad macro-scale matrices with ellipses and M/K/N dimension labels, no 2×2 example and no numeric entries.
Visual style: polished high-information editorial textbook infographic; precise semi-3D layers, soft paper and subtle depth, not a flat SVG look; navy, teal, amber; strong typography and generous breathing room.
Exact Chinese headings/labels only: "同一矩阵乘，两种展开", "内积：固定一个输出", "外积：固定一批贡献", "串行累加或并行归约", "复用输入与权重", "部分和与分发开销", "A [M,K]", "W [K,N]", "Y [M,N]", "K".
Relationships: A rows and W columns feed the one selected Y cell in inner-product panel; A column and W row fan out to the Y area in outer-product panel; arrows always point toward Y, never from Y backward. Both panels show the same final Y, no suggestion of different mathematical results. Show a small bottom bridge label "相同结果，不同数据流".
Constraints: Simplified Chinese text, correct matrix dimensions, accurate arrow direction, large legible labels, no formulas beyond dimension labels, no fabricated chip measurements, no numeric entries, no logos, no watermark.
```

用户指出初版外积面板的部分和高亮只覆盖了 Y 的中间区域，但完整 A 列与 W 行的外积应覆盖整个 `Y[M,N]`。使用初版图片作为编辑目标，以下提示词生成 v2：

```text
Use case: precise-object-edit. Fix ONLY the lower panel titled 外积：固定一批贡献. In this lower outer-product panel, the selected A[:,k] column (M×1) and W[k,:] row (1×N) form an M×N rank-one contribution, so the highlighted amber partial-sum update MUST cover EVERY cell of the entire purple Y[M,N] matrix, edge to edge, including its top/bottom rows and left/right columns. Extend the amber overlay to match the full outer boundary of Y exactly, with distributed update arrows across the full height and width. Do not show a smaller highlighted rectangle inside Y. Adjust the small callout to say exactly '本轮贡献覆盖整个 Y（M×N）'. Keep the upper 内积 panel, dimensions, selected A column and W row, other text, overall typography, color palette, and layout otherwise unchanged. Accurate Chinese characters, no new numbers or invented performance data.
```

目视核对 v2：两栏均标注 `A[M,K]`、`W[K,N]`、`Y[M,N]`；内积选择 A 的一行和 W 的一列，外积选择 A 的一列和 W 的一行；外积的橙色贡献覆盖整个 Y 矩阵，箭头分布至全部行与列。没有数字构造例子。局部矩阵格子仅代表索引。图内“复用输入与权重”是硬件调度可采取的措施，不能据此推断具体设备的复用率。

## 图 3：Cube 分块与 Prefill/Decode

- 文章位置：Tiling 的资源取舍和 Prefill/Decode 段之后。
- 需回答的问题：大矩阵怎样通过 M/N/K 分块进入有限 Cube，部分和何时写回，以及 M 维变化对同一权重块的使用有什么影响？
- 文件：`assets/generated/matmul-tiling-cube-05-zh.png`。
- 原始生成文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-762dcefa-d25a-477b-9d0b-384535c2e817.png`。
- SHA-256：`7d324f0090e0a7ac8d096d8b9d368799e205422b398f5c9e8d960a12665b53ad`。
- 最终提示词：

```text
Use case: scientific-educational
Asset type: a Chinese-language, high-information educational illustration embedded in an engineering blog, tall portrait for mobile.
Primary request: Explain hardware tiling of matrix multiplication Y=A×W and why Prefill versus Decode have different M dimensions. No numeric toy matrices.
CRITICAL GEOMETRY: Draw A[M,K] large matrix in top-left and W[K,N] large matrix in top-right. Directly BELOW A draw its selected A_tile[M_t,K_t]; directly BELOW W draw its selected W_tile[K_t,N_t]. Place a single Cube compute array in the CENTER BELOW BOTH tiles. Draw TWO SEPARATE DOWNWARD ARROWS: A_tile directly down into Cube left input, W_tile directly down into Cube right input. There must be NO arrow connecting A_tile to W_tile. Cube points down to one resident C_tile[M_t,N_t] accumulation tile. A curved loop labeled "沿 K 逐段累加" feeds subsequent tile pairs into Cube until K is complete. Only then a final arrow moves C_tile to the finished output matrix.
BOTTOM THIRD: side-by-side Prefill and Decode use the SAME weights. Prefill shows many input rows M and fuller array occupancy; Decode shows few input rows M and sparse array occupancy. Small note that batching requests can add rows. No claimed speedup or occupancy percentage.
Exact key labels in simplified Chinese, large and legible: "矩阵乘如何进入 Cube", "输入块 A_tile", "权重块 W_tile", "Cube 乘加阵列", "片上部分和 C_tile", "沿 K 逐段累加", "完成 K 后写回", "Prefill：多行输入", "Decode：新位置较少", "批量请求可增加行数", "M", "N", "K". Show dimension notation A[M,K], W[K,N], C_tile[M_t,N_t].
Style: beautiful precise editorial technical illustration, subtle dimensional paper layers, tasteful navy teal amber, clear arrows, spacious but information dense, readable at smartphone width. Do not imitate simplistic SVG; no 2×2 numeric example, no invented chip specs, no watermark.
```

目视核对：A/W 的行列轴与三个块维度一致；输入块、权重块各自进入 Cube，部分和在 K 段间保留，完成后写回；底部仅比较 M 行数与示意性的阵列占用。此前两张试版存在 A 块串行送入 W 块的箭头歧义，未复制到文章资源目录。

参考资料：[E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)、[CUTLASS 分块矩阵乘说明](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/efficient_gemm.html)、[Google TPU 矩阵单元说明](https://docs.cloud.google.com/tpu/docs/system-architecture-tpu-vm)。图示的 Cube 是泛称，不对应某款具体设备。
