# Crypto Component Suite 系列博客策划

日期：2026-09-27。状态：内部策划，尚未创建公开文章。依据本地参考快照中 2026-09-24 的 Suite 规划、契约、公共基线及 Oracle 文档。本文不随公开文章导出。

## 1. 系列定位与叙事路线

建议系列名：**密码算法怎样成为可组合的硬件：Crypto Component Suite 设计笔记**。

英文系列名：**Building Composable Cryptographic Hardware: Crypto Component Suite Design Notes**。

面向跨方向芯片工程师，按“算法解决什么问题 → 硬件怎样计算 → 多种服务怎样组合 → 系统怎样可靠使用”展开。推荐 13 篇主线，前 7 篇介绍算法族及硬件，后 6 篇介绍 Suite。每篇围绕一个工程问题，可独立阅读；不用统一的章节模板。

根据用户补充，系列核心价值明确为：**分开时，算法组件可独立嵌入其他 HAC；聚合时，同一组组件可组成覆盖目标应用所需功能的密码加速器，并按负载配置并行度和串联服务。** “完整功能”按选定应用 profile 定义，包括所需算法、接入、密钥授权、结果交付和错误处理，不意味着囊括所有密码算法或完整通信协议。HAC 沿用用户术语，公开稿首次出现时结合实际目标系统补充定义，不自行猜测全称。

前 7 篇都应自然回答两个问题：这个组件独立交付什么服务；嵌入 HAC 时需要宿主提供什么。后 6 篇围绕“独立复用、聚合交付、并行配置、服务串联”展开，减少重复外围开发是其中一项收益。以下 HAC 嵌入及并串联图均为规划架构示例，不能暗示已有对应集成成果。

本系列范围包含加解密、摘要、消息认证和密钥派生。Hash、MAC、KDF 不统称为加解密算法。开篇用一个简短任务地图说明这些角色，随后尽快进入具体电路。RSA、ECC、SM2 和 PQC 不在当前 Suite 的 11 项资产内；已有 PQC 博客可作为相关阅读，不能画成 Suite 已集成模块。

AI 辅助研发作为贯穿的方法线：标准与需求核对、算法分组、接口审查、配置负例、独立答案及协议检查。现有材料不足以还原具体 AI 对话或工时收益，因此不捏造研发经历。算法科普篇无需每节强行谈 AI，最后一篇集中展示有证据的方法。

## 2. 事实基线与写作口径

| 层次 | 本次材料能支持什么 | 写作方式 |
| --- | --- | --- |
| 产品规划 | 8 个算法组件、3 个 Shell；Suite 是产品线集合 | 可讲组织原则与取舍，不把 Suite 描述成第 12 个硬件 IP |
| 算法硬件 | 逐组件契约给出操作范围、候选电路分解和资源约束；没有这些新 IP 的 RTL 成果 | 使用“可采用”“规划采用”“需要保留”，图注写设计/原理示意 |
| 首批接口和需求 | CCI-M0-0.2.0 草案，SM3/AES/Stream/MMIO LRS，G0 开放 | 可讲已形成的契约内容，不写已冻结或已完成实现验证 |
| 可执行软件资产 | Oracle、schema、manifest 校验器及测试源码已存在 | 可讲代码和设计；若报道运行结果，正式写作时在参考目录外准备环境并重跑 |
| 后续能力 | DMA、扩展算法、RTL 装配生成器、PPA、防护档等按路线推进 | 介绍目标和验证方法，不报实测收益或认证结论 |

关键版本差异：较早 CCI 总述把流称为 AXI4-Stream，并列出 SECRET 属性；后续 baseline 明确首批是 ready/valid 字节流，不声明完整 AMBA AXI4-Stream 兼容，普通 CCI 的 secret 位只能为 0。写作采用 baseline 的收敛口径，秘密对象使用独立受保护服务。位宽、编码以对应 HWIF YAML 为准，本参考副本未提供这些跨仓依赖，不能补造具体线级值。

首批线级能力是 SM3/HMAC-SM3、AES-GCM_BASE/EXT；KDF secure_service 子调用、TupleHash、replay 等需要命名扩展 profile。产品总规划、首批接口子集、Oracle 软件能力必须分开。

## 3. 算法分组与篇目总览

