"""Trace E4B's audio tower and language-width projection with torchview.

The trace follows Gemma4Model.get_audio_features from processor-provided
Mel features and validity mask. It uses E4B config and initialized modules,
without loading checkpoint weights or making a speech prediction. Waveform
resampling, Mel extraction, and placeholder construction are Processor work.
"""

import json
from pathlib import Path

import torch
from torch import nn
from torchview import draw_graph
from transformers.models.gemma4.configuration_gemma4 import Gemma4AudioConfig, Gemma4TextConfig
from transformers.models.gemma4.modeling_gemma4 import Gemma4AudioModel, Gemma4MultimodalEmbedder


ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "reference" / "transformers-gemma4-8445b13" / "e4b-config.json"
data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
audio_config = Gemma4AudioConfig(**data["audio_config"])
text_config = Gemma4TextConfig(**data["text_config"])
audio_config._attn_implementation = "eager"


class AudioPathTrace(nn.Module):
    def __init__(self):
        super().__init__()
        self.audio_tower = Gemma4AudioModel(audio_config)
        self.embed_audio = Gemma4MultimodalEmbedder(audio_config, text_config)

    def forward(self, input_features, input_features_mask):
        output = self.audio_tower(input_features, input_features_mask)
        projected = self.embed_audio(inputs_embeds=output.last_hidden_state)
        return projected, output.attention_mask


def main():
    torch.set_num_threads(8)
    model = AudioPathTrace().eval()
    mel_frames = 16  # Small teaching shape; not a recording-length limit.
    input_features = torch.zeros(1, mel_frames, 128)
    input_features_mask = torch.ones(1, mel_frames, dtype=torch.bool)

    with torch.no_grad():
        projected, mask = model(input_features, input_features_mask)
    assert tuple(projected.shape) == (1, 4, text_config.hidden_size), tuple(projected.shape)
    assert tuple(mask.shape) == (1, 4), tuple(mask.shape)

    graph = draw_graph(
        model,
        input_data=(input_features, input_features_mask),
        device="cpu",
        depth=2,
        show_shapes=True,
        hide_inner_tensors=True,
        save_graph=False,
        graph_name="audio_path_16mel_e4b",
    )
    (OUT / "audio_path_16mel_e4b.dot").write_text(graph.visual_graph.source, encoding="utf-8")
    print("PASS: audio path shape forward", tuple(projected.shape), tuple(mask.shape))


if __name__ == "__main__":
    main()
