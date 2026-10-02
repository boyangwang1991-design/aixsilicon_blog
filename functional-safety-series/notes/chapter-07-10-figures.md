# 第 07–10 章中文讲解图记录

内部编辑资料。2026-10-01 制作；所有图片为机制/时序概念示意，不代表真实 IP、芯片波形、覆盖率或产品界面。用户要求只做中文和正文讲解图，因此未制作英文图或封面。ImageGen 使用 Codex 内置工具；第 07 章访问图在检查生成草图的箭头歧义后改用可编辑 SVG 绘制，未选用草图不进入正文。

| 章节与用途 | 最终资源路径（相对本系列） | SHA-256 |
| --- | --- | --- |
| 07 访问、巡检、响应与报错路径；原生 SVG | `assets/generated/chapter-07-access-paths.svg` | `74BD6EB3E43AEB087E9CB8011FDDC01D31EF19447F058E9035B87D168D7BBC52` |
| 07 ECC、MBIST、repair 机制对照；ImageGen | `assets/generated/chapter-07-mechanisms.png` | `8E31E8D2C8E8470860F80AF325387E15592A5830B1420CEB972E9D473152341F` |
| 08 比较门控与共同错误输入；ImageGen 修订 | `assets/generated/chapter-08-lockstep-gate.png` | `2015B1D2AF686B45D705D6C0504686A86583EFBF4474A4FF2A1936FF364A2DF4` |
| 09 窗口、过早/按时/过晚服务及任务进度；ImageGen | `assets/generated/chapter-09-window-timeline.png` | `CB65F781CB8297EE2E732D10D51C7D6AEDF0233FCB86BA08A1FFB9E9FE6EAD94` |
| 10 主功能与监控器的参考源、供电、复位依赖；ImageGen 修订 | `assets/generated/chapter-10-dependency-map.png` | `1ECA3A815C095786CE5785DA4E47020F4A6815006BBE7C2611891CC778FDDA06` |
| 10 缓降和速降的预警、动作与可靠区间；ImageGen | `assets/generated/chapter-10-brownout-timing.png` | `4B7414A3594C57C52615C8A3323BF1EA6D7CA297E2548F6A534521403A0646F1` |

## 图 07-1：访问路径

最终绘制规格：横向浅色底、深蓝模块、青色受控数据响应、琥珀色错误事件。总线请求依次进入地址检查/初始化门控、访问仲裁、ECC 编解码、SRAM 阵列；读取码字回到 ECC，数据与状态经过响应门控返回同笔总线事务，错误事件另行经锁存送 Error Manager。巡检作为访问发起方进入仲裁，纠正后回写也要重新仲裁。MBIST/repair 用虚线框表示可选能力。不得画出巡检绕过仲裁的直接写回，也不得从 Error Manager 引出数据无效路径。源图即 `chapter-07-access-paths.svg`。

## 图 07-2：三种机制

内置 ImageGen 最终提示词：`Use case: infographic-diagram. Asset type: inline Chinese technical blog figure, wide 16:9, crisp high-contrast engineering diagram on warm white background. Answer one question: ECC, MBIST, and BISR/repair each provide what evidence, at what time? Draw three clear side-by-side vertical panels (no large full-page title): panel 1 navy/teal “ECC” with labels “触发：正常读取”, “检查：当前码字”, “结果：纠正 / 检出”, “边界：未访问位置仍潜伏”; panel 2 amber/navy “MBIST” with labels “触发：制造 / 启动测试”, “动作：读写测试模式”, “结果：发现阵列缺陷”, “边界：通常改写内容”; panel 3 neutral/navy “BISR / repair” with labels “触发：缺陷定位后”, “动作：冗余行列替换”, “结果：改变存储映射”, “边界：非运行期诊断”. At the bottom a thin flow ‘MBIST 发现缺陷 → 修复决策 → 重新核对逻辑地址与 ECC 绑定’, clearly presented as possible workflow rather than automatic or always present. All text simplified Chinese apart from technical acronyms, big enough for phone; exact spelling, minimal prose, generous margins. Deep navy structural elements, teal for detected/corrected, amber for candidate defect, grey for limitations. No logos, chapter number, presentation header, coverage percentages, fabricated claims, generic chip ornament.`

生成源：`C:\Users\wangb\.codex\generated_images\01a0f5ec-cce7-7f92-a3ab-2d1e940e3998\exec-a13be7cc-4d1d-4da5-907d-e07406cb88e4.png`。核对：三列触发时机、对象、结果和边界与正文一致；底部为可能流程，非必选功能。