| 篇次 | 中文拟题 | 主要对象 | 读者带走什么 |
| --- | --- | --- | --- |
| 01 | AES 与 SM4：一块数据怎样经过密码电路 | crypto_aes、crypto_sm4 | 轮函数、密钥扩展、迭代与展开的取舍 |
| 02 | 同一颗密码核，为什么 CTR、GCM 和 XTS 长得不一样 | AES/SM4 的工作模式 | 反馈、认证、存储用途如何改变数据通路 |
| 03 | SM3、SHA-2 与 HMAC：摘要硬件为什么需要保存状态 | crypto_sm3、crypto_sha2 | 分块、链值、填充和 HMAC 内部复用 |
| 04 | SHA-3、SHAKE 与 KMAC：一个置换核怎样提供多种服务 | crypto_keccak | 吸收、挤出、域分离与可变长输出 |
| 05 | ChaCha20-Poly1305：加密与认证怎样在硬件里配合 | crypto_chacha_poly | ARX 通路、MAC 通路与内部流水 |
| 06 | Ascon 的轻量密码硬件：小状态之外还要付出什么 | crypto_ascon | 置换复用与系统资源成本 |
| 07 | HKDF 怎样复用 HMAC：密钥派生硬件的秘密数据路径 | crypto_kdf | 固定模板编排、安全子调用与资源预留 |
| 08 | 分开嵌入 HAC，聚合成为密码加速器：组件化的两种用法 | Suite 产品组织 | 独立复用与完整产品交付如何共用组件 |
| 09 | 密码组件怎样并行与串联：Crypto Component Suite 的组合架构 | CBB / 组件 / Shell / 外部服务 | 实例复制、并行调度、服务依赖及完整数据路径 |
| 10 | CCI 接口怎样描述一条密码任务 | CCI 与服务接口 | 命令、片段、上下文、背压、终结与取消 |
| 11 | Stream、MMIO 与 DMA：同一组密码组件怎样接入 SoC | 三种 Shell | 硬件客户端、CPU、内存队列的接入差异 |
| 12 | 算法、并行度与服务链：怎样配置一套密码加速器 | manifest、产品档位 | 算法选择、实例数、服务组合与合法配置约束 |
| 13 | 算法答案正确之后：AI 辅助密码硬件设计还要验证什么 | Oracle、协议、生命周期、系统验证 | 各层证据如何配合，怎样发现组合错误 |

## 4. 每篇写作任务

### 01：AES 与 SM4

英文拟题：**AES and SM4: Inside a Block-Cipher Datapath**。建议 slug：`crypto-aes-sm4-datapaths`。

从“输入和输出都是一块数据，硬件内部要做多少次变换”进入。先解释分组长度、密钥长度和轮数是不同概念，再分别画 AES 与 SM4 的状态、轮运算和密钥扩展。讨论一套轮电路反复使用、部分展开和流水实现，说明面积、延迟、吞吐与换钥成本分别受什么影响。

两者适合放在同篇比较，但不能画成可直接替换的同一轮函数。选一个固定消息的概念周期图解释迭代，不用无来源的实际频率和面积。模式只预告到下一篇。

配图：双语独立封面；AES/SM4 数据通路对照；迭代与展开示意。依据：两组件 contract 第 2、4 节及公开算法标准。写作前补标准轮操作核对，不将候选微架构写成现有 RTL。

### 02：模式决定硬件组织

英文拟题：**CTR, GCM, and XTS: How Modes Reshape Cipher Hardware**。slug：`crypto-block-modes-hardware`。

从“为什么一颗 AES 核的峰值不能代表所有模式的吞吐”切入。CTR 与 CBC 加密用于解释独立块和反馈依赖；GCM 展开加密通路、GHASH、AAD、长度与 Tag；CCM 用少量篇幅解释 CBC-MAC 的额外计算；XTS 解释数据单元、tweak 和尾块处理，并说明它不提供认证。

把模式按用途分组，避免逐项列 ECB/CBC/CFB/OFB 的公式手册。主案例用 AES-GCM，SM4 对应模式仅说明复用边界；SM4-XTS 是项目命名 profile，不混称为 XTS-AES 标准。KW/KWP、GCM-SIV 留作后续专题，正文只列其增加的安全导入/重读要求。

配图：独立块与反馈对照；完整 GCM 通路；认证成功前暂存、失败后销毁的示意。依据：block_mode_contract、AES/SM4 contract、Shell 认证释放条款。认证暂存给出设计要求，不宣称已有泄漏验证。

### 03：SM3、SHA-2 与 HMAC

