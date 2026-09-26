# 新博客选题扫描 · 2026-09-26

内部编辑资料，不是公开文章，不从公开正文链接。以下判断来自 reference 中已有报告、设计文档与结果文件的阅读，未重新运行仿真或综合。reference 保持只读。

## 扫描范围与选择依据

扫描 CBB、ESL、IP、Skill、SoC Studio、VIP、Wenwang EdgeNPU 七组资料，优先阅读尚未被现有八篇文章覆盖的实验记录和验收报告。检查了嵌套 PQC 发布 ZIP 的条目，其正文和图片属于已整理的 PQC 文章；Aurora 的 project.bundle.zip 为工程包，没有发现另一篇待导入文章。

本轮最有价值的新增材料集中在系统级 NPU 实验、Transformer 数据流、常数乘法结构和密码接口验证。排序考虑：读者是否容易理解问题、是否有反直觉结果、证据是否足够具体、是否区别于已有文章。下列 AI 切入点是写作方向；正式成稿还需核对对应开发记录，不能仅凭工具报告推断某项决策由 AI 提出，更不能虚构节省工时。

## 优先 1：互连加宽一倍，为什么 Decode 尾延迟反而变差？

**建议标题：**《NPU 互连加宽一倍，为什么 Decode 尾延迟反而变差？》

开头先解释两个任务：Prefill 处理输入上下文，Decode 逐步生成后续 token。两者共享资源时，批量处理更快与交互响应更稳可能不是同一个目标。

同一混合负载中，链路从 32 B/cycle 加宽到 64 B/cycle，整批结束时间由 24032 降至 14893 周期，而 128 个固定 Decode 读事务的 p99 从 53 升至 59 周期。平均事务时延反而由 45.367 降至 44.156 周期。平均返回阶段变短，目标端阶段由 21.867 增至 24.359 周期，值得用排队过程解释这一矛盾。

AI 的叙事应落在构造可比负载、扫描配置、拆解事务时间与检查数据一致性。与已有 SRAM ESL 文章相比，这篇讨论网络、存储和混合负载之间的干扰，不重复 bank 映射案例。

配图：同一组任务经过窄/宽链路进入目标队列；平均时延、p99、批次结束时间三指标并排；事务阶段分解。

边界：SystemC full_data 模型，尚未校准 RTL；p99 是这组固定样本的统计量。不能写成“加宽总线一定更慢”，也不能把事务尾延迟直接称为实际大模型 token 延迟。队列变化支持排队解释，精确仲裁因果还需进一步拆分。

来源：
- `reference/aixsilicon_esl_repo-main/aixsilicon_esl_repo-main/models/npu_mesh/reports/20260924-interference/report.md`
- 同目录 `experiment.md`、`interference_checks.json`、`interference.svg`
- `reference/aixsilicon_esl_repo-main/aixsilicon_esl_repo-main/models/npu_mesh/docs/interference.md`

## 优先 2：先少搬数据，再谈更多算力

**建议标题：**《先少搬数据，再谈更多算力：一次 Transformer 数据流优化》

主线：AI 辅助芯片研发不必从 RTL 开始。先用功能模型检查哪些中间结果必须写回共享内存，哪些可以留在局部；再比较数据搬运量与存储占用。

dataflow v0.6 的 18 组前后对比覆盖三类模型结构、W8/W4、N=1/2/3，均为 5 token Prefill + 2 token Decode。DMA 有效载荷字节减少 48.14%～70.26%，共享实际载荷峰值减少 34.84%～51.93%。可选 Llama 结构 W4/N3 一组展开：DMA 字节 218528 → 84676，共享峰值 58656 → 28994，局部峰值 1536 → 5056，明确展示搬运减少与局部存储增加的交换。

机制可围绕在线 Attention、GQA 复用、W4 流式处理、局部中间结果保留选择两三项展开，避免罗列全部能力。已有批次的 logits 对比最大绝对差为 0；不要据此推出量化精度无损。

配图：原先中间结果反复往返共享内存，与局部消费后的数据流；三类资源变化；同一输入的功能对照。

边界：Python 无时序功能模型，采用合成模型结构，不是预训练大模型实测；字节减少不等于同比加速或节能。事件双缓冲不代表已经测出硬件重叠收益。

