# Every router has a tile

2026-09-27. Codex built-in imagegen localization of the corrected Chinese topology. Output: assets/generated/architecture-en.png. User clarified one Tile per Router; this replaces the two-tile abstraction.

Translate this exact infographic to English, preserve exact 8 routers R0-R7, 8 NIUs, 8 Tiles 0-7, six horizontal plus four vertical links and every Tile connection. Title "Every Router Connects to a Tile". Subtitle "4×2 Mesh: 8 routers + 8 compute tiles". In every Tile replace 计算单元 with Compute and 本地 SRAM with Local SRAM. Inset heading "Possible endpoint attachment (detail)"; Router 本地端口 = "Router local port"; 本地接入复用 = "Local endpoint mux"; Tile NIU unchanged; 计算 Tile = "Compute tile"; 端点 NIU = "Endpoint NIU"; DMA / 共享存储 / DDR 接入 = "DMA / shared memory / DDR interface". Footer "Keep a tile at every node; attach other endpoints as required." Small footer "Architecture concept; ESL represents tile traffic, not operator execution." Make ALL inset data connections bidirectional including mux branches and NIU-endpoint arrows. Maintain mobile legibility same colors and 4:3 composition.

Generated source: C:\Users\wangb\.codex\generated_images\01a0db57-6e0e-7dc1-957a-ec6b32c34f1d\exec-424cf0de-97f1-4a67-9537-92b6701b829c.png