英文拟题：**SM3, SHA-2, and HMAC: Why Hash Hardware Needs State**。slug：`crypto-hash-hmac-hardware`。

以一条消息分几次到达为例，解释分块、残块、填充、链值和长度计数；接着说明 SM3/SHA2 的链式依赖为何限制单消息并行。SHA2 的 32-bit 与 64-bit 运算族分别说明，不把后者解释成执行两次前者。

HMAC 的内外层计算、长密钥预处理及授权缓存自然引出“完整消息组件”与“压缩核”的区别。HMAC 属于对应 Hash 组件内部能力，不新增一个独立 HMAC 引擎。普通摘要也不能独立证明消息来源。

配图：多片段汇入压缩链；同核执行 HMAC 内外层；单消息与多上下文并发对照。依据：SM3/SHA2 contract、Oracle hashes 与对应测试。首个可运行演示可选公开 SM3/SHA256 已知答案；具体输出在写作时复核。

### 04：Keccak 算法族

英文拟题：**SHA-3, SHAKE, and KMAC: Multiple Services from One Permutation Core**。slug：`crypto-keccak-sponge-hardware`。

以“摘要长度固定，SHAKE 为什么能继续输出”进入，讲吸收和挤出、rate/capacity、置换状态和域分离。进一步说明同一个置换数据通路如何承载不同服务，以及 cSHAKE/KMAC 需要的编码与定制信息。

HMAC-SHA3 与 KMAC 是不同操作；TupleHash 的元素边界不能靠简单拼接替代；ParallelHash 的串行核复用不自动带来并行加速。扩展函数用一段或一幅图概括，避免把所有公式放入同篇。用长 XOF 输出为后续公平调度埋下问题。

配图：海绵吸收/挤出；共享置换与不同前后处理；有限缓冲下的长输出。依据：Keccak contract 与 Oracle 能力差异。Oracle 已接入部分 SHA3/SHAKE/HMAC-SHA3，不把 KMAC 等缺口描述成已运行示例。

### 05：ChaCha20-Poly1305

英文拟题：**ChaCha20-Poly1305: Coordinating Encryption and Authentication in Hardware**。slug：`crypto-chacha-poly-hardware`。

解释 ARX（加法、循环移位、异或）如何形成 ChaCha 数据通路，Poly1305 如何积累认证值，再把二者连接为完整 AEAD（带附加数据的认证加密）服务。突出一次性 MAC 密钥、计数器、字节序与长度编码。

真实契约细节选 block 0 生成 Poly1305 一次性密钥、payload 从 block 1 开始，帮助读者看到“两个算法接起来”需要明确的规则。软件中常见的性能印象不能直接推导本项目硬件优劣，无查表也不等于无侧信道风险。

配图：ARX 运算示意；密钥生成与 payload/MAC 两路协作。依据：ChaCha contract、Oracle 对应实现及 RFC 8439（正式写作时重新核对）。QUIC 头保护仅作为原语扩展，不宣称完整 QUIC 卸载。

### 06：Ascon

英文拟题：**Ascon Hardware: Looking Beyond a Small State**。slug：`crypto-ascon-hardware`。

从受限设备的资源预算进入，解释 320-bit 状态、置换轮复用以及 AEAD/Hash/XOF/CXOF 服务。与 Keccak 的比较落在状态组织和用途，不能把两种置换直接替换。

本篇的工程发现是：轮函数状态之外，还要计入上下文、密钥副本、部分块和认证暂存。小核心不保证整个子系统都同样小。采用最终标准命名，避免混用竞赛版本；当前 Oracle 中 Ascon 尚属待实现，不安排伪造的运行结果。

配图：置换与消息控制；核心状态和系统缓冲的资源分类图，不画无证据的面积比例。依据：Ascon contract 与 SP 800-232。

### 07：KDF 作为组合服务

英文拟题：**Reusing HMAC for HKDF: Secure Data Paths for Key Derivation**。slug：`crypto-kdf-service-composition`。

这是算法篇通向系统篇的桥梁。用 HKDF 的 Extract/Expand 解释 IKM、salt、PRK、info 与 T(i) 的不同角色，随后介绍 TLS Expand-Label 的结构化输入；KBKDF 只作为后续 HMAC/CMAC/KMAC 服务复用方向。

规划中的 KDF 是固定模板控制器，复用已有服务，不重新建立 Hash 轮函数核。IKM 和前一轮 T(i) 属于秘密消息，仅有 key_handle 端口不能完成复用。讲清受保护消息/结果对象、子服务 credit、安全结果槽，以及父任务占满子服务资源可能造成的环等待。

