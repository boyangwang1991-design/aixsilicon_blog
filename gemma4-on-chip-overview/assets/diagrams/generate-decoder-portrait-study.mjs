// Phone-first editorial diagram, cross-checked with the torchview layer trace.
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require(resolve(process.argv[2], 'sharp'));
const out = dirname(fileURLToPath(import.meta.url));
const tx = (x, y, s, size, fill = '#19323F', weight = 500, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${s}</text>`;
const box = (x, y, w, h, fill, stroke = 'none', r = 18, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
const line = (d, color = '#5A7180', width = 2.5, marker = true) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" ${marker ? 'marker-end="url(#arrow)"' : ''}/>`;

let g = '';
const state = (y, label) => {
  g += box(296, y, 208, 60, '#EAF1F5', '#B9CCD4', 17);
  g += tx(330, y + 40, label, 31, '#183441', 800);
  g += tx(389, y + 39, '[B,S,2560]', 18, '#607987', 550);
};
const stage = ({ y, number, title, subtitle, color, pale, flow, from, plusY }) => {
  g += box(202, y, 418, title === 'PLE' ? 188 : 153, pale, color, 24, 'stroke-width="2" filter="url(#shadow)"');
  g += box(224, y + 18, 43, 32, '#FFFFFF', 'none', 10);
  g += tx(233, y + 42, number, 21, color, 800);
  g += tx(283, y + 43, title, 29, color, 800);
  g += tx(226, y + 77, subtitle, 21, '#445F6B', 500);
  if (title !== 'PLE') {
    g += box(223, y + 94, 376, 43, '#FFFFFF', 'none', 11);
    g += tx(239, y + 122, flow, 20, color, 650);
  } else {
    g += box(223, y + 95, 376, 73, '#FFFFFF', 'none', 11);
    g += tx(240, y + 124, 'Linear + GELU → × PLE', 21, color, 650);
    g += tx(240, y + 153, '→ Linear → RMSNorm', 21, color, 650);
    g += box(632, y + 94, 164, 70, '#FFF9F1', '#DFB181', 13);
    g += tx(652, y + 123, '逐层输入', 21, '#995A21', 700);
    g += tx(644, y + 149, '[B,S,256]', 20, '#995A21', 550);
    g += line(`M632 ${y + 128} H625`, '#B66B28', 2.5);
  }
  g += line(`M400 ${from + 60} V${y - 7}`);
  const bottom = y + (title === 'PLE' ? 188 : 153);
  g += line(`M400 ${bottom} V${plusY - 34}`);
  g += `<circle cx="400" cy="${plusY}" r="27" fill="#FFFFFF" stroke="#9AB0BA" stroke-width="2"/>`;
  g += tx(387, plusY + 11, '+', 32, '#1B3947', 500);
  g += line(`M296 ${from + 30} H126 V${plusY} H363`, '#99ADB8', 2.5);
  g += tx(139, plusY - 13, '残差', 19, '#6D8590', 550);
};

state(114, 'X₀');
stage({ y: 208, number: '01', title: 'ATTENTION', subtitle: '向可见位置取信息', color: '#168497', pale: '#E9F7F8', flow: 'RMSNorm → Attention → RMSNorm', from: 114, plusY: 405 });
g += line('M400 433 V445');
state(452, 'X₁');
stage({ y: 543, number: '02', title: 'MLP', subtitle: '加工当前位置的特征', color: '#7056AA', pale: '#F2EEFA', flow: 'RMSNorm → MLP → RMSNorm', from: 452, plusY: 740 });
g += line('M400 768 V780');
state(787, 'X₂');
stage({ y: 878, number: '03', title: 'PLE', subtitle: '加入本层的逐层输入', color: '#B66B28', pale: '#FFF3E5', from: 787, plusY: 1107 });
g += line('M400 1135 V1151');
g += box(290, 1158, 220, 51, '#EAF1F5', '#B9CCD4', 13);
g += tx(310, 1191, '× layer_scalar', 23, '#284859', 650);
g += line('M400 1211 V1227');
state(1234, 'X₃');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="820" height="1364" viewBox="0 0 820 1364">
<defs>
  <filter id="shadow" x="-8%" y="-15%" width="116%" height="135%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#204252" flood-opacity="0.08"/></filter>
  <marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="strokeWidth"><path d="M1 1 L8 4.5 L1 8 Z" fill="#5A7180"/></marker>
</defs>
<style>text{font-family:"Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif}</style>
<rect width="820" height="1364" fill="#F7F9F9"/>
${tx(46, 53, 'Decoder 一层怎样更新主状态？', 34, '#173441', 800)}
${tx(48, 86, 'Gemma 4 E4B · 三段更新，三次残差相加', 19, '#5D7682', 500)}
${g}
${tx(49, 1339, '各状态均为 [B,S,2560]；Attention 与 MLP 内部计算在后文展开。', 16, '#6F8490', 500)}
</svg>`;
await writeFile(resolve(out, 'decoder-portrait-study.svg'), svg, 'utf8');
await sharp(Buffer.from(svg)).png().toFile(resolve(out, 'decoder-portrait-study.png'));
