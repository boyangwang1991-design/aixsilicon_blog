# 第 05 期源码核对（原第 04 期资料）

2026-09-28，按用户明确授权新增下载至 reference；下载之后只读使用。下载清单、完整 revision、URL、SHA-256 见 04-code-snapshot.json。10 个源码文件的 Git blob SHA 已与 GitHub 固定 revision 目录 API 逐项比对通过。另有上游 LICENSE 与固定 E4B 配置，共 12 个参考文件。未下载模型权重，未宣称执行推理；模块目录不是完整可运行的 Transformers 安装。

本地文件：reference/transformers-gemma4-8445b13/modeling_gemma4.py，以下为本地原始文件行号（网页解析器行号可能不同）。

| 正文事实 | 源码依据 |
| --- | --- |
| 主 Embedding 按 ID 查表后乘固定缩放 | Gemma4TextScaledWordEmbedding，1444–1455；模型初始化用 hidden_size**0.5 |
| 主路径没有 Embedding 与 Decoder 之间的额外矩阵乘 | Gemma4TextModel.forward 中 `hidden_states = inputs_embeds`，随后将 `hidden_states` 逐层送入 `decoder_layer`，1678–1700 |
| gate/up/down 为三套无偏置线性层 | Gemma4TextMLP，1061–1077；forward 中先激活 gate，再逐元素乘 up，最后 down |
| Q/K/V 为不同投影，共享 K/V 层例外 | Gemma4TextAttention，1162–1280；1195 起条件构建 K/V，1236 起复用既有状态 |
| 线性投影准备表示，注意力再跨位置汇聚 | q_proj/k_proj/v_proj 与 attention_interface 的先后关系 |
| 层内先注意力后 MLP，各有归一化与残差 | Gemma4TextDecoderLayer，1355 起；本期概念图不表示并行执行 |
| 2560 与 10240，禁用 double wide | e4b-config.json 的 text_config.hidden_size、intermediate_size、use_double_wide_mlp |

推导与教学例子（非 checkpoint 数值）：[2,3] 乘 [[1,4,2],[5,6,-1]] 得 [17,26,1]；[1,0] 得 [1,4,2]。MAC 数为 2560×10240=26,214,400，128 行为 3,355,443,200；BF16 权重为 52,428,800 字节，即 50 MiB。推导仅针对一张投影矩阵，不是整个 MLP 或层的计数。

编辑审阅：本期在 Decoder 概览之后解释层内 Linear 的特征组合机制，在阅读顺序上承接 Embedding、预备下一篇 Decoder，投影实际发生在 Decoder 内，主路径没有额外矩阵乘层。模型另行准备逐层输入（PLE）作为层内辅助信号，不能将其混同于主 Embedding 到 Decoder 的中间投影。说明独立逐维缩放与跨特征组合的差别，避免“矩阵乘只是升维”“升维自动增加信息”“QKV 投影本身交流上下文”等误解。跨位置交互与线性投影分开，保留非线性必要性。正文两张讲解图的示例、形状与箭头已核对，正文无私有资料入口。

按用户要求本次不制作英文正文与配图；系列英文状态仍为待补。没有发布导出或实际发布。
