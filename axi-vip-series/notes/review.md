# 中文内容与配图检查

2026-10-02，内部编辑记录，不随正文导出。

## 事实对应

| 正文 | 核对材料与判断 |
| --- | --- |
| 01、08 | user-guide、qualification、run_log；研发步骤为可采用方法，不虚构逐轮 AI 历史 |
| 02 | Arm IHI 0022H A3/B1 与 user-guide；Full/Lite 分开，协议能力与实现上限分开 |
| 03 | axi4_env、axi4_agent、axi4_driver、axi4_configuration、user-guide；角色、monitor/checker 连接、按 ID 关联、reset_epoch 与类型化接口 |
| 04 | axi4_unit_memory；向量实际存在，逐字节表为独立推导，建议新增检查未写为已执行 |
| 05 | qualification、regression、coverage、mutation、gate_status；负向验收、bin 分母、参数组合、工具条件、本地包边界 |
| 06 | run_log 2026-09-04；只声明 tc_sanity/tc_burst 历史 PASS。接入骨架核对 user-guide 和 axi4_if；未编译该教学片段 |
| 07 | run_log 2026-09-04；默认 READY、disable fork、按 BID 路由、前置登记、8/8 回填和阶段 84/84 单元 |

每份材料路径与 SHA-256 保存在 sources.json。正文不链接这些内部文件。

## 配图

6 张图均使用 Codex 内置 ImageGen，各自提示词、修订记录、原始输出路径、最终路径和哈希保存在 imagegen-manifest.json。未使用替代 CLI。原始草图留在工具默认输出位置，系列 assets 仅保留选中图。

逐张看过生成的原尺寸图，并生成、查看 640 像素宽缩放图：主标签和关键数字可读，次级说明同时在正文解释。五通道握手图纠正源端措辞；架构图纠正 checker/coverage 方向并补事件 monitor 的直接采样箭头；总览明确桥就是 DUT；字节图移除提示词式措辞。没有因装饰差异反复重生。

第 6 章图为教学环境，Monitor 区域概括协议观察与检查，不是源码类图；图注明确这一点。所有图均为原理示意，无伪造波形、日志、覆盖工具或产品截图。未制作封面。

## 完成状态

- 8 章中文完整内容稿，约 2.2 万 Markdown 字符，已建立前后章与主题交叉链接。
- 6 张中文讲解图均有正文替代文本与图注。
- 独立系列目录和根索引已同步；英文按中文先行安排待补。
- 公共 README 与 chapters 扫描未发现 reference 路径、私有 GitHub 地址或 notes/sources 阅读入口；图片文字无上述内容。
- 官方 Arm PDF URL 已实际打开核对可访问，不把本地链接检查当作远程验证。
- node scripts/check-content.mjs 通过；git diff --check 通过。已有其他专题的变动保留。
- 当前只核对已有报告和实现，未运行 EDA 仿真；未生成发布 HTML/PDF，未提交、推送或发布。

仍待真实 Verdi 波形、英文全文与英文图、最终工程审稿及发布审阅。波形要求见 waveform-requests.md。
