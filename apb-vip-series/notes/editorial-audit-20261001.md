# APB VIP 本轮事实与文风审阅

内部资料，2026-10-01。中文先行。本轮未运行 VIP 仿真，不修改 reference/。公开正文聚焦已有能力、已完成修正和可借鉴方法；与主题无关的未完成项及细小问题不展开。保留直接影响结论的条件。

## 事实依据与源码优先级

- APB 以外层 reference/aixsilicon_vip_repo-main/vip/amba/apb 为当前基线；嵌套同名目录不混用。
- Arm IHI0024E 公共规范核对阶段、完成条件、等待、连续访问、错误、strobe 和版本扩展。公开正文保留官方入口。
- Watchdog、Demux、CDC、Secure Demux 与 PQC 属于不同时间的消费方材料，展示其实际组件组织或历史反馈，不宣称全部消费方已在同一新版本完整回归。
- 20260928 报告数字保留 run_id、seed、工具、矩阵及采样汇总口径；非本轮重跑，非 URG 合并数据库结果。
- AI 流程按方法解释，不捏造历史对话、失败归因、工时或提效倍数。
- AXI4 独立向量事件明确属于 AXI4 记录；向 APB 的迁移是方法建议，不虚构已经发生的代码继承。

## 已按实现修正文稿的重点

- 主请求 driver 在原请求填入响应后 item_done()；RAL provides_responses=0 与此对应，不写成额外 response 队列返回。
- 当前请求完成之后 try_next_item；不沿用旧架构文档中“完成前预取”的表述。
- apb_env 按角色选主动 agent；不能同时默认启用 master 与 slave 驱动同一接口。复杂消费方采用组件组合。
- 主要 SVA 在 apb_if 内；enable_checker、sva_enable、check_enable 的作用不同；violation_ap 不聚合全部原生断言与 X 错误。
- 等待门限是完成事务级检查，不写成能自动终止无限挂起。FI 等待20/门限16属于有限等待测试。
- response 数据、等待、错误控制分别配置；通用 sparse memory 不替代外设功能模型。
- cfg 切换版本需应用默认值；virtual interface 物理参数与 cfg 两层都要一致。
- predictor map 守卫与 set_map 是当前能力；不根据组件存在就声称所有 RAL 配置完整资格验证。
- Watchdog APB 观察同时进入 rm、apb_actual、checker、cov、predictor，产品观察/实际输出分别连接模型与 scoreboard；图省略部分适配，不伪装成完整类图。

## 保存在内部、待波形/运行核对的静态观察

以下是静态代码核对发现的关注点，不等于本轮仿真确认的缺陷，不进入公开问题清单。

1. monitor wait_cnt 在首个未就绪 ACCESS 的计数方式可能影响 observed_wait_cycles；需 W02 波形独立数边沿。
2. phase_pattern 由 start_time 与完成时间比较派生，不能直接当作已验证的真实相邻传输分类。正文只讲现有覆盖维度与必须核对的口径。
3. 单连接 psel[0] 相关断言不能提升为共享 PENABLE 多从拓扑的普遍规则；公开第 6 章保留拓扑条件。
4. CDC 示例 scoreboard 的残留队列与 mismatch 计数检查不能据静态阅读认定完整；正文描述双侧事务匹配思路，末尾残留检查属于应采用的方法。
5. advance wakeup、其他后续能力、DISABLED 模式细节、尚未承诺的完整产品资格状态等与主线无关，不在正文列缺项。
6. 错误响应不保证产品回滚；通用 responder 的存储更新时间不应解释为 DUT 寄存器副作用规范。
7. 无独立仿真确认的状态，不以“发现并修复了某缺陷”叙述。

## 文风与内容保留

8 章保留四条主线：协议/架构、AI 实现/可信依据、产品复用、反馈/跨项目方法。删除重复的“本章依据材料”和内部审稿口吻，将条件放到对应结论附近。原有版本、USER、CHECK、X检查、配置作用域、RAL、故障注入、覆盖数字、消费方与跨 VIP 方法均在相应章节保留。

## 待完成

- 真实 Verdi 波形按 verdi-waveform-requests.md 采集，收到后插入对应段落并核对实际结果。
- 英文正文与英文配图后续补齐；当前不标记双语发布完成。
- 发布前连同图中文字再次审阅私有信息边界、数据口径与平台显示。
