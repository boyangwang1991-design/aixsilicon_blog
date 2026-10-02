# Secure Demux 背景与阅读顺序补充

本次调整第 1、5、6 章。第 1 章首次出现时解释用途；第 5 章补齐应用问题、Demux、上下游、地址窗口、身份与 PPROT、放行/拒绝/等待、本地 CSR 与业务访问，以及 shadow/active 更新。先背景，再角色，最后组件与代码。第 6 章增加自包含的简短回顾。

来源：现有 APB 协议核对材料，以及 reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/infrastructure/apb/apb_secure_demux/docs/hld/00_overview.md 和已核对的 access RTL、CSR 更新、checker 与 virtual sequence。身份真实性由上游集成保证；本模块做访问授权，不描述为加密或身份认证。一个上游、多个下游，配置与业务共口且顺序执行。

身份 A 可读不可写为解释性例子，明示端口启用及其他条件满足，不声称新跑了场景，不引入其他真实 IP。未修改图像，现有图与新增背景关系一致。继续中文先行，英文和波形待补。
