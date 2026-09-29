# 第 11 期 KV Cache 容量与读写图

- 日期：2026-09-29。
- 工具：Codex 内置 imagegen，生成后对写入箭头做一次定点修正。
- 用途：`11-kv-cache.md` 图 3，把长期占用、单步新写入和历史逻辑读取分开。
- 成图：`assets/generated/kv-capacity-traffic-11-zh.png`。
- 性质：依据 E4B 固定配置的构造估算，不是模型运行截图、设备实测曲线或实际 DRAM 流量。

## 生成提示词

```text
Use case: scientific-educational. Generate ONE ORIGINAL landscape 16:9 Chinese PPT-style technical explainer slide for Gemma 4 E4B KV Cache, white background, dark navy headings, teal local cache, purple global cache, amber data movement, crisp vector shapes and large readable simplified Chinese. Exact title: “KV Cache：存量与每步搬运是两笔账”. Small subtitle: “E4B · B=1 · BF16 · 仅 24 个独立 KV 生产层的原始净荷”. Two wide side-by-side panels, with clear separation and NO conventional shared-scale bar chart. LEFT title “长期占用随历史增长”. Show teal local-cache strip reaching a plateau labeled exactly “20 个局部生产层：512 窗口约 20 MiB”, and purple global-cache strip visibly growing through two milestones labeled exactly “64K 位置：约 1 GiB” and “128K 位置：约 2 GiB”, with small label “4 个全局生产层”. RIGHT title “每新增一个 token”. Show a small amber WRITE arrow labeled exactly “新 K/V 写入：约 56 KiB”, and a distinct much larger READ path labeled “局部可见历史：约 20 MiB” plus “全局可见历史：128K 时约 2 GiB”; label both read values as '逻辑净荷', not measured DRAM traffic. Below right panel a short accurate conclusion exactly “新写入很小，历史读取可很大”. Footer across whole slide exactly “示意数值不含共享消费层、元数据或实际外存流量；形状不按比例”. No extra numbers, no equations, no invented benchmark, no chip image, no misleading axes. This figure must distinguish retained-capacity, per-step write, and per-step logical read, never suggest all 2 GiB is rewritten every token.
```

初版右上“写入”箭头误指向当前 token，故使用 imagegen 只修该处：

```text
Precise local edit to the provided Chinese KV Cache quantitative slide. Preserve the entire title, all text and numbers, all shapes, curves, colors and layout except the WRITE direction in the upper part of the right panel. The orange WRITE arrow currently points toward the small box labeled 当前 token on the far right; that is wrong. Reverse ONLY that orange arrow so it points LEFT, from the 当前 token box toward the orange 写入 area / cache. The intended semantics: current token produces new K/V and writes them into KV Cache, not cache writes into current token. Keep the two READ arrows below pointing left exactly as they are. Do not change any other label, position, or technical relationship.
```

## 核对

- 最终图的橙色写入箭头由“当前 token”指向缓存方向；两个读取箭头指向本步计算。
- 数字核对：局部 20 层各 1 MiB，共 20 MiB；全局四层每位置共 16 KiB，64K 为 1 GiB，128K 为 2 GiB；新位置原始写入 40+16=56 KiB。
- 图中局部平台对应长期只保留 512 窗口的假设，非所有后端的物理实现；读写栏是逻辑净荷，未计共享消费层和实际外存流量。
