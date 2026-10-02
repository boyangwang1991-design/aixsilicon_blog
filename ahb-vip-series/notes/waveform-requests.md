# AHB 系列真实波形需求

内部制作清单；不从公开正文链接。截图由实际仿真和 Verdi 产生，不用 ImageGen 代替。

所有截图保留 HCLK、HRESETn、时间刻度、信号名，标出采样边沿。裁掉私有目录、用户名与无关层次。记录源码/配置指纹、工具版本、种子、批次、场景、截图范围及图片哈希。输出放 assets/waveforms/，实际有图后再创建目录并插入正文。

| 章节 | 场景与激励 | 信号与观察点 | 预期 |
| --- | --- | --- | --- |
| 2、4 | 连续写 0x100/0x204，数据 0x11223344/0x55667788 | HADDR、HTRANS、HWRITE、HWDATA、HREADY、完成事件 | 当前数据关联前一已接受地址，恰好两次完成 |
| 2、4、7 | 0x300 写等待 3 周期，后接 0x400 读 | 上述信号加 HRDATA、等待计数、请求/完成计数 | 写值 0xDEADBEEF，读值 0xFACECAFE，无重复接受 |
| 2、4 | WRAP4，size 2，起点 0x80C | HBURST、HSIZE、HADDR、HTRANS、HREADY | 0x80C→0x800→0x804→0x808 |
| 6 | 跨目标连续访问，目标等待 0/1/2/3 | HADDR[13:12]、data_target、各目标 HSEL/HREADYOUT、总线 HREADY/HRESP/HRDATA | 地址译码可与数据阶段目标不同，返回选择保持旧目标至完成 |
| 7 | ERROR 两周期并取消下一候选请求 | HTRANS、HREADY、HRESP、pending 有效位、结果计数 | 低就绪 ERROR 后高就绪 ERROR，仅旧访问失败，无幽灵事务 |
| 7 | 等待期间复位，随后新读写 | HRESETn、pending、结果状态、存储提交计数 | RESET_ABORT；新访问独立完成，不沿用旧上下文 |
| 7 | Classic RETRY/SPLIT 后重放 | HRESP、仲裁许可/释放相关信号、请求地址、成功提交计数 | 非成功尝试不提交，重放成功仅提交一次 |

前四组优先，每张控制在 8–15 个周期左右；ERROR 与复位不要叠在同一张图。Classic 重放跨越更长时间时用两段真实截图并明确时间断点，不能拼成连续波形。