配图：HKDF 算法角色；父任务→预留子服务→秘密结果槽，明确普通流和安全路径。依据：KDF contract、CCS-03、Oracle 分工。HKDF 纯算法 API 已存在不代表秘密子任务或首批 CCI 已支持该功能。

### 08：独立嵌入与聚合交付

英文拟题：**Crypto Components in HACs and Standalone Accelerators**。slug：`crypto-suite-composition-value`。

开场并列展示同一算法组件的两种部署：一侧直接嵌入其他 HAC，由宿主硬件客户端调用；另一侧与其他算法组件装入共享 Shell，形成面向目标应用的密码加速器。解释为什么算法组件不自带重复 CSR/DMA：宿主可以复用自己的控制、搬运与调度设施，独立加速器则由 Shell 提供这些系统能力。

独立使用仍须满足 CCI 和相关服务契约；带密钥算法需要授权密钥路径，认证解密需要可信暂存与释放机制。宿主不必引入整套 Suite，但必须承担所用能力要求的系统责任。聚合实例按目标 profile 配齐服务，形成对使用者完整的任务入口、执行和交付路径。

必须区分三种组合：组件内部的 GCM/HMAC/KMAC/ChaCha20-Poly1305；KDF 的固定安全子服务调用；Shell 对独立组件的装配、路由和调度。首版不开放任意软件执行图，也不会把 GHASH 的每次乘法送到全局队列。

收益写成可检查的机制：共享系统接入、独立算法演进、按场景裁剪、统一生命周期、复用验证设施。代价同样具体：共享资源竞争、调度和缓冲成本、服务版本依赖、统一接口需要表达不同语义。没有比较数据，不填写节省面积或研发时间的百分比。

配图：同一组件嵌入 HAC 与进入独立密码加速器的双场景主图；三种组合粒度图；外围职责对照按篇幅选用。依据：plan、Shell、manifest、各组件契约；HAC 场景来自用户补充的应用定位，具体宿主集成需后续材料支持。

### 09：组合架构

英文拟题：**Parallel Engines and Chained Services: Crypto Component Suite Architecture**。slug：`crypto-suite-architecture`。

用一条 AES-GCM 解密任务走读完整候选架构：客户端提交 → 准入并预留资源 → 授权与实例绑定 → 数据路由 → 算法认证 → 暂存提交 → 完成交付。再插入一个独立短 Hash 任务，解释每实例缓冲及读写逻辑通道为何重要。

随后用三种拓扑讲可组合性：单组件进入 HAC；多个同类/异类组件并行接入 Shell；固定服务链按依赖调用组件。并行区分核内展开/流水、多上下文交错和多实例复制：它们分别改变运算节拍、资源利用与聚合服务能力，不能统称为单任务加速。增加实例后同步核算密钥服务、输入输出带宽、暂存和完成队列。

串联区分数据依赖与直接流式级联。HKDF 调用 HMAC 是已有规划中的固定安全服务组合；“派生结果提交为句柄，再用于加密”可作后续端到端模板的教学示例，但需单独定义授权、先后依赖、失败处理和整体完成，不标成已支持模板。只有生产者输出语义、消费者输入及安全策略兼容时，才研究直接传递中间结果、减少搬运；有认证屏障或秘密数据的路径不能简单 dout 接 din。首版无任意任务图，灵活串联通过已定义和验收的模板逐步扩展。

架构图分四区：客户端/总线；共享 Stream Shell；算法组件及其局部 CBB；外部 key/staging/entropy 服务。Shell 负责系统资源和交付，组件负责算法及消息状态，CBB 承担局部运算。外部 key manager、密钥库、TRNG/DRBG、firewall、secure_boot 保持独立身份。

讲清算法运算完成、认证确定和结果交付完成三个事件。核心计算快，不等于系统交付快；长输出、密钥等待和暂存也需要预算。首批 FUNCTIONAL 配置不启用熵接口，图中把后续防护熵路径画为可选。

配图：双语完整架构图；独立/并行/串联三种拓扑；一次成功解密的生命周期。长短任务竞争可合入并行拓扑图。依据：plan、Shell、baseline、architecture_review。图上把首批、后续规划和外部依赖区分清楚。

### 10：CCI 与服务接口

