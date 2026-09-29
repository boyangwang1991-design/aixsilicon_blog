# 第 07 期 RoPE 横向讲解图记录

日期：2026-09-28。正文已由四张 `assets/draft-newsletter/` 参考文章图片改为两张 Codex 内置 imagegen 文生图。两张成图均按 16:9 横向 PPT 教学页构思，使用简体中文，属于原理示意；不表示 Gemma 4 实际运行截图、芯片布线或测量结果。旧图仍在编辑资源目录供来源追溯，正文不再引用。

## 图 1：绝对旋转与相对位移

- 文章路径：`assets/generated/rope-relative-position-slide-07-zh.png`
- SHA-256：`c1299d76e4d3b49312ee43078f13dbc535a0b1108f5aa8aa82899cf5e7afc46f`
- 原始生成文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-c377c42a-7295-40bd-9c74-faa9aeaad68e.png`
- 最终编辑文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-30e804f8-62de-4764-b4c7-9b9601194eeb.png`
- 目标：同一张图讲清 Q、K 按各自绝对位置旋转、点积中的共同旋转抵消、固定内容时共同平移不改变相对位置关系。

初始成图提示词：

```text
Create one high-information 16:9 landscape PPT-style Chinese educational slide for a technical blog. Topic: "两个绝对位置，留下一个相对位移". Three clean panels, large readable Chinese text, sophisticated navy/teal/amber diagram on ivory background.
Left panel: two distinct content arrows q and k on separate identical 2D axes. Position m rotates q by mω to q_m; position n rotates k by nω to k_n. Independent arrows, never q→k.
Center: q_m and k_n start from the same origin on one axis; highlight their mutual angle. Text: "点积比较相对夹角". Show exact identity "R(m)ᵀR(n)=R(n−m)".
Right: shift both positions equally to m+t and n+t. Both arrows rotate by tω, mutual angle stays identical. Text: "位置同移，夹角不变", "相对位移仍是 n−m".
Bottom takeaway: "分数由内容 q、k 和相对位移共同决定".
No numeric examples, no fabricated scores, no chip props, no watermark. Correct arrow directions. Polished slide aesthetic with dimensional paper layers, not plain SVG.
```

初版副标题把“相对夹角”误写成只由相对位移决定，遗漏了 `q`、`k` 原有方向对夹角的贡献。该版未进入文章。以下为针对性编辑提示词：

```text
Use case: precise-object-edit. Preserve this 16:9 slide's three-panel geometry, colors, layout, arrows, formulas and most text. Correct the central scientific claim: the angle between rotated q and k is NOT determined by relative position alone; it also includes the original content-vector angle. Replace the subtitle under the large title with exactly '两端按绝对位置旋转；点积同时比较内容与相对位移'. In center panel replace the angle label θ_(n−m) with exactly '内容夹角 + (n−m)ω' next to the angle arc, large enough to read. Replace any tiny statement saying similarity only depends on relative displacement with exactly '固定 q、k 时，位置项只看 n−m'. Keep the correct formula R(m)ᵀR(n)=R(n−m). Keep the bottom takeaway saying content q,k and relative displacement jointly determine the score. Do not alter the rest of the diagram or introduce any claim that score is solely a function of distance.
```

核对：Q 与 K 是两条独立向量；中心等式 `R(m)ᵀR(n)=R(n−m)` 正确；成图已改为“内容夹角 + (n−m)ω”以及“分数由内容 q、k 和相对位移共同决定”。图中共同平移只讨论固定 `q`、`k` 的数学关系，不声称真实模型不同位置的内容表示相同。

## 图 2：局部层、全局层与 mask

- 文章路径：`assets/generated/rope-partial-slide-07-zh.png`
- SHA-256：`fdd8cbc58bfcb5d66e02cd5ba32da17c51df24a765699685827b0f8a198fc3a4`
- 原始生成文件：`C:/Users/boyang-lab/.codex/generated_images/01a0eaf4-13de-71f2-bff9-82d1fdced5ae/exec-c3a0d026-a380-4d64-a587-dea5167f2ba3.png`
- 目标：只解释 E4B 局部层与全局层的 Q/K 位置处理，以及 V、mask 的不同职责，不展开参数比例或内部频率公式。

最终提示词：

```text
Create one polished 16:9 landscape PowerPoint-style Chinese teaching slide for a Gemma 4 E4B RoPE chapter. Clear editorial presentation design, ivory background, deep navy, teal, amber. Large mobile-legible text, minimal words, information-rich exact data flow.
Title exactly "Gemma 4：位置如何进入注意力".
Two side-by-side lanes:
LEFT heading "局部注意力：Q、K 旋转". Draw two separate labeled ribbons Q and K, each entering a position-rotation module and then merging only at a Q·K score node. Draw V as a separate ribbon bypassing rotation and entering the later weighted-value stage. The local attention mask box controls which historical K positions may reach the score node, not which feature channels rotate.
RIGHT heading "全局注意力：部分维度旋转". Draw Q and K as feature ribbons split into two channel groups: a highlighted section labeled "旋转维度" passing through position rotation, and an unhighlighted section labeled "未旋转维度" bypassing rotation. Both sections rejoin before the Q·K score node. V bypasses rotation. A separate full-attention mask box controls visible K positions. Do not draw partial rotation as a fraction of token positions or attention heads; no numerical proportion.
Bottom distinction exactly "RoPE 改变匹配分数；mask 决定可见位置".
Conceptual illustration only, not actual tensor layout or hardware wiring. Arrows must go Q/K → rotation/bypass → Q·K score, V only to weighted value, mask only to visibility gating. No fabricated scores, no 2×2 example, no watermark, no borrowed newsletter composition, no decorative chip blocks. Professional slide clarity, dimensional paper texture, not simplistic SVG.
```

核对：左右两栏分别表示局部层 Q/K 旋转与全局层部分特征维度旋转；V 绕开旋转进入加权求和；mask 控制可见的 K 位置，与维度选择分开。图中的带状通道仅作概念分组，不是实际张量切片截图。E4B 局部层与全局层的参数差异依据[固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json)及[固定实现](https://github.com/huggingface/transformers/blob/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4/modeling_gemma4.py)。
