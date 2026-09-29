# 第 10 期存算比讲解图

- 用途：解释同一张权重在 Prefill 与单请求 Decode 中被多少输入行复用，以及这对硬件关注点的影响。
- 成图：`assets/generated/prefill-decode-arithmetic-intensity-zh.png`。
- 可编辑图源：`assets/diagrams/draw-prefill-decode-arithmetic-intensity.py`，使用 Python Pillow 绘制 PNG。
- 参数：E4B gate 投影按数学矩阵方向为 `[2560,10240]`；BF16 每权重 2 字节；Prefill 输入 128 行，单请求 Decode 输入 1 行。该形状与正文所引 E4B 固定配置一致。
- 验算：权重 `2560×10240×2 = 52,428,800` 字节，即 50 MiB。Prefill 运算 `2×128×2560×10240 = 6,710,886,400` FLOP，Decode 运算 `2×1×2560×10240 = 52,428,800` FLOP；分别除以权重字节数，得到 128 和 1 FLOP/byte。
- 边界：只计从指定存储层级读取一次权重；未计激活、输出、K/V、重复搬运或缓存命中。图用于解释机制，不是实测性能。
- 检查：已目视核对文字、矩阵方向、行数、箭头和数值。图中文字为中文；不存在测量截图或产品界面。
