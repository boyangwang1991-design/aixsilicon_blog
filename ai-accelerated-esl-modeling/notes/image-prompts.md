# ESL 配图生成记录

图 5 后续重做为真实指标对照与 port 0 任务尾部解释，正文采用 `assets/generated/03-evidence-to-decision-zh-v2.png`。最终提示词及口径见 [图 5 修订记录](figure-5-revision.md)。下方原图 3（正文图 5）的提示词仅保留为历史记录。

## 图 2 的最终修订

重新布线版本误删了反压通路，未采用，保存为 `assets/generated/drafts/02-npu-sram-model-zh-v2.png`。最终回到图 2 中文初稿，只修正计算语义与加载标签，保留原有模型级反馈箭头及反压通路。

```text
Make a minimal text-only correction to this Chinese ESL model infographic. Preserve EVERY existing arrow, line, module, color, layout and all other text pixel-for-pixel as closely as possible, especially the dashed blue backpressure arrow at the bottom and the original green upward feedback arrow. Change ONLY these three text items: (1) inside the green upper '计算' box replace '使用数据进行 NPU 计算' with '按假设推进计算时间', centered and clear; (2) in the overlapping task inset change '任务 i' to '加载 i'; (3) change '任务 i+1' to '加载 i+1'. Do not reroute, remove or add any arrows. Do not change任何其他文字、模块或排版. This is a resource simulation model, not numerical computation. Chinese text must remain readable.
```

## 第一轮定向修订提示词（图 1 采用；图 2 由上节替代）

图 1 初稿自动添加了无来源数字与示意图表，图 2 初稿的计算说明和反馈箭头不够准确。两张初稿保留在 `assets/generated/drafts/`，不用于正文。以下修订在各自的中文初稿上进行，图 3 采用初始生成版本。

### 图 1 修订

```text
Edit this Chinese ESL workflow infographic. Preserve the overall title, four columns, colors, role bands, main workflow arrows, and visual style. Correct only invented data/technical implications and small text. In column 3 replace the entire numeric experiment matrix table with a clear non-numeric checklist panel heading '实验组合' and three items '固定基线', '只改目标参数', '记录实际配置'. No example rows, sample numbers or variable data. In column 4 replace ALL chart panels (bar chart, donut chart, sensitivity chart and resource numbers table) with FOUR equally attractive illustrated TEXT cards; no chart axes or sample measurements anywhere: card1 heading '任务完成时间', body '在同一负载下比较方案'; card2 heading '等待原因', body '结合任务时间线定位'; card3 heading '资源预算', body '检查队列与容量开销'; card4 heading '适用条件', body '换一组负载验证结论'. Use large readable Chinese and simple semantic icons. In column1 replace '满足功耗/面积约束' with '满足资源预算约束', and replace '面积 · 功耗 · 时钟频率' with '容量 · 带宽 · 队列深度'. In column3 replace '独立参考模型（功能与统计对照）' with '独立参考检查（数据与统计对照）'. Remove all tiny decorative corner slogans so text is cleaner and mobile-readable. Preserve core technical names and strong graphic hierarchy. There must be NO fabricated data values, no plots, no numeric performance or PPA estimates. All other content remains unchanged.
```

### 图 2 修订

```text
Edit this Chinese NPU resource model infographic while preserving its entire composition, title, modules, color palette, and all existing labels except for the following precise changes. In the top central green '计算' module replace the explanatory text '使用数据进行 NPU 计算' with exactly '按假设推进计算时间'. In the upper right overlapping-task inset, replace blue labels '任务 i' and '任务 i+1' with '加载 i' and '加载 i+1' to match load-compute-store. Strengthen the completion feedback route: a clear thin teal arrow should originate at the rightmost lower '返回与重组' module, travel upward outside the right edge of the SystemC group and along the gap between layers, then point into the bottom of upper green '计算' module; label it '实际完成后释放依赖'. Remove the existing feedback arrow that originates at an unspecified empty place on the SystemC boundary, replacing it with this correctly anchored arrow without crossing text. Keep all other request and backpressure arrows unchanged. Diagram describes a traffic/resource model; do not suggest mathematical NPU operations are executed. Legible Chinese, no other modifications.
```

