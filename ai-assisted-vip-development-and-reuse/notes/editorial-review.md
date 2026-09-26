# AXI4 VIP 编辑核对

日期：2026-09-26。仅阅读工程快照并改稿，没有重跑仿真、修改 reference 或重新判定 VIP 资格。

## 事实与时间口径

主资料根：reference/aixsilicon_vip_repo-main/aixsilicon_vip_repo-main/vip/amba/axi4。

- reports/run_log.md S08：79/79 golden cases、unaligned 地址计算读写对称错误、5 处期望/用例问题。对应 src/axi4_memory.sv 与 unit_test/axi4_unit_memory.sv。图 2 是独立检查的机制示意，不声称工程测试恰好采用图中的逐格检查实现。
- reports/run_log.md S06/S08：协议事实核对、运行时模型、局部需求编号、L1 unit 机制回写 Skill。当前 Skill 是后续演进版本，不能将其中所有条款倒推为当时产物。
- 2026-09-04 run_log 与上级 vip/amba/defects.md：默认 READY 在构造函数中赋值；unit 84/84；新增 B 回填 8/8 专项，full 10 tier。旧 gate_status.md 的79/79、9/9仍是旧阶段摘要，正文明确区别时间，不合并为一轮结果。
- reports/mutation/mutation_report.md：四类非法事务4/4检出、early-WLAST双侧monitor检出2次。正文只引用四类指定注入，不把双侧事件当两个独立案例，不声称完整 mutation 100%。
- docs/architecture.md §8：公共语义函数复用，但Checker规则判定与Reference/Model独立。正文不宣称代码完全独立即可证明独立性。
- docs/user-guide.md、接口与配置源码：参数化、主/从/被动模式、高层API、版本依赖形态。参数可调不等于全参数验证。
- MPU 环境未见本套 AXI4 VIP 依赖导入：reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/security/firewall/memory_protection_controller/verification/env/axi_mpu_env_pkg.sv。正文和图4明确为接入方案，未写成既成复用验收。
- 实际 x2p 集成反馈见 vip/amba/defects.md，正文只引用默认值、响应检查的修复，不宣称 x2p 全部回归通过。

## 内部保留的限制

G4覆盖收敛、G5资格、G6发布未全通过；旧Gate、mutation报告和后续日志存在时间差。后续记录撤回FI-015 exclusive早期PASS：has_response宽松条件曾掩盖未真正检查EXOKAY，修复B回填后暴露独立exclusive问题；本稿不采用该项正面结论。x2p sanity/burst通过但timeout曾失败，不声称完整集成通过。未给出工时统计或量化提效。正文保留验证范围与阶段条件，不展开内部问题清单。

## 发布检查

删除正文所有私有仓库链接、内部文件索引和源码可公开访问承诺。四张新图与现有封面均在本篇资产目录。素材记录与哈希留在 notes 和 sources.json，不由正文链接。
