# 中文稿截图与事实核对记录（内部）

日期：2026-09-29。SoC Studio 本地服务运行于 127.0.0.1:5173，后端 127.0.0.1:8011。截图来自运行中的真实网页，Edge 浏览器视口 1600×1000；未替换页面文字、状态或连线。截图文件 SHA256 在 sources.json 的 chinese_revision 中记录。

## 截图对应状态

| 文件 | 页面与工程 | 需要注意 |
| --- | --- | --- |
| 01-aurora-bus.png | aurora_rtl_candidate / BUS | 页面显示 14 instances、21 links；完整工程为 171 实例、710 连接。 |
| 02-address-map.png | 同一工作工程 / Address | corei_uart0 为 Base 0x40000000、Size 0x1000；页面标注共享译码与不支持不同 Master 重映射。 |
| 03-irq-view.png | 同一工作工程 / IRQ | 只截到局部信号，右侧属性仍为此前选中的 xbar_peri；不可说这张图展示 GPIO 的全部 32 位中断。 |
| 04a-output-scope.png | 同一工作工程 / Output Products | 页面直接标注“仅执行源码导出，不运行 EDA”。 |
| 04-output-products.png | 同一工作工程 / 已展开系统产品 | 当前磁盘输入匹配，565 个源码文件，部分文件入口；Run 为 b2aaab43b1d7423b9331856a4f267836。 |
| 05-aurora-demo.png | 新建 / 打开工程 | 受保护 Demo，171 模块、710 连接、23 锁定包；只展示入口，未创建副本。 |
| 06-history.png | aurora_rtl_candidate / Design Timeline | 页面显示 19 个已保存节点、0 待保存；打开的是旧保存检查点，无逐项操作或增量 Tcl。仅用于证明时间线界面和旧历史边界。 |
| 07-ip-repo.png | 同一工作工程 / IP Repository | 显示 ZIP/路径 Import、只读预检、受支持标准子集说明；未提交导入或执行脚本。 |
| 08-tcl-console.png | 同一工作工程 / Tcl Console | 编辑器内是默认示例脚本，未点击预览或应用；页面说明预览不写盘、不执行工具。 |
| 10-runs.png | 同一工作工程 / Runs & Regression | 可见项均为 generate · manual；保存后自动执行未勾选，不能视为回归 PASS。 |

工作工程中的运行产物不属于 Demo 冻结包，新建副本不继承产物。源工程当前台账 docs/planning/acceptance-ledger.md 与 demos/aurora/demo.json 已核对；前者记录 A01–A05 为 auto_verified / awaiting_user。565 文件是系统源码产品，不是 RTL 编译、仿真、综合或启动证明。

正文中的五张讲解图以用户提供的原图为基础，由 Codex imagegen 编辑，原文件保留在 assets/generated/；它们是概念图，不是运行截图。来源与核对事项见 notes/user-imagegen-zh.md 和 notes/ai-native-imagegen-zh.md。

英文 README.en.md 和英文配图未在本次任务中修改；中文稿更新后，两版不再事实同步，根索引已标记待同步。
