# Bilingual response-path correction

Tool: Codex built-in imagegen. Applies to system-zh.png and system-en.png. Initial images showed return only from DDR; this was corrected during visual QA.

Preserve all labels, layout, colors and typography. Correct the dashed response path only: both SRAM and DDR must feed a shared dashed return line, using separate connections from their right edges to a vertical dashed trunk at the far right then a bottom leftward dashed arrow. Make the left end of the dashed return arrow point to the combined source side (a short vertical bracket encompassing all three source boxes), not just KV. Keep this response route separate from forward solid request arrows and do not overlap any text. This is a logical return-path summary, not a direct physical bypass. Do not add or remove text.
