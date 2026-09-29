# 第 08 期 Hybrid Attention 配图生成记录

2026-09-28 使用 Codex 内置 `image_gen` 生成三张横向中文教学图。成图均保存在本篇 `assets/generated/`，属于机制示意，不是模型运行截图或实测结果。事实依据为固定 E4B 配置与 `Gemma4TextAttention` 源码；`reference/` 仅供内部核对。

| 正文图 | 文件 | 要回答的问题 | 核对 |
| --- | --- | --- | --- |
| 图 1 | `assets/generated/hybrid-layer-schedule-zh.png` | 42 层如何交错，位置 4095 在局部/全局层分别能直读哪里 | 7 组 5 局部 + 1 全局；全局层号 5/11/17/23/29/35/41；窗口 512；局部 3584–4095，全局 0–4095 |
| 图 2 | `assets/generated/hybrid-sliding-relay-zh.png` | 窗口如何移动，旧信息如何间接传递，比较数如何随阶段变化 | q=3/4/5 分别读 0–3/1–4/2–5；首次生成把 q=3 的位置 0 误着灰色，已定点修为蓝色；复杂度只表示逻辑比较数 |
| 图 3 | `assets/generated/hybrid-kv-sharing-zh.png` | E4B 局部/全局头形状及跨层 K/V 来源 | 8Q/2KV；局部 256、全局 512；K/V 分开投影；局部共享层取第 22 层、全局共享层取第 23 层 |

图 3 另有两张未采用的草稿：一张误列共享全局层号，另一张箭头与生产/消费分区不清。正文只使用重新生成并核对过的第三张。原 `assets/draft-newsletter/` 的九张网络图不再被第 08 期正文引用，文件保留作内部编辑记录。

## 图 1 原始提示词

```text
Use case: scientific-educational. Create a NEW original Chinese infographic for a Gemma 4 E4B technical blog, wide 16:9 presentation slide, polished vector-like editorial style, white background, navy text, blue for local attention and purple for global attention, large legible Simplified Chinese. Do not copy any existing online diagram. Goal: explain the E4B hybrid attention layer schedule AND direct visibility in one image. Top half: seven clearly separated six-layer groups; in each group show five blue '局部' tiles followed by one purple '全局' tile, 42 layers total indexed 0–41, with prominent purple indices 5,11,17,23,29,35,41 and callout '第 41 层是全局层'. Bottom half: two side-by-side causal history timelines for a query at position 4095 of a 4096-token sequence. Local panel: only latest 512 positions, indices 3584–4095, are directly readable, older 0–3583 greyed out; caption '局部层：最多直接读 512 个位置'. Global panel: all positions 0–4095 directly readable; caption '全局层：直接读完整因果历史'. Include one short footer: 'mask 决定可见范围；RoPE 改变可见位置的匹配，不会解除 mask'. Avoid suggesting all 42 layers have distinct KV caches; this image is only about layer types and visibility. No fake measurements, no E2B comparison. Use arrows only where direction is unambiguous. Exact numerical facts: 42 layers; 5 local + 1 global repeated 7 times; window 512; final layer 41 global; query 4095 local 3584–4095 versus global 0–4095. Title exact: '42 层怎么分工：五局部，一全局'. Ensure every Chinese label and number accurate and readable.
```

## 图 2 原始提示词

```text
Use case: scientific-educational. Create a NEW original Chinese 16:9 landscape infographic for an AI chip engineering blog; polished slide-like vector design matching a white/navy/blue/purple visual language. Topic: sliding-window attention movement, indirect information relay, and the direct comparison-work consequence. Do not copy an online image. Top half: clear three-row teaching timeline with window width W=4 (explicitly labeled '仅为教学例子；E4B 实际 W=512'), showing query q=3 directly reads positions 0,1,2,3; q=4 directly reads 1,2,3,4; q=5 directly reads 2,3,4,5. Draw 0–5 as aligned columns, highlight current readable four blue cells in each row and grey out excluded old positions. Show window shifts one step right each time. Bottom left: simple two-layer state relay, older position 0 can affect position 3's UPDATED STATE in an earlier local layer, which can then be read by position 5 in a later local layer. Label '窗外 K/V 不能直接读' and '早期信息可能经层间状态间接传递；不保证逐字保留'. Make arrows clearly show layer order and distinguish indirect state flow from a forbidden direct KV read. Bottom right: compact computation card, exact labels 'Prefill：局部约 S×W；全局约 S²' and 'Decode 单步：局部最多 W 个键；全局约 T 个键', with footer '逻辑比较数，不是实测延迟'. Color local blue, global purple, old out-of-window grey. Title exact '滑窗向前走：直接读取变短，信息仍可接力'. Ensure Chinese text and indices fully correct and readable, no ornamental chips, no false claim that window size is 4 in E4B.
```

## 图 2 定点修图提示词

```text
Use case: precise-object-edit. Correct only the highlighted-window colors in the attached Chinese sliding-window infographic; preserve every label, number, diagram, arrow, title, style, spacing, and all other colors. The teaching example has W=4. For the TOP timeline row '查询 q=3', the directly readable cells must be positions 0,1,2,3, all BLUE; positions 4 and 5 remain GREY. Currently cell 0 is mistakenly grey: recolor it blue. In the lower-left indirect-relay panel, the first local layer's position 0 cell should also be BLUE because its arrow shows it can influence the updated state at position 3 in that earlier layer. Do not alter the q=4 or q=5 timeline rows. Keep the text q=3 reads 0,1,2,3 and all other text intact. This is a color-only correction.
```

## 图 3 采用版提示词

```text
Use case: scientific-educational. Create a FRESH original Chinese wide 16:9 presentation infographic for the exact Gemma 4 E4B configuration. Minimal, clear, high contrast, white background, navy type, blue local and purple global. This is a TWO-SECTION image, nothing else. SECTION A (upper half): side-by-side comparison: BLUE card '局部层：8Q / 2KV，每头 256 维，窗口 512'; PURPLE card '全局层：8Q / 2KV，每头 512 维，完整因果历史'. Below the cards write '每 4 个 Q 头共用 1 组 K/V；K 与 V 分开投影，K ≠ V'. SECTION B (lower half): exactly TWO horizontal source-to-consumer lanes, each spanning LEFT to RIGHT with one arrow. Blue lane, exact text in left source box '第 22 层：最后的局部 KV 生产层' then a BLUE RIGHTWARD ARROW then right consumer box '第 24–41 层中的局部共享层：读取第 22 层 K/V'. Purple lane, source box '第 23 层：最后的全局 KV 生产层' then a PURPLE RIGHTWARD ARROW then consumer box '第 24–41 层中的全局共享层：读取第 23 层 K/V'. Above the two lanes write '前 24 层（0–23）各自生产 K/V；后 18 层（24–41）不再各自投影 K/V'. Footer '共享层仍计算自己的 Q 和输出投影；不是 42 层共用一份 KV'. Absolutely NO individual layer tiles, NO vertical divider, NO duplicated consumer boxes, NO arrows from nowhere, NO consumer-to-consumer arrows, NO extra claims. Accurate Simplified Chinese, large labels. Title exact 'E4B 的 KV 结构：头宽与跨层共享'.
```
