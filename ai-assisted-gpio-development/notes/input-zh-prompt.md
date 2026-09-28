# input-zh

2026-09-27. Codex built-in imagegen. Concept image; not measured silicon or simulation screenshot. Output: assets/generated/input-zh.png.

Scientific teaching infographic landscape4:3 warm white navy teal amber, exact title "先确认输入有效，再判断有没有边沿". Upper readable pipeline six boxes left-to-right "PAD 异步输入" → "同步器" → "数字滤波（可选）" → "去抖（可选）" → "数据 + IN_VALID" → "边沿 / 中断". Below left subsection "两种问题，分别处理" with cards "同步器：降低亚稳态传播风险" and "滤波 / 去抖：按规则确认稳定样本". Lower central 3-stage story fromlefttoright "路由切换：available=0，输入失效" → "重新建立同步与处理历史" → "首次有效样本：只建边沿基线". Bottom strong conclusion "恢复时读到高电平，不自动算一次上升沿". Side/bottom note "后续有效跳变才参与边沿检测；电平中断另按电平条件判断". Footer "概念示意；不保证捕获所有窄脉冲". Do not fabricate clock-cycle counts or waveforms. All labels exact no added slogans.

Final original image: C:\Users\wangb\.codex\generated_images\01a0db57-6e0e-7dc1-957a-ec6b32c34f1d\exec-ea91e98c-bf4d-4a93-bbf0-e7f85f78168f.png
Original prompt used as above.
Reviewed: labels and conceptual relationships accepted.
