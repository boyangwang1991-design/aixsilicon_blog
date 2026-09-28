# 讲解图生成与修订记录

日期：2026-09-27。工具：Codex built-in imagegen。内部记录，不从公开正文链接。成图是教学示意，不是仿真截图；可编辑语义图源保存在 assets/figure-specs.json。

第一轮需求图的逻辑门可能误示锁信号极性，并自动添加地址/数值；第二轮去掉逻辑门和数值，明确锁定禁止写入。第一轮协作图加入无关机械制造意象/口号，英文遗漏资产仓连接；第二轮修正。仅最终版本复制到文章目录。

## 01-requirement-zh · 第 1 版

- 语言：zh
- 用途：讲解图
- 采用：否，已被修订替换
- 目标：`assets/generated/01-requirement-zh.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-236e1091-8062-48ab-b0d7-d3572640e8f5.png`

```text
Use case: scientific-educational. A polished engineering teaching infographic, landscape 4:3, high resolution, warm off-white background, navy text and outlines, teal primary arrows, amber repair/feedback accents. Large clear typography for mobile reading, generous spacing. Subtle dimensional technical illustration integrated with structured cards; clean precise arrows, not decorative light effects. All content is a conceptual explanation, not a real UI, real simulation, or measurements. No invented labels, no extra text. All explanatory text in Simplified Chinese. Title "一句需求，怎样落到电路？". Four equal cards in a two by two grid with a clear numbered path 1 top left → 2 top right → 3 bottom right → 4 bottom left, arrows kept outside cards. Card 1 title "1 行为要求", text "锁定后，配置保持不变", icon a specification sheet and lock. Card 2 title "2 写使能设计", text "锁状态控制写入许可", icon lock control wire entering a write gate. Card 3 title "3 生成与连接", text "SystemRDL → CSR RTL", second line "顶层连接控制信号", icon generated register bank connected to write gate. Card 4 title "4 定向检查", text "配置 → 锁定 → 改写 → 读回", second line "检查原值是否保留", icon probe reading register. A thin amber return arrow outside the grid from card 4 to card 2 labelled "失败后定位并修正". Small footer "方法示意 · 不代表完整锁机制验收". Technical invariant: the lock controls write permission, not read permission.
```

## 01-requirement-en · 第 1 版

- 语言：en
- 用途：讲解图
- 采用：否，已被修订替换
- 目标：`assets/generated/01-requirement-en.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-10b16a9c-29aa-4fa8-941e-d910ede01d9d.png`

```text
Use case: scientific-educational. A polished engineering teaching infographic, landscape 4:3, high resolution, warm off-white background, navy text and outlines, teal primary arrows, amber repair/feedback accents. Large clear typography for mobile reading, generous spacing. Subtle dimensional technical illustration integrated with structured cards; clean precise arrows, not decorative light effects. All content is a conceptual explanation, not a real UI, real simulation, or measurements. No invented labels, no extra text. All explanatory text in English. Title "How does a requirement reach the circuit?". Four equal cards in a two by two grid with a clear numbered path 1 top left → 2 top right → 3 bottom right → 4 bottom left, arrows kept outside cards. Card 1 title "1 Define behavior", text "Locked configuration must hold", icon a specification sheet and lock. Card 2 title "2 Design write control", text "Lock state gates write permission", icon lock control wire entering a write gate. Card 3 title "3 Generate and connect", text "SystemRDL → CSR RTL", second line "Connect control in top-level RTL", icon generated register bank connected to write gate. Card 4 title "4 Check behavior", text "Configure → Lock → Write → Read", second line "Verify the original value remains", icon probe reading register. Thin amber return arrow outside the grid from card 4 to card 2 labelled "Diagnose and revise". Small footer "Method illustration · Not a complete lock qualification". Technical invariant: lock controls write permission, not read permission.
```

## 01-requirement-zh · 第 2 版

