import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 可编辑的中文教学图源。运行：node functional-safety-series/assets/diagrams/build-chapters-11-15.mjs
// 所有图为 1600×900 的概念图；没有目标 IP 的阈值、覆盖率或实测数据。
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'generated');
mkdirSync(out, { recursive: true });

const C = {
  navy: '#17375e', teal: '#087f83', amber: '#bd7510', red: '#c73535', gray: '#6a7b8b',
  paleNavy: '#edf4f9', paleTeal: '#e5f7f4', paleAmber: '#fff3dd', paleRed: '#fff0ef', paleGray: '#f2f5f7',
};
const tones = {
  navy: [C.navy, C.paleNavy], teal: [C.teal, C.paleTeal], amber: [C.amber, C.paleAmber],
  red: [C.red, C.paleRed], gray: [C.gray, C.paleGray],
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const rect = (x, y, w, h, tone = 'navy', dashed = false) => {
  const [stroke, fill] = tones[tone];
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"${dashed ? ' stroke-dasharray="12 8"' : ''}/>`;
};
const text = (x, y, lines, size = 25, tone = 'navy', anchor = 'start', weight = 400, spacing = 35) => {
  const items = Array.isArray(lines) ? lines : [lines];
  return `<text x="${x}" y="${y}" fill="${tones[tone][0]}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${items.map((line, i) => `<tspan x="${x}" dy="${i ? spacing : 0}">${esc(line)}</tspan>`).join('')}</text>`;
};
const card = (x, y, w, h, title, lines = [], tone = 'navy', opt = {}) => {
  const size = opt.size ?? 30;
  const bodySize = opt.bodySize ?? 23;
  return rect(x, y, w, h, tone, !!opt.dashed) + text(x + 22, y + 46, title, size, tone, 'start', 700) +
    (lines.length ? text(x + 22, y + 88, lines, bodySize, 'navy', 'start', 400, opt.spacing ?? 34) : '');
};
const arrow = (points, tone = 'navy', dashed = false, width = 5) =>
  `<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${tones[tone][0]}" stroke-width="${width}" stroke-linejoin="round"${dashed ? ' stroke-dasharray="12 8"' : ''} marker-end="url(#arrow-${tone})"/>`;
const line = (x1, y1, x2, y2, tone = 'gray', dashed = false, width = 3) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tones[tone][0]}" stroke-width="${width}"${dashed ? ' stroke-dasharray="10 8"' : ''}/>`;
const pill = (x, y, w, label, tone = 'gray') =>
  rect(x, y, w, 54, tone) + text(x + w / 2, y + 36, label, 23, tone, 'middle', 700);
