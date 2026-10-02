# APB VIP 中文讲解图制作记录

2026-10-01。使用 Codex 内置 ImageGen，中文先行，无封面、无英文图。最终 4 张图均为概念/方法示意，不能代表仿真证据。技术关系以源码核对与正文为准。

## 第 02 章

文件：`assets/generated/chapter-02-vip-architecture-zh.png`

SHA256：`5319ad5c7b2f82cea70ab9cad32587a24c030097e6b14b97deeb15dd29fb1887`

用途：请求端驱动、实际观察、检查/覆盖/寄存器预测的分工。

最终提示词：

Use case: infographic-diagram. 为中文技术博客绘制可直接嵌入正文的工程讲解图，横向约16:9，清晰简体中文，高对比、大字号、留白充足、无整页大标题、无页眉页脚、无Chapter编号、无品牌、无封面、无装饰芯片照片、无真实软件界面、无波形。深海军蓝表示结构，白或极浅底色，青色表示观察与验证路径，琥珀色表示待检查或反馈问题，中性灰表示边界。不是幻灯片截图。简洁局部标签比解释文字大。图为原理示意，不含性能或验证通过数字。 本图回答：请求端模式下，一笔事务如何穿过APB VIP并被观察？左侧大边界标注“APB VIP / 请求端模式”，右侧独立边界“DUT / APB外设”。主线从左上“Sequence / 访问意图”到“Sequencer”到“Driver / 驱动请求”到居中的“apb_if / 物理接口”再指向右侧DUT，请求箭头明确向右，响应箭头从DUT返回接口再返回Driver。接口框内下部小块“SVA / 逐周期检查”。从接口向下有青色箭头到唯一“Monitor / 实际观察”，从Monitor分三路向下分别到“Checker / 事务检查”“Coverage / 场景统计”“Predictor / 可选寄存器预测”。Predictor旁灰色小标签“绑定 RAL map 后更新”。底部一行局部边界说明“外设功能预期由项目模型负责”。不要画从Sequence到Monitor的捷径。不要画从Checker或Coverage驱动DUT。不要画Slave Driver与当前Master同时在一个接口上驱动。箭头不得经过框中文字。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-1fbd4ce3-96e8-42f2-8338-c0b00682871d.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

核对：请求与响应方向、monitor 取自物理接口、predictor 的 map 条件正确；默认只绘请求端。

## 第 04 章

文件：`assets/generated/chapter-04-independent-checks-zh.png`

SHA256：`4d81a6c6dd31880c1c58d99a4ede6bd57f4ec31aa36807c4fdfec800220e5ef0`

用途：普通存储字节写入的独立预期，固定结果 0x11BB33DD。

最终提示词：

生成中文技术博客正文概念图，横向16:9，白底、海军蓝结构、青色有效写入、灰色保持。不要整页大标题、页眉页脚、口号、幻灯片装饰。准确表达一个32位普通存储的部分写独立预期。左侧占60%：四列由高字节到低字节，列标签依次 [31:24] [23:16] [15:8] [7:0]。四行标签及值严格为：原值 11 22 33 44；写入值 AA BB CC DD；PSTRB 0 1 0 1；预期 11 BB 33 DD。高字节和第1字节用灰色垂直引线表示原值保持；第2字节及最低字节用青色引线表示写入替换。左下简短条件“普通存储语义；逐字节独立推导”。右侧占40%：上方框“固定预期 0x11BB33DD”，下面框“实现输出 实际读回值”，两框分别用青色箭头指向右下的“比较”框。固定预期必须从左侧预期行连接过来。旁边小灰注“预期不调用被测合并函数”。文字大且清晰，四字节表格是主体，留足间距，图只解释独立预期的来源，不绘制回环架构、不制造通过标记或仿真截图。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-fd734411-9164-40a1-855d-cc9ea6f6d75a.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

核对：四个字节、strobe、期望值及比较输入一致；不显示虚构 PASS。

## 第 05 章

文件：`assets/generated/chapter-05-watchdog-reuse-zh.png`

SHA256：`21c6f2305657eeb5e177ee99d2ab1b66924f091f01f0d8f2192d6082447cdb75`

用途：Watchdog 环境主要数据流，省略 apb_actual 等适配路径的概念简图。

最终提示词：

Use case: infographic-diagram. 为中文技术博客绘制可直接嵌入正文的工程讲解图，横向约16:9，清晰简体中文，高对比、大字号、留白充足、无整页大标题、无页眉页脚、无Chapter编号、无品牌、无封面、无装饰芯片照片、无真实软件界面、无波形。深海军蓝表示结构，白或极浅底色，青色表示观察与验证路径，琥珀色表示待检查或反馈问题，中性灰表示边界。不是幻灯片截图。简洁局部标签比解释文字大。图为原理示意，不含性能或验证通过数字。 本图回答：APB VIP与Watchdog产品验证如何分工？分左右两个边界，左“复用 APB VIP”，右“Watchdog 项目验证”，中下DUT标注“Watchdog RTL”。左上“访问序列 / RAL”向“APB Driver”再向DUT的APB端口，DUT总线信号向“APB Monitor”。APB Monitor向左下“协议检查与覆盖”，向右侧“产品参考模型”，另一路向左小框“RAL Predictor / 寄存器镜像”。右侧有“控制激励”箭头到DUT，DUT产品信号箭头到“Watchdog Monitor”；Watchdog Monitor分两路，一路向“产品参考模型”标注“观察”，一路向“Scoreboard”标注“实际”；产品参考模型向Scoreboard标注“预期”；Scoreboard向“产品功能覆盖”标注“匹配结果”。如果空间拥挤请利用两层排列但不要省略实际与预期独立来源。所有箭头方向正确，不把predictor画为DUT状态本体。没有AI机器人或装饰。少字、大标签。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-bcbc9ec5-3fa0-4bb8-84aa-812f0b7d90db.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

