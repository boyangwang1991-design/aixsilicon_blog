# English image localization record

Date: 2026-09-26. Tool: Codex built-in imagegen.

The initial request specifications below were reconstructed from the generation work after interruption; they are not claimed as verbatim tool transcripts. Exact later correction prompts are retained separately where available. Chinese source images were visually inspected and retained.

## cover-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Memory Access Needs Permission. AI-assisted AXI MPU development. AI-ASSISTED CHIP DEVELOPMENT.

## 01-mpu-access-control-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

CPU/DMA/NPU issue AXI requests through MPU to protected memory. Check address, identity, security, privilege, read/write/instruction. Separate APB configuration. Default deny.

## 04-requirement-to-evidence-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Default deny: requirement, local error path, outside-region read/write tests, DECERR with no backend request and violation record, versioned execution evidence.

## 02-denied-burst-response-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Four 8-byte beats at 0x17F8, 0x1800, 0x1808, 0x1810. Allowed region 0x1000–0x17FF; one 4KB page. Deny all before forwarding. ARLEN=3, four DECERR beats, RLAST only on the last. Correction: Even if the first beat is in range, do not forward any part of the request.

## 03-register-single-source-en.png

Use case: text-localization. Translate all labels into natural English. Preserve technical meaning, values, arrow directions, palette, and composition; reflow text for readability. No Chinese remains. Do not invent measurements.

Behavior contract to SystemRDL; deterministic tools produce register RTL, C headers, documentation and IP-XACT. Write-one-to-set lock, reset clears; protected register write enables must actually enforce locking and be tested.
