# 功能安全系列标准核对记录（内部）

本记录只用于编辑与事实核对，不作为公开正文附件，也不随文章导出。2026-09-30 只读核对 `reference/iso26262/` 中的 2018 版标准 Markdown 快照，并用 ISO 官网确认公开书目信息。第 1 章关于 IEC 61508 的范围另核对 [IEC 61508-1:2010 官方书目](https://webstore.iec.ch/en/publication/5515)。正文仅概括工程含义，没有复制标准表格、图或成段条文。

| 资料 | 相对仓库根目录的只读来源 | SHA-256 |
| --- | --- | --- |
| ISO 26262-1:2018 | `reference/iso26262/ISO_26262-1-2018/ISO 26262-1-2018.md` | `633B5F62CCE5CEDBA9E26368B87A7496E487AEEE8BFFB14E535AD219002FA433` |
| ISO 26262-2:2018 | `reference/iso26262/ISO_26262-2-2018/ISO 26262-2-2018.md` | `2E0F29D32825194508C987EA4E934D5B865075A812AA440F1253E9694709DA62` |
| ISO 26262-4:2018 | `reference/iso26262/ISO_26262-4-2018/ISO 26262-4-2018.md` | `D4D5294B517D2346C57006F829F2988536C851400247C6D33D0BDB3ACD3BBFE2` |
| ISO 26262-5:2018 | `reference/iso26262/ISO_26262-5-2018/ISO 26262-5-2018.md` | `F94A08DA2144FC12631B11C5691872ECF81EFDACC62AA292467BC8F224A6BF64` |
| ISO 26262-7:2018 | `reference/iso26262/ISO_26262-7-2018/ISO 26262-7-2018.md` | `5164E1CC652096A51E44C15EF71D14390E3E436E13B902083C9BE7A769899243` |
| ISO 26262-8:2018 | `reference/iso26262/ISO_26262-8-2018/ISO 26262-8-2018.md` | `E07B7DEC81AD43E7ED118DD48DE9923F1727AAD638CB03D5A4119AF4EAD94BA4` |
| ISO 26262-9:2018 | `reference/iso26262/ISO_26262-9-2018/ISO 26262-9-2018.md` | `CFF2CA5E08F060ECDAECE4BDAE41B1E9C20E11AE376C75CB8AF605E4A2525B07` |
| ISO 26262-11:2018 | `reference/iso26262/ISO_26262-11-2018/ISO 26262-11-2018.md` | `1049C858C76DBC89C557269F4249E40B0ACD6DC2A352ADB58687CEC56975BA99` |

公开书目入口：[Part 5](https://www.iso.org/standard/68387.html)；[Part 11](https://www.iso.org/standard/69604.html)。Part 5 是硬件研发要求；Part 11 为半导体应用的资料性指南，不能把其中举例或典型值写成所有 IP 的强制要求。ISO 官网目前仍列出 2018 版为已发布版本；修订草案正在开发，正式发表前要再次核对版本状态。

## 章节映射与核对要点

| 章节 | 内部核对位置 | 写入正文的工程含义 / 后续缺口 |
| --- | --- | --- |
| 01–03 | Part 1 §3.6、§3.41、§3.46、§3.50–3.54、§3.75–3.77、§3.84、§3.138–3.139；Part 5 §6；Part 11 §4.4–4.5 | 已解释故障、错误、失效、危险事件、item、element、SEooC、ASIL 和系统级传播。硬件要求来自技术安全需求；可复用 IP 的使用假设须由集成方核对。假设的整车案例仍需实际 item 资料与 HSI 才能升级为工程案例。 |
| 04–07 | Part 1 §3.118、§3.164–3.165；Part 11 §4.3、§5.1.2–5.1.5、§5.1.13.1 | 随机硬件失效、系统性失效、系统级功能失效与具体故障模型各是不同维度；Part 11 区分 MCU 与 MBU，ECC 不覆盖全部地址/控制故障。物理位交织的机制细节另以半导体厂商公开资料核对；需补目标宏的物理映射、实际码字和控制器接口。 |
| 08–10 | Part 11 §4.7、§5.1.12；Part 5 Annex D | 共享时钟、复位、电源等依赖需单独分析；watchdog 类型与诊断能力不能只凭名字推定。需补真实实现/注入证据。 |
| 11 | Part 5 Annex D.2.3.2；Part 11 §4.8、§5.1.2 | LBIST 是硬件支持的逻辑自测试示例；需按扫描域、模式和故障模型评价覆盖，区分测试完成与通过，核对启动/恢复顺序。 |
| 12–16 | Part 11 §5.1.5；Part 5 §7、§8 | 总线、MMU/访问控制、中断控制器有不同失效模式；错误管理器需考虑潜伏故障。E2E 通信字段与判定规则另以 AUTOSAR 公开规范核对；需补端到端响应路径。 |
| 17–18 | Part 11 §4.8、§5.1.10 | 故障注入的模型、抽象层级、故障列表、位置、工作负载和观察点决定结果含义。需补真实 campaign、独立 checker 与统计口径。 |
| 19 | Part 1 §3.33、§3.85、§3.97、§3.125、§3.130、§3.156；Part 5 Annex B 图 B.2、Annex C §C.1–C.3 | 先按 SG、独立性与机制覆盖分 SPF/RF/MPF/安全故障，再算 SPFM/LFM；两个 DC 的分母不同。教学账本数字须独立复算，不作产品结论。 |
| 20 | Part 5 §8–9、Annex C–E；Part 11 §4.6、§4.5.4 | SPFM/LFM 与 PMHF 范围不同；软 IP 定量分析依赖假设，集成时复核。需补可信失效率与工程算例。 |
| 21–22 | Part 5 §6–7、§10；Part 9 §7；Part 11 §4.5、§4.7 | 需求、架构、HSI、集成验证和使用假设应互相对应；Safety Island 的共因与自检不可省略。需补系统级案例。 |
| 23 | Part 11 §5.1.3、Table 32、§5.1.13.1–4 | NVM 字级 ECC、整块 CRC/签名及冗余块分属不同诊断；更新中掉电、版本选择与擦除态须按目标器件核对。 |
| 24 | Part 11 §5.2.2、§5.2.3.6、§5.2.4 | 模拟链要分析漂移、量程内错误、通道错选、共享参考与时序；具体故障分布/覆盖率依赖电路和工艺。 |
| 25 | Part 4 §6；Part 5 §6；Part 8 §6；Part 11 §4.4–4.5 | TSC 联合技术需求和系统架构；IP FuSa LRS 为项目命名，不是标准统一文件名；SEooC 假设须集成核对。 |
| 26 | Part 9 §7–8；Part 5 §8–9；Part 11 §4.7 | DFMEA/FTA/DFA 与 FMEDA 分别分析传播、顶事件组合、相关失效及随机硬件风险；安全分析在设计中迭代。 |
| 27 | Part 8 §5–6；Part 11 §4.5、§5.1.11 | Safety Manual/AoU 与 DIA 作用不同，供应方能力和集成方责任须由同一配置和证据连接。 |
| 28 | Part 2 §6；Part 7 §5–7；Part 8 §7–10 | 区分 Safety Case、确认审阅、审核、评估与可选商业证书；补异常、配置/变更、生产和现场交接。 |
| 29 | Part 5 §6–7、§10；Part 9 §7；Part 11 §4.5、§4.7 | 集成案例核对检测到受控动作的端到端时序，并把 NVM/ADC 的生产与消费边界纳入。 |
| 30 | Part 11 §4.5.4、§4.8；Part 5 §7、§10 | AI 仅能协助候选与资料组织；安全主张仍需独立判据、验证与可追溯工作产品。需补真实 AI 参与记录。 |

## 正式发表前复核

现有 EP03–30 的主线已补充工程推理。EP05 的八位码字是手算教学例子：位置 1–8 为 `0 1 1 0 0 1 1 0`，三个局部偶校验和总偶校验均成立；单独翻转位置 6 时 syndrome 为 6。它不是 ISO 表格、真实 IP 参数或仿真结果。EP20 的 `λ×f×(1−c)` 只说明一类简化残余失效率关系，不代替 Part 5 的完整分类与 PMHF 评价。正式审稿时需独立复算并检查图文一致性。

EP05 与 EP07 讨论相邻单元翻转与物理位交织。Part 11 §5.1.2 对 MCU/MBU 的定义是故障模型依据，§5.1.3 和 §5.1.13.1 用于核对存储器与 ECC 的适用边界；**不要写成 ISO 26262 强制要求物理位交织**。物理相邻位分配给不同码字、交织距离随工艺与扰动范围变化的说明来自 [Infineon 公开技术文章](https://community.infineon.com/t5/Knowledge-Base-Articles/Different-Ways-to-Mitigate-Soft-Errors-in-Asynchronous-SRAMs/ta-p/257944)。文中的 `A0 B0 C0 D0 A1 B1 C1 D1` 仅是教学映射，并非某个宏的真实布局；无目标宏布局、多位翻转分布及修复后映射证据时，不给出覆盖率或交织倍数结论。

EP06 与 EP07 补充全零/全一码字盲区。扩展 Hamming 教学码 `01100110` 与 `00000000`、`11111111` 均为合法码字；整字替换可得到零 syndrome。该结论只针对本文采用的偶校验八位码，不能推断所有 ECC 的 All-X 行为。NXP [MPC5777C 安全手册](https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/mpc5xxx/10624/1/MPC5777_User_Guide.pdf)区分带地址/不带地址的 RAM ECC，并指出带地址方案在部分地址仍有合法 All-X；Infineon [AURIX Flash ECC 对照](https://www.infineon.com/assets/row/public/documents/10/56/infineon-aurix-program-memory-unit-training-en.pdf?fileId=5546d46269bda8df0169ca89a7cb2567)展示 PFlash 与 DFlash 对擦除态及 All-X 的不同处理。Part 11 §5.1.13.5 的 RAM pattern test 可支持 stuck-at/转换故障的说明，但标准并未要求本文列出的特定 All-X 编码方案。正式工程案例要核对目标宏 ECC 矩阵、地址参与方式、初始化状态与告警优先级。

本轮按用户提供的工程分析细化了地址耦合 ECC：`P_store=H_D·D⊕H_A·A⊕B`，全零反例满足 `H_A·A=B`，全一反例满足 `H_A·A=1_r⊕H_D·1_n⊕B`。这些是 GF(2) 下从编码定义直接推导的条件，不作为 ISO 条文。有效地址集合、地址转换、bank/别名和目标矩阵必须在具体 IP 上核对。若 `H_A` 在有效地址上遍历所有校验模式，则固定 bias 无法保证整个地址空间都排除 All-X；Generator 应报告无解或反例，不伪造覆盖结论。尚未在本博客仓库发现可直接修改的 ECC Generator 实现，因此本轮只写设计与验证要求。

EP11 的扫描式 LBIST 原理、测试窗口与结果分类核对 Part 5 Annex D.2.3.2，并参考 [TI LBIST 集成文档](https://software-dl.ti.com/jacinto7/esd/processor-sdk-rtos-jacinto7/08_06_00_12/exports/docs/sdl/sdl_docs/userguide/j721e/modules/lbist.html)和 [Infineon Logic-BIST 架构](https://documentation.infineon.com/aurixtc4xx/docs/pvz1545137908465)。这两份器件资料仅用于说明可能的实现，不把器件特定启动时间或覆盖率写成通用指标。EP13 的 Data ID、counter、CRC 和超时机制参考 [AUTOSAR CP E2E Library 规范](https://www.autosar.org/fileadmin/standards/R4.3.1/CP/AUTOSAR_SWS_E2ELibrary.pdf)；它是公开通信保护实例，不等同于本博客某个 SoC 已实现 E2E。正式工程稿须核对消息布局、选择的 Profile、故障模型、接收窗口及动作时间。

EP19 依据用户提供的 `functional-safety-series/assets/ref_image/76cfdd38c9705eba7d03aa482aee02e55b01e6d2e18075efafebde6a5a91cd94.jpg`（SHA-256 `A0F5758F7E21CEE1C13BD00A9C2CAB29C89F00D416F14B8D6D248CE32C7E6E27`）核对分类路径；该图对应 Part 5:2018 附录 B 图 B.2，只作内部对照，不在公开正文复制或链接。分类术语核对 Part 1，SPFM/LFM 算法核对 Part 5 附录 C 公式 C.7/C.8。教学账本复算：`λ_total=100`，`λ_SPF=20`，`λ_RF=4`，`λ_MPF,DP=60`，`λ_MPF,L=6`，`λ_S=10`（单位均为 FIT）；`SPFM=1−24/100=76%`，`LFM=1−6/(100−24)=92.105...%`。表中各模式可能来自不同元素，真实 FMEDA 须核对元素边界、故障独立性、失效率来源、两个 DC 的分母和检测时间；不把示意数值当作标准建议值。

EP23 NVM 的机制范围核对 Part 11 Table 32 与 §5.1.13.1–4：字级 ECC、修改过的 checksum、memory signature 与 block replication 有不同保护边界。A/B 更新状态机与掉电插入是教学方案，不是标准指定设计；具体擦写原子性与擦除态需看器件资料。公开实例分别参考 [Microchip NVM CRC 扫描](https://onlinedocs.microchip.com/oxy/GUID-C0410A3B-A192-4F94-A83F-81035433111B-en-US-2/GUID-B147D547-9BE5-4799-923A-784B3A6E41E1.html)及 [Infineon 双 bank 更新资料](https://documentation.infineon.com/traveo/docs/eyn1762021324263)。不能据此推定本系列目标 SoC 有双 bank 或已做掉电验证。

EP24 ADC/模拟链核对 Part 11 §5.2.2、Table 36、§5.2.3.6 与 §5.2.4：失效模式包含偏置、增益/准确度、参考、MUX、采样保持和时序，相关失效需考虑共用供电、基准、基板与板级输入。教学矩阵只显示候选诊断适用关系，不给出 DC 数字。公开器件例子是 [TI ADC 软件冗余资料](https://software-dl.ti.com/jacinto7/esd/processor-sdk-rtos-j721s2/11_02_01_03/exports/docs/pdk_j721s2_11_02_01_08/docs/userguide/j721s2/modules/ip_fma/adc6.html)。正式稿需要目标模拟宏模型、PVT 条件、注入与板级测量，不能将数字 RTL 注入结果当作模拟诊断覆盖率。

- 对照原版 PDF 核查引用的节号、术语与表格语境；Markdown 快照可能含 OCR/排版错误。
- 确认每篇的示例数字、工作负载、故障注入及 IP 实现状态；没有证据时保持教学假设口吻。
- 只引用 ISO 官网公开页面作为读者入口，不提供内部标准快照、私有工程或编辑记录路径。
