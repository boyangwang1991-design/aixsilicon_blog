# 待截取的 AXI4-Stream 波形

内部清单，2026-10-02。由用户搭建/运行环境后使用 Verdi 截图，不用 ImageGen 模拟波形。保存工具、版本、配置、seed、测试名和截图 SHA-256。截图放本系列 assets/waveforms，再在正文相应位置插入。

| 章节 / 优先级 | 场景与信号 | 观察重点 |
| --- | --- | --- |
| 02 / P1 | TVALID 先有效、TREADY 延迟；ACLK/ARESETn、TVALID/TREADY、TDATA/TKEEP/TSTRB/TLAST | 每个握手沿只计一拍；等待直到恢复握手沿载荷保持 |
| 02、04 / P1 | 全NULL TLAST，随后一个普通包 | 零DATA拍仍结束包；附monitor token或包计数日志，不假定波形能展示软件token |
| 06 / P1 | register-slice 连续输入、下游背压、恢复；双侧valid/ready/data/qualifier/last及r_valid | 空槽接收、满槽保持、同一沿旧拍输出与新拍写入；READY仍有组合路径 |
| 03、06 / P2 | 4个key逐拍交织；TID/TDEST/TLAST与接收事件 | 各key独立组包，不将不同流拼为一个包 |
| 07 / P1 | 已进入stall后请求取消，再恢复READY | 取消调用确实位于TVALID=1/TREADY=0窗口；在途VALID不撤销，软件取消状态与物理握手区别 |
| 07 / P1 | 半包复位、重新发送 | epoch、ABORTED_BY_RESET和预期结算；配软件日志，不能仅用信号推断队列处理 |
| 05、07 / P2 | CDC 100MHz/约71.4MHz、已知数据包 | 两侧时间对齐，数据完整；标明零key/侧带条件，不声称亚稳态证明 |

第04章32→64位教学转换若后续制作波形，须先补真实异宽接口装配与产品预期，再明确记录新的运行批次，不能使用当前regslice结果替代。