## 初始生成过程

生成日期：2026-09-26。使用 Codex 内置 imagegen 文生图，无 CLI/API 密钥调用。PQC 配图作为信息组织参考：完整模块、明确箭头与解释层次；本次生成没有将 PQC 图作为编辑目标。

主图均以简体中文说明章节理念。原始运行数据图保持原样；概念图不充当仿真或测量证据。

## 图 1

文件：`assets/generated/01-ai-esl-workflow-zh.png`。

初始生成提示词（图 1、图 2 另见文末最终修订）：

```text
Use case: scientific-educational. Generate a complete Chinese explanatory infographic for a public engineering blog on AI-assisted chip development. Wide landscape about 3:2, generous white background, professional textbook clarity combined with subtle dimensional technical illustration, dark navy typography, blue control/process, teal modeling, amber evidence. Inspiration: an excellent complete chip architecture or educational diagram, not a decorative cover. All labels simplified Chinese except established names AI, ESL, RTL, SystemC, Python. Exact heading: “让 AI 把架构问题变成可验证的实验”. Top short question strip: “Bank 怎么分？地址怎么映射？队列多深？”. Main four connected numbered stages with clear left-to-right arrows, each a well-sized illustrated module: “定义问题” with smaller “目标 · 基线 · 约束”; “搭建模型” with smaller “SystemC 资源模型” and “Python 负载与依赖”; “运行实验” with smaller “配置检查 · 独立参考 · 参数对照”; “比较与决策” with smaller “任务时长 · 等待原因 · 资源预算”. Show a long feedback arrow from final stage back toward define stage labeled “证据反馈，调整下一轮问题”. Bottom two horizontally aligned role bands, visual person/decision icon versus software modules, exact text “工程师：设定边界，判断取舍” and “AI：协助建模、补测试、组织实验、解释结果”. Footer insight in a restrained colored band “在 RTL 实现之前，让架构选择先接受实验检验”. Every section has meaningful hierarchy and spacing. Crisp legible Chinese large enough on a phone, no dummy text, no fabricated performance claims, no robots, no holographic brains, no watermark. Draw an explanatory framework, not a real tool screenshot.
```

## 图 2

文件：`assets/generated/02-npu-sram-model-zh.png`。

最终提示词：

```text
Use case: scientific-educational. Generate a polished COMPLETE Chinese explanatory architecture illustration for an ESL blog. Landscape 3:2, white background, dark navy large readable Chinese, color-coded blue control, teal compute/time model, amber storage, tasteful subtle 3D dimension, clean arrows and excellent spacing. Exact title “一次访存，怎样影响整个 NPU 任务？”. Top layer a prominent horizontal workflow with three tiles and arrows “加载数据” → “计算” → “写回结果”, grouped under “NPU 任务依赖”; include a small second tile sequence illustrating overlapping tasks and label “有限双缓冲，约束任务推进”. Middle layer grouped “SystemC 时间与资源模型”, with four clear modules connected left to right “请求拆分” → “有限队列与网络” → “SRAM Bank 服务” → “返回与重组”. Under storage block show several orderly amber bank tiles and label “多 Bank 组织”. Label input down-arrow from upper 加载数据 into 请求拆分 “访存请求”; label return arrow from 返回与重组 back up to upper 计算 “实际完成后释放依赖”. Additional fine dashed feedback arrow from right hand 返回与重组 toward 有限队列与网络 labeled “容量不足，反压向前传递”. Side mini card “Python” and below “生成地址与依赖” with arrow INTO NPU任务依赖, outside SystemC resource model. Bottom three compact insight boxes “观察任务完成时间”, “检查资源竞争与等待”, “比较不同架构方案”. Small footer “资源模型示意，非实际芯片版图”. The diagram should stand on its own and teach interplay of workload feedback and shared resource contention. Do not imply Python computes hardware timing. Avoid invented signal-level interface pins, numbers, simulation charts and logos.
```

