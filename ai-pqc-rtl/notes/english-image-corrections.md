# English diagram corrections

Date: 2026-09-26. Codex built-in imagegen. Targets were visually reviewed.

## rtl-02-command-control-en.png

Make exactly one arrow correction to this English diagram. The horizontal line labeled 'DMA done / err' between the orange DMA block and blue TOP transaction FSM must have ONLY ONE arrowhead: at its RIGHT endpoint, pointing from DMA into TOP. Remove its left arrowhead. Preserve every other arrow, text, number, and box unchanged.

## rtl-03-compute-datapath-en.png

Make only these text corrections in this English diagram. Replace 'Working SRAM (Same logical interface for all modules)' with 'Working SRAM (Logical ports of one shared SRAM)'. Next to the vertical blue arrow from TOP directly down to SRAM, add 'Direct memory access (algorithm controller; read / write)' in readable small text without overlapping other elements. This arrow is a functional simplification of requests and returns. Preserve ALL existing arrows and other text. Do not create an SRAM connection for Keccak.