英文拟题：**Describing a Cryptographic Task with CCI**。slug：`crypto-cci-interface`。

避免接口信号字典式写法，用“分段 Hash”和“AEAD 解密”两条概念事务讲命令、数据和结果。cmd/din/dout/cpl/mgmt/cap 组成首批公共语义；crypto_secret、crypto_staging、crypto_entropy 分别说明服务职责。

重点解释 task 与 context、request_seq 与 generation 的不同用途；TLAST 结束片段而非整条任务；UPDATE 终结不代表 FINAL 认证；空片段不发数据拍；valid/ready 背压期间内容保持稳定。展示成功、Tag 失败、输出受阻时取消三条不同路径。

CCI 是项目内部接口。示例标成逻辑事务，不伪造已经冻结的位宽、opcode 或真实波形；ready/valid 不等同完整 AXI4-Stream 兼容。秘密数据不走普通 din/dout；候选明文只允许流向可信 staging。

配图：通道职责图；片段与整消息的层次；概念握手和取消时序。依据：baseline、CCI、COM、CCS-01/02。正式线级教程需补读 HWIF 单一来源，缺少时保持事务级叙述。

### 11：三种 Shell 与软件接入

英文拟题：**Stream, MMIO, and DMA: Connecting Crypto Components to a SoC**。slug：`crypto-shell-soc-integration`。

按使用者比较：硬件客户端使用 Stream；CPU 小任务使用 MMIO/PIO；内存大块及并发任务使用 DMA、散列表 SG、提交/完成队列 SQ/CQ。MMIO/DMA 都复用 Stream Shell，共用设计不代表三者容量和完成条件完全相同。

选两个具体取舍讲透：MMIO 若软件等完成才读结果、硬件却等 FIFO 被读才能完成，会形成等待环，因此规划要求完整结果准入预留；DMA 要等必要写响应与提交条件满足，CQ 失败不能发送成功中断。数据可见、CQ 发布、IRQ 通知是不同事件。

软件接口以能力发现、submit/query/cancel 为概念流程，不发布不存在的寄存器地址或驱动。opaque handle 与通用 raw-key setkey 的衔接需要可信 import adapter。DMA、ABI 与驱动仍为后续设计，示例明确标注。

配图：同一 Stream 内核外加两种系统接入层；CPU/队列/组件/内存的完成顺序。依据：三个 Shell contract、CCS-05/06。

### 12：配置与产品档位

英文拟题：**Configuring a Crypto Accelerator: Algorithms, Parallelism, and Service Chains**。slug：`crypto-suite-configuration`。

从“勾选 AES-GCM 就能得到可用加速器吗”切入。区分生成配置、每任务参数和可信安全策略；manifest 描述算法—模式—参数合法组合，不能把几个独立列表的笛卡尔积当成支持矩阵。

配置说明围绕三个用户决策组织：选择哪些算法及模式；各算法配置多少实例、上下文和配套资源；启用哪些已定义的服务组合。用概念配置对比“一路 AES 服务”和“多路 AES 加独立 Hash 服务”，解释并行度可以按各类负载分别配置。串联模板需要列出服务依赖、秘密中间值路径及资源预留，不能仅列算法顺序。实例数和连接结构属于构建期选择；运行时只在实际生成并获授权的能力中选择任务及服务，不暗示支持任意动态重构。未冻结的链配置字段只画概念表，不伪造成现有 schema。

用已有 sm3_stream 和 aes_gcm_mmio 合成配置讲首批 CUSTOM 原型；再用规划中的 NETWORK、SHANGMI、STORAGE、LIGHTWEIGHT 配置说明应用依赖。GENERAL/EMBEDDED 等其余档位放简表，不把每个档位再拆一篇。核心案例是“缺可信暂存就不能开启认证解密”，以及“KDF 有 HMAC 组件但无 secure_service 仍不合法”。

现有 schema/校验器与未来 RTL 装配生成器分别说明。生成器规划输出 SV 顶层、依赖、寄存器/能力/回归等资产，但当前未实现 RTL 装配。禁止把合成配置的 qualification 当成真实 supported 证据。

配图：配置三层；服务依赖图；合法与拒绝配置对照。依据：manifest 系列、schema、两个样例、product_profiles。展示代码前实际校验样例，后续命名产品不冒充首版 schema 已支持。

### 13：AI 辅助设计与证据

英文拟题：**Beyond Correct Answers: Verifying AI-Assisted Crypto Hardware Design**。slug：`crypto-suite-ai-verification`。

