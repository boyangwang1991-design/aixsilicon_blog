# English image localization record

Date: 2026-09-26. Tool: Codex built-in imagegen.

The initial request specifications below were reconstructed from the generation work after interruption; they are not claimed as verbatim tool transcripts. Exact later correction prompts are retained separately where available. Chinese source images were visually inspected and retained.

## cover-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Explore Architecture Before RTL. AI-assisted NPU SRAM modeling. Chip labels: Compute, Controller, On-chip network, Other modules.

## 01-ai-esl-workflow-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Turn architecture questions into experiments. Define, build, run, compare. Preserve engineer and AI responsibilities. Queue depth must remain queue depth, not team size.

## 02-npu-sram-model-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

How does one memory access affect an NPU task? Python addresses and dependencies; load/compute/store with finite buffers; SystemC splitting, bounded queues, network, banks and returns. Completion releases task dependencies. Backpressure propagates upstream.

## 03-evidence-to-decision-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Lower memory latency, nearly unchanged task time. Same holdout C0 versus XOR: transaction p99 225 to 198 cycles, 12%; GEMM 7714 to 7715 cycles, +1 cycle. Port 0 later tiles illustrate the task tail, not to scale. Do not claim measured shortening of a particular task.
