# SPI2APB 编辑核对

修订日期：2026-09-26。依据已有工程记录改稿，未重新运行 RTL、仿真或 EDA 工具。reference 只读。

## 叙述与图片

以外部控制器访问片内寄存器的场景开篇，解释 SPI、APB、IP、CRC、跨域、拍、UVM 与参数展开。沿完整请求、缓存交接、权限边界和首读调试组织文章。Skill 作为本次工程流程的事实资料阅读，不触发硬件开发流程。

正文替换原系统、架构、流程配图，并以数据表呈现容量与综合面积。保留已有独立封面。旧图和可编辑源继续作为历史编辑资产保存，不从正文链接。公开文章自包含，删除全部私有仓库链接及内部编辑材料入口。

## 核对依据

参考根目录：reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/external_bus/bridge/spi2apb_bridge。

- reports/report.md：closure_final05，seed 17；11/11 UT、64 UVM + 1 C、1872 次注入；48 合法组合仅展开，8 代表配置完成功能回归。未把通过数当成完整签核。
- docs/user_manual/spi_protocol.md：9 字节头、CRC、单帧单命令、提交填充字节、READ 无载荷、byte lane、禁用策略及部分完成。
- docs/hld/01_architecture.md：请求缓存、邮箱、事务引擎、APB 单拍执行器分工。
- docs/lld/03_spi2apb_session_guard.md：停钟事件保持、普通中止与复位边界。
- rtl/spi2apb_engine.sv：READ cmd_data 固定 0，command_parity 使用同一 0；正常中止不任意撤销当前 APB 拍。
- reports/ppa/ppa_report.md：默认 64 拍 23326.87 µm²、单拍 5265.70 µm²；28nm HVT TT、1.00V、25°C、PCLK 100MHz/SCLK 25MHz。两点容量不同，不是等价优化。CS 事件最小周期 60ns、不确定度 0.2ns；DC V-2023.12-SP3。
- reference/aixsilicon_skill_repo-main/aixsilicon_skill_repo-main/skills/ip-development-suite/SKILL.md：研发步骤、事实源和执行证据原则。

## 内部保留的成熟度信息

报告 G0–G3 pass（G3 含高级 CDC/RDC 许可证 skipped），G4 条件通过，G5 fail；0.1.0 为候选包。行覆盖 94.13%–95.27%，分支 90.11%–91.20%，目标仍为 95%。高级 CDC/RDC 未完整签核。综合最差 hold -0.13ns；setup 最差路径涉及 CS 事件域，不换算 PCLK Fmax。未有布局后或多角签核。正文保留 IP 级、后续覆盖/跨域签核与物理时序条件，不展开验收问题清单。

功耗原始估算采用默认活动率，无 SAIF 与实测输入；本稿未引用功耗数值。9 个综合命名点含参数相同别名，未宣传为 9 种独立功能配置。没有人时对照，不声称量化提效。

## 图像审核

图 1：CRC 与身份认证区分、失败请求不进入 APB。图 2：宽数据稳定，控制握手跨域，非逐位同步。图 3：当前拍结束与后续拍停止，禁用旧帧不重放，APB 复位另行处理。图 4：未知值传播、READ 数据与校验同步置零，非真实波形。
