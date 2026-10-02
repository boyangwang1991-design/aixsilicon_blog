# 第 29 章讲解图技术复核记录

- 用途：修正 Mini Safety SoC 图中内部数据可用标志与 AXI 读响应握手混用，以及把 `DECERR` 当作 SRAM UE 响应的歧义。
- 语言：简体中文。
- 工具：Codex 内置 ImageGen，基于原图定向编辑一次。
- 最终文件：`assets/generated/chapter-29-mini-soc-imagegen-v2.png`。
- SHA-256：`7ffc0858ef7238f35a9d1ecd35d2d1753b433b62bd5d6f9ec29e5a289ed738d4`。
- 原尺寸检查：`1672 × 941`；图中内部 `data_valid=0`、`RRESP=SLVERR` 与 `RVALID` 握手均可读，原有数据路径、事件路径和证据核对保留。原图作为历史版本保留，不再由正文引用。

最终编辑提示词原文：

> Use case: precise-object-edit. Edit target: the supplied Chinese engineering diagram. Preserve its 16:9 composition, visual quality, color semantics, layout, all modules, arrows, lower evidence panels, and all text not named below. This is a narrowly targeted technical correction. Replace every occurrence of 'data valid = 0' in the SRAM Controller and the leftward response label with '内部 data_valid = 0'. Replace '返回错误响应 (如 SLVERR/DECERR)' with 'AXI 返回 SLVERR；RVALID 握手保持'. Replace '(如 SLVERR/DECERR)' under the leftward error-response arrow with '(RRESP=SLVERR，RVALID 握手)'. In lower-left panel replace line '同一笔读取返回 data valid = 0，且为错误响应 (SLVERR/DECERR 等)。' with '内部 data_valid=0；AXI 以 RRESP=SLVERR 完成握手。'. Do not use DECERR anywhere in the edited image. Critical technical meaning: internal data_valid means payload may be consumed normally, whereas AXI RVALID marks a valid read response transfer and must be asserted for the error beat. Keep all other text readable Chinese, no chapter heading or cover.

第二张图用途：修正时间预算图 `T₁/T₂` 的潜在重复计时，以及把“对外可观察”误当作受控动作完成。语言同为简体中文，使用 Codex 内置 ImageGen 对原图定向编辑一次。最终文件为 `assets/generated/chapter-29-time-budget-imagegen-v2.png`，SHA-256 为 `95ce235d5d83f14e671b710ffded0c1d51e8761c111e75682d4412f1b666864e`，尺寸 `1672 × 941`。原尺寸检查了时间箭头、公式、三组边界说明；原图保留作历史版本，不再由正文引用。

最终编辑提示词原文：

> Use case: precise-object-edit. Edit target: supplied Chinese 16:9 engineering time-budget diagram. Preserve composition, color palette, layout, typography hierarchy, six-stage upper process, lower three caution panels, and every element except the specified technical labels. Remove double-counting and make the FTTI endpoint the actual controlled output action. Change T1 lower label '故障到可被读取' to '故障激活/暴露延迟' and upper first red-box note to '故障发生；若尚未影响功能，记录暴露起点；此段按故障模型定义'. Change T2 lower label '读取/巡检等待' to '等待实际读取/巡检'. Change T6 lower label '对外可观察输出' to '受控输出实际生效'; in the last upper green box change heading '对外受控输出可观察' to '受控输出实际生效' and detail to '隔离/降级/安全状态在输出端生效；寄存器/日志用于验证'. Keep the equation 'T1+T2+T3+T4+T5+T6+工程裕量 < FTTI' and all other caveats. Avoid any statement implying a log entry alone satisfies FTTI. Keep Chinese labels high-contrast and readable, no new large title, no chapter number.
