# 第 16–30 章中文讲解图记录

内部编辑资料，2026-10-01。按用户要求，只制作中文正文讲解图，不制作英文图或封面。第 16–30 章正文最终选用 30 张 Codex 内置 ImageGen 生成的 PNG 教学示意；不是目标 IP 的 RTL 截图、仿真波形、故障覆盖率或产品认证结果。`assets/diagrams/build-chapters-16-30.mjs` 与同名 SVG 是内容规划和可编辑底稿，未被正文引用；原 SVG 的哈希仍记录在 `notes/chapter-16-30-figure-manifest.json`。最终 PNG 的用途、逐图初始提示规格、修订记录、尺寸与 SHA-256 见 `notes/chapter-16-30-imagegen-manifest.json`；末次 ImageGen 修订调用的完整提示词见 `notes/chapter-16-30-final-prompts.md`。

| 章节 | 图 1 回答的问题 | 图 2 回答的问题 |
| --- | --- | --- |
| 16 | 多源事件怎样锁存、分类、路由到系统动作？ | 调试掩码残留怎样让真实 ECC 错误静默？ |
| 17 | 一次注入从激活到最终动作留下什么证据？ | 记录字段、典型误判与统计归类如何对应？ |
| 18 | 正常事务与故障注入怎样并行进入 DUT，判据从何而来？ | 故意破坏安全性质后 checker 应怎样失败？ |
| 19 | 指定安全目标下怎样依次判断 SPF、RF、MPF？ | 100 FIT 教学账本和 SPFM/LFM 的分母怎样读？ |
| 20 | FMEDA 每行的失效率、模式分布和诊断有效性从哪里来？ | DC、SPFM、LFM、PMHF 与系统性错误的结论边界是什么？ |
| 21 | SG/FSR 怎样追到 TSC、IP 行为、接口和证据？ | 报告窗口变化会影响哪几层资料？ |
| 22 | 共享资源如何击穿安全岛独立性与最终动作？ | 五种故障情境分别需要什么观察和资源？ |
| 23 | 字级 ECC 通过后还需建立哪些内容与版本信任？ | A/B 更新各阶段掉电后能选哪份参数？ |
| 24 | 量程内错误沿模拟链怎样进入软件？ | 五类故障与候选诊断怎样配对，限制是什么？ |
| 25 | “加 ECC”如何分配为 TSC、IP 和系统动作？ | IP 安全需求怎样写成接口、观察点和集成责任？ |
| 26 | DFMEA、FTA、DFA、FMEDA 的不同入口是什么？ | 同一顶事件怎样跨四种分析反向修订架构？ |
| 27 | IP 能力经 Safety Manual 与 SoC 核对怎样形成受限结论？ | 五项 AoU 怎样留下集成证据？ |
| 28 | 安全主张怎样由同一基线的设计、分析和验证支撑？ | 确认审阅、审核、评估、第三方证书与量产交接怎样区分？ |
| 29 | Mini Safety SoC 的读请求、数据返回与错误动作路径怎样分开？ | 故障激活至受控动作的最坏时间怎样与 FTTI 比较？ |
| 30 | AI 候选、工具反馈和工程决定怎样进入研发链？ | DUT 与 checker 同源遗漏 `valid` 时如何用独立需求和变异测试纠正？ |

SVG 底稿曾用 Chrome 渲染检查。ImageGen 成图随后逐张核对了中文、箭头方向、故障分类和正文关系；第 16 章掩码状态、第 18 章 UE/valid、第 19 章 SPF/RF 分支、第 22 章共享资源和第 23 章 NVM 放行条件做过针对性修图。第 19 章 100 FIT 是正文已有的显式教学假设，不是任何真实芯片的指标。新图仍属中文初稿的教学图，英文版与发布前手机排版复核待后续阶段完成。

标准版本与边界核对：[ISO 26262-5:2018](https://www.iso.org/standard/68387.html)当前仍为已发布硬件研发版；[ISO 26262-11:2018](https://www.iso.org/standard/69604.html)为资料性半导体指南；[ISO 26262-8:2018](https://www.iso.org/standard/68390.html)涵盖分布式开发接口、配置、变更和验证等支撑过程。第 23、24 章的器件例子另参考 [Infineon TRAVEO 更新资料](https://documentation.infineon.com/traveo/docs/eyn1762021324263)与 [TI ADC 信息冗余示例](https://software-dl.ti.com/jacinto7/esd/processor-sdk-rtos-j721s2/11_02_01_03/exports/docs/pdk_j721s2_11_02_01_08/docs/userguide/j721s2/modules/ip_fma/adc6.html)。这些公开资料不证明本系列候选 IP 的实现状态；真实配置、故障模型、时限和覆盖率仍待工程记录核对。