## 图 08：Lockstep

内置 ImageGen 最终提示词：`Use case: infographic-diagram. Asset type: inline Chinese technical blog illustration, landscape near 16:9. Technical question: why must a lockstep comparison gate outward writes, and why can common-mode wrong inputs escape? Two clearly separated horizontal scenes on warm white background, navy CPU modules, teal detection/gating, amber divergence, red only unsafe escaped write. Upper scene: CPU A and delayed CPU B each produce a write request. A: address REG_DISABLE, data 1. B: address REG_ENABLE, data 1. Their requests enter an “对齐与比较” module that compares “写使能 + 地址 + 数据”, then one output branch labelled “一致 → 放行写入” and the other labelled “不一致 → 阻断 + 报警”; put an explicit “暂存写请求” gate BEFORE the external peripheral. The A/B address mismatch must visibly go to the block branch, no misleading route to peripheral. Lower scene: one “共同错误输入” forks to both CPU A and CPU B, both generate the same wrong value, “比较相等” while a side note says “相等不证明正确”. Keep text short, all simplified Chinese except CPU and register identifiers, huge legible labels, wide safe margins. No large whole-image title, no chapter label, no presentation decorations, no real product screenshot, no percentages, no claim of guaranteed independence. Palette deep navy structure, teal blocking, amber error, grey assumptions.`

定向修订提示词：`Targeted label and timing correction only. Keep the entire two-scenario Chinese lockstep diagram and all CPU A/B addresses, comparison branches, and shared-error scene unchanged. On both upper and lower paths, the teal block just BEFORE 外设 is currently labelled “暂存写请求（门控）”, misleading because it appears after comparison. Replace its label with “输出门控”; show that external write enable passes only after comparison grants permission. Do not claim this block itself stores the request after the comparison. Keep the upper mismatch branch blocked and unable to reach 外设. No other content or layout changes, no new text.`

最终生成源：`C:\Users\wangb\.codex\generated_images\01a0f5ec-cce7-7f92-a3ab-2d1e940e3998\exec-0c00820d-771b-4fcd-8c64-bb7534627b5e.png`。核对：地址分歧阻断外设写；输出门控位于比较之后；共享错误输入下比较相等，不暗示结果正确。

## 图 09：Watchdog

内置 ImageGen 最终提示词：`Use case: scientific-educational. Asset type: Chinese technical blog inline timing diagram, wide landscape around 16:9, warm white background. Answer: how does a window watchdog distinguish early, accepted, and late service, and why should service depend on actual task progress? Draw one large horizontal time axis from left to right with three adjacent clearly colored intervals labelled exactly “封闭窗口”, “开放窗口”, “超时”. Above timeline place three service marks at clearly different locations: in closed interval “过早服务 → 报错”, in open interval “按时服务 → 接受”, after end “未服务 / 过晚 → 报错”. Below time axis make a second thin swimlane of simplified Chinese task stages in sequence “采样有效 → 输入检查 → 控制计算 → 输出提交 → 允许喂狗”; use one dashed arrow from “允许喂狗” to the accepted service mark, indicating service qualification from progress. Small side callout: “定时中断仍运行 ≠ 关键任务完成”. Use deep navy structures, teal accepted path, amber early/late problems, red only for error event. No actual time numbers or fixed proportions, no full-page headline/chapter number, no presentation frame, large crisp Chinese labels, generous whitespace, no decorative CPU or chip, no claims about a particular hardware implementation. Exact labels and arrow meanings matter.`

生成源：`C:\Users\wangb\.codex\generated_images\01a0f5ec-cce7-7f92-a3ab-2d1e940e3998\exec-e60c9711-c453-487b-92f2-4d7406fed99c.png`。核对：三段窗口与三类服务结果一致；进度许可连接到开放窗口服务。

## 图 10-1：监控依赖