const svg = (body, desc) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${esc(desc)}">
<defs>${Object.keys(tones).map(k => `<marker id="arrow-${k}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M1 1 L11 6 L1 11 Z" fill="${tones[k][0]}"/></marker>`).join('')}</defs>
<rect width="1600" height="900" fill="#fcfdfd"/>
<g font-family="Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif">${body}</g></svg>`;
const save = (name, body, desc) => writeFileSync(join(out, name), svg(body, desc), 'utf8');

// 11-1：模式产生、扫描捕获、签名比较与状态控制。
{
  let s = '';
  s += text(70, 70, '受测结构', 28, 'navy', 'start', 700);
  s += card(60, 115, 235, 188, 'PRPG / LFSR', ['生成测试模式', '模式数受配置约束']);
  s += card(355, 115, 245, 188, '扫描链', ['移入模式 · 捕获', '测试域须明确定义']);
  s += card(660, 115, 245, 188, '被测逻辑', ['响应进入扫描链', '未扫描路径不计入']);
  s += card(965, 115, 245, 188, 'MISR', ['压缩多次响应', '存在签名混叠边界']);
  s += card(1270, 115, 265, 188, '签名比较', ['实测 vs 期望', '版本/域/模式须匹配'], 'teal');
  for (let x of [295, 600, 905, 1210]) s += arrow([[x, 210], [x + 50, 210]], 'navy');
  s += line(60, 360, 1540, 360, 'gray');
  s += text(70, 410, '控制与判定', 28, 'navy', 'start', 700);
  s += card(65, 450, 415, 230, 'LBIST 控制器', ['选择域 / 扫描模式 / 时钟', '启动、完成、超时分开记录', '测试自身也需要故障分析'], 'gray');
  s += card(550, 450, 420, 230, '完成 ≠ 通过', ['完成后再比较期望签名', '签名不符或超时：锁存失败', '结果须与本次配置对应'], 'amber');
  s += card(1040, 450, 490, 230, '交给系统的结果', ['PASS：仍需退出测试与恢复', 'FAIL / TIMEOUT：禁止直接放行', '事件送错误管理器'], 'teal');
  s += arrow([[480, 565], [540, 565]], 'gray'); s += arrow([[970, 565], [1030, 565]], 'amber');
  s += pill(235, 745, 470, '目标：选定扫描域的结构故障', 'navy');
  s += pill(895, 745, 470, '边界：故障覆盖要靠模式与故障仿真', 'gray');
  save('chapter-11-lbist-architecture.svg', s, 'LBIST 的 PRPG 扫描链 被测逻辑 MISR 签名比较和控制结果');
}

// 11-2：放行门槛与失败分支。
{
  let s = text(70, 78, '启动/受控测试窗口', 29, 'navy', 'start', 700);
  const steps = [
    ['复位与隔离', '输出保持受控'], ['选择测试域', '时钟/电源就绪'], ['运行 LBIST', '进入扫描模式'],
    ['判定结果', '完成且签名匹配'], ['退出并恢复', '上下文/存储重建'], ['放行功能', '状态重新核对'],
  ];
  steps.forEach((v, i) => {
    const x = 55 + i * 258;
    s += card(x, 135, 225, 168, v[0], [v[1]], i === 5 ? 'teal' : 'navy', { size: 28, bodySize: 22 });
    if (i < 5) s += arrow([[x + 225, 215], [x + 250, 215]], 'navy', false, 4);
  });
  s += line(55, 365, 1545, 365, 'gray');
  s += text(70, 420, '失败与中断路径', 29, 'amber', 'start', 700);
  s += card(80, 455, 420, 168, '未运行 / 超时', ['不能当作测试通过', '检查启动与时钟路径'], 'amber');
  s += card(590, 455, 420, 168, '签名不符', ['锁存失败与目标域', '不进入正常功能'], 'red');
  s += card(1100, 455, 420, 168, '恢复失败', ['退出扫描模式未完成', '上下文或存储不可信'], 'amber');
  s += arrow([[280, 623], [280, 702], [750, 702]], 'amber');
  s += arrow([[800, 623], [800, 691]], 'red');
  s += arrow([[1310, 623], [1310, 702], [850, 702]], 'amber');
  s += card(565, 702, 470, 132, '禁止放行 / 受控响应', ['按系统要求报告并保持安全输出'], 'teal', { bodySize: 21 });
  save('chapter-11-lbist-sequence.svg', s, 'LBIST 从启动到放行的六个状态和三类失败分支');
}

// 12-1：观察点位置与可见范围。
{
  let s = text(70, 72, '同一笔读事务的观察边界', 29, 'navy', 'start', 700);
  s += card(60, 135, 230, 170, 'Master', ['原意：读地址 A', '记录请求 ID']);
  s += card(360, 135, 230, 170, '监控点 A', ['源端请求/响应', '看不到内部位置'], 'teal');
  s += card(660, 135, 230, 170, 'Interconnect', ['地址/路由/返回', '可能发生 A→B']);
  s += card(960, 135, 230, 170, '监控点 B', ['目标端实际到达', '未必知道源端原意'], 'teal');
  s += card(1260, 135, 280, 170, 'Slave', ['实际收到地址 B', '可能合法返回 B 数据']);
  for (let x of [290, 590, 890, 1190]) s += arrow([[x, 218], [x + 60, 218]], 'navy');
  s += card(75, 395, 430, 205, '协议检查', ['握手、响应、顺序是否合法', '合法事务仍可能送错地址'], 'navy');
  s += card(585, 395, 430, 205, '内容检查', ['保护码生成→检查之间', '每跳重算会掩盖上游损坏'], 'teal');
  s += card(1095, 395, 430, 205, '身份与进度', ['源端 A 对照目标端 B', '无响应需定义超时起点'], 'amber');
  s += pill(90, 695, 430, '故障点①：监控 A 之前改地址', 'amber');
  s += pill(585, 695, 430, '故障点②：互连内 A→B', 'amber');
  s += pill(1080, 695, 430, '故障点③：返回数据位翻转', 'amber');
  s += text(80, 825, '监控点只证明它看得到的接口行为；身份关联与 parity/timeout 均需按设计增设。', 24, 'gray');
  save('chapter-12-observation-points.svg', s, 'AXI Master 互连 Slave 两侧监控点及地址数据故障位置');
}

// 12-2：五类故障矩阵。
{
  let s = text(70, 76, '故障现象', 27, 'navy', 'start', 700) + text(575, 76, '必要观察', 27, 'navy', 'start', 700) + text(1070, 76, '候选检查与边界', 27, 'navy', 'start', 700);
  const rows = [
    ['握手/顺序违规', '所监控接口的通道行为', '协议 checker；只对可见接口有效'],
    ['A 被送成 B', '源端意图 A + 目标端到达 B', '事务身份/地址关联；协议可仍合法'],
    ['返回数据翻转', '保护码生成点到检查点', 'parity/CRC；不覆盖生成前错误'],
    ['请求无响应', '接受时刻 + 合法等待上限', 'timeout；要避免正常背压误报'],
    ['无请求却发生写入', '目标访问 + 源端请求日志', '目标侧关联；只看 master 会漏'],
  ];
  rows.forEach((r, i) => {
    const y = 115 + i * 140;
    s += rect(55, y, 1490, 120, i % 2 ? 'gray' : 'navy');
    s += text(75, y + 53, r[0], 27, i === 4 ? 'amber' : 'navy', 'start', 700);
    s += text(575, y + 53, r[1], 25);
    s += text(1070, y + 53, r[2], 23, i === 4 ? 'amber' : 'teal');
  });
  s += text(70, 855, '观察点、事务关联和允许等待时间须来自目标互连与安全要求；表中机制并非 AXI 默认配置。', 23, 'gray');
  save('chapter-12-fault-matrix.svg', s, 'AXI 五种故障现象 对应观察点及候选检查机制');
}

// 13-1：真正的两个端和边界外反例。
{
  let s = text(65, 68, '保护范围：生产者生成 → 最终消费者检查', 28, 'navy', 'start', 700);
  s += card(60, 140, 310, 205, '生产者', ['生成 payload / counter', 'Data ID 参与逻辑绑定', '按约定字段计算 CRC'], 'teal');
  s += card(450, 140, 265, 205, 'DMA / 队列', ['帧复制、缓存', '可发生重复/丢失'], 'navy');
  s += card(795, 140, 265, 205, '互连 / 存储', ['地址或内容可受扰动', '不应悄悄重算 CRC'], 'navy');
  s += card(1140, 140, 390, 205, '最终消费者', ['检查 CRC / Data ID / counter', '另看接收超时', '通过后才采纳或拒绝'], 'teal');
  for (const x of [370, 715, 1060]) s += arrow([[x, 237], [x + 70, 237]], 'navy');
  s += line(65, 410, 1535, 410, 'gray');
  s += text(75, 465, '接收端四项判断', 28, 'navy', 'start', 700);
  const checks = [
    ['CRC', '内容损坏'], ['Data ID', '错类型 / 误路由'], ['counter', '重复 / 跳号 / 乱序'], ['超时', '无新帧 / 迟到'],
  ];
  checks.forEach((v, i) => s += card(65 + i * 385, 510, 350, 130, v[0], [v[1]], i === 3 ? 'amber' : 'teal', { size: 29 }));
  s += card(75, 710, 660, 126, '边界外①：生成 CRC 前数值已错', ['后续保护字段可能忠实保护错误数值'], 'gray', { bodySize: 21 });
  s += card(850, 710, 660, 126, '边界外②：检查通过后再次被改', ['使用点已不在图示 E2E 检查范围内'], 'gray', { bodySize: 21 });
  save('chapter-13-e2e-path.svg', s, 'E2E 从生产者到消费者的保护边界 四项检查及两类边界外故障');
}

// 13-2：错误到检查项的映射，强调条件。
{
  let s = text(70, 75, '故障注入', 27, 'navy', 'start', 700) + text(555, 75, '优先观察', 27, 'navy', 'start', 700) + text(1005, 75, '接收端应决定', 27, 'navy', 'start', 700);
  const rows = [
    ['payload 位翻转', 'CRC / 内容检查', '拒绝损坏帧'],
    ['别的通道完整帧', '本通道 Data ID 绑定', '拒绝误路由帧'],
    ['同一帧重复', 'counter 与接收状态', '拒绝重复或按策略处理'],
    ['跳号 / 乱序', 'counter 允许窗口', '拒绝或标记丢帧'],
    ['迟到 / 完全丢失', '接收超时计时', '旧值何时必须失效'],
    ['生成前错 / 检查后改', '图示 E2E 边界外', '另设源端/使用端检查'],
  ];
  rows.forEach((r, i) => {
    const y = 112 + i * 119;
    s += rect(55, y, 1490, 102, i === 5 ? 'gray' : (i % 2 ? 'gray' : 'navy'));
    s += text(75, y + 59, r[0], 25, i === 5 ? 'amber' : 'navy', 'start', 700);
    s += text(555, y + 59, r[1], 25, i === 5 ? 'gray' : 'teal');
    s += text(1005, y + 59, r[2], 24);
  });
  s += text(70, 858, '是否能检出取决于 Profile、字段布局、计数回绕、丢帧窗口及时间要求；普通 CRC 不用于身份认证。', 22, 'gray');
  save('chapter-13-e2e-faults.svg', s, 'E2E 六类故障与内容身份顺序时间检查的对应及接收动作');
}

// 14-1：请求判定与无副作用。
{
  let s = text(70, 74, '检查点必须覆盖所有可能写入安全区的 master', 28, 'navy', 'start', 700);
  s += card(70, 135, 290, 160, 'CPU A', ['对参数区：允许写', '示例权限']);
  s += card(70, 345, 290, 160, 'DMA B', ['仅允许访问缓冲区', '向参数区写：非法'], 'amber');
  s += card(485, 190, 425, 280, '总线侧权限判定', ['输入：master ID', '输入：地址 / 读写属性', '输入：当前规则与模式', '目标写使能在判定后发出'], 'teal');
  s += arrow([[360, 215], [475, 278]], 'navy'); s += arrow([[360, 425], [475, 355]], 'amber');
  s += card(1065, 135, 455, 205, '允许路径 → 参数 SRAM', ['CPU A 合法写：数据和 ECC 更新', '返回正常完成响应'], 'teal');
  s += card(1065, 410, 455, 205, '拒绝路径 → 不触碰目标', ['DMA B 写：返回错误 + 上报', '目标数据和 ECC 位保持不变'], 'amber');
  s += arrow([[910, 275], [1055, 240]], 'teal'); s += arrow([[910, 390], [1055, 505]], 'amber');
  s += line(65, 682, 1535, 682, 'gray');
  s += pill(70, 740, 640, 'CPU 本地 MPU 未必看得到 DMA 请求', 'gray');
  s += pill(870, 740, 640, 'master ID 的生成与传递也要可信', 'gray');
  save('chapter-14-access-decision.svg', s, 'CPU 与 DMA 在总线侧权限判定后的允许和拒绝路径');
}

// 14-2：规则更新的两个方向及候选控制。
{
  let s = text(70, 74, '旧规则 → 切换窗口 → 新规则', 28, 'navy', 'start', 700);
  s += card(65, 145, 385, 165, '旧规则', ['CPU A 可写参数区', 'DMA B 不可写']);
  s += card(605, 145, 385, 165, '更新中的事务', ['在途请求如何判定？', '规则何时生效？'], 'amber');
  s += card(1145, 145, 385, 165, '新规则', ['权限按新配置执行', '须确认切换完成']);
  s += arrow([[450, 228], [595, 228]], 'navy'); s += arrow([[990, 228], [1135, 228]], 'navy');
  s += card(75, 405, 655, 175, '失效方向①：权限过宽', ['先开放新规则再撤旧规则', '短时间内两个 master 都可能可写'], 'red');
  s += card(870, 405, 655, 175, '失效方向②：全拒绝', ['先撤旧规则再装新规则', '合法安全任务可能超时'], 'amber');
  s += card(75, 665, 655, 145, '候选控制：原子切换', ['双缓冲规则；在途事务语义仍要定义'], 'teal', { bodySize: 22 });
  s += card(870, 665, 655, 145, '候选控制：更新期间阻断', ['暂停相关事务；核对可容忍时长'], 'teal', { bodySize: 22 });
  save('chapter-14-policy-update.svg', s, '访问控制策略切换中权限过宽或全拒绝的风险及候选控制');
}

// 15-1：数据和事件双路径。
{
  let s = card(65, 130, 290, 210, 'SRAM + ECC', ['不可纠正读错误', '本次事务标记无效', '短事件须被锁存'], 'amber');
  s += card(450, 105, 330, 170, '数据路径', ['响应门控 / valid 语义', '阻止坏数据正常提交'], 'red');
  s += card(450, 370, 330, 190, '错误源锁存', ['保存地址/类型/事务', '新事件与清除竞态须定义'], 'amber');
  s += arrow([[355, 205], [440, 190]], 'red'); s += arrow([[355, 265], [440, 445]], 'amber');
  s += card(870, 370, 300, 190, 'Error Manager', ['分类 / 掩码 / 升级', '严重事件可能硬件直达'], 'navy');
  s += card(1260, 370, 275, 190, 'IRQ / NMI', ['到达 CPU', '可被延迟或失效'], 'teal');
  s += arrow([[780, 465], [860, 465]], 'amber'); s += arrow([[1170, 465], [1250, 465]], 'navy');
  s += card(1020, 655, 515, 135, '软件读取 → 受控动作', ['先读详情再清除；动作完成还需观察'], 'teal', { bodySize: 22 });
  s += arrow([[1395, 560], [1395, 645]], 'teal');
  s += card(70, 655, 810, 135, '可选硬件直达动作', ['若 CPU 停摆或普通 IRQ 被屏蔽，必须验证此路径确实存在且仍工作'], 'gray', { bodySize: 22, dashed: true });
  s += arrow([[1020, 560], [1020, 615], [475, 615], [475, 645]], 'gray', true);
  save('chapter-15-error-path.svg', s, 'SRAM ECC 错误的数据有效性控制和事件锁存中断软件动作双路径');
}

// 15-2：正常与屏蔽情形的响应时间。
{
  let s = text(75, 75, '正常 IRQ 路径', 29, 'navy', 'start', 700);
  const xs = [170, 535, 900, 1265];
  ['t0 ECC 检出', 't1 事件锁存', 't2 进入处理', 't3 受控动作完成'].forEach((v, i) => {
    s += pill(xs[i] - 145, 135, 290, v, i === 3 ? 'teal' : 'navy');
    if (i < 3) s += arrow([[xs[i] + 148, 162], [xs[i + 1] - 155, 162]], 'navy', false, 4);
  });
  s += card(100, 260, 670, 135, '通知延迟：t2 − t0', ['仅说明 CPU 何时开始处理'], 'gray', { bodySize: 22 });
  s += card(830, 260, 670, 135, '端到端反应：t3 − t0', ['包含软件与实际硬件动作'], 'teal', { bodySize: 22 });
  s += line(65, 455, 1535, 455, 'gray');
  s += text(75, 515, '普通 IRQ 被屏蔽时', 29, 'amber', 'start', 700);
  s += card(65, 555, 380, 180, '事件仍在源端锁存', ['IRQ 不等于被 CPU 接收', '错误详情不得被清掉'], 'amber');
  s += card(590, 555, 380, 180, '条件成立时才可升级', ['未处理超时 / NMI / 专用线', '实际实现与共享依赖待核对'], 'gray', { dashed: true });
  s += card(1115, 555, 380, 180, '受控动作仍要完成', ['硬件隔离或可工作的处理器', '以输出状态为最终观察点'], 'teal');
  s += arrow([[445, 645], [580, 645]], 'amber', true); s += arrow([[970, 645], [1105, 645]], 'gray', true);
  s += text(75, 836, '若没有独立升级路径，应如实记录“响应依赖普通 IRQ 与 CPU 工作”的条件。', 23, 'gray');
  save('chapter-15-response-timing.svg', s, 'ECC 检出到受控动作完成的正常与 IRQ 被屏蔽时序');
}
