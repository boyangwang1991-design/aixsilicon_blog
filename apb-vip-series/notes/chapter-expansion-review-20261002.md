# APB 八章补图记录（2026-10-02）

本轮每章新增两张中文讲解图，共 16 张。原有 12 张保留，正文合计 28 张。采用 Codex 内置 ImageGen；没有生成封面、英文图或伪波形，英文与真实 Verdi 波形继续待补。

## 用途与插入位置

| 章节 | 新增图 | 对应工程问题 |
| --- | --- | --- |
| 1 | chapter-01-reuse-boundary-zh.png | 公共 APB 协议能力与项目功能预期的分工 |
| 1 | chapter-01-ai-human-tools-zh.png | 工程师、AI 与验证工具各自提供的判断依据 |
| 2 | chapter-02-apb-state-flow-zh.png | APB 的 IDLE、SETUP 与 ACCESS 状态转换 |
| 2 | chapter-02-protocol-product-check-zh.png | 同一笔 APB 访问分别接受协议检查与产品功能检查 |
| 3 | chapter-03-response-fields-zh.png | 两笔定向读响应的字段归属与逐项比较 |
| 3 | chapter-03-reset-lifecycle-zh.png | 复位同时终止总线访问与 UVM 事务交接，随后验证恢复 |
| 4 | chapter-04-positive-negative-zh.png | 正向、负向与故障注入分别检验什么 |
| 4 | chapter-04-evidence-identity-zh.png | 测试结论需要绑定源代码、配置、执行与检查判据 |
| 5 | chapter-05-instance-binding-zh.png | DUT 端口、VIP 角色、配置与接口句柄的对应 |
| 5 | chapter-05-identity-sideband-zh.png | 请求者身份侧带与 APB 事务共同进入权限判断 |
| 6 | chapter-06-deny-observation-zh.png | 拒绝访问需要同时检查上游错误、下游隔离与目标状态 |
| 6 | chapter-06-wait-side-effects-zh.png | 等待周期不应重复产生目标模型的副作用 |
| 7 | chapter-07-wait-data-contract-zh.png | APB 完成采样要求与 Secure Demux 等待期输出约定的区别 |
| 7 | chapter-07-minimal-reproducer-zh.png | 保留触发条件，把失配缩减为可判断的最小复现 |
| 8 | chapter-08-feedback-placement-zh.png | 一次项目发现如何分别进入代码、测试、接入说明与 AI 方法 |
| 8 | chapter-08-upgrade-evidence-zh.png | VIP 升级后重新建立公共测试与消费项目的证据对应 |

图中事实来自各章已核对的正文，延续 notes/source-snapshot.json 的资料基线，没有新增仿真结果。第三章响应图逐项对照现有用例的地址、数据、错误、USER 宽度和常量。第五至七章保留项目专属语义，尤其 master_id 是项目侧带、等待期零输出是产品约定，不能扩大为 APB 通用规则。图中的计时器、控制寄存器、运算模块是复用方向示例，不是新增消费项目实证。

## 生成与审阅

每张最终提示词、生成原始路径、修订提示词、最终选定文件和 SHA-256 见 chapter-expansion-figures-20261002.json；同一批已加入 figure-manifest.json。初稿保存在 ImageGen 默认生成目录，未选用文件未复制到正文资源目录。

16 张图逐张检查了原尺寸，并通过 640 像素宽缩放检查了标签和主关系。第三章复位图将错误文字“交成”修为“完成”；第五章端口绑定图修正两条响应箭头，使 slave VIP 向 DUT 返回响应。其他图未因装饰细节反复生成。QA 拼图仅存系统临时目录，不进入发布资源。

正文在相关机制解释后插图，每张有中文替代文本和图注。第一章两张新增图均不提前引入 Secure Demux；案例仍在复用段落出现。新图是原理/方法示意，不提供真实波形证据。

内容检查通过：19 个索引目录、870 个本地链接；索引图片数量同步为 28。图内不含私有路径、二维码或外部仓库引用。仍须后续补真实波形、英文版及最终发布审阅。
