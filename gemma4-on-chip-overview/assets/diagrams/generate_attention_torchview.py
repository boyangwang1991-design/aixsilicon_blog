"""Trace a complete E4B local Attention module with torchview on meta tensors.

The wrapper supplies precomputed RoPE values and a mask so the figure can
focus on the complete Attention path. It uses the pinned E4B configuration,
official Gemma4TextAttention, eager backend, layer 0, B=1, S=2, and no cache.
No checkpoint weights or numerical predictions are used.
"""

import json
from pathlib import Path

import torch
from torch import nn
from torchview import draw_graph
from transformers.models.gemma4.configuration_gemma4 import Gemma4TextConfig
from transformers.models.gemma4.modeling_gemma4 import Gemma4TextAttention


ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "reference" / "transformers-gemma4-8445b13" / "e4b-config.json"
data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
config = Gemma4TextConfig(**data["text_config"])
config._attn_implementation = "eager"


class AttentionTrace(nn.Module):
    """Keep Attention itself intact and fix its non-main inputs."""

    def __init__(self):
        super().__init__()
        self.attention = Gemma4TextAttention(config, layer_idx=0)
        self.register_buffer("cos", torch.ones(1, 2, 256, device="meta"))
        self.register_buffer("sin", torch.zeros(1, 2, 256, device="meta"))
        self.register_buffer("mask", torch.zeros(1, 1, 2, 2, device="meta"))

    def forward(self, x):
        output, _weights = self.attention(
            hidden_states=x,
            position_embeddings=(self.cos, self.sin),
            attention_mask=self.mask,
            shared_kv_states={},
            past_key_values=None,
        )
        return output


def main():
    with torch.device("meta"):
        model = AttentionTrace()
    model.eval()
    x = torch.empty(1, 2, 2560, device="meta")
    with torch.no_grad():
        output = model(x)
    assert tuple(output.shape) == (1, 2, 2560)
    graph = draw_graph(
        model,
        input_data=x,
        device="meta",
        depth=2,
        show_shapes=True,
        hide_inner_tensors=True,
        save_graph=False,
        graph_name="attention_layer_0_full",
    )
    (OUT / "attention_layer_0_full.dot").write_text(graph.visual_graph.source, encoding="utf-8")
    print("PASS: complete Attention meta forward", tuple(output.shape))


if __name__ == "__main__":
    main()