内置 ImageGen 最终提示词：`Use case: infographic-diagram. Asset type: Chinese technical blog inline dependency diagram, wide landscape 16:9, warm light background, deep navy modules, teal monitoring/controlled path, amber shared upstream risk, grey unverified assumptions. Answer: what resources does a clock, reset, and voltage monitor itself rely on? Make three horizontal rows, each with a function on the left, distinct monitor on right, and clearly directed observation arrows: row 1 “主时钟 → CPU” with “参考时钟 → 时钟监控器” and arrow labelled “测目标时钟活动” from main clock to monitor; row 2 “核心电源 → CPU / SRAM” with “参考电压 + 监控器供电 → 电压监控器” and observation of core rail; row 3 “复位源 → 受控模块” with “下游复位反馈 → 复位监控器”, monitor compares command and observed effect. Three monitors send event-only arrows to a shared “错误管理 / 硬件隔离” at far right. At bottom amber dashed callout “共同上游电源 / 参考异常可能同时影响功能与监控”, with dashed connection to relevant sources but do not imply all are independent. Label “按目标芯片核实供电与复位依赖” in small legible text. No full-page large title or chapter number, no generic chip ornament, no thresholds or coverage claims, no false guaranteed-detection checkmarks. Large readable simplified Chinese typography; arrows technically correct and uncluttered.`

定向修订提示词：`Targeted technical correction. Preserve this Chinese dependency diagram's layout, labels, colors and most content. In the TOP CLOCK ROW only, REMOVE the grey vertical connection/dot that appears to connect the main clock signal directly down into the reference clock block. Show “主时钟” and “参考时钟” as two separate inputs to “时钟监控器”: main clock is measured, reference clock provides counting basis. Their possible common upstream dependence remains only the dashed amber “共同上游电源” callout, not a direct electrical line between them. Keep all other rows unchanged. Ensure arrows and Chinese labels stay legible; no new title or chapter number.`

生成源：`C:\Users\wangb\.codex\generated_images\01a0f5ec-cce7-7f92-a3ab-2d1e940e3998\exec-57e2ce96-1e82-4166-8cd7-738d14cea7c1.png`。核对：主时钟与参考时钟分开输入；下方共用供电仅标示可能依赖，不代表必定共源。

## 图 10-2：欠压响应时序

内置 ImageGen 最终提示词：`Use case: scientific-educational. Asset type: Chinese technical blog inline concept timing figure, wide landscape 16:9, precise clean vector-like line art on light background. Answer: why does a slow brownout sometimes allow software reaction but a fast supply collapse need a hardware safe path? Make TWO separate side-by-side scenarios, each with a descending core-voltage curve versus time: left “缓慢下降” descending gently, right “快速跌落” descending steeply. Across each panel show two horizontal reference lines with labels “预警阈值” higher than “复位阈值”; no numeric voltages, no equal durations asserted. On the left, show three ordered event markers on time axis: “预警”, “软件动作完成”, “复位/隔离”; clearly software action occurs before the core becomes unreliable only in this illustrative slow case. On the right show “预警” then almost immediately “功能不再可靠”; a teal hardware path “硬件隔离 / 复位” should act to keep outputs controlled, do not claim software completes. Include small legend distinguishing voltage curve, prewarning, hardware action. Deep navy labels, teal safe action, amber falling voltage, red only for unreliable zone. Chinese simplified text exact, big phone-readable labels, generous margins; no page title, no Chapter number, no fake numerical timing or thresholds, no product graph/simulation claim, no generic chip visuals.`

生成源：`C:\Users\wangb\.codex\generated_images\01a0f5ec-cce7-7f92-a3ab-2d1e940e3998\exec-acbda4a6-2d9d-4525-ab19-cf79a834910e.png`。核对：两种下降速度的事件顺序与正文一致；阈值和时间无具体数值，功能可靠边界为教学假设。

## 技术依据与剩余核对

标准范围依据内部 `standards-audit.md` 中的 ISO 26262-5:2018 与 Part 11:2018 核对记录；正文只链接 ISO 官网。窗口机制与任务签名的公开器件例子核对 AMD 官方手册：[窗口模式](https://docs.amd.com/r/en-US/am026-versal-ai-edge-prime-gen2-trm/Window-Watchdog-Timer-Mode)、[AXI Timebase Watchdog](https://docs.amd.com/api/khub/documents/Woso12Sanyrs~0MQKp1nYA/content)。延迟 lockstep 的器件例子核对 [Infineon AURIX 功能安全说明](https://documentation.infineon.com/aurixtc3xx/docs/owq1745576218449)。电压 supervisor 与 brownout 提前告警核对 [TI supervisor 指南](https://www.ti.com/lit/sg/slyt361h/slyt361h.pdf)和 [TI 提前告警资料](https://www.ti.com/document-viewer/lit/html/SSZTAQ7/GUID-CD23080D-D75F-43C5-A90C-6B45DF979F50)。以上资料不证明本系列候选 IP 的实现状态；目标宏映射、双核对齐、watchdog 配置和芯片供电时序仍需真实工程资料。
