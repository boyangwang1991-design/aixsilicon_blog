# 第 06 期 GQA 与 KV Cache 教学图生成记录

- 工具：Codex 内置 `image_gen`，两张图各生成一次，GQA 和 KV Cache 图各修订一次；2026-09-28。
- 用途：GQA 图现用于第 06 期图 3；KV Cache 图原用于第 06 期图 5，后移至第 11 期图 1。两图属于原理示意，不是模型运行结果。
- 参考图：`assets/diagrams/attention-gqa-zh.png`、`assets/diagrams/attention-kv-cache-zh.png`，只作为事实结构和术语参考。两张原图的 SVG 和 PNG 继续保留为编辑记录。
- 成图：`assets/generated/attention-gqa-imagegen-zh.png`（1672×941）、`assets/generated/attention-kv-cache-imagegen-zh.png`（1672×940）。
- 核对：GQA 图有 8 条独立 Q 路径、2 组共享 K/V、各头独立权重与输出、合并投影；KV Cache 图有历史缓存、本步 K/V 追加、重新计算 Q 对应权重、下一步复用与可见范围限制。两图文字与箭头均经视觉检查。KV Cache 图按一个查询头示意，正文图注说明这一范围。
- 修图：KV Cache 初版中“缓存持续累积”可能被理解为局部层无限保留旧位置，已用内置 `image_gen` 定点改成“本步 K/V 已写入，供后续位置复用”；正文使用修订版。
- 修图：GQA 初版左侧“同一位置的输入 X”与多位置 K/V 长条不一致，已用内置 `image_gen` 定点改成“同一层的输入序列 X”；正文图注进一步说明 Q 路径取单个查询位置作例子。

## GQA 原始提示词

```text
Use case: scientific-educational. Asset: Chinese technical blog teaching figure, wide landscape presentation slide. The attached PNG is a reference for factual structure and terminology, not a layout to copy. Generate a newly designed, polished, information-rich infographic explaining E4B layer 0 GQA. Crisp vector-like shapes, warm white background, dark navy type, restrained blue/green/purple accents, strong grouping and arrows, large mobile-legible Chinese text, no decorative chip illustrations. Visual flow left to right: one current-position state X yields 8 separate query heads Q0–Q7 and only 2 K/V head streams; group A Q0–Q3 each independently uses KV head 0; group B Q4–Q7 each independently uses KV head 1. Each K/V head stream contains K/V across allowed past positions, not a single token. For each Q head show separate Q–K matching -> its own position weights -> weighted read of the shared V stream -> its own head output. At far right show 8 head outputs joined then output projection. Make the key difference visually unmistakable: shared K/V data, separate queries and separate weights/output. Include exact short Chinese labels only: title 'GQA：8 个 Q 头，共用 2 组 K/V'; '同一位置的输入 X'; 'Q₀–Q₃'; '共用 K₀ / V₀'; '4 份独立权重与输出'; 'Q₄–Q₇'; '共用 K₁ / V₁'; '4 份独立权重与输出'; '8 个头合并 → 输出投影'; footer '下标表示头编号；K/V 头包含可见位置上的一串 K/V' and '共享 K/V，不共享注意力权重'. Accurate arrows, no other numbers, no invented numerical weights, no claim that Q heads merge before attention. 16:9 wide presentation aesthetic.
```

## KV Cache 原始提示词

```text
Use case: scientific-educational. Asset: Chinese technical blog teaching figure, wide 16:9 presentation slide. The attached PNG is a factual reference, but redesign with richer information and more visual explanation. Polished vector-like infographic, white/pale background, dark navy readable Chinese, blue for historical cached data, purple for current new token, green for attention read, clean spacious alignment. Main question: why can a decoder reuse historical K/V when generating the next token? Show a left-to-right timeline for one same Attention layer: positions 0 and 1 were processed earlier under causal attention; their per-position K0,V0 and K1,V1 are stored in KV Cache. At current position 2, compute fresh Q2,K2,V2 from its state; append K2,V2 to cache. A large central-lower pipeline shows Q2 matching permitted K0,K1,K2 -> current position weights are calculated anew -> weights read corresponding V0,V1,V2 -> position 2 output. At bottom show next position 3 reuses old K/V but computes new Q3 and new weights. Include an explicit small legend/callout that cache stores K and V tensor values, never Q, scores, softmax weights, or original text; for E4B layer 0, cached K has passed head RMSNorm and RoPE, cached V has passed head RMSNorm. Include causal/window mask restricting readable positions, even when K/V entries exist. Important: subscript 0/1/2 here means sequence position, NOT head number. Exact prominent Chinese labels: title 'KV Cache：历史 K/V 为什么能复用？'; '此前：位置 0、1 已处理'; '同层 KV Cache'; '当前：新位置 2'; '新算 Q₂、K₂、V₂'; 'K₂、V₂ 加入缓存'; 'Q₂ 匹配允许读取的 K'; '重新计算位置权重'; '按权重读取对应 V'; '输出位置 2'; '下一步：复用 K/V，重算 Q₃ 和权重'; '因果 / 局部窗口 mask 决定可读范围'; small footer '下标表示位置编号；缓存不存 Q 或注意力权重'. Keep process and arrows technically correct; avoid fake numerical weights, avoid showing old hidden states recomputed or updated. Chinese text must be legible and spelled exactly; no decorative chip objects.
```

## KV Cache 定点修图提示词

```text
Use case: precise-object-edit. Edit the attached Chinese KV Cache teaching infographic, preserving its composition, arrows, colors, all other labels, and resolution as closely as possible. Make exactly one text correction: inside the top-right panel titled '更新后的同层 KV Cache', replace the sentence '缓存持续累积，供后续位置复用' with the exact sentence '本步 K/V 已写入，供后续位置复用'. This avoids suggesting that a local sliding-window cache grows forever. Do not change any other text, tiles, arrows, or numeric indices. Keep all Chinese text legible and correct.
```

## GQA 定点修图提示词

```text
Use case: precise-object-edit. Edit the attached Chinese GQA teaching infographic. Preserve its composition, arrows, all head labels Q₀–Q₇ and K₀/V₀, K₁/V₁, colors, and every other sentence exactly. Make one factual text correction in the leftmost blue input panel only: replace '同一位置的输入 X' with '同一层的输入序列 X'. The K/V green strips represent data from multiple visible sequence positions, so the input label must refer to the whole sequence. Render the replacement Chinese clearly in the same dark navy font, fitting the panel. Do not change anything else.
```
