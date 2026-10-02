# AHB 系列事实与编辑记录

核对日期：2026-10-02。中文先行，英文待补；当前不是双语发布就绪。未重新运行 EDA 工具，未修改 reference。

## 来源选择

统一采用 reference/aixsilicon_vip_repo-main/vip/amba/ahb 外层目录。逐文件 SHA-256 见 sources.json。公开正文不链接这些路径。

- 资格权威：reports/qualification.md、reports/latest.md、config/release-plan.yaml。r3 沿用 r2 原字节执行记录；不是 r3 新仿真。13/13、48/48、21 个负向见证、6/6 变异、五档 WAIT 均来自当前资格摘要。
- reports/regression.md、coverage.md、mutation.md 有较早批次内容。历史 300 seeds、million beats、34/204 不拼入当前结果。完整 169 条/204 点不等于本次三配置有限资格。
- 架构核对 docs/architecture.md、user-guide.md、src/agent/ahb_agent.sv。图中等待/响应属于目标策略，存储模型负责数据与副作用；完成事件不表示 ERROR 的数据也可用于正常比较。
- 独立预期核对 self_test/tb/ahb_vectors_tb.sv：V01 两笔地址数据，V02 三周期等待，V05 ERROR 无幽灵，V06 WRAP。没有把这几组向量说成全部协议证明。
- 源码变异核对 tools/mutate.py：MUT-ADDR、PIPE、ERROR、MASK、EXCL、PARITY；要求编译成功与预期失败标记，非编译失败即检出。不是自然缺陷的历史叙述。
- 主案例 self_test/tb/ahb_system_tb.sv：4 Manager、16 target agent、4 共享 memory；每端口32写32读；每目标32提交。各端口使用不同目标内偏移，未推导同址竞争仲裁能力。AHB_SYSTEM_PASS 是源码显示标记，不伪装成本次原始日志。
- 检索 IP/CBB 资料未找到本 VIP 的明确消费绑定，故不声称产品 IP 集成验收；主案例为实际自验证夹具。

## 外部协议核对

Arm IHI 0033C 官方目录：https://developer.arm.com/documentation/ihi0033/c/ 。官方 PDF 服务本次直接打开超时；此前搜索可获得协议摘录，正文用 Arm 员工在官方论坛的具体采样说明辅助解释 ERROR：https://community.arm.com/support-forums/f/soc-design-and-simulation-forum/56514/questions-regarding-amba-ahb-sampling-time-ihi0033c_amba_ahb_protocol_spec/185133 。Classic 基线 Arm AMBA 2 IHI0011A，未把 RETRY/SPLIT 混入 Lite。

## 图审阅

四张选定中文图，原始与修订提示词、生成路径见 imagegen-records.json；哈希见 sources.json。阶段图修正普通等待/读数据有效性及返回箭头；系统图修正各端口目标内偏移，避免误画一对一地址区间；证据图修正48组合维度与13组回归含义。未选用初稿留在生成缓存，不进入文章资源。

已逐张检查原图及 640 像素宽缩放图：主模块、关键数字与箭头可辨；细节说明可打开原图阅读，正文已完整解释对应条件。QA 缩略图仅保存在系统临时目录，不作为发布资源。内容脚本通过：19 个索引目录、853 个本地链接；新系列公开 Markdown 未发现 reference、内部 notes/sources 或本地绝对路径。图片哈希一致，无尾随空白，git diff --check 无差异错误。

## 待发布事项

真实波形按 waveform-requests.md 补充；英文全文与英文图后续制作；无封面。按文章自包含原则复核公开链接和图中文字；没有承诺私有工程公开或读者直接取得源码。内容检查脚本通过不等于正式发布审阅完成。
