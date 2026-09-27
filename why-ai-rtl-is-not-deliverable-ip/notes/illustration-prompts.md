# 讲解图生成记录

工具：Codex 内置 imagegen。日期：2026-09-27。用途：概念插画，不作为仿真、测量或真实产品证据。生成原件保留；采用版本复制到 assets/generated。完整记录及哈希见 sources.json。

## 01-first-read-zh · v2 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-3a0d9fd4-1a1f-40c8-9c71-37f3be8aa19d.png`

成图：`assets/generated/01-first-read-zh.png`

初始提示词：

```text
Use case: scientific-educational. Premium technical teaching infographic, landscape 4:3, off-white canvas, navy sans-serif text, teal connections and amber warning accents. Clear geometric cards and subtle dimensional document/buffer icons, generous whitespace, large mobile-readable labels. Two horizontal panels showing before and after a READ command preparation fix. Conceptual mechanism only; no invented register addresses, no bus waveforms, no actual simulation screenshots. Strict technical rule: READ uses no write payload. Before fix an uninitialized write buffer supplies an irrelevant data field X to the command and its parity generation/checking, causing an unknown dependency. After fix READ command data and the data input to parity generation both use 0; the write buffer remains unreset and is not used for READ. X is a simulation unknown, NOT a detected bit flip or certain parity mismatch. Do not draw logic gates or bit equations. All text exactly as supplied, no extra slogans or values. All explanatory text Simplified Chinese, keep READ and X. Title "首条 READ，为何依赖写缓存？". Top panel title "修正前：无关数据进入校验". A left rectangle "未初始化写缓存" and "X" flows to a central branching junction labelled "READ 数据字段", then branches to two rectangles "命令数据" and "校验输入", both marked X. Far right amber note "未知值影响命令发出". Bottom panel title "修正后：READ 使用确定值". A left grey buffer rectangle "写缓存" and beneath it "READ 不使用", no connecting arrow from that buffer. Next to it a teal source circle "0" flows to the same branching junction labelled "READ 数据字段", branching to "命令数据" and "校验输入", both marked 0. Far right note "同步修改数据与校验输入". Footer "原理示意 · X 表示四态仿真中的未知值". Make both branches clear; do not imply parity of all command fields is zero, only its data input is zero.
```

修订输入：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-1bcc957c-bc82-4a11-b05c-628dad1e7ea3.png`

修订提示词：

```text
Edit this teaching diagram preserving layout, all arrows, colors and all other text. In BOTH panels change the box label 校验输入 to 校验的数据输入, so it is explicit that only the data portion of the parity calculation is shown. In the bottom corrected panel only, replace the orange warning-triangle icon by a neutral navy document icon (the repair is not an error). Keep top warning icon. Keep 0 and X values unchanged; never imply whole command parity equals zero. Render crisp Simplified Chinese. No other changes.
```

## 01-first-read-en · v1 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-61757f2a-2d64-41e5-9b5f-8a49a0704d30.png`

成图：`assets/generated/01-first-read-en.png`

初始提示词：

```text
Use case: scientific-educational. Premium technical teaching infographic, landscape 4:3, off-white canvas, navy sans-serif text, teal connections and amber warning accents. Clear geometric cards and subtle dimensional document/buffer icons, generous whitespace, large mobile-readable labels. Two horizontal panels showing before and after a READ command preparation fix. Conceptual mechanism only; no invented register addresses, no bus waveforms, no actual simulation screenshots. Strict technical rule: READ uses no write payload. Before fix an uninitialized write buffer supplies an irrelevant data field X to the command and its parity generation/checking, causing an unknown dependency. After fix READ command data and the data input to parity generation both use 0; the write buffer remains unreset and is not used for READ. X is a simulation unknown, NOT a detected bit flip or certain parity mismatch. Do not draw logic gates or bit equations. All text exactly as supplied, no extra slogans or values. All explanatory text English. Title "Why did the first READ depend on the write buffer?". Top panel title "Before: irrelevant data enters the check". Left rectangle "Uninitialized write buffer" and "X" flows to a central branching junction labelled "READ data field", then branches to two rectangles "Command data" and "Data input to parity", both marked X. Far right amber note "Unknown value affects command issue". Bottom panel title "After: READ uses a defined value". Left grey buffer rectangle "Write buffer" and beneath it "Not used by READ", no connecting arrow from that buffer. Next to it teal source circle "0" flows to the same branching junction labelled "READ data field", branching to "Command data" and "Data input to parity", both marked 0. Far right note "Update data and parity input together". Footer "Conceptual illustration · X denotes an unknown in four-state simulation". Both branches clear; do not imply parity of all command fields is zero, only its data input is zero.
```