- 语言：zh
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/01-requirement-zh.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-04e03206-a102-4617-b9b2-b27504d621d7.png`
- 编辑输入：`C:/Users/wangb/.codex/generated_images/01a0e1e9-5658-70b2-8753-bbbaf425eff0/exec-236e1091-8062-48ab-b0d7-d3572640e8f5.png`

```text
Edit this teaching infographic. Keep the existing four-card 2x2 layout, large title, navy/teal/amber palette and four-stage arrows, preserve all four main card titles and their two short descriptions. Remove ALL gate symbols, register tables, hexadecimal numbers, memory values, waveforms, tiny extra annotations, and terminals. The original lock diagram could incorrectly imply that active lock enables writing; eliminate that possibility by using abstract labeled rectangular modules only, NOT logic gates. Also remove any extra text not listed below. Subtle large icons of document, padlock, linked blocks and magnifying glass may remain. Generous spacing, very legible text. This is a conceptual method diagram, no quantitative data. Simplified Chinese only except SystemRDL, CSR RTL. In card 2 show ONLY a horizontal arrow from a rectangular block "锁状态" to another rectangle "写入控制" with the clearly legible note below "锁定 → 禁止配置写入". In card 3 show ONLY three rectangles "SystemRDL" → "CSR RTL" ← "顶层控制". In card 4 show ONLY a register icon with two large labels "原值" and "读回值" and an equals sign between them; no numbers. Keep card 1 as simple spec and lock icons with no extra text. Maintain title "一句需求，怎样落到电路？", card titles "1 行为要求", "2 写使能设计", "3 生成与连接", "4 定向检查". Main descriptions: "锁定后，配置保持不变"; "锁状态控制写入许可"; "SystemRDL → CSR RTL" and "顶层连接控制信号"; "配置 → 锁定 → 改写 → 读回" and "检查原值是否保留". Feedback arrow "失败后定位并修正". Footer "方法示意 · 不代表完整锁机制验收".
```

## 01-requirement-en · 第 2 版

- 语言：en
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/01-requirement-en.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-a8c2115f-167e-4db8-afb5-c80acd7b1224.png`
- 编辑输入：`C:/Users/wangb/.codex/generated_images/01a0e1e9-5658-70b2-8753-bbbaf425eff0/exec-10b16a9c-29aa-4fa8-941e-d910ede01d9d.png`

```text
Edit this teaching infographic. Keep the existing four-card 2x2 layout, large title, navy/teal/amber palette and four-stage arrows, preserve all four main card titles and their two short descriptions. Remove ALL gate symbols, register tables, hexadecimal numbers, memory values, waveforms, tiny extra annotations, and terminals. The original lock diagram could incorrectly imply that active lock enables writing; eliminate that possibility by using abstract labeled rectangular modules only, NOT logic gates. Also remove any extra text not listed below. Subtle large icons of document, padlock, linked blocks and magnifying glass may remain. Generous spacing, very legible text. This is a conceptual method diagram, no quantitative data. English only. Card 2 has ONLY rectangular block "Lock state" → rectangular block "Write control", and the large note below "Locked → Configuration writes blocked". Card 3 has ONLY three rectangles "SystemRDL" → "CSR RTL" ← "Top-level control". Card 4 has ONLY a register icon with two large labels "Original value" and "Readback value" and an equals sign between them; no numbers. Card 1 simple spec and lock icons with no extra text. Title "How does a requirement reach the circuit?". Card titles "1 Define behavior", "2 Design write control", "3 Generate and connect", "4 Check behavior". Main descriptions "Locked configuration must hold"; "Lock state gates write permission"; "SystemRDL → CSR RTL" and "Connect control in top-level RTL"; "Configure → Lock → Write → Read" and "Verify the original value remains". Feedback arrow "Diagnose and revise". Footer "Method illustration · Not a complete lock qualification". Remove technical invariant footer bar, keep only listed footer.
```

## 02-collaboration-zh · 第 1 版

- 语言：zh
- 用途：讲解图
- 采用：否，已被修订替换
- 目标：`assets/generated/02-collaboration-zh.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-03d0af58-6186-4f23-ae7d-c879eb7ab506.png`