以“摘要算对了，但 UPDATE 后明文已经可见”作为标明假设的验证场景，说明算法比对与系统正确性是不同层的问题。组织四层证据：独立已知答案与算法差分；CCI 背压/分段/终结检查；owner/key/暂存/取消生命周期；DMA/队列/软件可见结果。

现有架构审查可用的真实材料包括 MMIO 等待环、KDF 父子资源环、UPDATE/FINAL 混淆、并发暂存预留和提交 ACK 丢失。这些是文档审查发现并收敛的风险，不写成已经在 RTL 运行中出现并修复的故障。

AI 可以辅助把规则变成配置负例、向量、状态模型和测试计划；人的决策落在标准版本、威胁边界、资源策略及证据裁决。Oracle 同后端重算只证明一致性和完整性，候选向量不自动晋级 golden；Mock 证明不了算法；Python 逻辑清空不证明硬件擦除。

配图：算法/协议/服务/系统证据分层；一个审查问题怎样变成验收条件。依据：Oracle architecture/work_packages、测试源码、architecture_review。要把标题升级为“实践成果”，需补可追溯 AI 工作记录和外部目录中的实际运行记录。

## 5. 应突出哪些组合收益

| 设计选择 | 收益来自哪里 | 后续可以怎样验证 |
| --- | --- | --- |
| 独立组件嵌入其他 HAC | 宿主按需取用算法服务，复用既有控制和数据搬运设施 | 对照宿主接口、密钥与暂存责任，验证独立组件集成 |
| 多组件聚合为密码加速器 | 用同一组组件提供目标应用所需的完整任务服务 | 按产品 profile 检查算法、接入、安全服务及错误交付 |
| 按算法配置并行度 | 对热点服务增加实例或调整核内结构，其他服务保持适当规模 | 分别测单任务延迟、聚合吞吐与共享服务瓶颈 |
| 固定模板串联服务 | 统一中间结果、调用依赖及完成处理，具备条件时减少中间搬运 | 检查语义兼容、认证屏障、秘密路径和失败传播；减少搬运需实测 |
| 组件不带重复 CSR/DMA | 同一算法服务可接不同系统入口，外围维护集中 | 固定同一算法配置，对比不同 Shell 的接入工作和真实资源 |
| 内部标准组合留在组件 | 避免细粒度计算经过全局调度，保留算法相关局部状态 | 比较控制/数据移动开销；未实验前只解释机制 |
| KDF 复用安全 MAC 服务 | 复用计算能力，秘密中间值不经公共流 | 算法答案、路径可见性和父子资源前进性分别检查 |
| 统一 CCI 与生命周期 | 算法组件共享客户端、Mock 和错误处理约定 | 新组件接入相同协议检查，核对操作特有语义 |
| 独立缓冲与准入预留 | 隔离受阻通道，避免接受后无处保存结果或完成 | 长 XOF/短摘要、满队列/取消/慢端点等混合负载 |
| manifest 与裁剪 | 按场景选择能力，提前拒绝缺服务和不兼容配置 | 正负配置及实际交付能力逐项对应 |

这些属于设计预期与验证方向，当前不能量化为面积、功耗、性能或研发提效成果。共享也会增加仲裁、缓冲和版本协同成本，需要在实际配置中核算。

## 6. 发布顺序、工作量与延伸选题

推荐阅读/发布顺序保持 01→13，符合先算法后组合的主线。01 的开头放一张小型系列地图，尽早告诉读者这些算法最终要组成什么。07→08 是主转折，08 不重复算法细节，09 不重复收益清单，10 不重讲整套架构。

可分三批制作：01–03 先建立分组密码、模式、摘要/认证基础；04–07 补齐算法家族和派生；08–13 完成系统篇。每批先做事实卡和图示草图，再写中文、英文、正式配图与审阅。可按每周一篇安排约 13 个发布周，但排期服从证据和双语图文准备情况，不以规划日期推断硬件进展。

每篇中文初步预算约 2500–4000 字，接口/系统篇按需要增加，复杂时拆图而不堆长表；英文完整表达同样内容。预算用于控工作量，不作为固定字数要求。篇 01–07 每篇建议 2–3 张讲解图；篇 08–13 每篇 2–4 张；各篇另有独立双语封面。真正数据图只在取得可追溯数据后制作。

