# 编辑核对记录（内部）

编辑日期：2026-09-26。只编辑博客、索引和图片，未运行仿真/综合，未写入 reference。

## 叙事与事实来源

主线：更新权限时避免中间态，进而解释入口准入、事务快照、原子提交、参数实例绑定和 AI 的修改路径。保留技术细节，删除重复的六个 Key Finding、AI 能力分级和口号式收尾；不把未完成资格审查包装为交付成功。

工程状态采用 reports/report.md 的 2026-09-14 基线：169 条需求；G0–G3 pass；模块 UT 10/10；典型 DIRECT、seed=42 的 UVM 17/17。G4 fail、G5 blocked，完整覆盖率没有真实值；其他静态检查、RAL交接、参数执行、形式与集成证据未闭环。正文保留“已执行范围、不代表全参数验证/产品签核”的必要限定，完整缺项不按验收报告罗列。

单点综合数字来自 reports/ppa/ppa_report.md：CFG_TYPICAL_DIRECT，端口8、主体16、身份4bit、地址32bit、FIFO8、REGISTER_MODE=0。38184.94 µm²、周期10ns、关键路径裕量0.01ns、零latch/零unmapped；工具、库、corner、电压、温度、不确定度和IO delay均随文说明。本次不引用low-effort功耗或未经四点比较验证的DIRECT/REGISTER收益。

## 纠正原稿容易造成的误解

- APB 等待期间上游必须保持请求稳定。事务快照是内部单一状态归属，并不意味着上游可以合法改变当前请求。
- DIRECT 模式在 SETUP 组合准入后可以建立下游选择；SETUP 末沿冻结，后续阶段使用快照。不能画成所有模式都必须先锁存、下一拍才允许下游SETUP。
- docs/lld/03_policy.md 明确单APB、无后台队列，COMMIT 完成前不存在另一笔在途外设事务。删除“提交与另一笔访问同时进行，旧事务继续跑”的并发叙事；下一SETUP使用新版本。
- COMMIT 复制所选端口的完整CFG和全部PERM，任一检查失败，整个选中集合均不改变。并非全芯片所有端口强制一起提交，也非交换存储银行指针。
- parity/互补锁编码是指定存储故障检测机制，不能宣称任意故障保护或全系统安全证明。
- EVENT_FIFO_DEPTH=0 裁剪的是队列，首末事件快照和计数仍有逻辑。不把参数检查点总数当作实际RTL配置回归数。
- scripts/check_configuration.py 明确是配置输入检查、不是RTL执行。标签“observed Elaboration”不能单凭Python结果解释成真实EDA elaboration通过/拒绝。
- PREADY 在无有效ACCESS时为1是 REQ-APB-005 项目约定。APB 标准允许PENABLE=0时任意PREADY值，PRDATA错误时清零亦非协议普遍强制条件。
- 源码和归属文档核对了实例绑定编译守卫；不是让模型手写第二套寄存器定义。
- RAL 当前已生成并实际编译，frontdoor/predictor交接仍待完成。配图只说生成验证寄存器模型，不宣称端到端验证交接已完成。

## 公开协议核对

Arm IHI0024C 官方PDF：
https://documentation-service.arm.com/static/64257f64314e245d086bc8b7?token=

核对§3.1/§3.3等待与稳定性、§3.4错误可能有副作用，以及PENABLE低时PREADY任意。IHI0024D入口首次读取超时，最终使用C版本支持本文涉及的APB4基本规则；这不是补做工程受控版本集成审批。

## 配图与公开边界

四张图分别讲入口阻断、冻结上下文、原子提交和实例一致性。公开正文及assets导览不保留私有仓库链接，原导入与上游链接历史仅保留在sources.json。来源哈希和最终图哈希在sources.json记录，提示词见image-prompts.md。