```text
Use case: scientific-educational. Premium technical magazine infographic, landscape 4:3, warm off-white canvas, navy lettering, teal arrows and amber feedback, matching a restrained dimensional paper-and-circuit editorial style. Generous spacing, very legible large labels and modest dimensional icons. Strictly conceptual roles and information flow, not a screenshot, no code, no invented data, no extra text beyond supplied labels. All text Simplified Chinese except AI, Skills, CBB, IP, VIP, ESL. Title "AI 参与研发，工程依据留在哪里？". Top: a horizontal wide band "工程师" with subtitle "确定目标 · 审视取舍 · 判断证据", thin downward lines leading to middle three large cards. Middle primary flow: card "设计依据" subtitle "需求 · 架构 · 详细设计" → card "AI 推进工作" subtitle "实现 · 测试 · 定位 · 修正" → card "工具执行" subtitle "生成 · 检查 · 仿真 · 综合". A single amber feedback arrow below the three cards goes FROM 工具执行 BACK TO AI 推进工作, labelled "实际结果与诊断". Lower support row: card "Skills" subtitle "步骤与检查方法", arrow upward to AI card; card "资产仓" subtitle "CBB · IP · VIP", arrow upward to AI card. Small separated side card "可选：ESL" subtitle "架构探索", dashed arrow to 设计依据. Footer "职责示意 · 按任务选用资产与检查". Do not add arrows suggesting Skills themselves declare tests passed; tool results are the only execution feedback.
```

## 02-collaboration-en · 第 1 版

- 语言：en
- 用途：讲解图
- 采用：否，已被修订替换
- 目标：`assets/generated/02-collaboration-en.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-b4b2c5bf-86a8-4d66-913c-e1a6de0df38b.png`

```text
Use case: scientific-educational. Premium technical magazine infographic, landscape 4:3, warm off-white canvas, navy lettering, teal arrows and amber feedback, matching a restrained dimensional paper-and-circuit editorial style. Generous spacing, very legible large labels and modest dimensional icons. Strictly conceptual roles and information flow, not a screenshot, no code, no invented data, no extra text beyond supplied labels. All text English. Title "AI does the work. What grounds it?". Top: horizontal wide band "Engineers" subtitle "Set goals · Review trade-offs · Assess evidence", thin downward lines leading to middle three large cards. Middle primary flow: card "Design basis" subtitle "Requirements · Architecture · Detail" → card "AI develops" subtitle "Implement · Test · Diagnose · Revise" → card "Tools execute" subtitle "Generate · Check · Simulate · Synthesize". Single amber feedback arrow below the three cards goes FROM Tools execute BACK TO AI develops, labelled "Actual results and diagnostics". Lower support row: card "Skills" subtitle "Steps and checking methods", arrow upward to AI card; card "Asset repositories" subtitle "CBB · IP · VIP", arrow upward to AI card. Small separated side card "Optional: ESL" subtitle "Architecture exploration", dashed arrow to Design basis. Footer "Roles illustrated · Select assets and checks for each task". Do not add arrows suggesting Skills themselves declare tests passed; tool results are the only execution feedback.
```

## 02-collaboration-zh · 第 2 版

- 语言：zh
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/02-collaboration-zh.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-bd36e22d-941a-44f9-8456-1d82409a54cf.png`
- 编辑输入：`C:/Users/wangb/.codex/generated_images/01a0e1e9-5658-70b2-8753-bbbaf425eff0/exec-03d0af58-6186-4f23-ae7d-c879eb7ab506.png`

```text
Edit the infographic while preserving its correct main text, title, all six role cards, arrows and navy/teal/amber palette. Remove the bottom right globe and both slogan books completely, leave clean off-white whitespace. Remove the mechanical CAD part, robotic arm, and wavy data chart from the 工具执行 card. Replace only those card illustrations with a modest generic server plus a document marked by simple lines and a magnifying glass, no additional text or data; these represent software engineering tools, not manufacturing. Remove extraneous top-band book-spine words and balance-scale cards, retain the engineer and top title/subtitle. Remove technical machine-part drawing at bottom left, leave clean whitespace. Keep Skills arrow to AI and 资产仓 arrow to AI separate and clearly connected. Keep optional ESL dashed arrow to 设计依据. Do not add slogans, book labels, new text, plots, or data.
```

## 02-collaboration-en · 第 2 版

- 语言：en
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/02-collaboration-en.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-f7aa5135-f450-4776-bf54-82941049b774.png`
- 编辑输入：`C:/Users/wangb/.codex/generated_images/01a0e1e9-5658-70b2-8753-bbbaf425eff0/exec-b4b2c5bf-86a8-4d66-913c-e1a6de0df38b.png`