可选后续专题：GCM-SIV 的两遍数据访问；KW/KWP 与密钥导入授权；长 XOF 与短任务公平性；Nonce 跨实例及复位管理；同配置的迭代/展开 PPA 实验。等具体证据充分再写，不扩张首轮主线。

## 7. 公开交付与素材要求

正式每篇创建独立 slug 目录，含 README.md 与 README.en.md、文首语言切换、双语独立封面和含文字讲解图。封面使用同一系列配色、篇次和字体层级，主体分别对应轮运算、反馈、压缩链、海绵、双通路、轻量状态、安全派生、组件装配等，不重复通用芯片摆件。

封面路径使用 assets/generated/cover-zh.png 与 cover-en.png，提示词在 notes/cover-prompt.md，来源与哈希在 sources.json。概念图标明原理/规划示意；本策划阶段不生成封面、不创建空文章，也不把待写篇目加入已完成文章计数。

公开正文直接呈现必要方法和图示；不得链接本策划或 reference 内部材料。每篇均保留自己的图源和事实卡，不依赖另一篇内部目录。涉及已运行结果时记录输入、版本、配置和边界；源文档里的历史测试数量不能当作本次复测成绩。

根索引在正文实际创建时增加双语入口与各自状态。每批运行 node scripts/check-content.mjs，再核对数字、术语、图文、私有链接及导出内容。提交、推送和发布另依用户授权。

## 8. 内部来源与补证清单

以下基路径相对仓库根，仅供编辑定位：

`reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/security/crypto/`

- 系列边界、路线、产品：crypto_component_suite/README.md、docs/plan.md、docs/product_profiles.md。
- 当前基线与版本差异：docs/baseline.md、docs/contract_index.md、docs/implementation_common_contract.md。
- 组合、接口、交付：docs/crypto_component_interface_contract.md、docs/crypto_accelerator_shell_contract.md、docs/service_lifecycle_contract.md、docs/block_mode_contract.md。
- 算法硬件依据：crypto_sm3、crypto_sha2、crypto_keccak、crypto_aes、crypto_sm4、crypto_chacha_poly、crypto_kdf、crypto_ascon 各目录下同名 contract，重点第 2、4 节。
- 接入细节：crypto_shell_stream、crypto_shell_mmio、crypto_shell_dma 各目录下同名 contract。
- 配置：Suite docs/manifest_and_configuration.md、manifest_schema 系列、schema/manifest.schema.json、examples/manifests/sm3_stream.yaml 和 aes_gcm_mmio.yaml。
- 证据分层：Suite docs/architecture_review.md、docs/oracle_architecture.md、docs/oracle_work_packages.md、oracle/README.md、oracle/crypto_oracle 与测试源码。
- 首批需求入口：SM3、AES、Stream、MMIO 的 docs/lrs/index.md；本轮未进行逐条 LRS 与源码一致性审计。
- 已有公开稿：ai-pqc-rtl/README.md；同时只读列举 pqc/docs/ai-pqc-blog-publish.zip，包含 ai-pqc-rtl.md/html 及 8 张图。本轮未解压、未导入，原来源哈希可见现有 ai-pqc-rtl/sources.json。PQC 不纳入 Suite。

本轮核对了上述规划、公共基线、算法硬件约束和 Oracle 说明，未执行参考工程中的脚本，未写入 reference。其余细化契约、工具源码、全部 LRS 和标准向量按各篇需要再逐项核对。

本轮另核对公开一手页面，可用于正式正文的外部引用：AES 的分组与密钥定义见 [FIPS 197](https://csrc.nist.gov/pubs/fips/197/final)；SHA3/SHAKE 的标准范围见 [FIPS 202](https://csrc.nist.gov/pubs/fips/202/final)；HKDF 的 Extract/Expand 及输入角色见 [RFC 5869](https://www.rfc-editor.org/rfc/rfc5869.html)；Ascon 的最终标准入口见 [SP 800-232](https://csrc.nist.gov/pubs/sp/800/232/final)。其他标准链接在正式撰稿时访问原文并冻结版本，不把源规划中的“已核实”直接当成本轮核查。

首批写作前优先补三项：算法图的标准步骤与字节序核对；引用运行示例的独立答案和实际运行记录；AI 参与方式的可追溯证据。篇 10 若需要具体信号表，另补 HWIF YAML；篇 11 若需要可执行软件教程，另补真实 RDL/ABI/驱动。当前资料已足够开展设计原理系列，无需等待全部 RTL 才开始写作。
