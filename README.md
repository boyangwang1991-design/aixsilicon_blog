# AixSilicon Blog

面向微信公众号及其他公开平台的技术博客写作仓库，核心主线是 **AI 辅助芯片研发**。

通过具体工程实践讲清 AI 怎样参与需求、架构、实现、调试和验证，以及人怎样判断结果。文章应有吸引力、技术扎实、行文自然：用真实问题、设计取舍和证据吸引读者，保留工程师的判断，减少套话、口号与模板化表达。详细写作标准见 [AGENTS.md](AGENTS.md)。

## 文章索引

功能安全专题已建立[《芯片功能安全：从原理到 IP 实战》中文主索引](functional-safety-series/INDEX.md)、[设计到评估的全流程地图](functional-safety-series/PROCESS-MAP.md)及 30 章独立中文主线初稿。全部 30 章现有中文讲解图；按当前要求未制作英文版与封面，工程素材、技术审稿和发布审阅仍待完成。

目前总索引收录 **14 篇文章及 Gemma 4、功能安全、APB VIP、AXI VIP、AXI4-Stream VIP、AHB VIP 六个系列**。APB VIP 系列已有 8 章中文内容稿及 29 张讲解图；AXI VIP 和 AXI4-Stream VIP 系列各有 8 章中文内容稿及 6 张讲解图，分别围绕读写事务与流传输展开 AI 研发、可信证据、接入实践和反馈改进。AHB VIP 系列已有 8 章中文内容稿和 4 张讲解图，以地址/数据流水和四端口自验证为主线。四个 VIP 系列均待补真实波形、英文版与发布审阅。下列顺序按主题编排，不代表发表时间；“已提取”不等于已完成发布审核。

原有 14 篇文章均提供中文与英文全文，以及对应语言的独立封面。Gemma 4 系列已有 19 章中文改稿，各章已配中文独立封面和正文讲解图，其中部分外部原图仍作为待授权或替换的 draft 资源保留；英文正文与英文配图按当前安排暂缓。封面采用概念插画，具体机制与工程证据见正文。

