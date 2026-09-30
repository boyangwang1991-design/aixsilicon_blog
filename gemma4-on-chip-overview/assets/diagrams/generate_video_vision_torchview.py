"""Trace E4B's video-frame vision path with torchview, without checkpoint weights.

The wrapper follows Gemma4Model.get_video_features through frame flattening,
the shared vision tower, and projection to text width. Processor operations
(frame sampling, timestamps, placeholder construction) are outside nn.Module.
The small two-frame, 3x3-patch input is for graph readability, not an E4B limit.
"""

import json
from pathlib import Path

import torch
from torch import nn
from torchview import draw_graph
from transformers.models.gemma4.configuration_gemma4 import Gemma4TextConfig, Gemma4VisionConfig
from transformers.models.gemma4.modeling_gemma4 import Gemma4MultimodalEmbedder, Gemma4VisionModel


ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "reference" / "transformers-gemma4-8445b13" / "e4b-config.json"
data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
vision_config = Gemma4VisionConfig(**data["vision_config"])
text_config = Gemma4TextConfig(**data["text_config"])
vision_config._attn_implementation = "eager"


class VideoVisionTrace(nn.Module):
    def __init__(self):
        super().__init__()
        self.vision_tower = Gemma4VisionModel(vision_config)
        self.embed_vision = Gemma4MultimodalEmbedder(vision_config, text_config)

    def forward(self, pixel_values_videos, video_position_ids):
        # Same frame folding and module sequence as Gemma4Model.get_video_features.
        frames = pixel_values_videos.flatten(0, 1)
        positions = video_position_ids.flatten(0, 1)
        features = self.vision_tower(pixel_values=frames, pixel_position_ids=positions).last_hidden_state
        return self.embed_vision(inputs_embeds=features)


def main():
    frames = 2
    patches = 9  # 3x3; one pooled token per frame in this small trace.
    patch_pixels = 3 * vision_config.patch_size**2
    coords = torch.tensor([[x, y] for y in range(3) for x in range(3)], dtype=torch.long)
    positions = coords.view(1, 1, patches, 2).repeat(1, frames, 1, 1)

    torch.set_num_threads(8)
    model = VideoVisionTrace()
    model.eval()
    pixels = torch.zeros(1, frames, patches, patch_pixels)

    with torch.no_grad():
        output = model(pixels, positions)
    assert tuple(output.shape) == (frames, text_config.hidden_size), tuple(output.shape)

    graph = draw_graph(
        model,
        input_data=(pixels, positions),
        device="cpu",
        depth=2,
        show_shapes=True,
        hide_inner_tensors=True,
        save_graph=False,
        graph_name="video_vision_2frames_e4b",
    )
    (OUT / "video_vision_2frames_e4b.dot").write_text(graph.visual_graph.source, encoding="utf-8")
    print("PASS: video vision shape forward", tuple(output.shape))


if __name__ == "__main__":
    main()
