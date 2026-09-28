"""Trace one official E4B text decoder layer on PyTorch's meta device.

The trace uses the pinned E4B text config and official Transformers module.
It traces a non-shared sliding attention layer (index 0), B=1, S=2, with
precomputed layer input and position embeddings. No weights are loaded.
"""

import json
from pathlib import Path

import torch
from torch import nn
from torchview import draw_graph
from transformers.models.gemma4.configuration_gemma4 import Gemma4TextConfig
from transformers.models.gemma4.modeling_gemma4 import Gemma4TextDecoderLayer


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT.parent / "reference" / "transformers-gemma4-8445b13" / "e4b-config.json"
data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
config = Gemma4TextConfig(**data["text_config"])
config._attn_implementation = "eager"


class LayerTrace(nn.Module):
    """Fix precomputed side inputs while keeping the official layer intact."""

    def __init__(self):
        super().__init__()
        self.layer = Gemma4TextDecoderLayer(config, layer_idx=0)
        self.register_buffer("cos", torch.ones(1, 2, 256, device="meta"))
        self.register_buffer("sin", torch.zeros(1, 2, 256, device="meta"))
        self.register_buffer("mask", torch.zeros(1, 1, 2, 2, device="meta"))

    def forward(self, x, per_layer_input):
        return self.layer(
            hidden_states=x,
            per_layer_input=per_layer_input,
            shared_kv_states={},
            position_embeddings=(self.cos, self.sin),
            attention_mask=self.mask,
            past_key_values=None,
        )


def main():
    with torch.device("meta"):
        model = LayerTrace()
    model.eval()
    x = torch.empty(1, 2, 2560, device="meta")
    ple = torch.empty(1, 2, 256, device="meta")
    with torch.no_grad():
        result = model(x, ple)
    assert tuple(result.shape) == (1, 2, 2560), tuple(result.shape)
    for depth in (2,):
        graph = draw_graph(
            model,
            input_data=(x, ple),
            device="meta",
            depth=depth,
            show_shapes=True,
            hide_inner_tensors=True,
            save_graph=False,
            graph_name=f"decoder_layer_0_depth_{depth}",
        )
        (OUT / f"decoder_layer_0_depth_{depth}.dot").write_text(
            graph.visual_graph.source, encoding="utf-8"
        )
    print("PASS: meta forward output", tuple(result.shape))


if __name__ == "__main__":
    main()