核对：APB 观察和产品观察分别进入参考模型；实际产品输出进入 scoreboard，匹配进入功能覆盖。

## 第 07 章

文件：`assets/generated/chapter-07-feedback-improvement-zh.png`

SHA256：`f96d64c9fbed4e226efddd8fa56c4edf7719bd2135e114d36a0213337672a6ac`

用途：消费方反馈到公共修正、专项回归与返回项目的流程；项目专属行为单列灰色分支。

最终提示词：

请新生成一张简体中文技术博客正文图，横向16:9，白底海军蓝结构，青色表示验证和改进路径，琥珀色只用于问题输入，灰色表示项目专用分支。禁止整页大标题、页眉页脚、口号横幅、Chapter字样。不要很多小字，只画下面指定的6个主框以及一个分支框，模块标签大、手机阅读清晰。主线分两行：上行从左到右三个框，分别“项目反馈”（小字：现象・需求）、“复现问题”（小字：固定版本・输入条件）、“判断职责”（小字：协议规则・产品约定）。上行第三个框向下箭头连接下行右侧框“修改 VIP”（小字：通用行为），下行从右到左依次连接“测试与回归”（小字：专项用例・相关配置）、“返回项目”（小字：固定新版本・消费方验证）。返回项目向上用细线回到项目反馈，标注“新的运行经验”。判断职责还用灰色分支向最右侧一个独立灰框“调整项目模型”（小字：产品专属行为），灰框不纳入通用VIP主线。底部仅一行普通小注“AI：定位与实现；工程师：规则、范围与预期审查”。这是方法示意，不是实际运行报告，不要成功打勾、不写自动发布、不写保证正确。文字严格按给定标签生成，箭头方向清楚，避免交叉。

生成记录：Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-b1c0ee41-5c51-4316-a957-ba965d3505e5.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

核对：主线从项目反馈到复现、职责判断、修改、测试、消费方验证，返回新经验；AI 与工程师职责清楚。原图一个标签漏字，一次定向修订未解决，改用少量大标签重生，最终图文字及关系通过。原图和未选修订不进入文章资产，详细记录在 figure-manifest.json。

## 第 04 章未选草图记录

最初采用回环对照构思，一次定向修订后仍有读回与存储箭头误导，因此未采用，改为数值清晰的字节合并示例。两张未选草图留在工具默认生成目录，不复制到发布资源。

原提示词：

Use case: infographic-diagram. 为中文技术博客绘制可直接嵌入正文的工程讲解图，横向约16:9，清晰简体中文，高对比、大字号、留白充足、无整页大标题、无页眉页脚、无Chapter编号、无品牌、无封面、无装饰芯片照片、无真实软件界面、无波形。深海军蓝表示结构，白或极浅底色，青色表示观察与验证路径，琥珀色表示待检查或反馈问题，中性灰表示边界。不是幻灯片截图。简洁局部标签比解释文字大。图为原理示意，不含性能或验证通过数字。 本图回答：为什么写后读回一致还需要独立预期？画左右两个清晰区域。左区局部标签“回环检查”，有“写入模型”到“存储”到“读回模型”最后到“比较结果”；写入模型和读回模型上方连接同一个琥珀色说明“可能共享同一种错误”，末尾琥珀色标签“读回一致 ≠ 已验证语义”。右区局部标签“独立检查”，顶部“协议规则 + 人工推导”向下生成青色“固定预期”，另一路“被测实现”向下产生“实际结果”，两者以两根独立箭头进入“比较”。底部三项小框“基础向量”“合法边界”“违规注入”，分别支撑比较或检查目标。右下小注“预期不调用被测算法”。不要宣称独立测试覆盖所有错误。左右不要画出写后读缺陷是APB真实已发生事故。概念图而非统计结果。

定向修订提示词：

修订这张工程概念图，保留左右对照、海军蓝/青色/浅底配色及主要标签，只做以下必要纠正：1 左上说明改为“共同错误可能被读写一致性掩盖”，避免原来的“只能说明”错误结论。2 左侧数据流明确绘成 写入模型→存储→读回模型→比较结果，写入数据另外用细线进入比较结果作为对比输入；绝不能画成读回模型写入存储。3 左下大黄色口号框移除，换成小灰字注“读回一致，还需独立预期核对”。4 两侧顶部‘回环检查’和‘独立检查’改成普通小分组标签，不要深色巨大标题横幅。5 右侧保持协议规则+人工推导→固定预期→比较，以及被测实现→实际结果→比较。其余内容不扩写。简体中文清楚，16:9技术插图，不要整页标题和页脚。

原图记录：

Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-35ea90dd-86a6-4afc-8c5e-101804324c39.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

修订草图记录：

Generated images are saved to C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520 as C:\Users\wangb\.codex\generated_images\01a0f7a4-e4da-72b3-af39-10e3676c7520\exec-d14458f5-9828-43b7-8dc9-5c1edd3a2a8c.png by default.
If you need to use a generated image at another path, copy it and leave the original in place unless the user explicitly asks you to delete it.
The generated image is already displayed to the user. There is no need to render it in the final response as a Markdown image or file link.

## 显示核对

已查看每张生成图原尺寸，并制作 640 像素宽 QA 预览核对主要标签、分组与主线。正文使用最终原图；较小补充说明可点开原图阅读，关键条件在正文中重复说明。未将 QA 预览纳入文章资源。