来源：
- `reference/wenwang-edgenpu-main/wenwang-edgenpu-main/reports/architecture/dataflow_system.v0.6.md`
- 同仓库 `README.md`、`docs/contracts/dataflow_execution.md`、`docs/decisions/ADR-0015-untimed-dataflow.md`

## 优先 3：常数乘法，手工优化一定比直接写乘号好吗？

**建议标题：**《把乘法拆成移位加法，就一定更省面积吗？》

四种结构比较：直接乘法、二进制展开、CSD 有符号数位表示、共享中间结果的加法图。适合用乘以 85 的算式科普公共子表达式，再展示综合结果如何改变直觉。

固定库、相同组内位宽/系数/精度/延迟：W16、系数 85、两级延迟时，NATIVE 面积 250.263，ADDER_GRAPH 为 201.708，减少约 19.4%；到达时间 2.36 → 2.06 ns。W8、系数 45、组合实现中，NATIVE 面积 40.833，CSD 为 47.970，直接乘法反而更小。不能跨这两组推导随位宽变化的单因素规律。

验证材料较丰富：820 配置、230095 周期回归；另有矩阵与 PPA 配置对照；9 个代表配置通过 Formality。写作可展示 AI 生成候选结构、独立任意精度 oracle 检查、综合反馈筛选的工作链。不要把代表配置证明外推至所有流水结构。

区别于已有 CBB 文章：原篇比较切片方式与 FIFO 容量，本篇聚焦算术表达式、共享子表达式及逻辑综合映射。

配图：85x 的不同运算图；组内面积/到达时间对比；候选实现如何通过功能检查进入综合。

边界：仅综合结果，无布局布线；功耗采用默认活动估计，不适合作为主卖点。正式发布前确认所选库数值允许公开；若不能公开绝对数，采用归一化面积。

来源：
- `reference/aixsilicon_cbb_repo-main/aixsilicon_cbb_repo-main/components/arithmetic_datapath/constant_multiplier/reports/ppa-report.md`
- 同目录 `ppa-results.json`、`verification-report.md`、`qualification-report.md`

## 备选 4：算法核还没做完，接口验证能先开始吗？

**建议标题：**《算法核还没做完，接口验证能先开始吗？》

用 CCI 密码组件接口的 Mock 讲并行研发：先以可控的确定性数据源替代算法，独立检查背压、取消、完成槽位和迟到响应。读者应能理解“算法算对”和“任务交付正确”是两层问题。

CCI 本轮报告覆盖 5 种位宽、60 个端点场景；74 次预期违规被检出，包括 16 次通道背压负例、13 类语义负例、45 次迟到/错配/重复完成。完成槽耗尽后拒绝新任务，退休后恢复；取消与正常完成只能产生一个终态。可结合一次测试未排空导致取消过晚的修正，讲清 AI 写测试也需审查时序前提。

区别于现有 AXI4 VIP 文章：重点是算法开发与接口验证解耦、可控故障注入和任务生命周期，不再泛讲 VIP 复用。

配图：真实算法核与 Mock 的替换边界；任务取消后在途数据排空；槽位预留与交付。

边界：Mock 不执行密码运算，最小调度例子不是生产 Shell；通过范围是定向功能验证。

来源：`reference/aixsilicon_vip_repo-main/aixsilicon_vip_repo-main/vip/security/crypto_cci/` 下 `README.md`、`reports/regression.md`、`reports/run_log.md`。

## 备选 5：解密得到明文后，为什么还不能交给软件？

**建议标题：**《明文已经算出来，为什么还不能交给软件？》

从 AES-GCM 的认证机制切入：解密数据流可以先产生明文，但认证标签核对通过前，这些数据不能按可信结果交付。用这个容易理解的冲突引出暂存、认证通过后的提交、失败后的清理，以及算法核与系统 Shell 的职责分界。

已有 GCM 定向单元测试 5 种位宽 × 89 项 = 445 项，通过 OpenSSL 参考数据核对，包含空消息、块边界、分段、错误标签、取消和错误续传。AI 的叙事可围绕把安全要求变成明确接口约束与负向测试。

配图：解密输出进入可信暂存区，认证通过后交付，失败则丢弃；不能把“先给软件再撤回”画成合法路径。

