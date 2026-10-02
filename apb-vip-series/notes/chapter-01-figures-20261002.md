# 第 1 章讲解图与 Secure Demux 案例收敛

2026-10-02。使用 Codex 内置 ImageGen，中文先行，无封面。用户要求配图提高信息量，并将 IP 复用案例集中到 Secure Demux。

## 系列全貌：协议、AI开发、可信依据、Secure Demux复用、反馈与两类积累

文件：`assets/generated/chapter-01-development-loop-zh.png`

SHA256：`54231ba37ad59e750df9331518799b0ab65c3716b1f511183faad98d15abd012`

最终提示词：

制作中文工程博客正文概念图，横向16:9，白底深海军蓝主结构、青色验证与改进、琥珀色问题反馈、灰色项目专属边界。字大清楚，结构紧凑，信息丰富而非长段文字，不做幻灯片，不加整页标题、页眉页脚、Chapter、logo、口号、虚构通过标记。
主线顶行四个等宽卡片从左到右单向连接：
“理解 APB”：读写与握手 / 等待与错误 / 版本与可选信号。
“AI 辅助开发 VIP”：需求与组件职责 / 事务与驱动实现 / 编译与仿真调试；底部小字“工程师审查规则与取舍”。
“建立可信依据”：独立预期 / 检查与故障注入 / 配置矩阵与回归；底部小字“绑定版本与运行条件”。
“Secure Demux 接入”：CSR 寄存器配置 / Master 与 Slave 协作 / 路由与权限验证。
下半部右侧框“运行反馈”：新场景 / 新需求 / 可复现失配。由Secure Demux接入框向下箭头进入。
下半部中间框“复现与责任判断”：固定版本 / 定位触发条件 / 区分通用与产品行为。运行反馈向左单向箭头进入它。
下半部左侧大框“留下两类积累”，内部上下两个子框：“公共 VIP：实现、测试、接入说明”和“研发方法：任务约定、检查步骤”。复现与责任判断框向左箭头进入此框。
唯一返回箭头：从“留下两类积累”大框顶部向上，连接顶行第二个“AI 辅助开发 VIP”底部，标注“用于下一轮研发”。不得连接复现框或直接绕过验证连到Secure Demux。
“复现与责任判断”框下方一个小灰框，单向细灰箭头向下指入，小框文字“产品专属行为 → 项目模型”。
所有箭头端点清楚。不要漏掉复现框，不把新需求自动等同缺陷，不画已完成运行的含义。图的目的：从协议到VIP研发、验证、单个IP复用，再把使用反馈变成组件和方法积累。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-6623e22c-d641-4de5-b997-67830518004d.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

## 单案例实际角色：共同上游APB、Master/Slave、身份侧带、目标模型与周期检查

文件：`assets/generated/chapter-01-secure-demux-reuse-zh.png`

SHA256：`3943edc0a85a89e5cade157d8abcbe8c686079d0cd80616cb257bab29322b4e1`

最终提示词：

中文技术博客正文工程概念图，16:9横向，白底，深海军蓝主结构，青色验证路径，琥珀色只用于反馈输入，灰色边界。文字大，信息丰富但只用以下指定内容，不自行加小字，不加全页标题、Chapter、页眉页脚、口号。没有真实波形、界面或通过率。
图回答：一个Secure Demux案例怎样同时复用APB VIP请求端和响应端，并加入产品验证？
上半部占约60%画面，从左到右三个区域。
左边框“上游 Master VIP”，内两项“配置 CSR”“发起业务访问”。框上方有小框“项目 sequence”，标注“同步驱动身份与请求”，连向master框；一条另行侧带线从sequence直达DUT标注“master_id / valid”，这是项目侧带，不能画成APB标准信号。
中间大框“Secure Demux / DUT”，内含上方“CSR 配置与策略”，下方“地址译码与权限判断”。上游master与DUT间只有一条公共APB请求连接，标“同一 APB 接口”，另有反向细箭头标“响应”。大框下方灰色注“CSR 本地处理；允许的业务访问转发”。
右边框“下游目标环境 × N”，内部两个上下模块“Slave VIP：等待 / 错误”“目标模型：读数据 / 完成时副作用”。DUT向此框箭头“选中端口的请求”，此框返回DUT箭头“响应”。不画每端口同时被选择。

下半部约40%：左侧“观察与比较”区域，三个横向小框“上下游 Monitor”“独立产品参考模型”“逐周期 Checker”。Monitor仅说明“事务记录”，不能画monitor.analysis直接连接checker（实际项目checker取control_if逐周期信号）。在这三个框上方用横向短注“接口与项目侧带 → 周期观察；规则与输入 → 预期”，从独立参考模型到Checker单向箭头标“预期”，从DUT区域向Checker单向箭头标“实际”。Checker框内列“放行与拒绝”“选通与响应”“策略生效与隔离”。
下半部右侧三个紧凑职责条：“AI：接入、实现、定位”“工程师：规则与预期审查”“工具：编译、仿真、回归”。底部无大横幅。确保请求与响应方向相反、MASTERID是项目侧带、只有一个上游APB入口，图是抽象结构，不声称完整验证已通过。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-90953c2a-5b0a-41b7-a0a8-ded7cd52df74.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

## 技术核对与正文调整

- 同一上游 APB 同时承担本地 CSR 与转发业务，不能画独立配置总线。
- DUT 上游是 slave 接口，验证环境使用 master agent；DUT 下游发请求，验证环境使用 slave agent。
- master_id 与有效标志属于项目侧带，由项目 sequence 与 APB 请求协调。
- 下游 responder 由 VIP 控制等待和错误；目标模型提供实际数据与完成时副作用；observed 用于记录实际接口。
- 产品 checker 通过 control_if 逐周期读取信号，并调用独立 RM；不虚构 monitor analysis port 到项目 checker 的连接。
- 源码存在 RAL 产物，但实际所述配置入口是 csr_write/allow_port/address_of；正文不将其说成已经接入 RAL predictor。
- 第 5 章讲实际结构，第 6 章讲同一案例的场景，第 7 章讲明确标注的教学反馈流程。PQC/Watchdog/CDC 等旧接入故事不再作为公开复用案例展开；第 8 章保留 AXI 独立向量经验作为跨 VIP 方法来源。
- 旧 Watchdog 图保存到 notes/retired-figures，不从正文引用。其他章节图保持原状。
- 最终两图均已原尺寸与缩放核对。第一图回向路径经过研发与可信依据，再回到消费项目；第二图用概念结构压缩源码细节，未包含真实运行数据。

## 新增来源（内部路径）

基目录：reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/infrastructure/apb/apb_secure_demux/

读取 verification/th/harness.sv、verification/env/apb_secure_demux_env.sv、verification/env/apb_secure_demux_virtual_sequence.sv、verification/env/apb_secure_demux_checker.sv、verification/env/apb_secure_demux_rm.sv、verification/README.md 与 README.md。文件快照并入 source-snapshot.json；本轮未运行仿真或修改参考工程。

未选草图均保留在工具默认目录，提示词与修订记录见 figure-manifest.json，未复制进发布资源。