## 02-check-scope-zh · v1 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-27462f70-1329-4a7a-b14f-ee853f1a65ef.png`

成图：`assets/generated/02-check-scope-zh.png`

初始提示词：

```text
Use case: scientific-educational. Polished engineering teaching infographic, 4:3 landscape, warm off-white canvas, navy sans-serif, teal lines and amber scope notes, restrained dimensional cards. Very legible mobile typography, generous whitespace. Three independent horizontal rows, NOT a waterfall and no arrow between rows. Each row shows inputs on the left, the question in a central large card, and output on the right. No checkmarks, no numeric scores, no graphs or fictitious measurements. Only exact text supplied. This is an explanation of check types, not a report of completed runs. All text Simplified Chinese except RTL. Title "检查通过，究竟通过了什么？". Row 1 left "RTL + 参数", center heading "展开检查", question "参数展开后，结构是否合法？", right "结构检查结果". Row 2 left "设计 + 激励 + 预期", center heading "功能仿真", question "施加场景下，行为是否符合预期？", right "场景执行结果". Row 3 left "RTL + 库 + 约束", center heading "综合表征", question "给定条件下，电路如何映射？", right "面积与时序估计". Each row arrows strictly left → center → right. Footer amber band "检查范围不同，结果不可互换". No counts or data from any project.
```


## 02-check-scope-en · v1 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-7794f674-edc9-4646-ac15-1a170f6897a4.png`

成图：`assets/generated/02-check-scope-en.png`

初始提示词：

```text
Use case: scientific-educational. Polished engineering teaching infographic, 4:3 landscape, warm off-white canvas, navy sans-serif, teal lines and amber scope notes, restrained dimensional cards. Very legible mobile typography, generous whitespace. Three independent horizontal rows, NOT a waterfall and no arrow between rows. Each row shows inputs on the left, the question in a central large card, and output on the right. No checkmarks, no numeric scores, no graphs or fictitious measurements. Only exact text supplied. This is an explanation of check types, not a report of completed runs. All text English. Title "A check passed. What did it establish?". Row 1 left "RTL + Parameters", center heading "Elaboration", question "Is the expanded structure legal?", right "Structural check results". Row 2 left "Design + Stimulus + Expectations", center heading "Functional simulation", question "Does behavior match in applied scenarios?", right "Scenario execution results". Row 3 left "RTL + Library + Constraints", center heading "Synthesis characterization", question "How does the circuit map under these conditions?", right "Area and timing estimates". Arrows strictly left → center → right within each row. Footer amber band "Different scopes · Results are not interchangeable". No project counts or data.
```


## 03-handoff-zh · v1 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-dc87c9ae-4c14-4ed3-bc5e-d110ab202e7f.png`

成图：`assets/generated/03-handoff-zh.png`

初始提示词：

```text
Use case: scientific-educational. Professional teaching infographic, 4:3 landscape, warm off-white, navy sans-serif text, teal completed progress, amber intervention, light gray not-started actions. Large mobile-readable labels, clean three-stage transaction timeline in upper half and responsibility cards in lower half. Conceptual illustration ONLY; no measured times, no cycle counts, no actual simulation waveform, no extra data or slogans. Critical semantics: ordinary SPI abort with APB NOT in reset. Past APB transfers retain effects; the already active APB transfer is allowed to finish; no new transfers start afterward. The abort is NOT a rollback. Software uses available status and peripheral semantics to determine recovery; do NOT imply same aborted SPI frame delivers a response. System provides clocks resets and implementation constraints. All explanatory text Simplified Chinese except SPI, APB, IP. Title "中止一笔写入，谁负责接下来的事？". Upper subheading "普通 SPI 中止 · APB 未复位". Timeline left to right: teal block "已完成的拍" with subtitle "副作用保留"; center block "当前 APB 拍" subtitle "按协议完成"; gray right block "后续拍" subtitle "不再启动". An amber downward event arrow labelled "SPI 中止" points INTO the center block before its right boundary. No arrow that terminates current APB halfway. Lower half three large cards: "IP" text "处理当前拍与停止边界"; "软件" text "结合可用状态和外设语义恢复"; "系统" text "提供时钟、复位与实现约束". Separate thin arrows from 系统 to IP labelled "集成条件", and from IP to 软件 labelled "状态语义". Footer "中止不回滚已完成写入 · APB 复位另有边界". Do not draw a direct readback response in the aborted frame.
```


