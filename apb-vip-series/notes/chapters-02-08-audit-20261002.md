# 第 2～8 章深化与证据核对（2026-10-02）

本次按章节顺序完善中文稿，主案例限定 APB Secure Demux。未在 reference 中执行构建或修改文件，未重跑仿真。英文、真实波形、发布审阅仍待完成。

验证：node scripts/check-content.mjs 通过（16 articles、676 local links）；git diff --check 未报告空白错误。正文私有路径与编辑资料入口扫描无匹配，四行事件日志逐条对照 JSON 内原始 output，新图 SHA-256 与清单一致。系列在本轮开始时即未跟踪，未提交；其他系列已有修改保留。

## 逐章修改
- 02：补充功能入口与项目责任表，保留实际 response 写回请求、monitor 独立观察与 RAL map 条件。
- 03：按 seq_response_test 补两笔请求/响应字段的确定预期，解释数据、错误、USER 差异如何帮助定位。
- 04：增加 policy 单元运行 exit_code=0 / passed=false 的真实结构化记录；用故障注入说明正负向测试判据不同。
- 05：补 allow_port 原有三步调用、下游 responder 与 target 分工、BASE+8 读清 / BASE+12 写触发；增加概念图。
- 06：采用真实等待设置 0/1/17/257、权限位索引、两类复位、典型配置报告及 events 历史 stdout；增加提交生效图。
- 07：以报告中等待期数据检查修正替代纯假设开头，明确不因此宣称 VIP 有缺陷或还原 AI 对话。
- 08：增加 68 文件候选清单与下一轮 AI 输入材料，区分公共自测与消费方回归。

## 核对范围与解释
VIP 基线：reference/aixsilicon_vip_repo-main/vip/amba/apb/。
IP 基线：reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/infrastructure/apb/apb_secure_demux/。
文件哈希保存于本目录 source-snapshot.json。

| 正文事实 | 依据（相对上述基线） | 边界 |
| --- | --- | --- |
| 两笔返回及 USER 宽度 | VIP self_test/apb_seq_response_test.sv | 源码输入与预期，非新增运行 |
| 568/568、24 正向、157/157、54/54、68 文件 | VIP reports/run_log.md、qualification.md | 2026-09-28 冻结批次；工具合并覆盖未运行 |
| FI_ALL_DETECTED | VIP reports/mutation.md | 报告中的日志标记，未伪装为本地原始日志 |
| exit_code=0 / passed=false | IP reports/quality/rtl_leaves/policy_ut_before_reset_guard.json | 结构化元数据原样节选，不推演未保留的错误行 |
| allow_port、身份协调 | IP verification/env/apb_secure_demux_virtual_sequence.sv | CSR 与业务共用上游 |
| 读清 / 写触发 | IP verification/th/apb_secure_demux_target_model.sv | 测试目标，非 DUT CSR；错误不更新为目标约定 |
| 等待 0/1/17/257 | IP verification/tc/tc_apb_secure_demux_apb.sv | 配置设置不代替实际波形计数 |
| 权限索引 | IP verification/tc/tc_apb_secure_demux_acl.sv、rtl/apb_secure_demux_access.sv | 0x02 示例为按现有位定义推导；另有其他准入条件 |
| 复位范围 | IP verification/tc/tc_apb_secure_demux_reset.sv | 外设复位与 Demux 自身复位区分 |
| 17/17 UVM、10/10 模块 UT | IP reports/report.md | 2026-09-14 CFG_TYPICAL_DIRECT，seed42，VCS W-2024.09-SP1；非全部 VPLAN/参数覆盖 |
| 事件模块四行 PASS | IP reports/quality/rtl_leaves/events_ut_runs.json 的 output 字段 | 2026-09-11 历史 stdout；当前 UT 格式已有变化，不声称当前源码重跑同样输出 |
| 等待期数据预期 | IP reports/report.md、verification/env/apb_secure_demux_checker.sv、rtl/apb_secure_demux.sv | 报告记载修正；现存源码用于解释当前行为，不捏造原始失败波形或改动过程 |

事件日志只摘取 UT 结果行，删除了不需公开的机器路径与工具横幅；结果文字未改写。checks 是运行检查次数。报告中其他未完成事项不在文章罗列，但直接影响数字含义的配置、范围和批次均保留。

## 图像审阅
新增两图由内置 ImageGen 分别生成，首版选用。已检查原图及 640px 缩略图：主标签可读，请求和响应方向正确，shadow/active 生效边界正确，无额外上游口，无虚构波形。小字含义在正文重复解释。具体提示词、路径、哈希及生成位置见 figure-manifest.json。本记录仅用于编辑，不从正文链接。
