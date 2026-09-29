# 第 11 期 KV Cache 硬件存储图

- 日期：2026-09-29。
- 工具：Codex 内置 imagegen。第一次生成请求连接失败、没有成图；第二次使用下列提示词成功生成。
- 用途：`11-kv-cache.md` 图 4，解释长期存储、片上分块计算和并发请求的不同硬件压力。
- 成图：`assets/generated/kv-storage-hierarchy-11-zh.png`。
- 性质：概念结构示意，不是目标芯片的真实存储框图、测量结果或性能承诺。

## 最终提示词

```text
Original Chinese 16:9 PPT-style teaching slide, white background, navy/teal/purple. Title exactly “KV Cache 怎样占用硬件存储”. Three big panels. 1 “长期存储”: large-memory box labeled “DRAM / HBM” contains “模型权重” and “全局 KV：随历史增长”; a small ring-shaped buffer labeled “局部 KV：512 窗口”. 2 “每步读取”: arrows carry one “K/V 块” at a time from large memory into small “片上 SRAM” box, then to “Attention 计算”, with a loop for the next block; exact caption “分块减少片上同时占用，不消除历史读取”. 3 “并发请求”: four separate growing KV bars marked 请求 1, 请求 2, 请求 3, 请求 4; caption “请求越多，动态 KV 总量越大；空间需要分配和回收”. Footer exactly “容量要放得下；带宽要供得上；位置映射不能错”. Large legible simplified Chinese, accurate arrows, spacious vector slide. This is a conceptual diagram, not a real chip or measurement. No fabricated throughput, no photo, no glamour chips or circuits.
```

## 核对

- 中文标题、三栏的模块标签与箭头方向已人工检查。长期全局 KV 在大容量存储中，当前 K/V 块经片上 SRAM 进入 Attention；图没有把整份长期历史画在片上。
- 局部 KV 的 512 窗口是逻辑保留上限示意，具体物理位置可由目标设备决定。四条请求各有独立历史；图中没有共享前缀或实测容量。
- 图 4 的分块过程以全局层为例；实际注意力后端的分块大小、布局、复用和外存流量需另行验证。