```text
Edit this infographic preserving all six role cards, their exact titles and subtitles, color palette, and top Engineers band. Correct the support arrows: ONLY ONE teal upward arrow from Skills to AI develops. ADD a distinct elbow-shaped teal arrow that originates at the TOP of Asset repositories, travels left above the lower cards without touching the amber feedback line, and enters the AI develops card at its lower right edge. Asset repositories must be visibly connected to AI develops, not left disconnected. The original has two arrows both apparently originating from Skills; fix that. Keep the amber Tools execute → AI develops feedback arrow and the ESL → Design basis dashed arrow. Change the main headline to 'AI in development: roles and evidence'. Use a clean sans-serif font for ALL text consistent with a technical teaching infographic. Remove unlabeled rising bar chart in Engineers band. No new data, slogans, or text. Keep diagrams conceptual.
```

## 03-independent-check-zh · 第 1 版

- 语言：zh
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/03-independent-check-zh.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-276b9b4f-294f-4693-a100-1bcdc22fc99a.png`

```text
Use case: scientific-educational. A sophisticated technical teaching infographic, landscape 4:3, warm off-white background, navy text, teal outlines, amber error highlights. Very clear mobile typography, uncluttered generous whitespace, subtly dimensional memory-cell blocks. Only teaching symbols A, B, V; no real addresses, no bus formulas, no invented values, no fake simulation screenshots. TWO clearly separated horizontal panels. Technical invariant: an intended write of V at A is misdirected to B; read with same wrong mapping fetches B returning V, while independent expected location is A. Both panels must refer to the SAME stored state, A unchanged and B containing V. The bottom panel is an independent position check, not a new correct write. No extra text beyond labels specified. All explanatory text in Simplified Chinese. Title "读写都错，回环为何还能通过？". TOP PANEL label "共享错误映射". Left rectangular block "写入 V" with arrow labelled "错误映射" to central memory cell "B：存入 V". Above central cell a separated grey cell "A：未写入" labelled "目标位置". Arrow from B to right block "读回 V", labelled "相同错误映射". Far right a small comparison tag "V = V" and subtitle "回环通过". B must be visually amber marked as wrong location, not success. BOTTOM PANEL label "独立预期检查位置". Left card "预期：V 应在 A". Right two-cell memory depiction repeats exactly "A：未写入" and "B：存入 V". A comparison arrow from the expected card to A and a clearly visible amber annotation "位置不符". Do not show V flowing to A. Footer "A、B、V 为教学符号 · 数值相等不能证明位置正确". No green all-passed assertion.
```

## 03-independent-check-en · 第 1 版

- 语言：en
- 用途：讲解图
- 采用：是
- 目标：`assets/generated/03-independent-check-en.png`
- 生成输出：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-ca11779d-1728-4b6d-81ec-278ba196e6c6.png`

```text
Use case: scientific-educational. A sophisticated technical teaching infographic, landscape 4:3, warm off-white background, navy text, teal outlines, amber error highlights. Very clear mobile typography, uncluttered generous whitespace, subtly dimensional memory-cell blocks. Only teaching symbols A, B, V; no real addresses, no bus formulas, no invented values, no fake simulation screenshots. TWO clearly separated horizontal panels. Technical invariant: an intended write of V at A is misdirected to B; read with same wrong mapping fetches B returning V, while independent expected location is A. Both panels must refer to the SAME stored state, A unchanged and B containing V. The bottom panel is an independent position check, not a new correct write. No extra text beyond labels specified. All explanatory text in English. Title "Both paths are wrong. Why does loopback pass?". TOP PANEL label "Shared incorrect mapping". Left rectangle "Write V", arrow labelled "Wrong mapping" to central memory cell "B: V stored". Above central cell a separated grey cell "A: Not written" labelled "Intended location". Arrow from B to right block "Read V", labelled "Same wrong mapping". Far right comparison tag "V = V" and subtitle "Loopback passes". B must be visually amber marked wrong location, not success. BOTTOM PANEL label "Independent location check". Left card "Expected: V belongs at A". Right two-cell memory depiction repeats exactly "A: Not written" and "B: V stored". Comparison arrow from expected card to A and clearly visible amber annotation "Location mismatch". Do not show V flowing to A. Footer "A, B, V are teaching symbols · Equal values do not prove the correct location". No green all-passed assertion.
```


