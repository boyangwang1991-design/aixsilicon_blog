# Gemma 4 图源

`mlp` 显示第 0 层门控 MLP，`local_qkv` 保留第 0 层 Q/K/V 的局部追踪，`attention_layer_0_full` 追踪第 0 层完整局部 Attention：Q/K/V、RoPE、GQA 展开、打分、mask、softmax、V 汇聚和输出投影。模型参数和输入都在 PyTorch `meta` device 上；`B=1,S=2` 只限制画面的序列长度，E4B 的主宽度、MLP 宽度和头形状保持真实配置。图不是模型权重或数值推理结果。完整 Attention 追踪的 RoPE 值和 mask 是固定侧输入，未启用 KV Cache。

生成流程：

```powershell
python assets/diagrams/generate_torchview.py
python assets/diagrams/generate_attention_torchview.py
npm install --prefix "$env:TEMP\gemma-viz" @viz-js/viz@3.30.0 sharp@0.35.5
node assets/diagrams/render-dot.mjs "$env:TEMP\gemma-viz\node_modules" mlp local_qkv attention_layer_0_full attention_layer_0_full_compact
node assets/diagrams/render-concept-svg.mjs "$env:TEMP\gemma-viz\node_modules" attention-gqa-zh attention-kv-cache-zh
```

从本文文件夹运行上述命令。Python 环境需提供 PyTorch、Transformers、torchview 与 graphviz Python 包；本次完整 Attention 追踪使用 PyTorch 2.8.0+cpu、Transformers 5.18.0.dev0、torchview 0.2.7，实际导入的 `modeling_gemma4.py` SHA-256 与 `notes/04-code-snapshot.json` 中固定源码相同。`.dot` 是追踪图源，`.svg` 和 `.png` 是相同结构的成图。第 05 期 `mlp.dot` 与局部 `local_qkv.dot` 曾从原追踪中收起 `hidden-tensor` 并直连前后算子；生成脚本已设置下次追踪时直接隐藏。`attention_layer_0_full.dot` 本次直接以 `hide_inner_tensors=True` 生成，无中间隐藏张量节点。第 06 期正文同时展示原始追踪 `attention_layer_0_full.svg` 与压缩讲解图 `attention_layer_0_full_compact.png`。后者从完整追踪重绘，合并 RoPE 逐元素步骤和形状整理、用用途名称标注 GQA 与汇聚；不作为独立数值运行结果。`attention-step-zh.svg/png` 是单次查询的算法讲解图。`attention-gqa-zh.svg/png` 与 `attention-kv-cache-zh.svg/png` 是早期矢量示意图，当前正文改用 `assets/generated/` 下的 Codex imagegen 版本；提示词和核对记录见 `notes/06-attention-imagegen.md`。