边界：可信暂存、nonce 唯一性、授权、最终提交等有系统侧职责，当前不能写成全系统安全已经验证。本文可讲接口设计与定向测试，无需扩大为完整密码子系统发布。

来源：`reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/security/crypto/crypto_aes/reports/report.md`。

## 备选 6：复位结束，旧 DMA 为什么还能写回来？

**建议标题：**《复位已经结束，旧 DMA 为什么还能写回来？》

直觉上复位应清空一切，但已经发出的写请求可能晚到。围绕旧任务、旧地址、新任务之间的关系解释 epoch、缓冲区占用与隔离期，讲 AI 怎样把异常时序变成可执行场景。

control v0.1 模型确实注入强制复位后的迟到写入，对旧分配保留 pin 与地址隔离，避免过早释放。报告包含 127 项测试、729 条六操作轨迹及 65536 组 IRQ 组合检查。数字只作为证据，正文以一个晚到写入场景为核心。

配图：复位前后的两条任务时间线，旧缓冲区何时允许回收；软件看到完成与底层请求真正排空的区别。

边界：无时序功能模型；地址槽单调分配，没有真实物理地址复用验证，不能宣称 AXI drain、CDC 或硬件复位签核通过。

来源：`reference/wenwang-edgenpu-main/wenwang-edgenpu-main/reports/architecture/control_system.v0.1.md`。

## 可接续的两篇性能短文

### 调低后台带宽，Decode 就能更稳吗？

QoS 实验把混合负载 Decode p99 从 53 降到 44 周期，接近独跑 43，但整批结束时间 24032 → 76715 周期，约变为 3.19 倍；任务数量没有减少。适合用“交互体验和后台吞吐怎么取舍”承接选题 1。不能只摘录尾延迟下降而省略成本。来源：ESL `models/npu_mesh/reports/20260924-qos/report.md`、`docs/qos.md`。

### NPU 搬运变快，靠的未必是更多 Bank

固定多播负载中，NIU/DMA 并发窗口从 1/1 调至 8/2，8074 → 5883 周期，减少约 27.1%；继续把 SRAM bank 从 8 加到 16 仅到 5861。适合解释“允许多少请求同时在途”，先讲延迟与并发再谈资源。逻辑吞吐计入初始化、回读与填充排空，不是 NPU 有效算力；不宣称面积收益。来源：ESL `models/npu_mesh/reports/20260924-memory/report.md`、`sweep.csv`、`docs/memory.md`。

这两篇与选题 1 来自同组模型，建议排成系列，避免连续发布三篇近似的性能扫描报告。

## 暂不优先独立成篇

- **SoC Studio 的真实连线与设计历史：** 有 GPIO 32 位映射至 PLIC 77～108、地址/IRQ/顶层生成一致性、分支与历史恢复等材料。可先补强已有 SoC Studio 文章的真实场景和截图。当前台账明确 `socComplete=false`、`edaExecuted=false`，不宜包装成完整 SoC 已跑通。来源：SoC Studio `docs/planning/acceptance-ledger.md`、`docs/aurora/aurora-candidate.md`。
- **PLIC 大规模寄存器生成：** 3537/14791 寄存器规模、独立仲裁 oracle 和错误上下文记录修正有价值，但当前生成器系列已有两篇。若写，聚焦 claim 读副作用或寄存器一致性核对，不用规模代替工程成果。来源：IP `ips/system/interrupt/plic/reports/report.md`。
- **Watchdog：** 225/225 定向动态测试等材料可支撑局部验证故事，但需先找到比计数器更强的具体冲突，避免写成参数和通过数清单。来源：IP `ips/peripheral/timer/watchdog/reports/report.md`。
- **ASCON、ChaCha/Poly、SM3、密码 Shell：** 部分仍以需求草稿、编译或接口规划为主，暂不按完成的 IP 成果宣传。
- **Skill 仓库本身：** 更适合融入上述案例，展示某条工程规则怎样改善设计或发现错误。暂不追加一篇抽象的 Skill 流程介绍。

## 建议发布顺序

先写互连尾延迟，再写常数乘法，随后写 Transformer 数据流，覆盖系统、RTL 算术和架构三种尺度。之后按读者反馈选择 CCI Mock 或 AES-GCM。每篇均应补齐实际 AI 开发记录，采用自包含正文和中文机制图；私有路径仅留在本文件及后续文章的内部笔记。