| 主题 | 中文版 | 中文状态 | English edition | 英文状态 |
| --- | --- | --- | --- | --- |
| AHB / VIP / AI 辅助流水总线验证 | [AI 辅助芯片验证：AHB VIP 的研发与实战](ahb-vip-series/README.md) | 8 章中文内容稿；4 张讲解图；待补波形与发布审阅 | 待补 | 待补 |
| AXI4-Stream / VIP / AI 辅助流接口验证 | [AI 辅助芯片验证：AXI4-Stream VIP 的研发与实战](axi-stream-vip-series/README.md) | 8 章中文内容稿；6 张讲解图；待补波形与发布审阅 | 待补 | 待补 |
| AXI / VIP / AI 辅助研发与复用 | [AI 辅助芯片验证：AXI VIP 的研发与实战](axi-vip-series/README.md) | 8 章中文内容稿；6 张讲解图；待补波形与发布审阅 | 待补 | 待补 |
| APB / VIP / AI 辅助研发与复用 | [AI 辅助芯片验证：APB VIP 的研发与实战](apb-vip-series/README.md) | 8 章中文内容稿；29 张讲解图；待补波形与发布审阅 | 待补 | 待补 |
| Gemma 4 / 端侧芯片 / 系列中文稿 | [Gemma 4 从算法到端侧芯片](gemma4-on-chip-overview/README.md) | 19 章中文改稿；各章封面与讲解图已配；外部原图仍为 draft | 待补 | 待补 |
| IP / 工程交付 / AI | [为什么 AI 写 RTL 容易，做一个真正可交付的 IP 很难？](why-ai-rtl-is-not-deliverable-ip/README.md) | 图文齐备；待发布审阅 | [Why Is Generating RTL with AI Easier Than Delivering a Reusable IP?](why-ai-rtl-is-not-deliverable-ip/README.en.md) | 图文齐备；待发布审阅 |
| IP / AI-Native / 研发方法 | [从 Spec 到 RTL：我正在尝试一种 AI-Native IP 研发流程](spec-to-rtl-ai-native-ip-workflow/README.md) | 图文齐备；待发布审阅 | [From Spec to RTL: Building an AI-Native IP Development Workflow](spec-to-rtl-ai-native-ip-workflow/README.en.md) | 图文齐备；待发布审阅 |
| IP / GPIO / AI 辅助研发 | [用 AI 从头开始设计一款 GPIO](ai-assisted-gpio-development/README.md) | 图文齐备；待发布审阅 | [Designing a GPIO from Scratch with AI](ai-assisted-gpio-development/README.en.md) | 图文齐备；待发布审阅 |
| IP / WDT / AI 辅助研发 | [用 AI 从头开始设计一款 WDT](ai-assisted-watchdog-development/README.md) | 图文齐备；待发布审阅 | [Designing a Watchdog from Scratch with AI](ai-assisted-watchdog-development/README.en.md) | 图文齐备；待发布审阅 |
| AI / ESL / NPU Mesh | [AI 核里的数据怎样流动？用 AI 辅助 ESL 探索 Mesh 架构](ai-assisted-npu-mesh-exploration/README.md) | 图文齐备；待发布审阅 | [How Does Data Move Inside an AI Core? Exploring Mesh Architecture with AI-Assisted ESL](ai-assisted-npu-mesh-exploration/README.en.md) | 图文齐备；待发布审阅 |
| CBB / 功能安全 / PPA | [谁来检查比较器？AI 辅助多样性比较器设计与 PPA 取舍](ai-assisted-diversity-comparator-design/README.md) | 图文齐备；待发布审阅 | [Who Checks the Comparator? AI-Assisted Diversity Comparator Design and PPA Trade-offs](ai-assisted-diversity-comparator-design/README.en.md) | 图文齐备；待发布审阅 |
| CBB / PPA | [让 AI 带着综合结果改 RTL：一次 CBB 设计与 PPA 探索](ai-assisted-cbb-and-ppa-exploration/README.md) | 图文齐备；待发布审阅 | [Let Synthesis Guide AI-Assisted RTL Design: A CBB and PPA Exploration](ai-assisted-cbb-and-ppa-exploration/README.en.md) | 图文齐备；待发布审阅 |
| ESL / NPU SRAM | [让 AI 先跑一轮架构实验：NPU SRAM 的 ESL 建模实践](ai-accelerated-esl-modeling/README.md) | 图文齐备；待发布审阅 | [Explore Architecture Before RTL: AI-Assisted ESL Modeling of NPU SRAM](ai-accelerated-esl-modeling/README.en.md) | 图文齐备；待发布审阅 |
| IP / Secure APB Demux | [AI 辅助设计外设访问控制 IP：从请求拦截到权限原子更新](ai-assisted-parameterized-ip-development/README.md) | 图文齐备；待发布审阅 | [AI-Assisted Peripheral Access Control: Request Filtering and Atomic Policy Updates](ai-assisted-parameterized-ip-development/README.en.md) | 图文齐备；待发布审阅 |
| IP / AXI MPU | [给片上内存加一道权限检查：AI 辅助 AXI MPU 研发实践](ai-assisted-generator-ip-development-v2/README.md) | 图文齐备；待发布审阅 | [Checking Access to On-Chip Memory: AI-Assisted AXI MPU Development](ai-assisted-generator-ip-development-v2/README.en.md) | 图文齐备；待发布审阅 |
| IP / SPI2APB | [用一条 SPI 链路访问片内外设：AI 辅助 SPI2APB 设计与验证](ai-assisted-spi2apb-ip-development/README.md) | 图文齐备；待发布审阅 | [Reaching On-Chip Peripherals over SPI: AI-Assisted SPI2APB Design and Verification](ai-assisted-spi2apb-ip-development/README.en.md) | 图文齐备；待发布审阅 |
| IP / PQC | [我让 AI 设计后量子密码加速器：从一条命令，到可验证的电路](ai-pqc-rtl/README.md) | 图文齐备；待发布审阅 | [Designing a Post-Quantum Cryptographic Accelerator with AI: From Commands to Verified RTL](ai-pqc-rtl/README.en.md) | 图文齐备；待发布审阅 |
| VIP / AXI4 | [AI 辅助开发 AXI4 VIP：让验证代码成为可复用的工程资产](ai-assisted-vip-development-and-reuse/README.md) | 图文齐备；待发布审阅 | [AI-Assisted AXI4 VIP Development: Making Verification Code Reusable](ai-assisted-vip-development-and-reuse/README.en.md) | 图文齐备；待发布审阅 |
| SoC Studio | [AI Native SoC Studio，为什么先做工程模型？](soc-studio-from-diagram-to-design/README.md) | 中文已补真实截图与五张文生图；待发布审阅 | [SoC Studio: Bringing the Whole Chip Design Together](soc-studio-from-diagram-to-design/README.en.md) | 旧稿；待与新版中文同步 |

