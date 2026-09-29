# SoC Studio 能力核对（内部编辑资料）

核对日期：2026-09-29。只读取 C:/Users/boyang-lab/Desktop/soc_studio 中的产品规划、验收台账与专题文档；未修改 SoC Studio 工程，也未把私有路径写入公开正文。本表用于区分设计理念、已有切片和当前边界，不作为公开文章附件。

| 主题 | 核对结果 | 内部依据 |
| --- | --- | --- |
| 标准 Repo 与统一 Import | 原生 Repo 支持静态、参数化、generator IP，文件集、参数/接口、生成/回归任务、摘要与依赖锁；Packager/ZIP 接入。CAPI2 与 IP-XACT 仅声明式子集，不支持任意格式无损导入。 | docs/ip/s02-complete.md；docs/ip/s02-native-packager.md |
| 图形化配置 | 普通 RTL parameter、结构化 generator configuration 分别保存；接口求值、端口/连接校验、保存/Tcl/生成共享模型。 | docs/ip/structured-ip-configuration.md；docs/ip/s03-parameters.md |
| 项目上下文生成 | 公共 Repo 不反写；任务读取 project/instance/config/dependency，结果保存在项目 Run 和产品。Aurora typed 顶层与 FuseSoC 源码包有非 EDA 自动证据。 | docs/verification/s08-output-products.md；docs/planning/acceptance-ledger.md |
| IPGEN / REGGEN / TOP GEN | Aurora 中部分 IP 运行真实 ipgen/reggen；系统使用自有受限 typed 顶层生成及 FuseSoC 导出。不能称通用 topgen 或任意 SoC 已完成。 | docs/aurora/aurora-internal-services.md；docs/verification/s08-output-products.md |
| 自动回归 | 包可声明 regression，显式信任后运行；可选 onSave 策略；Run 与输入摘要绑定，设计变化 stale。Python contract regression 不是 RTL 仿真。 | docs/planning/product-plan.md；docs/projects/save-journal.md；docs/verification/run-contract.md |
| Tcl 复现 | 设计操作和部分项目/文件集/Repo 会话已接入；模型导出/回放可复建。T04-T06、工具运行、附件与视图动作等不完整，不能说所有动作已可复现。 | docs/design/tcl-system.md；docs/planning/acceptance-ledger.md |
| HISTORY 图与保存增量 | 时间线有设计节点、保存说明、增量 Tcl、分支/恢复；旧普通 Save 没有完整操作记录。 | docs/projects/design-history.md |
| Git | 项目独立 .history.git 镜像 design/event；普通 Bundle、附件、工具产物与运行不在设计历史里；无远程推送或多人协作。 | docs/projects/design-history.md；docs/architecture/workspace-layout.md |
| 工具连线检查与候选 | DRC 覆盖参数/端点/资源/依赖等子集；声明式兼容连线候选有假设、前后对照和过期检查；不自动推断协议桥、时钟、复位或完整 HDL 合法性。 | docs/verification/s07-validation.md |
| AI 辅助连线/检查 | 属于产品目标；当前无 AI 对工程模型自动操作、提案、检查或回归反馈的实现证据。 | docs/planning/product-plan.md；docs/planning/acceptance-ledger.md |
| 其他核心概念 | 统一工程模型、版本化项目文件、Bundle、资源视图、Run/产品追溯、stale 状态和 CI 复现目标均纳入正文叙述；EDA 验证仍未实现。 | docs/planning/product-plan.md；docs/architecture/framework.md；docs/verification/s08-output-products.md |

