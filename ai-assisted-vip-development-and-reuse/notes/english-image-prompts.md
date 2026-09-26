# English image localization

Date: 2026-09-26. Tool: Codex built-in imagegen.

## cover-en.png

Input: assets/generated/cover-zh.png

Prompt: Use case: text-localization. Translate all Chinese in supplied image to concise natural English, preserving technical meaning, direction, layout and style. English only. Title: Can AI-Written Verification Be Reused?. Wide cover. Subtitle Developing and refining an AXI4 VIP. Series AI-ASSISTED CHIP DEVELOPMENT. Small tiles Stimulus / Protocol checks / Coverage / Reference model / Assertions / Transactions / Reusable VIP / Next chip design.

## 01-vip-role-en.png

Input: assets/generated/01-vip-role-zh.png

Prompt: Use case: text-localization. Translate all Chinese in supplied image to concise natural English, preserving technical meaning, direction, layout and style. English only. Title: Verification tools need verification too. Test intent -> VIP Driver -> DUT -> Monitor -> Checker and Coverage, monitor also feeds product reference model. Driver creates handshakes; Monitor reconstructs transactions; Checker detects protocol violations; Coverage records scenarios; product reference checks functional requirements. VIP is simulation software, not synthesized hardware. Conceptual roles.

## 02-common-error-oracle-en.png

Input: assets/generated/02-common-error-oracle-zh.png

Prompt: Use case: text-localization. Translate all Chinese in supplied image to concise natural English, preserving technical meaning, direction, layout and style. English only. Title: Wrong address, correct readback?. Left: write A -> wrong address mapping -> wrong memory location -> same wrong read mapping -> A read back -> loopback passes, bug hidden. Right independent vectors define correct location, compare actual write location -> mismatch identifies mapping bug. Independent expectations must not reuse DUT address algorithm. No numeric addresses needed.

## 03-test-the-checker-en.png

Input: assets/generated/03-test-the-checker-zh.png

Prompt: Use case: text-localization. Translate all Chinese in supplied image to concise natural English, preserving technical meaning, direction, layout and style. English only. Title: How do you check a VIP?. Three columns semantic unit tests (independent vectors for addresses/byte lanes), system self-test (driver monitor responder, normal/boundary/concurrent cases), intentional violations (illegal burst length or early data termination, expect correct rule). Legal controls must not false-alarm; violations must be detected. Injection code existing does not prove violation occurred on interface. No qualification/coverage completion claim.

## 04-reuse-boundary-en.png

Input: assets/generated/04-reuse-boundary-zh.png

Prompt: Use case: text-localization. Translate all Chinese in supplied image to concise natural English, preserving technical meaning, direction, layout and style. English only. Title: Reuse AXI behavior, keep product-specific checks. Conceptual proposed AXI MPU integration, not an accepted integration. Upstream AXI master VIP -> MPU DUT -> downstream AXI slave VIP. VIP generates transactions observes handshakes checks protocol. Product reference checks regions, identities, read/write permissions, violation records. Configure region -> set permissions -> access -> check response and violation. Denial also requires no downstream access.
