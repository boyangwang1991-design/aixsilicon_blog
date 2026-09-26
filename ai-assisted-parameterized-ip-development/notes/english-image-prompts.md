# English image localization

Date: 2026-09-26. Tool: Codex built-in imagegen. Original Chinese images preserved.

## cover-en.png

Input: assets/generated/cover-zh.png

Prompt: Use case: text-localization. Fully translate supplied image into natural precise English. Preserve technical relationships, values, arrows and original visual style. No Chinese. Reflow text for readability. Title: When Permissions Change, Which Rules Apply?. Wide editorial cover. Subtitle: AI-assisted Secure APB Demux design. Series: AI-ASSISTED CHIP DEVELOPMENT. Cards New policy / Active policy. Preserve dark teal amber composition.

## 01-admission-before-routing-en.png

Input: assets/generated/01-admission-before-routing-zh.png

Prompt: Use case: text-localization. Fully translate supplied image into natural precise English. Preserve technical relationships, values, arrows and original visual style. No Chinese. Reflow text for readability. Title: Check permissions before selecting a peripheral. Upstream APB request: address/read-write/identity/attributes -> address decode -> permission check using ACTIVE per-port per-requester policy -> allow -> select one port -> Peripheral 0/1/2, only 1 selected. Deny -> local error upstream, no peripheral selection, no write, no read-clear or FIFO pop. Identity comes from trusted system connection.

## 02-frozen-transaction-context-en.png

Input: assets/generated/02-frozen-transaction-context-zh.png

Prompt: Use case: text-localization. Fully translate supplied image into natural precise English. Preserve technical relationships, values, arrows and original visual style. No Chinese. Reflow text for readability. Title: One access, one transaction context. SETUP decode/check -> end-of-SETUP edge captures context -> ACCESS waits/completes -> next access. Frozen address/data, read-write/byte enables, requester identity, protection attributes, target/decision, policy version feeds routing,response,event records. Preserve identity,target,decision during stalls. Upstream must still obey APB stability rules.

## 03-atomic-policy-commit-en.png

Input: assets/generated/03-atomic-policy-commit-zh.png

Prompt: Use case: text-localization. Fully translate supplied image into natural precise English. Preserve technical relationships, values, arrows and original visual style. No Chinese. Reflow text for readability. Title: Update permissions without a half-written policy. Software writes SHADOW across multiple writes while ACTIVE remains old. COMMIT validates port mask, no lock conflict, integrity good. All pass: selected ports configuration and ALL requester permissions update ACTIVE together on one edge; version +1. Any failure: ACTIVE unchanged. Next SETUP uses new policy. Single upstream APB serializes configuration and peripheral access; COMMIT does not run alongside another in-flight peripheral access.

## 04-parameterized-instance-en.png

Input: assets/generated/04-parameterized-instance-zh.png

Prompt: Use case: text-localization. Fully translate supplied image into natural precise English. Preserve technical relationships, values, arrows and original visual style. No Chinese. Reflow text for readability. Title: Change parameters, update the whole instance. One instance config: port count, requester count, features -> validate -> expand SystemRDL -> register RTL, verification register model,C headers,docs. Same config -> behavioral RTL parameters. Compile-time comparison of RTL parameters with generated instance package: match continue, mismatch reject and regenerate. 32 requesters need at least 5 identity bits (2^5=32).
