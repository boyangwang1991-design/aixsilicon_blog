// Phone-readable view of the saved torchview trace. Checks its module count
// and shapes before folding the twelve repeated Gemma4AudioLayer nodes.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packageDir = process.argv[2];
if (!packageDir) throw new Error('Usage: node render-audio-compact-trace.mjs <node_modules path>');
const { instance } = require(resolve(packageDir, '@viz-js/viz'));
const sharp = require(resolve(packageDir, 'sharp'));
const out = dirname(fileURLToPath(import.meta.url));
const source = await readFile(resolve(out, 'audio_path_16mel_e4b.dot'), 'utf8');
const expected = [
  ['Gemma4AudioSubSampleConvProjection', 1],
  ['Gemma4AudioRelPositionalEncoding', 1],
  ['Gemma4AudioLayer', 12],
  ['Gemma4RMSNorm', 1],
];
for (const [name, count] of expected) {
  const actual = (source.match(new RegExp(`${name}<BR`, 'g')) ?? []).length;
  if (actual !== count) throw new Error(`${name}: expected ${count}, saw ${actual}`);
}
for (const shape of ['(1, 16, 128)', '(1, 16)', '(1, 4, 1024)', '(1, 4, 1536)', '(1, 4, 2560)']) {
  if (!source.includes(shape)) throw new Error(`Missing traced shape ${shape}`);
}

const dot = String.raw`digraph audio_path_16mel_e4b_compact {
  graph [rankdir=TB, bgcolor="white", pad="0.35", nodesep="0.35", ranksep="0.45", splines=polyline,
         fontname="Microsoft YaHei", labelloc=t, label="E4B 音频模型路径 · torchview 追踪压缩图", fontsize=24];
  node [shape=box, style="rounded,filled", fontname="Microsoft YaHei", fontsize=16,
        color="#617796", penwidth=1.4, margin="0.22,0.16", width=3.6];
  edge [color="#496583", penwidth=1.6, arrowsize=0.8, fontname="Microsoft YaHei", fontsize=13];

  mel [label="Log-Mel 特征\n[1, 16, 128]", fillcolor="#e7f5f4", width=2.6];
  mask [label="有效帧 mask\n[1, 16]", fillcolor="#f2f3f5", width=2.6];
  {rank=same; mel; mask;}
  sub [label="卷积下采样 + 投影\n两次 stride-2\n[1, 4, 1024]", fillcolor="#d7eceb"];
  submask [label="下采样后的 mask\n[1, 4]", fillcolor="#f2f3f5", width=2.6];
  {rank=same; sub; submask;}
  pos [label="相对位置表示\n[1, 13, 1024]", fillcolor="#e9edfa"];
  layers [label="音频编码层 × 12\n[1, 4, 1024]", fillcolor="#dce6f9"];
  outproj [label="音频塔输出 Linear\n[1, 4, 1536]", fillcolor="#e3e9fa"];
  norm [label="RMSNorm\n[1, 4, 1536]", fillcolor="#eee8fb"];
  proj [label="语言宽度 Linear\n[1, 4, 2560]", fillcolor="#e7ddfa"];
  soft [label="投影后音频向量\n[1, 4, 2560]", fillcolor="#d7c7f5", penwidth=2];

  mel -> sub;
  mask -> sub;
  sub -> submask [color="#8896a8"];
  sub -> pos;
  sub -> layers;
  pos -> layers;
  submask -> layers [color="#8896a8"];
  layers -> outproj -> norm -> proj -> soft;
}`;

const viz = await instance();
const svg = viz.renderString(dot, { format: 'svg', engine: 'dot' });
await writeFile(resolve(out, 'audio_path_16mel_e4b_compact.dot'), dot, 'utf8');
await writeFile(resolve(out, 'audio_path_16mel_e4b_compact.svg'), svg, 'utf8');
await sharp(Buffer.from(svg), { density: 192 }).png().toFile(resolve(out, 'audio_path_16mel_e4b_compact.png'));
