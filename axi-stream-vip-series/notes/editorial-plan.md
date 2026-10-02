# AXI4-Stream 系列编辑与事实边界

2026-10-02。内部资料，不随正文导出。

中文先行，8 章完整内容稿、6 张 ImageGen 中文讲解图；英文和真实波形待补，不创建空英文文件，不制作封面。主线：协议语义→架构→AI 与独立预期→实证→寄存器切片实战→调试→复用反馈。

## 基线与取舍

- 以外层 reference/aixsilicon_vip_repo-main/vip/amba/axi4_stream 为当前实现基线；qualification.md 和 latest.md 绑定 axi4-stream-1.0.0-release-20260930-r5。
- regression.md、coverage.md、mutation.md 当前内容仍为 run-004。它们用于理解历史与方法，不把其细分 bins 冒充 r5 同轮数据。r5 数字以 qualification/latest 为准。
- 当前检查目录15项为 P001–P009、A001–A002、W001–W002、C001、I001。报告称15条协议规则，公开稿根据实际分类写15个检查入口。
- 12项变异集中types包，在隔离副本改源码、编译并运行定向语义proof，不宣称十二种完整UVM/RTL时序缺陷均被端到端杀死；六个总线注入目标另述。
- 检索 ip-repo、cbb-repo 未找到 axi4_stream_pkg / axi4_stream_env / aixsilicon:vip:axi4_stream 的独立产品消费者。采用实际自验证 register-slice fixture，不虚构产品复用验收。
- smoke_tb 注释列出 dir/fifo/router/widthup，但实际选择为regslice与CDC两条路径；不据注释宣称全部fixture均已在物理链路执行。
- 单级切片 s_tready=!r_valid||m_tready，保留反向组合READY；不说所有路径都寄存隔离。
- 通用 axi4_stream_env 声明多个agent句柄，但 build不自动创建所有agent；正文以实际smoke_env装配为依据，不夸大自动接入。
- LOGICAL_STREAM已有token比较。异宽两侧类型、lane配置及动态侧带物理集成未从现有材料充分确认，异宽图仅说明教学预期，不写为已完成真实异宽回归。
- 两侧monitor共享types语义，不宣称完全独立；固定golden和变异提供额外判断依据。
- CDC当前顶层数据路径用异步FIFO，ID/DEST/USER源侧透明绑定，测试使用零key/相应侧带条件。限定18包数据完整性，不能宣称任意动态sideband完整跨域或亚稳态安全。
- CDC测试含PRESERVE/CUSTOM配置切换，不推导这些策略在所有复位组合都已行为验收。
- cancellation测试源码不足以支持新增细粒度时序结论；正文说明driver现有语义及建议观察点，不虚构已定位修复故事。
- monitor的active_cycles在握手分支内增长，不能当作全部非复位观察周期来推算内置摘要利用率。正文不给该内置比率背书，而用独立20周期教学窗口解释定义；不将此内部细节扩展为无关缺陷清单。
- 稳定性、零值数据、NULL+TLAST、在途取消和吞吐口径为关键教学内容；未实现或非主题细节不逐项列入正文。

## 发布边界

本次只读核对源码与报告，未重跑EDA。无原始日志访问时使用报告摘要，不生成伪造终端片段。正文不链接内部reference、notes或私有仓库。图为概念，波形待用户Verdi截图。最终发布、英文同步和工程复审待完成。
