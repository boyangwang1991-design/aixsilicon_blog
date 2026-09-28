# GPIO 编辑与事实核对

核对日期：2026-09-27。仅依据已有工程快照，未运行上游验证或综合，未修改 reference。正文为完整双语原创文章；图为概念解释，不冒充波形或实测。

## 主线和边界

从写输出寄存器到控制物理引脚，解释能力、拥有权、模式与有效性；以真实 APB 修复、FIFO 复用取舍和综合报告体现 AI 辅助工程过程。开头为设问场景，不是捏造的亲历故障。人的决策与 AI 工作分开描述，不提供无依据提效或性能收益。

## 逐项来源（相对 reference 工程 GPIO 根目录）

| 正文事实 | 核对材料 |
| --- | --- |
| 258 需求、12 模块；实际 APB 修复；13 UT、42 动态运行、1 静态、7 配置/8 执行 | reports/quality/full_process.md |
| APB Setup 提前响应、passthrough CSR、Access 发请求、字节位掩码 | docs/lld/03_gpio_apb_if.md |
| 1～128 GPIO、32 位分组、同步器 2～4 级、系统信号边界 | docs/integration/gpio_integration_guide.md |
| 输出优先级、开漏、最终能力/拥有权 OE 门控、休眠强制推挽 | rtl/gpio_output.sv；docs/integration/gpio_integration_guide.md |
| 同步/滤波/去抖、阈值减一、DIV+1、无效返回0 | rtl/gpio_input.sv；docs/user_manual/gpio_user_guide.md |
| 首次有效仅建基线、重建历史、IRQ W1C 新事件优先 | docs/hld/02_policy_reconfig.md；docs/user_manual/gpio_user_guide.md |
| sync_fifo 满+POP差异、FLUSH、parity复用 | docs/reuse_plan.md；docs/hld/02_policy_fifo_concurrent.md |
| AON暂存/提交、超时非取消、停钟非断电保持 | docs/user_manual/gpio_user_guide.md；docs/integration/gpio_integration_guide.md |
| 三宽度综合面积、工艺与频率、解析器修正、容量非等功能优化 | reports/ppa-report.md |
| 初始化与原子更新 | docs/user_manual/gpio_user_guide.md |

## 不在公开文中扩展的内部成熟度信息

原始结果为条件 candidate，非无条件量产签核；CDC/RDC 因许可证跳过，Formal 模型启动但完成证明数为0；完整覆盖与参数空间未闭合。文章不宣称签核或独立形式证明。测试通过范围及综合估计边界直接保留在对应正文段落。

## 图文审阅

六张独立图：中英文封面、输出机制、输入有效性；英文封面复制为4:3入口文件。逐张检查文字、方向、优先级、数据一致性。输出中文图首次生成把能力掩码误解释为驱动强度，已通过 imagegen 修改；两版均明确开漏表的 OE、能力、拥有权前提。所有模式经过最终 OE 门控。输入图未标注虚构周期数，不把恢复高电平当上升沿。

中英文面积数据与条件一致；测试数量一致；公开正文无私有仓库路径、reference、notes 或 sources 入口。未创建 HTML/PDF 导出。待用户进行发布审阅。

## 设计细节增补

按用户要求补充中英文技术细节，保留既有封面和两组机制图，主题与图示关系不变。

- gpio_irq.sv：pending 清除与新事件的更新公式省略 test 注入；detect 与 enable 分离；按组归约。公式是解释性简化，不是完整 RTL。
- gpio_apb_if 微设计：普通 RW 候选值合并、按实际写入字节检查、混合锁定写整笔拒绝、命令和 MASKED full strobe。候选值公式仅用于普通 RW。
- gpio_event_fifo.sv：每拍单条、最低编号候选优先、候选计数减实际 push 为丢失数、满/空与 POP 并发、FLUSH、128 位记录、32 位饱和丢失计数；软件四次 HEAD 读后 POP 来自用户手册。消费者互斥为由接口推导的使用约束，未声称硬件提供软件互斥。
- gpio_aon_mailbox.sv：保持 payload、request/ack toggle 两级同步、单 outstanding、POR 保留传输状态、暖复位 RECOVER；稳定窗口与 CDC 约束作为集成要求，不宣称完成 CDC 签核。
- PPA 微架构细节来自 docs/lld/03_gpio_apb_if.md 的 PPA 决策及 IRQ/FIFO RTL；未声称已测得单项优化收益。
- 新增测试组合描述是建议的测试关注点，不冒充每项已单独完成的执行证据。
