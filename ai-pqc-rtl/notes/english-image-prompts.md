# English image localization

Date: 2026-09-26. Tool: Codex built-in imagegen. Chinese originals retained.

## cover-en.png

Source: `assets/generated/cover-zh.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Cover headline: 'Designing a Post-Quantum Accelerator with AI'. Subtitle: 'From algorithms to verifiable circuits'. Series: 'AI-ASSISTED CHIP DEVELOPMENT'. Preserve navy, teal and amber lattice-over-chip conceptual illustration. Wide composition, crop-safe.

## lattice-quantum-intuition-en.png

Source: `assets/lattice-quantum-intuition.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title 'Lattice Cryptography: Easy to Generate, Hard to Reverse'. Three panels: lattice structure; noisy observations; high-dimensional hard problems. Clearly retain: the 2D drawing builds intuition and is not a security proof; real security depends on suitable parameters, not dimension alone; no known efficient quantum attack. ML-KEM / ML-DSA use carefully designed module structures. Do not imply absolute future security.

## rtl-01-overview-en.png

Source: `assets/rtl-01-overview.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title '01 | Current RTL Architecture'. Preserve six controller names, all connections. Facts translate to: One active command; 64 KiB working SRAM by default; 32-bit internal data; 128-bit AXI by default. Keccak has NO direct memory port. Preserve inactive gray sequencers start=0.

## rtl-02-command-control-en.png

Source: `assets/rtl-02-command-control.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title '02 | Command Scheduling and Transaction Control'. Keep all seven encapsulation stages and separate KeyGen branch. Include 128-byte descriptor shadow, CRC/parameter/permission validation, command lifecycle; input DMA / algorithm start / output DMA / completion commit. 32-byte completion record. Both result writes and completion write must receive write responses before command retires. Diagram is serial flow, not cycle-accurate timing. KeyGen custody needs external KM ACK before public key/handle output.

## rtl-03-compute-datapath-en.png

Source: `assets/rtl-03-compute-datapath.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title '03 | Shared Compute Datapath'. Exact values N=256, q=3329 or 8380417, 1600-bit state,1 or 2 rounds/cycle,8-bit streams,32-bit data,16-bit word addresses. Keccak only streams via controller, NO SRAM arrow. Direct SRAM access belongs to algorithm controller. Sampler writes; Poly and Codec read/write. Preserve notes: current Poly single lane despite NTT_LANES parameter; hash throughput also limited by byte streams.

## rtl-04-memory-dma-en.png

Source: `assets/rtl-04-memory-dma.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title '04 | Working Memory and DMA'. Keep all existing English labels and architecture unchanged. Bottom note translate 'Current limits: no parallel multi-bank service; TOP tag_we=0, tag_check_req=0; page-attribute authorization is incomplete'. Preserve C0/C1/D logical interfaces to ONE access path;256words/page1KiB/page;39-bit ECC;40-bit external addresses/128-bit default data.

## rtl-05-key-security-en.png

Source: `assets/rtl-05-key-security.png`

Use case: text-localization. Edit the supplied image, translating every Chinese title, label, note and legend into clear natural English. Preserve every technical relationship, arrow direction, identifier and numerical value. Keep its visual style, with spacing adjusted for readable English. No Chinese remains. This is a conceptual explanation, not a measured result. Title '05 | Keys and Security Control'. Other Chinese note: 'The two rows show different uses of the same Work Key RAM'. Preserve all existing English labels, current integration limits, and arrows. WorkKeyRAM8KiB SECDED. No APB/AXI privatekeyreadback. Faultcontroller downwardzeroizerequest and upwarddoneaggregation. Keep KeySlots metadata, not full privatekey arrays.

