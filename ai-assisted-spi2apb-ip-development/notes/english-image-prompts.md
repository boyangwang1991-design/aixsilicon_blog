# English image localization

Date: 2026-09-26. Tool: Codex built-in imagegen.

## cover-en.png

Input: assets/generated/cover-zh.png

Prompt: Use case: text-localization. Fully translate image into clear natural English. Preserve numbers, relationships, arrows, technical behavior and visual style. No Chinese text. Reflow for legibility. Title: A Serial Link to On-Chip Peripherals. Wide cover. Subtitle AI-assisted SPI2APB design and verification. Series AI-ASSISTED CHIP DEVELOPMENT. Chip labels Configuration registers / Status registers / Peripherals / Controller. Preserve illustration.

## 01-request-before-access-en.png

Input: assets/generated/01-request-before-access-zh.png

Prompt: Use case: text-localization. Fully translate image into clear natural English. Preserve numbers, relationships, arrows, technical behavior and visual style. No Chinese text. Reflow for legibility. Title: A serial command becomes an on-chip access. External controller <-> SPI2APB bridge -> APB interconnect -> configuration/status/control peripherals. Receive complete request -> check format and applicable CRC -> publish -> execute APB beats. Fail checks: no APB access. CRC detects corruption, not identity authentication. Incomplete or invalid requests must not trigger peripheral side effects.

## 02-clock-domain-ownership-en.png

Input: assets/generated/02-clock-domain-ownership-zh.png

Prompt: Use case: text-localization. Fully translate image into clear natural English. Preserve numbers, relationships, arrows, technical behavior and visual style. No Chinese text. Reflow for legibility. Title: Two clocks, one ordered handoff. SCLK SPI frontend receives/checks -> stable shared request buffer -> PCLK APB transaction engine reads/executes. Request-ready control handshake forward, completion acknowledgement backward. 1 receiver fills 2 freeze after publication 3 executor reads 4 release after completion. One outstanding transaction. Synchronize controls; keep wide data stable. Conceptual request path; response/reset omitted.

## 03-revoke-at-transaction-boundary-en.png

Input: assets/generated/03-revoke-at-transaction-boundary-zh.png

Prompt: Use case: text-localization. Fully translate image into clear natural English. Preserve numbers, relationships, arrows, technical behavior and visual style. No Chinese text. Reflow for legibility. Title: Where does access stop after revocation?. Two separate scenarios. APB already started: completed beats remain completed; current beat finishes per protocol; no further beats launched. SPI frame starts disabled then re-enabled inside frame: frame remains rejected, check permission again only on next frame. Completed writes not rolled back. Disabled MISO output enable=0 (high impedance). Re-enable never replays old request. APB reset handled separately.

## 04-first-read-debug-en.png

Input: assets/generated/04-first-read-debug-zh.png

Prompt: Use case: text-localization. Fully translate image into clear natural English. Preserve numbers, relationships, arrows, technical behavior and visual style. No Chinese text. Reflow for legibility. Title: Why did the first READ depend on a write buffer?. Before: uninitialized write buffer -> unused READ data field -> command parity becomes X -> READ cannot issue normally. After: READ data field fixed to 0 -> parity uses same 0 -> independent of buffer initialization. X means unknown in four-state simulation, Z means high impedance. Debug flow failed first READ -> trace data -> fix command/parity together -> rerun original case -> full regression. Write-before-read can hide initialization dependence.
