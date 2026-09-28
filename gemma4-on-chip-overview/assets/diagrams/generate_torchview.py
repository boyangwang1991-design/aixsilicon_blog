"""Trace bounded Gemma 4 E4B views with official Transformers modules.

Run with a Python environment containing torch, transformers, and torchview.
All parameters and inputs live on the meta device: no checkpoint and no
numerical inference are involved. The diagrams cover only the named paths.
"""

from pathlib import Path

import torch
from torch import nn
from torchview import draw_graph
from transformers.models.gemma4.configuration_gemma4 import Gemma4TextConfig
from transformers.models.gemma4.modeling_gemma4 import (
    Gemma4TextAttention,
    Gemma4TextMLP,
)


OUT = Path(__file__).resolve().parent
LAYER_TYPES = ["sliding_attention"] * 5 + ["full_attention"]
CONFIG = Gemma4TextConfig(
    vocab_size=262_144,
    hidden_size=2560,
    intermediate_size=10240,
    num_hidden_layers=42,
    layer_types=LAYER_TYPES * 7,
    num_attention_heads=8,
    num_key_value_heads=2,
    head_dim=256,
    global_head_dim=512,
    hidden_size_per_layer_input=256,
    num_kv_shared_layers=18,
    sliding_window=512,
    attention_bias=False,
    hidden_activation="gelu_pytorch_tanh",
)


class LocalQKVProjection(nn.Module):
    """Only the projection/normalization path of official local layer 0.

    RoPE, masking, score/softmax, cache, and output projection are intentionally
    outside this view. These omitted paths are described in the article text.
    """

    def __init__(self, attention: Gemma4TextAttention):
        super().__init__()
        self.attention = attention

    def forward(self, x):
        b, s, _ = x.shape
        a = self.attention
        q = a.q_norm(a.q_proj(x).view(b, s, 8, 256)).transpose(1, 2)
        k = a.k_norm(a.k_proj(x).view(b, s, 2, 256)).transpose(1, 2)
        v = a.v_norm(a.v_proj(x).view(b, s, 2, 256)).transpose(1, 2)
        return q, k, v


def write_view(name, model, data, depth):
    graph = draw_graph(
        model,
        input_data=data,
        device="meta",
        depth=depth,
        show_shapes=True,
        hide_inner_tensors=False,
        save_graph=False,
        graph_name=name,
    )
    (OUT / f"{name}.dot").write_text(graph.visual_graph.source, encoding="utf-8")


def main():
    with torch.device("meta"):
        mlp = Gemma4TextMLP(CONFIG, layer_idx=0)
        qkv = LocalQKVProjection(Gemma4TextAttention(CONFIG, layer_idx=0))
    mlp.eval()
    qkv.eval()

    # B=1, S=2 limits the displayed example. D/head dimensions are E4B's.
    write_view("mlp", mlp, torch.empty(1, 2, 2560, device="meta"), 2)
    write_view("local_qkv", qkv, torch.empty(1, 2, 2560, device="meta"), 2)


if __name__ == "__main__":
    main()