## 03-handoff-en · v1 · 采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-1be407af-0563-4915-a3c9-845443613edb.png`

成图：`assets/generated/03-handoff-en.png`

初始提示词：

```text
Use case: scientific-educational. Professional teaching infographic, 4:3 landscape, warm off-white, navy sans-serif text, teal completed progress, amber intervention, light gray not-started actions. Large mobile-readable labels, clean three-stage transaction timeline in upper half and responsibility cards in lower half. Conceptual illustration ONLY; no measured times, no cycle counts, no actual simulation waveform, no extra data or slogans. Critical semantics: ordinary SPI abort with APB NOT in reset. Past APB transfers retain effects; the already active APB transfer is allowed to finish; no new transfers start afterward. The abort is NOT a rollback. Software uses available status and peripheral semantics to determine recovery; do NOT imply same aborted SPI frame delivers a response. System provides clocks resets and implementation constraints. All explanatory text English. Title "A write is interrupted. Who handles what follows?". Upper subheading "Ordinary SPI abort · APB is not in reset". Timeline left to right: teal block "Completed transfers" subtitle "Effects remain"; center block "Active APB transfer" subtitle "Completes by protocol"; gray right block "Later transfers" subtitle "Do not start". Amber downward event arrow labelled "SPI abort" points INTO the center block before its right boundary. Never stop the active APB transfer halfway. Lower half three large cards: "IP" text "Finish the active transfer; stop new ones"; "Software" text "Recover using available status and peripheral semantics"; "System" text "Supply clocks, resets and implementation constraints". Separate thin arrows from System to IP labelled "Integration conditions", and IP to Software labelled "Status semantics". Footer "Abort does not undo completed writes · APB reset has a different boundary". Do not draw a direct response within the aborted frame.
```


## 01-first-read-zh · v1 · 未采用

输出原件：`C:\Users\wangb\.codex\generated_images\01a0e1e9-5658-70b2-8753-bbbaf425eff0\exec-1bcc957c-bc82-4a11-b05c-628dad1e7ea3.png`

初始提示词：

```text
Use case: scientific-educational. Premium technical teaching infographic, landscape 4:3, off-white canvas, navy sans-serif text, teal connections and amber warning accents. Clear geometric cards and subtle dimensional document/buffer icons, generous whitespace, large mobile-readable labels. Two horizontal panels showing before and after a READ command preparation fix. Conceptual mechanism only; no invented register addresses, no bus waveforms, no actual simulation screenshots. Strict technical rule: READ uses no write payload. Before fix an uninitialized write buffer supplies an irrelevant data field X to the command and its parity generation/checking, causing an unknown dependency. After fix READ command data and the data input to parity generation both use 0; the write buffer remains unreset and is not used for READ. X is a simulation unknown, NOT a detected bit flip or certain parity mismatch. Do not draw logic gates or bit equations. All text exactly as supplied, no extra slogans or values. All explanatory text Simplified Chinese, keep READ and X. Title "首条 READ，为何依赖写缓存？". Top panel title "修正前：无关数据进入校验". A left rectangle "未初始化写缓存" and "X" flows to a central branching junction labelled "READ 数据字段", then branches to two rectangles "命令数据" and "校验输入", both marked X. Far right amber note "未知值影响命令发出". Bottom panel title "修正后：READ 使用确定值". A left grey buffer rectangle "写缓存" and beneath it "READ 不使用", no connecting arrow from that buffer. Next to it a teal source circle "0" flows to the same branching junction labelled "READ 数据字段", branching to "命令数据" and "校验输入", both marked 0. Far right note "同步修改数据与校验输入". Footer "原理示意 · X 表示四态仿真中的未知值". Make both branches clear; do not imply parity of all command fields is zero, only its data input is zero.
```
