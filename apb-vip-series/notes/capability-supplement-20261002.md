# APB VIP 能力补充核对

本轮补充第二、三、四、七章，不新增章节。没有执行仿真，代码均明确为配置或 sequence 片段；不声称新增运行通过。

- 第二章：补能力地图和 PWAKEUP 三个枚举的实际行为。MANUAL 和 SEQUENCE_CONTROLLED 当前均使用 item.wakeup，不凭枚举注释虚构另一字段。
- 第三章：按 slave driver 的 decide_wait/decide_error 和 sequence 分支写等待、错误、数据的组合。概率1.0用于确定报错；地址范围是错误匹配，不将 region.wait_cycles 写成已使用的等待入口。
- 第四章：逐项核对七个 inject 字段及 master driver 生效位置。非法读strobe明确在SETUP驱动；bad_addrchk翻转第一个分组；x_prot注入X。未对齐加一与位宽相关，不声明必须ERROR。FI-005为等待门限用例，不与七字段一一映射。
- 第七章：区分 requested/observed等待，driver/monitor时间口径，APB_OK/ERROR/ABORTED，以及完成事务门限与独立运行看守。
- 回调审计：src/agent/apb_slave_driver.sv 发现 apb_slave_callback_base.post_response 声明，但 src 内未找到实际调用或UVM回调注册路径。因此移除第二章原有“回调也提供了响应扩展入口”的可用能力断言，不在公开文中罗列该内部细节。响应扩展介绍依托已执行的sequence入口。

新增内容沿用既有图，无新增图片或伪波形。能力机制与既有正负向图相连。真实截图仍由Verdi需求清单管理；英文按既定中文先行安排待补。

来源哈希见 capability-supplement-sources-20261002.json。公开正文不链接内部来源。内容检查：19 个索引目录、876 个本地链接通过；git diff --check 无错误。
