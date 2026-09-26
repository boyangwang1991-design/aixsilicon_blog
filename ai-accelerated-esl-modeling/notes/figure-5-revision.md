# 图 5 修订：指标对照与任务尾部

日期：2026-09-26。工具：Codex 内置 imagegen，以上一版图为编辑参考，重构信息表达。

旧图依靠方块长短解释局部改善，变化不明显，也容易让人误以为这些是实测任务。新图上半部呈现保留 GEMM 指标，下半部提供 port 0 后续任务的定性示意，不虚构精确时间点。

- p99：225 → 198 周期，下降 (225−198)/225 = 12%。
- 任务总时长：7714 → 7715 周期，增加 1 周期，基本不变。
- 时间线任务块不按比例，不由 p99 推导某段任务耗时。
- 端口分配、计算调度与布局是下一步实验方向，未单变量确认各自贡献。

## 最终生成提示词

```text
Use case: scientific-educational. Redesign this image comprehensively; keep its polished navy/teal/amber on white visual language, but replace the confusing BEFORE/AFTER task blocks with a precise Chinese engineering explainer combining real metric callouts and a clearly marked conceptual task-tail diagram. Landscape 3:2, large mobile-readable Chinese type, clean professional spacing, minimal words with strong hierarchy. Title exact: “访存延迟下降，任务时间为何几乎没变？” Subtitle exact: “同一保留集 GEMM：C0 → XOR”. Top half two equal very prominent cards: LEFT teal heading “事务延迟 p99”, huge “225 → 198”, small unit “周期”, badge “降低 12%”; RIGHT amber heading “GEMM 总时长”, huge “7714 → 7715”, small unit “周期”, badge “基本不变（+1 周期）”. Do not invent any other numerical measurements. Do not draw decorative data charts. Under cards one centered sentence “p99 是事务延迟的高分位，不是整个任务的完成时间”.
Lower half heading “任务尾部线索：port 0 还有后续 tile”. Draw ONE simplified qualitative timeline, NOT before/after comparison and NOT a reconstructed exact measured waveform. Two horizontal lanes with same start, first labeled “其他端口”, second labeled “port 0”. In each lane a three-block chain “加载” → “计算” → “写回”, aligned for the first tile. The first lane ends clearly about halfway across and has bold label “已完成”. After the first tile on port 0, draw another chain “加载” → “计算” → “写回” extending far to the right and encircle/outline this EXTRA chain with a bold amber dashed rectangle labeled “后续 tile 仍在执行”. A prominent vertical endpoint at far right labeled “等待 port 0 完成”. On the first lane, show remaining blank pale region to the end, caption “空闲”. Add a simple thin horizontal progression arrow below lanes labeled “时间推进（示意，不按比例）”, with NO numbers or ticks. Legend only if necessary, avoid clutter. Distinguish task groups and arrows cleanly, no ambiguous unconnected arrows.
Bottom insight band exact: “AI 辅助分析：从局部指标，追到任务依赖与调度” and smaller “下一步：对照端口分配、计算调度与数据布局”.
Footnote exact: “上方数字来自资源模型仿真；下方为任务尾部示意，非实际波形。”
Scientific accuracy: the shorter p99 does NOT prove that any specific compute or load block got shorter; do not connect p99 to a shortened task rectangle. This picture shows aggregate facts + a qualitative clue, not causal proof. All text in simplified Chinese except GEMM, C0, XOR, p99, port 0, tile, AI. No GitHub URLs, private repository links, source file paths, QR codes, fabricated numbers, extra slogans or watermarks.
```

