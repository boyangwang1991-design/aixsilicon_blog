# Gemma 4 局部 torchview 图源

两张图只展示官方 Transformers 模块的局部前向结构：第 0 层 `mlp`、第 0 个局部注意力层的 `local_qkv`。模型参数和输入都在 PyTorch `meta` device 上；`B=1,S=2` 只限制画面的序列长度，E4B 的主宽度、MLP 宽度和 Q/K/V 头形状保持真实配置。图不是模型权重、数值推理结果或完整 42 层执行图。

生成流程：

```powershell
python assets/diagrams/generate_torchview.py
npm install --prefix "$env:TEMP\gemma-viz" @viz-js/viz@3.30.0 sharp@0.35.5
node assets/diagrams/render-dot.mjs "$env:TEMP\gemma-viz\node_modules"
```

从本文文件夹运行上述命令。Python 环境需提供 PyTorch、Transformers、torchview 与 graphviz Python 包；实际验证版本及源码快照保存在同篇编辑资料中。`.dot` 是 torchview 原始输出，`.svg` 和 `.png` 是相同结构的可显示版本。图中所有被追踪的张量节点均开启 `show_shapes=True`；正文仍须解释 `B`、`S`、`head`、`head_dim` 的含义和未画出的阶段。
