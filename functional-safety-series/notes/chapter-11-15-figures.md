# 第 11–15 章中文讲解图记录

内部编辑资料，2026-10-01。按当前用户要求，仅制作中文正文图，不制作英文图或封面。十张图均为 1600 × 900 的概念/教学 SVG，不能当作目标 IP 的实测、仿真波形或覆盖率证据。可编辑生成源为 `assets/diagrams/build-chapters-11-15.mjs`；从系列根目录执行 `node assets/diagrams/build-chapters-11-15.mjs` 可再生成。图中配色统一为深蓝结构、青色允许/受控路径、琥珀色待处理情况、红色失败与灰色边界。

| 图 | 要回答的问题 | SHA-256 |
| --- | --- | --- |
| `assets/generated/chapter-11-lbist-architecture.svg` | PRPG、扫描链、被测逻辑、MISR、签名比较与控制结果怎样衔接？ | `2e3f11fd33d546feab77dca2b6663e9ff6a16ff085ea78378fe2ba5262e7ed74` |
| `assets/generated/chapter-11-lbist-sequence.svg` | LBIST 的启动测试何时能放行，未运行、超时、签名不符或恢复失败时怎么办？ | `c5b4d9e51d1a3a35262c6b41fab74959c6bb3d6b649ab96981d2eaa765a30317` |
| `assets/generated/chapter-12-observation-points.svg` | 数据完整性、协议、响应与活性问题分别在哪个观察点发现？ | `71c88ecb64a1ac5b70fbf2bbe479a70a0f3225611cc3bdf0d1e4d1332c2d5e83` |
| `assets/generated/chapter-12-fault-matrix.svg` | 同一 AXI 事务的不同故障，为什么需要不同的注入点和判据？ | `2e19e50eb210701e6cb2a3e3f739fc2352a0bdcf254e4f89fb768a9354298038` |
| `assets/generated/chapter-13-e2e-path.svg` | 生产者到消费者的 E2E 检查如何组合内容、身份、顺序和时间？ | `45b98bef9336585ff0d2b8aa0f1a320ce3c8a21d476c05672a7e1c58d33d668c` |
| `assets/generated/chapter-13-e2e-faults.svg` | 六类故障由什么字段发现、接收端如何处理、保护边界在哪里？ | `3b972519f25f4c823e4882be463e7c508c3f66a7c99a80ce07ecb53dd15a1ced` |
| `assets/generated/chapter-14-access-decision.svg` | CPU 与 DMA 的访问请求经权限判定后如何允许或拒绝？ | `cdc329bc3c9b4ccfb52c07c31e9fda1de09ff588a2c7af20a2b109eade6eb5a5` |
| `assets/generated/chapter-14-policy-update.svg` | 策略切换中的在途事务与中间态为什么需要定义？ | `b5ef9dff9c68fbabc457746a6d80419d9150f7663e0a01f3cf80852926991c65` |
| `assets/generated/chapter-15-error-path.svg` | ECC 错误的数据有效性控制、事件锁存和软件响应是什么关系？ | `2ab9cadaa12f233e4e2445c21130631c3fa35cdd668330e6a9ccfc5e5eff060a` |
| `assets/generated/chapter-15-response-timing.svg` | 检出到通知与真正受控动作的时间如何区分，普通 IRQ 被屏蔽时如何判断？ | `9e333849c65b11e3434a1a90029f507e42d509048fa637974cb7cc68f4bfa3a4` |

## 绘制和核对

每张图先以正文中的具体问题确定对象、箭头、故障分支和边界，再用代码原生绘制成 SVG。全部十张已用 Chrome 以 1600 × 900 渲染并逐张检查中文、箭头、空间和图文关系；第 11 章两图的长句已在复查中缩短并重新渲染。原理图中的规则、时间和动作是教学配置，不暗示所有器件均如此实现；目标 IP 的配置、诊断能力和检测时间仍需工程核对。

公开资料核对起点：第 11 章的 [Infineon Logic-BIST](https://documentation.infineon.com/aurixtc4xx/docs/pvz1545137908465) 与 [TI J721E LBIST](https://software-dl.ti.com/jacinto7/esd/processor-sdk-rtos-jacinto7/08_06_00_12/exports/docs/sdl/sdl_docs/userguide/j721e/modules/lbist.html)；第 12 章的 [Arm AMBA 规范入口](https://www.arm.com/architecture/system-architectures/amba/amba-specifications)；第 13 章的 [AUTOSAR E2E Library 规范](https://www.autosar.org/fileadmin/standards/R4.3.1/CP/AUTOSAR_SWS_E2ELibrary.pdf)；第 14 章的 [Infineon AURIX 安全架构资料](https://documentation.infineon.com/aurixtc3xx/docs/owq1745576218449)。第 15 章的错误路径是概念模型，具体 IRQ/NMI、锁存、屏蔽和硬件直达路径必须按目标设计验证。