既有 12 篇文章的英文封面另备 [4:3 版本预览与下载](notes/covers-en-4x3.md)，文件名统一为各篇 `assets/generated/cover-en-4x3.png`。

## 目录约定

- 根目录 `README.md` 是总索引，每篇博客在根目录下拥有一个独立文件夹，中文正文为 `README.md`，英文正文为 `README.en.md`，文首相互切换。
- 每篇的 `assets/` 保存配图、绘图源文件和原编辑说明，`sources.json` 保存逐文件来源、导入时 SHA-256 和修复的原始链接。
- [AGENTS.md](AGENTS.md) 记录本项目的编辑与协作规则，也是 Agent 自动发现入口。
- `reference/` 是本地只读参考资料，已忽略，不提交 GitHub。
- 参考工程的 GitHub 仓库不会公开。发布正文须自包含，不链接私有仓库、`reference/` 或内部编辑资料；`sources.json` 与 `notes/` 用于内部追溯，不随文章导出。

```text
aixsilicon_blog/
├── README.md                    # 全部博客的索引
├── AGENTS.md                    # 写作与协作规范
├── ai-pqc-rtl/                  # 一篇博客一个文件夹
│   ├── README.md                # 中文正文
│   ├── README.en.md             # 英文全文
│   ├── assets/                  # 图片与配套资料
│   └── sources.json             # 来源记录
├── …/                          # 其他博客，结构相同
├── scripts/check-content.mjs    # 内容检查
└── reference/                  # 其他仓库，只读且不上传
```

## 后续写作

1. 在根目录创建英文小写连字符命名的文章文件夹，例如 `ai-chip-design-notes/`，中文与英文全文分别写入 `README.md` 和 `README.en.md`。
2. 配图与图源放在该篇 `assets/`，正文使用相对路径。需要时增加 `notes/` 保存笔记、`exports/` 保存导出文件，不必预先创建空目录。
3. 在上方索引添加主题、双语标题链接及各自状态（如草稿、待校对、已发布）。参考已有资料时记录来源；原创文章不要求导入哈希。
4. 完成修改后运行 `node scripts/check-content.mjs`。HTML 等导出不是正文的编辑入口，正文修改后应重新生成相应导出。

## 整理范围与待办

初始迁移保留了原文及相关配图，后续按篇优化。历史稿件仍含上游工程链接和内部编辑资料入口；由于这些工程不会公开，发布前须将必要说明融入正文，并清理这些引用。内部来源记录继续保留，不能把当前迁移状态视为已满足发布要求。

SoC Studio 中文稿已补真实网页截图和机制图；英文仍为旧稿，待同步后才能作为双语发布。文章中的功能状态与非 EDA 验证边界在发布前仍需复核。

本次检索了 7 个已解压参考仓库；`aixsilicon_skill_repo` 和 `wenwang-edgenpu` 未发现独立博客稿。其余 README、需求、设计和报告未作为博客收录。外层仓库 ZIP 包不重复导入；PQC 博客单独封装在工程内的 `docs/ai-pqc-blog-publish.zip`，已补充提取，其压缩包路径、内部条目及哈希记录在 [PQC 来源记录](ai-pqc-rtl/sources.json)。后续检索也需检查嵌套发布包。

PQC 的 [原 HTML 发布版本](ai-pqc-rtl/assets/ai-pqc-rtl.html) 按原样保留，后续编辑以该篇 README 为准。

## 内容检查

执行 `node scripts/check-content.mjs` 检查本地 Markdown 链接、图片、文章索引和参考目录忽略状态。

旧布局的一次性导入脚本已移除。后续直接在各篇文件夹内写作，来源记录保留在对应文章旁。
