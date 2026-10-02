# AI 辅助芯片验证：AHB VIP 的研发与实战

简体中文｜英文版待补

**状态：8 章中文内容稿，4 张中文讲解图；真实波形、英文版与最终发布审阅待补。暂不制作封面。**

当前地址已经指向下一个目标，返回数据却仍属于上一笔访问。AHB 的这个流水特征贯穿整个系列：协议怎样表达它，AI 怎样实现驱动与观察器，独立测试怎样发现错配，以及组件怎样进入更复杂的验证环境。

主案例是已存在的四发起端、四目标自验证环境，包含不同等待长度、共享存储模型与读回检查。它提供实际组件装配的证据，面向新产品 IP 时仍需建立该 IP 的功能预期。

## 阅读顺序

| 章节 | 主要问题 |
| --- | --- |
| [01 AI 辅助 AHB 验证，怎样留下可复用的 VIP？](chapters/chapter-01.md) | 系列理念与阅读入口 |
| [02 AI 开发 AHB VIP，先看懂地址与数据的交错](chapters/chapter-02.md) | 地址/数据阶段、等待、突发与不同协议配置 |
| [03 AI 设计的 AHB VIP，怎样分开驱动、观察与判断？](chapters/chapter-03.md) | 实际组件、观察事件、存储、RAL 与桥接适配 |
| [04 用 AI 开发 AHB VIP，怎样避免驱动和检查器一起算错？](chapters/chapter-04.md) | 用独立向量和源码变异约束 AI 产出 |
| [05 AI 设计的 AHB VIP，现有证据说明了什么？](chapters/chapter-05.md) | 三配置资格范围与实际执行批次 |
| [06 AI 设计的 VIP 实战：四个发起端怎样访问四个 AHB 目标？](chapters/chapter-06.md) | 地址分配、数据阶段返回选择与提交次数 |
| [07 AI 辅助 AHB 调试：先分清等待、失败和真正的提交](chapters/chapter-07.md) | 等待、ERROR、复位及重放的定位方法 |
| [08 AI 辅助芯片验证，让 AHB VIP 带着经验进入下一项目](chapters/chapter-08.md) | 项目反馈、公共组件边界和版本更新 |

首次接触 AHB 建议顺序阅读。关注可信度可先读第 4、5 章；准备接入项目可先读第 3、6 章，再查看第 7 章的调试线索。

## 结果与材料边界

当前依据 AHB VIP 0.1.0 的三配置有限范围资格结果写作，最终资格批次为 `ahb-0.1.0-release-20260930-r3`，实际执行来自 r2。工具条件为 VCS W-2024.09-SP1、UVM 1.2、FuseSoC 2.4.7、seed 1。正文区分实现能力、资格结果与未来项目的接入建议；本次没有重新运行 EDA 仿真。

协议资料入口为 [Arm AMBA AHB Specification，IHI 0033](https://developer.arm.com/documentation/ihi0033/c/)。Classic AHB 的 RETRY/SPLIT 另按 AMBA 2 语义讨论，不混入 AHB-Lite。本文对关键概念直接解释，不要求读者访问内部源码或报告。

4 张讲解图由 ImageGen 生成，均为原理示意，不是仿真截图。真实波形将在构造场景后使用 Verdi 截图补充。

关联阅读：[APB VIP 系列](../apb-vip-series/README.md)、[AXI VIP 系列](../axi-vip-series/README.md)、[AXI4-Stream VIP 系列](../axi-stream-vip-series/README.md)。