## 图 3

文件：`assets/generated/03-evidence-to-decision-zh.png`。

最终提示词：

```text
Use case: scientific-educational. Create a complete clear Chinese teaching infographic about evidence-based architectural optimization for an AI-assisted ESL engineering blog. Landscape 3:2. White/ivory background, crisp navy Chinese, teal and amber highlights, restrained soft dimensional effects; tasteful and technically legible like a high-end chip design explainer. Exact heading “看见局部收益，也看清系统关键路径”. Top has a compact explanatory sentence “访存更快，是否让整个任务更早结束？”. Main center has TWO aligned hypothetical dependency timelines with a common start and common finish, no numeric axes and no actual simulation data. Upper row title “优化前”, lower row “优化后”. Each row has three parallel branches: two short teal branches labeled “可提前完成的任务”; one long amber branch of three serial blocks labeled “决定结束时刻的依赖链”. In lower row only teal branches shorten; the long amber chain retains identical left/right positions and identical end. Shared dashed vertical finish marker across both rows label “总完成时间不变”. Proper thin dependency arrows connect task blocks and join final completion. Below diagram show three generously sized evidence cards linked left to right: “局部指标” smaller “事务延迟是否下降”; “任务时间线” smaller “哪条依赖链最后完成”; “下一轮实验” smaller “对照调度、布局与资源配置”. Bottom emphasized conclusion “AI 辅助分析：把指标变化转化为下一步设计问题”. Small footer “原理示意，不对应本项目实际 DAG 或测量数值”. Labels must be clean correctly written Chinese. This is a concept explanation, never imply actual gain or fabricate measured numbers; no robot imagery, no watermark.
```

## 未采用的初稿

最初生成的无字封面和英文 BEFORE/AFTER 图未采用，保留在 `assets/generated/drafts/` 供回溯；正文只使用上述中文讲解图。

### 初稿 1

```text
Use case: editorial illustration. Create a premium wide landscape 16:9 editorial cover for a Chinese engineering blog about AI-assisted electronic system level modeling of NPU shared SRAM. Main visual: a precise miniature architectural study model on a warm off-white drafting surface; a central array of teal SRAM bank blocks with neatly routed data paths, several translucent alternative routing structures hovering as discrete candidate models above it, and one amber path extending toward an abstract compute tile. Communicate testing architectural hypotheses before committing to silicon. Sophisticated technical magazine art, isometric perspective, tactile frosted glass and anodized metal, restrained teal, charcoal, copper amber, soft natural shadows, exceptionally clear composition and generous whitespace, editorial sophistication rather than sci-fi spectacle. It is a conceptual model, not a physical chip floorplan or measured simulation. No humanoid robot, brains, magic AI glow, motherboard stock photo, charts, digits, performance claims, labels, text, watermarks or logos. Keep focal content centrally placed for flexible cover crops.
```

### 初稿 2

```text
Use case: scientific-educational editorial illustration. Create one beautiful wide landscape 16:9 conceptual infographic for an engineering blog: reducing memory waiting on one part of a task graph does not necessarily shorten the longest dependent chain. Two neatly aligned panels, stacked vertically on warm ivory background. Upper panel exact small label 'BEFORE', lower panel 'AFTER'. Each panel shows the SAME abstract task dependency graph with three branches sharing the same start point at the far left and finish at far right. A central amber critical branch has three long serial rounded task blocks and stays IDENTICAL length and position in both panels, reaching the common finish. Two secondary teal branches above/below the amber branch finish early; in AFTER these teal blocks become modestly shorter and their remaining unused space longer, while the long amber branch and final completion marker stay fixed. Connect branches to common final completion with fine pale grey dependency lines. Elegant clean dimensional paper-cut technical illustration, subtle shadows, generous margins, crisp teal and amber contrast, readable on phone, no decorative circuitry. Only words allowed: BEFORE, AFTER. No numeric axes, no charts posing as measured data, no performance percentages, no task labels, no watermark. This is an explanatory schematic, not the measured project's exact DAG or waveform. Emphasize identical total span despite local improvement.
```
