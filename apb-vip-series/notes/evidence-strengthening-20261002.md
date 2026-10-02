# 全文实证深化核对（2026-10-02）

本次更新第 1～8 章与专题入口。目的：将“已实现、可信、可在 IP 中使用”落实到源码调用、运行报告和检查机制，避免只增加通过数字。中文先行；现有 8 张图技术关系不变，无新增图片或封面。

交付检查：内容脚本通过，16 articles / 677 local links；限定范围 git diff --check 无空白错误；公开章节的 reference 路径、机器路径、内部 notes 入口和私有 repo 链接扫描无匹配。未提交、推送或发布。

## 新增证据与边界

源目录：
- VIP：reference/aixsilicon_vip_repo-main/vip/amba/apb/
- IP：reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/infrastructure/apb/apb_secure_demux/

| 事实 | 来源 | 表达边界 |
| --- | --- | --- |
| 冻结专项与依赖消费者通过 | VIP reports/regression.md、qualification.md | 保存下来的报告；非本次重跑，原始日志未逐项取得 |
| 消费者依赖 APB、创建 cfg/interface | VIP self_test/fusesoc_consumer/consumer_core.yaml、apb_consumer_tb.sv | 仅打包、依赖、类型构建与短运行；没有业务事务，不当成功能复用实证 |
| IP 声明依赖 APB VIP 1.0.0 | IP aixsilicon_ip_apb_secure_demux.core | 版本标识不等同于 9 月 28 日冻结快照 |
| 上游 master、逐端口 slave、monitor | IP verification/env/apb_secure_demux_env.sv | 实际类型与创建，非建议拓扑 |
| APB4、STRB/PROT 配置 | IP verification/env/apb_secure_demux_env_cfg.sv | 当前项目配置 |
| product sequence 使用 apb_item | IP verification/env/apb_secure_demux_virtual_sequence.sv | 侧带时序属于当前项目；不把旧 driver 时序注释套到新 VIP |
| 构建元数据适配、源哈希复核 | IP scripts/prepare_uvm_dependencies.py | 工作目录中生成适配元数据，外部源码不改变；不描述为零适配 |
| 三拍等待与部分写冒烟序列 | IP verification/tc/tc_apb_secure_demux_apb_smoke.sv | 节选代码顺序保留，仅调整空格；是现存用例源，不伪装为原始运行日志 |
| 4+12+1 个 UVM 场景 | IP verification/sim/regression_list.yaml | 当前清单的 17 个 SV 用例；另 3 个 extended 静态入口不计入。历史报告独立支持 17/17 总数，无逐例原始日志时不编造逐例结果表 |
| 禁止关闭 RM/checker、非空完成集合 | IP env.sv、checker.sv | 防空跑机制非充分覆盖保证 |
| 退出码 + parsed PASSED + 原生错误 | IP scripts/run_uvm.py | 源码中的判据，非本次执行输出；实际 parse_uvm_log 定义来自套件，不扩展声称其内部规则 |
| 输入、二进制、日志哈希与输入不变性 | IP scripts/run_uvm.py | 现存执行脚本机制；未核验不在快照内的 execution.json |

## 全文叙事调整
1. 入口改为实际 Secure Demux 使用场景；先给 VIP 和 IP 各自成果，保留批次区别。
2. 架构连接到实际 APB4 使用。
3. 定向响应的输入预期与已有专项报告对应；AI 工作流仍作为方法表达。
4. 明确公共行为测试、依赖消费者和产品功能验证的分工。
5. 源码声明、调用、构建适配及非空检查使复用具体化。
6. 从真实冒烟用例入手，解释 17 项场景和通过判据；保留已有真实 events stdout。
7. 新需求优先组合现有等待/错误入口，是否改 VIP 由复现判断。
8. 用 Secure Demux 收束主线，AXI 经验只保留为跨 VIP 方法借鉴。

## 只读与证据审阅
本轮只读检索了相关目录（包含 hidden/no-ignore 的 .log、execution.json 和压缩包名称），未找到可用于补充逐例运行结果的原始 UVM execution.json 或日志。已有 PQC 独立发布 zip 的只读条目审阅与哈希记录继续沿用，不将其用作 Secure Demux 的运行证据。未在 reference 执行构建或写入。无本轮仿真、收益倍数、认证或全参数覆盖声明。

关键解释条件继续保留在正文：VIP 9/28 与 IP 9/14 是不同批次，典型配置不是全参数验证，消费者加载不是产品功能验证，覆盖汇总不是 URG 数据库覆盖。本轮没有原始 AI 会话，不编造操作过程。内部源路径只在 notes 记录。
