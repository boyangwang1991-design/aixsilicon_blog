// Deterministic teaching figures for chapter 02. Values are pinned to the
// official google/gemma-4-E4B-it tokenizer revision recorded in sources.json.
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../generated');
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const font = 'Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif';
const text = (x, y, value, size = 32, color = '#15314d', weight = 500, anchor = 'middle') =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="${font}">${esc(value)}</text>`;
const rect = (x, y, w, h, fill, stroke = '#ccd9e2', radius = 20) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const base = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="#f8faf9"/>${body}</svg>`;

const raw = [
  ['为什么', 38157], ['天空', 141370], ['是', 237026],
  ['蓝', 240123], ['色的', 40074], ['？', 237536],
];
let body = text(600, 77, '屏幕上的一句话，进入模型前怎样切开？', 43, '#102d4a', 700);
body += rect(115, 113, 970, 100, '#fff4df', '#edc67d');
body += text(600, 181, '为什么天空是蓝色的？', 50, '#102d4a', 700);
body += `<path d="M600 222 L600 272" stroke="#087d89" stroke-width="5"/><path d="M588 261 L600 278 L612 261" fill="none" stroke="#087d89" stroke-width="5"/>`;
body += text(600, 318, '官方 Tokenizer · 不加聊天模板', 29, '#436478', 500);
raw.forEach(([token, id], i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 76 + col * 356;
  const y = 350 + row * 155;
  body += rect(x, y, 336, 132, '#e7f6f5', '#5db9b5');
  body += text(x + 29, y + 34, String(i + 1).padStart(2, '0'), 23, '#2d8290', 700, 'start');
  body += text(x + 168, y + 75, token, 42, '#102d4a', 700);
  body += text(x + 168, y + 111, `ID ${id}`, 24, '#486675', 500);
});
body += text(600, 700, '6 个 token → 整数序列 [1, 6]', 31, '#102d4a', 700);
body += text(600, 747, '蓝 / 色的分开；天空保留在同一个 token 中', 26, '#486675');
await writeFile(resolve(out, 'token-split-zh.svg'), base(1200, 790, body), 'utf8');

const prefix = [
  ['<bos>', 2, 'boundary'], ['<|turn>', 105, 'boundary'],
  ['user', 2364, 'role'], ['↵', 107, 'role'],
];
const content = raw.map(([token, id]) => [token, id, 'content']);
const suffix = [
  ['<turn|>', 106, 'boundary'], ['↵', 107, 'role'],
  ['<|turn>', 105, 'boundary'], ['model', 4368, 'role'],
  ['↵', 107, 'role'],
];
const colors = {
  boundary: ['#e9e6f5', '#8576b3'],
  role: ['#e9eef4', '#9aabbc'],
  content: ['#e7f6f5', '#5db9b5'],
};
function group(y, label, start, items, cols) {
  let s = rect(52, y, 1096, cols === 2 ? 315 : 324, '#ffffff', '#d8e1e6');
  s += text(86, y + 48, label, 30, '#102d4a', 700, 'start');
  const width = cols === 2 ? 510 : 332;
  const gap = cols === 2 ? 20 : 16;
  items.forEach(([token, id, kind], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 86 + col * (width + gap);
    const cy = y + 73 + row * 114;
    s += rect(x, cy, width, 99, colors[kind][0], colors[kind][1], 14);
    s += text(x + 22, cy + 32, String(start + i).padStart(2, '0'), 22, '#486675', 700, 'start');
    s += text(x + width / 2, cy + 58, token, 31, '#102d4a', 700);
    s += text(x + width / 2, cy + 86, `ID ${id}`, 21, '#486675');
  });
  return s;
}
let t = text(600, 70, '聊天模板怎样把 6 个 token 变成 15 个位置？', 40, '#102d4a', 700);
t += text(600, 116, '固定 E4B 版本 · 单条 user 消息 · add_generation_prompt=True', 25, '#486675');
t += group(155, '开场、角色与换行：4 个位置', 0, prefix, 2);
t += group(500, '提问正文：6 个位置', 4, content, 3);
t += group(850, '结束用户轮次，打开模型轮次：5 个位置', 10, suffix, 3);
t += rect(52, 1212, 1096, 132, '#eaf2f6', '#c8d7e0');
t += text(600, 1261, '4 + 6 + 5 = 15 个 ID', 35, '#102d4a', 700);
t += text(600, 1306, '紫色为边界符；灰色为角色名或换行；↵ 表示换行 token', 25, '#486675');
t += text(600, 1396, '最后的 model + ↵ 是生成起点，后面尚没有回答正文', 27, '#102d4a', 600);
await writeFile(resolve(out, 'chat-template-zh.svg'), base(1200, 1435, t), 'utf8');
