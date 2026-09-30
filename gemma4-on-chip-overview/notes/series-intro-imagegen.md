# 系列引言配图记录

2026-09-29 使用 Codex 内置 imagegen，为系列 `README.md` 新增一张中文独立封面和一张资源账总图。两图均为概念示意，不代表模型运行截图、芯片版图或设备测量。生成后检查了中文标题、输入输出方向、Prefill/Decode 分工与四类资源关系。

## 系列封面

- 路径：`assets/generated/cover-series-zh.png`
- 用途：公众号及系列入口的横向封面。单一焦点是文字、图像和声音汇入模型计算，权重与 KV 数据流连接到逐 token 输出。
- 提示词：

```text
Use case: scientific-educational. Asset type: original Chinese wide 16:9 cover for the Gemma 4 from algorithm to on-device chip blog series, suitable for a WeChat article header and phone thumbnail. A single compelling engineering visual: at left a compact ordered ribbon of text, image and audio input symbols flows into one luminous layered inference corridor; inside the corridor a clear matrix-compute grid and a distinct memory ribbon for weights and growing KV history; at right one text token emerges and feeds a subtle next-token loop. The image should convey that model mathematics becomes data movement and hardware constraints. Refined editorial PPT illustration, precise geometric depth, not a real silicon die or product UI. Navy foundation, teal data paths, restrained amber output and purple memory. Large simplified Chinese title exactly 'Gemma 4 从算法到端侧芯片'. One small subtitle exactly '看懂计算，也看懂数据怎样流动'. Keep both text lines crisp, correct and within generous crop-safe margins. Strong single focal point; no extra labels, no benchmark numbers, no logos, no watermark, no fake performance claim. The cover is conceptual and must not appear to be a measurement or chip photograph.
```

## 一次推理的四笔资源账

- 路径：`assets/generated/series-four-resource-accounts-zh.png`
- 用途：在一张图中连接输入路径、两种执行阶段和四笔硬件资源账，帮助读者理解整个系列的组织逻辑。
- 提示词：

```text
Use case: infographic-diagram. Asset type: original high-information Chinese teaching figure for the introduction of a Gemma 4 E4B on-device chip blog series; wide 16:9 PPT-like infographic that remains legible on a phone when enlarged. Main question: '为什么同一次推理不能只看模型参数或 TOPS？' Exact title: '一次推理，四笔资源账'. Use one coherent three-band layout, not a collage. TOP BAND is the actual left-to-right model path: three distinct inputs '文字→ID与Embedding', '图像/视频→视觉软 token', '音频→Mel与音频软 token' converge into one ordered input sequence; that enters a clearly labeled 'E4B Decoder ×42层' containing three roles 'Attention 读上下文', 'MLP 重组特征', 'PLE 逐层补入'; at right '逐个输出文本 token'. Indicate that text/image/audio frontends differ; do not show image or audio as text transcription. MIDDLE BAND splits the same model into two adjacent execution modes: 'Prefill：多行输入，复用权重，建立 KV' and 'Decode：每步少量新行，反复读权重与历史 KV'; show many aligned rows versus one newly added row, and a directional arrow from Prefill's created KV to Decode's historical KV. BOTTOM BAND is four visually distinct but connected hardware ledgers with short labels: '静态权重：容量 / 量化 / 供数', '动态 KV：局部窗口 / 全局历史 / 并发', '片上工作区：矩阵块 / 部分和 / online softmax', '持续运行：功率 / 散热 / 供电'. Use simple lines from top/middle to relevant ledgers, and one bottom takeaway exactly '瓶颈随输入长度、生成阶段和媒体类型改变'. No specific memory numbers, no FPS or TOPS numbers, no device performance claim; 42 layers is E4B model configuration, not a measured speed. Visual style: spacious editorial engineering diagram with elegant layered geometry, warm off-white background, navy text, teal for input and Prefill, amber for generated text and Decode, purple for persistent KV, light blue for compute. Large crisp simplified Chinese text, accurate arrows, minimal decorative circuitry, no logos or fake oscilloscope/device screenshot. This is a conceptual explainer, not real measurement. All Chinese text must be correct and uncluttered.
```

图中上层为模型数据路径，中层为同一模型的两种执行形态，下层是资源核算类别。`42 层`是 E4B 配置事实；方块数、流程长度和硬件图标均为教学示意。图注保留这个边界。
