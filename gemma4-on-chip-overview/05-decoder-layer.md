# 42 层里的这一层：信息沿哪几条路走

[系列索引](README.md) · 第 05 期

假如把 42 层 decoder 想成 42 次“把一句话重新写一遍”，就容易误以为每层都会重新产生一套 token。实际流过各层的是同一组位置上的向量，主宽度始终为 `[B,S,2560]`。每层改变向量承载的信息，最后才由输出头把当前位置的向量变成下一枚 token 的候选分数。读懂其中一层，就有了追踪整段推理的坐标系。

一层里有三次值得分开看的更新：Attention 让当前位置读取可见历史；MLP 在每个位置内部重组特征；E4B 的逐层嵌入（PLE）给本层补一条与 token 身份有关的输入。每次更新都要回到 2560 维，才能与保存的主流相加。残差相加不是跳过计算，而是让本层输出表示为“原有状态加上本次修正”。

沿官方 `Gemma4TextDecoderLayer` 的顺序看：先对主流做 RMSNorm，再运行自注意力；注意力输出再经 RMSNorm，与进入本段之前保存的残差相加。随后再次归一化进入 MLP；MLP 输出也经过归一化，再与它的残差相加。最后是 PLE 的门控、投影、归一化和残差注入。这个先后关系影响数值语义，不能仅用“Attention 加 FFN”两块替代。

![官方 E4B 第 0 层 MLP 的局部 torchview 图，B=1、S=2](assets/diagrams/mlp.png)

这张图故意只画 MLP。输入 `[1,2,2560]` 分成 gate 和 up 两路，各变成 `[1,2,10240]`；gate 路经过 `gelu_pytorch_tanh`，两路逐元素相乘，down 投影回 `[1,2,2560]`。绿色模块和米色张量节点均给出形状。图来自官方 `Gemma4TextMLP`，meta tensor 没有真实权重或推理结果；不是完整 decoder 层。固定 revision 的 E4B 配置中 `use_double_wide_mlp=False`，因此这里的 10240 中间宽度也适用于它的其他文本层；图仍只显示第 0 层的 MLP 算子路径。

<!-- 配图提示词｜图 05-A：中文单层数据流，主残差形状 [B,S,2560]。Attention、MLP、PLE 三段分别展开为若干模块，画三处残差相加；每条线标 shape、dtype，Q/K/V 内部暂折叠。标注“本图为 E4B 层结构概念图；完整数值顺序按官方实现”。只画一层，不画 42 层堆叠。 -->

## 为什么每段后面都留着原来的向量

如果把输入记为 `X`，第一段输出可写成 `X + N_post_attention(Attention(N_input(X)))`；再把结果记为 `Z`，第二段成为 `Z + N_post_feedforward(MLP(N_pre_feedforward(Z)))`。这里用不同名字标明它们是不同的归一化模块。残差相加也提供一个形状检查：MLP 的 gate 路与 up 路虽然中间宽达 10240，down 投影必须回到 2560。

RMSNorm 不是矩阵乘。它对规定的特征轴估计均方根，再按学习到的缩放参数调整每个元素；在层图上应标为归约和逐元素运算。Attention、MLP 与 PLE 之间交错的这些小算子，决定了硬件不能只靠峰值矩阵吞吐来预测整层时间。

## 按源码逐行还原一次前向

把 `N` 记作 RMSNorm，`A` 记作本层 Attention，`F` 记作门控 MLP，`P_l` 记作第 `l` 层 PLE 向量。忽略训练态随机行为，E4B 文本层的主要数值顺序可以写成：

```text
r0 = x                                      # [B,S,2560]
a  = A(N_input(x))                          # [B,S,2560]
x1 = r0 + N_post_attention(a)               # [B,S,2560]
r1 = x1
f  = F(N_pre_feedforward(x1))               # [B,S,2560]
x2 = r1 + N_post_feedforward(f)             # [B,S,2560]
g  = gelu(per_layer_input_gate(x2))         # [B,S,256]
p  = N_post_per_layer_input(
       per_layer_projection(g * P_l))       # [B,S,2560]
out = (x2 + p) * layer_scalar                # [B,S,2560]
```

这段是按 `Gemma4TextDecoderLayer.forward` 整理的教学伪代码，不是替代官方实现的 Python 仿真。源码还包含 MoE 分支；E4B 固定配置关闭该分支，因此这里不凭空加入路由和专家计算。`layer_scalar` 发生在 PLE 残差之后，不能把它提前乘在某一条支路上。相加的两侧都必须是 2560 维；PLE 中间的 256 维先经投影回主宽度。

RMSNorm 可用 `RMS(x)=sqrt(mean_i(x_i²)+ε)` 理解，再用学习到的逐维系数缩放 `x/RMS(x)`。官方 `Gemma4RMSNorm` 的具体参数化还包含实现细节，因此部署数值对齐时应以官方模块为准。它跨特征维归约，后面立刻接矩阵乘；若把两者拆成多次外存往返，峰值 MAC 数再高也可能救不了延迟。

## MLP 为什么要走两条 10240 维的路

对一枚 token，输入宽 2560。`gate_proj` 和 `up_proj` 分别输出 10240 个数，gate 路经过 `gelu_pytorch_tanh`，再与 up 路逐元素相乘，最后 `down_proj` 从 10240 回到 2560。用公式写是

`F(x)=W_down[ GELU_tanh(W_gate x) ⊙ (W_up x) ]`。

这里 `⊙` 是同位置逐元素乘，并没有让不同 token 互相通信；跨 token 的通信在 Attention 中。按权重元素数估算，三张矩阵分别为 `2560×10240`、`2560×10240`、`10240×2560`，共约 7864 万元素/层，未计其他权重。Prefill 可把多个 token 作为矩阵行重用这些权重；batch=1 Decode 往往只有一个新增行，权重读取更难摊薄。这个量级说明为什么只优化注意力而不看 MLP，可能仍看不到期望的整层收益。

一层的输出仍是 `[B,S,2560]`，因此可以送入下一层；但这条表面不变的主线已经分别吸收了历史信息、位置内特征变换和逐层身份输入。下一篇先把 Attention 内部的 Q、K、V 拆开。

资料：[Google Gemma 4 模型卡](https://ai.google.dev/gemma/docs/core/model_card_4) · [E4B 固定配置](https://huggingface.co/google/gemma-4-E4B-it/blob/ee0ef6023621cff504d758262d4e04895a5af4a2/config.json) · [Transformers Gemma 4 源码](https://github.com/huggingface/transformers/tree/8445b13cd24961e47f25a649fb113580f71a8d11/src/transformers/models/gemma4)
