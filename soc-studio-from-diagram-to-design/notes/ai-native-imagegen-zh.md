# AI Native 概念图生成记录（内部）

日期：2026-09-29。工具：Codex 内置 imagegen（文生图 / 参考图编辑）。五张图片均以用户提供的原始概念图为编辑目标，原图保留。图 1 使用用户明确指定的 exec-d9a9fdf2 版本；其余图片沿用同一系列的信息图风格。图片均为目标示意，不能作为产品功能或硬件验证证据。

| 序号 | 生成文件 | 原始参考 | 生成结果 ID | 用途 |
| --- | --- | --- | --- | --- |
| 1 | assets/generated/ai-native-01-engineering-model-zh.png | 03_53_30-1.png | exec-d9a9fdf2-e21b-42e9-8d07-b30e7b8ca4d1 | 文件孤岛到共同工程模型 |
| 2 | assets/generated/ai-native-02-architecture-zh.png | 03_53_31-2.png | exec-f7350bb3-7cc3-4f84-9727-070af7b8e93a | 浏览器、后端、工具分层 |
| 3 | assets/generated/ai-native-03-multiple-views-zh.png | 03_53_31-3.png | exec-e8ecc624-d37f-4761-b6c9-a08688762673 | 一份模型的多视图 |
| 4 | assets/generated/ai-native-04-ip-reuse-zh.png | 03_53_32-4.png | exec-3dee17ed-465e-4598-ab1c-aea802694783 | 公共 IP、实例、产物 |
| 5 | assets/generated/ai-native-05-evidence-chain-zh.png | 03_53_33-5.png | exec-85e95686-0200-412e-b207-0247072efa43 | 设计意图到执行证据 |

## 最终提示词

### 图 1

Edit the attached Chinese conceptual infographic, preserving its overall visual composition and polished white/blue editorial diagram style: LEFT '传统 SoC 工程：文件孤岛' with separate RTL/YAML/address/IRQ/script sources; RIGHT 'SoC Studio：统一工程工作台' with a central 工程模型 and surrounding engineering relationships. Keep the image's original topic, density, recognizable modules, and left-to-right comparison. Integrate AI Native into the RIGHT side only: show three peer contributors '工程师', '工具', and 'AI' all feeding the SAME central 工程模型 / SoC integration work; the shared work includes 'IP 生成', 'PARAMETER 配置', '连接与地址'. Add a clear output/inspection area '图形化检查设计结果' on the far right or bottom right, with a conceptual block diagram; arrow from shared model/integration to the graphical inspection area, with feedback toward the shared work. The AI is one collaborator, not a single sequential stage, and the graphical interface is where people inspect the result. Keep original left file-island contrast and the surrounding engineering assets where space permits. Replace any text implying that EDA verification is already complete with neutral conceptual wording; add a small readable qualifier 'AI Native 目标示意'. Use correct, crisp Simplified Chinese; do not invent numbers or fake results, no fake product screenshot, no watermark. Ensure arrows are technically unambiguous. This is an edit target, not merely a style reference; preserve as much of the original illustration as practical while adding the AI Native idea.

### 图 2

Minimal edit to this exact Chinese SoC Studio architecture infographic. Preserve the original 3 wide horizontal layers (1 浏览器/工程工作台, 2 工程后端, 3 已有工程工具), their position, scale, seven/eight cards per layer, arrows, colors, typography and bottom statement. Do not redesign, reflow, resize or replace cards. Integrate AI Native with two small unobtrusive additions: inside the first browser/workbench layer near its header, add a small matching badge '人 / 工具 / AI 协同设计' and subtitle '共同修改工程模型，图形化检查结果'; near the existing middle-layer 工程模型 card add a tiny label '共同工程事实'. Make the idea clear: human, tools and AI are collaborators on the same project model, tools execute engineering tasks, user checks via GUI. Add a small 'AI Native 目标示意' tag in a corner. Existing RTL仿真/Lint/综合/实现 tool cards should remain visually intact but should not be presented as completed current functions. Text crisp Simplified Chinese, no new invented values. This must look nearly identical to the input figure.

### 图 3

Edit the FIRST attached image (一份工程事实，多种视图). The SECOND attached image is the user-approved style/extent of AI Native integration; do not copy its specific layout or content. Preserve the first image's central 工程模型, the radial arrangement of BUS, IRQ, 时钟/复位, 地址空间, 源码, 生成产物, 验证结果, Debug/Alert views, the '不要这样' counterexample, white/blue editorial style, visual density, icons, footer conclusion. Integrate AI Native clearly but naturally: add a compact group 人 / 工具 / AI near the central shared model, showing they all access and update the same engineering facts, and add a graphical inspection/check label to the existing view cards (not a separate sequential AI stage). The concept: 人/工具/AI共同设计 SoC 集成; graphical views allow engineer to inspect design results. Keep all original subject matter. Add a subtle 'AI Native 目标示意' tag. Do not claim that current product already supports AI operations or hardware verification. Simplified Chinese text crisp and readable; no fabricated numerical values. Make it look like an expanded member of the original 5-figure series, as ambitious and detailed as the SECOND approved image.

### 图 4

Edit the FIRST attached Chinese infographic about '复用的是能力，不是代码副本'. The SECOND is a user-approved style reference for adding AI Native ideas. Preserve the original three-column composition 公共 IP Repo -> 工程实例/Instance -> 工程生成产物, the detailed cards, white/blue/green/orange design, arrow flow, bottom copy-paste warning and footer. Integrate AI Native inside the MIDDLE instance panel: a compact but clear 人 / 工具 / AI co-design group configuring an IP instance together, including 'IP 生成' and 'PARAMETER 配置', with a small '图形化检查实例结果' label near the existing topology drawing. Shared Repo defines capability; the project instance owns specific parameter values and connections; generated products belong to that project. IMPORTANT: remove all invented numeric parameter values, addresses and misleading port numbering from the middle panel; replace with neutral unlabeled parameter fields or names only (输入数, 输出数, 数据位宽, 地址映射) and a generic topology with no numbered ports. Do not invent or imply real Aurora data. Add small 'AI Native 目标示意'. Crisp Simplified Chinese, technically correct arrows, preserve original editorial diagram richness rather than simplification.

### 图 5

Edit FIRST attached infographic '从设计意图到执行证据'. SECOND image shows user-approved AI Native expansion style; match the same editorial diagram language, not its layout. Keep the first figure's three horizontal bands: top design intent/IP selection/parameter configuration/connections/address IRQ clock reset/design check; middle execution/evidence from Generate through RTL files and future EDA steps to report; bottom evidence chain input snapshot/command/log/product/report. Preserve detailed white-blue visual style, arrow directions and prominent red stale-evidence loop. Integrate AI Native at the START as 人、工具、AI collectively design SoC integration, including IP 生成 and PARAMETER 配置; integrate '图形化检查设计结果' with the existing top design-check box as the final human inspection point, with feedback to design intent. AI is a collaborator, not a single linear pipeline step. Visually mark Lint/Elaborate/Simulate and 综合/Implementation as '规划' or dashed future steps, since currently only non-EDA source export has been demonstrated. Add small 'AI Native 目标示意'. Do not claim successful EDA, numerical results, or current AI functionality. Preserve visual density and the original purpose: every generation has input, command, log, product and boundary. Readable Simplified Chinese, no garbled labels.

## 目视核对

五张图保留原系列的主题和信息图语言。图 4 已去除原图虚构数字与错误端口序号；图 5 将 EDA 阶段标为“规划”。图 2、3 中仍有目标视图或工具卡片，公开正文在相邻图注说明当前实现边界。

