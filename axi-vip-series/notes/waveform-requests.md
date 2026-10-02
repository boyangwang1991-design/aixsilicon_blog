# AXI 系列待截取波形

内部制作清单，2026-10-02。以下均待用户构造环境并在 Verdi 截图，不用 ImageGen 制造波形。先确认实际使用版本、配置、seed 与测试名；截图应保留时钟、复位、相关握手和关键字段，放入本系列 assets/waveforms 后记录哈希。

| 优先级 / 章节 | 场景与信号 | 截图要解释的事实 |
| --- | --- | --- |
| P1 / 02 | W-before-AW；ACLK、ARESETn、AWVALID/READY/ADDR/LEN、WVALID/READY/DATA/LAST、BVALID/READY/RESP | W 可先被接受，B 仍要满足 AW 与最后 W 的依赖；标出实际握手沿 |
| P1 / 03 | 两个 ID 的读并发与跨 ID 交织；ARID/ADDR/VALID/READY、RID/DATA/LAST/VALID/READY | 不同 ID 交错，同 ID 对应队列仍正确；同一 R 拍被背压时 payload 保持 |
| P1 / 06 | 32 位等宽、四拍 INCR、APB 某一拍插入等待；AXI 关键字段和 PADDR/PWRITE/PSEL/PENABLE/PREADY/PWDATA/PSLVERR | 四次下游访问与上游拍序对应，等待周期不是重复访问；B 时机按实际桥约定解释 |
| P1 / 07 | 唯一 ID 多笔写；AWID、AW/W 握手、BID/BVALID/BREADY，配日志里的对象完成计数 | 物理 B 与序列回填分别确认；应有响应数与实际完成数一致 |
| P2 / 03 | 读写在途时复位，再发新事务 | 旧请求退出，新事务不接收旧响应；同时保存状态日志以说明取消语义 |
| P2 / 04 | 非对齐首拍和部分 WSTRB | 总线 lane 与实际字节位置一致；不得把单元中的两次独立调用伪装为连续 burst |

若故障对照需要历史有缺陷版本，使用独立可回退的测试工作区；不要改只读 reference 或污染当前主线。当前正文已自包含，待补波形只用于增强观察证据，不为既有报告伪造新的运行结果。
