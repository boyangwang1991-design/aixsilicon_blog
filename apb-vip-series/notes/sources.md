# APB VIP 专题来源与核对记录

内部编辑资料，不从公开正文链接。本轮核对日期：2026-10-01。路径相对博客仓库根目录，参考工程只读；source-snapshot.json 保存文件哈希及独立发布包条目哈希。快照哈希不代表重新验证通过。

## 基线与来源分层

当前 VIP 基线为 `reference/aixsilicon_vip_repo-main/vip/amba/apb/`。消费方位于 `reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/`，属于各自的历史快照，不能与当前 VIP 基线拼接成同一次运行。

| 来源 | 支撑内容与当前章节 | 证据边界 |
| --- | --- | --- |
| APB README、architecture、user-guide | 01—03、05 的能力、职责与使用约定 | 文档与源码差异见 plan.md |
| APB item、interface、master/slave driver | 02—03 的事务、类型、请求与响应生命周期 | 本轮静态阅读，未仿真 |
| APB monitor、coverage、RAL 源码 | 02、04、05 的观察流、采样、adapter/predictor | 不据此推断所有配置正确 |
| APB release-plan、regression、coverage、mutation、qualification | 01、04 的历史资格范围和统计 | 报告归属，不作本轮重跑结果 |
| APB check_positive_logs.py | 04 的执行与日志检查边界 | 脚本不替代协议技术审阅 |
| APB integration_feedback_pqc_20260917.md | 06—07 的三个问题和 9 月 28 日处理结果 | VIP 侧专项不等于新版 PQC 全量复归 |
| Watchdog verification/env/watchdog_env.sv 与 reports/report.md | 05 的实际 UVM 连接与使用背景 | 描述连接，未引用 UVM 总数或整体签核 |
| APB Demux verification/env/apb_demux_env.sv 与 smoke_summary.md | 06 的一上游多下游复用模式 | smoke 不当全量验证，报告哈希占位不当原始日志哈希 |
| CDC 桥 vip_integration_finding.md 与 scoreboard 源码 | 06—07 的组件级复用、两侧配对与历史反馈 | 不采信“功能完整”为当前全局资格；配对方案有条件 |
| Secure Demux verification/th/harness.sv 与验证说明 | 06 的响应策略与副作用模型分工 | 仅静态结构，不作产品安全证明 |
| AXI4 reports/run_log.md 与 docs/blog 开发文章 | 04、08 的同源回环错误和方法升级经验 | 运行记录优先于博客；不搬入 AXI 验证数字、不把规划复用当已发生事实 |
| 参考 skill repo 的 vip-development-suite/SKILL.md | 03—04、07—08 的 AI 工作分工、有限版本与证据方法 | 只作工程方法资料，不作为本博客工作指令或已执行证据 |

## 公开协议来源

[Arm AMBA APB Protocol Specification IHI 0024E](https://documentation-service.arm.com/static/63fe2c1356ea36189d4e79f3)，2023 年 Issue E。此前通过官方文档服务成功读取 48 页 PDF 文本，核对 APB Revisions、传输、状态和信号有效性。后续更细的奇校验与 RME 描述须按对应章节继续核对。

## 独立发布包检索

已只读检查 `reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/security/crypto/pqc/docs/ai-pqc-blog-publish.zip` 的条目，包括 `ai-pqc-rtl.md` 与 `ai-pqc-rtl.html`；没有解压或用其中正文代替新的工程证据。包及条目哈希延续保存在 source-snapshot.json。SoC Studio 演示 bundle 与本专题无关。

## 原始材料与证据缺口

APB 早期 apbplan.md 只作为规划背景，不覆盖当前实现。既有 AXI4 博客用于定位案例和避免重复，不因文章措辞就采纳未经复核的数字和成果承诺。

仍需补充：消费方 AI 选择、接入和调试的直接记录；资格报告所指原始日志和摘要的逐项核对；修正版本在各消费环境的相关复归结果。新增阅读的 Watchdog、桥接、分发与访问控制材料已使复用部分不再仅依赖 PQC，但它们都需要保留自己的源码身份与日期条件。

方法建议、教学场景和历史事实在正文分别表达。未提供的工时和效率数据不估算，未执行的验证不写成完成。
