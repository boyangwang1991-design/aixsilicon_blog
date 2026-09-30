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

## 四个主题各一张讲解图（2026-09-29）

四图均由 Codex 内置 imagegen 文生图生成，原始生成文件留在本机生成目录，成图复制到 `assets/generated/`。逐张检查了主要中文标签、输入输出方向、主状态残差、Prefill/Decode 的 KV 接续、媒体前端与设备边界。图片为原理示意，图中的方块数量、视频帧间隔、设备仪表均不代表实测。

### 输入先变成什么

- 路径：`assets/generated/series-theme-input-zh.png`
- 提示词：

```text
Create an original high-information Chinese educational infographic, 16:9 wide PPT slide, for a Gemma 4 E4B technical blog. Question: 屏幕上的输入先变成什么？ Exact large title: '输入先变成有序位置'. A clear left-to-right three-stage teaching diagram: 1) left, visible user message plus chat-template role/control markers, labeled '可见文字' and '聊天模板'; 2) middle, tokenizer maps the resulting text to a row of discrete token IDs, labeled 'Tokenizer → Token ID', then embedding lookup changes each ID into a vector strip, labeled 'Embedding → 2560维向量'; 3) right, an ordered sequence of vector strips labeled 'Decoder 输入位置'. Include a small separate bottom note that image/video and audio later take their own frontend paths and join as soft-token vectors, without implying that image or audio is tokenized as text. Make the key distinction very readable: '字数 ≠ token 数 ≠ 输入位置数'. Show sequencing by different counts of abstract boxes, but do not use numerical example counts. Strictly correct arrow directions, no unrelated mathematical symbols. Editorial engineering diagram with warm off-white background, navy typography, teal input path, restrained purple and amber accents, clear large simplified Chinese text, generous spacing, legible when enlarged on a phone, no logo, no watermark, no fake device or measurement. This is a conceptual illustration.
```

### Decoder 一层怎样工作

- 路径：`assets/generated/series-theme-decoder-zh.png`
- 提示词：

```text
Create an original Chinese 16:9 PPT-style high-information educational diagram for a Gemma 4 E4B technical blog, consistent with a refined editorial engineering series: warm off-white background, navy type, teal main state line, purple context, amber per-layer input. Exact title: 'Decoder 一层怎样更新状态'. Main question: what distinct work do Attention, MLP and PLE do to the same token state? Show ONE continuous horizontal main state ribbon entering and leaving a decoder layer, with three successive residual additions clearly attached to that same ribbon. First branch: 'RMSNorm → Attention → 残差', annotation '从可见的上下文读取信息' and small Q/K/V context fan-in. Second branch: 'RMSNorm → MLP → 残差', annotation '在当前位置重组特征' and a widened feature-channel illustration. Third branch: 'RMSNorm → PLE 门控 → 残差', annotation '同一 token 的逐层可学习输入，按当前状态调节'; show a distinct learned per-layer embedding entering a gate controlled by current state, not an unconditional constant addition. Label boundary main states '输入状态' and '输出状态', and a small accurate legend '残差：把分支结果加回主状态'. Above or below, show the same layer repeated vertically as 'Decoder ×42层' but keep the three update branches of one enlarged layer as the main focus. Avoid implying RMSNorm centers by subtracting the mean. No fake code screenshot, no unrelated numbers, no watermark, no logos. All simplified Chinese labels crisp and readable on a phone when enlarged, arrows technically accurate, information-rich without small clutter. Conceptual mechanism illustration, not a runtime trace or measured chart.
```

### 同一模型为何有不同的硬件瓶颈

- 路径：`assets/generated/series-theme-hardware-zh.png`
- 提示词：

```text
Create an original Chinese high-information 16:9 PPT educational diagram for a Gemma 4 E4B on-device inference blog, consistent warm off-white, navy, teal, purple, amber editorial engineering visual language. Exact title: '同一模型，为何瓶颈会变？'. The main diagram is a side-by-side comparison of two execution phases operating the SAME Decoder weights. LEFT teal column 'Prefill｜整段输入': a tall multi-row activation matrix times one shared weight tile; show several input positions computed together, weight reused across rows, KV cache established; labels '多行矩阵乘', '权重复用', '建立 KV'. RIGHT amber column 'Decode｜逐步生成': a single or few new activation rows times the same weights, previous KV history read and one new KV entry appended, next token loop; labels '每步少量新行', '重复读权重', '读取历史 KV'. Between them show continuity Prefill-created KV flowing into Decode history. Bottom is a compact three-row hardware-account comparison, with icons and directional flow, not fabricated numeric values: '静态权重：容量与供数', '动态 KV：写入与历史读取', '片上工作区：Tile、部分和、归约'. Add one crisp takeaway band: '输入长度、batch 与历史长度改变复用和搬运，瓶颈要按负载判断'. Do not assert every Prefill is compute-bound or every Decode is bandwidth-bound. No throughput numbers, no fake measured chart, no device photo, no logo or watermark. Large legible simplified Chinese, precise arrows and clean coherent layout, conceptual figure rather than experiment.
```

### 媒体输入与真实设备边界

- 路径：`assets/generated/series-theme-media-device-zh.png`
- 提示词：

```text
Create an original Chinese high-information wide 16:9 PPT educational infographic for a Gemma 4 E4B on-device inference technical series. Exact title: '媒体输入与真实设备边界'. One coherent left-to-right causal flow in the same editorial visual language as other figures: warm off-white, navy text, teal for inputs, purple for media soft tokens, amber for generated output. LEFT region with TWO clearly separate input paths: '图像 / 视频' → '抽帧或图像 patch' → '视觉前端' → '视觉软 token'; and '音频波形' → 'Log-Mel 特征' → '音频前端' → '音频软 token'. For video add small timestamp and frame markers as a conceptual cue; do not imply precise frame sampling. CENTER region: media soft tokens join ordered text positions in a shared '语言输入序列' then enter 'E4B Decoder'; explicitly note '媒体增加输入位置，也增加前端计算'. RIGHT region: generated text runs over time on a generic phone/edge device silhouette, with three separate transparent constraint gauges labeled '功率预算', '热积累', '供电瞬态'; arrows from execution to those constraints and back to sustainable operating point, with the concise takeaway '短时峰值 ≠ 持续体验'. At bottom show a small family-model branching reminder '换型号：结构与资源账重算' without listing unverified model-specific numbers. Must distinguish media frontends from language Decoder, and must not show image/audio as text transcription. No fake temperature curve, fake measured values, real product screenshot, logo or watermark. Large accurate simplified Chinese lettering, clean arrow directions, high information but not microscopic text, conceptual explanatory illustration.
```
