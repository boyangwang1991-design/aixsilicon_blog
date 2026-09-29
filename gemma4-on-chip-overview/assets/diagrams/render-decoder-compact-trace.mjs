// Compact, top-down rendering of the saved torchview trace. Same 18 nodes and 20 edges.
// Usage: node render-decoder-compact-trace.mjs <workspace node_modules path>
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packageDir = process.argv[2];
if (!packageDir) throw new Error('Usage: node render-decoder-compact-trace.mjs <node_modules path>');
const { instance } = require(resolve(packageDir, '@viz-js/viz'));
const sharp = require(resolve(packageDir, 'sharp'));
const out = dirname(fileURLToPath(import.meta.url));
const source = await readFile(resolve(out, 'decoder_layer_0_depth_2.dot'), 'utf8');
const sourceNodes = [...source.matchAll(/^\s*(\d+) \[label=</gm)].map(m => Number(m[1]));
const edges = [...source.matchAll(/^\s*(\d+) -> (\d+)\s*$/gm)]
  .map(m => [Number(m[1]), Number(m[2])]);
if (sourceNodes.length !== 18 || edges.length !== 20 || sourceNodes.some((id, i) => id !== i)) {
  throw new Error(`Unexpected source trace: ${sourceNodes.length} nodes, ${edges.length} edges`);
}

const specs = [
  ['X0 · 输入', '[1,2,2560]', '#fff8dc'],
  ['本层 PLE', '[1,2,256]', '#fff8dc'],
  ['RMSNorm', '[1,2,2560]', '#dff1f1'],
  ['Gemma4TextAttention', '[1,2,2560]  +  权重 [1,8,2,2]', '#dff1f1'],
  ['RMSNorm', '[1,2,2560]', '#dff1f1'],
  ['add · X1', '[1,2,2560]', '#eaf2f8'],
  ['RMSNorm', '[1,2,2560]', '#eee7fa'],
  ['Gemma4TextMLP', '[1,2,2560]', '#eee7fa'],
  ['RMSNorm', '[1,2,2560]', '#eee7fa'],
  ['add · X2', '[1,2,2560]', '#eaf2f8'],
  ['Linear · 门控', '[1,2,2560] → [1,2,256]', '#fff0df'],
  ['GELUTanh', '[1,2,256]', '#fff0df'],
  ['mul · 门控 × PLE', '[1,2,256]', '#fff0df'],
  ['Linear · 回投影', '[1,2,256] → [1,2,2560]', '#fff0df'],
  ['RMSNorm', '[1,2,2560]', '#fff0df'],
  ['add', '[1,2,2560]', '#eaf2f8'],
  ['mul_ · layer_scalar', '[1,2,2560]', '#eaf2f8'],
  ['X3 · 输出', '[1,2,2560]', '#fff8dc'],
];
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const nodeDot = specs.map(([name, shape, color], id) =>
  `${id} [label=< <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="3"><TR><TD><B>${esc(name)}</B></TD><TD WIDTH="30"></TD><TD>${esc(shape)}</TD></TR></TABLE> > fillcolor="${color}"]`).join('\n  ');
const bypassEdges = new Set(['0-5', '5-9', '9-15']);
const edgeDot = edges.map(([from, to]) => {
  const key = `${from}-${to}`;
  return bypassEdges.has(key)
    ? `${from} -> ${to} [label="残差直通" fontname="Microsoft YaHei" fontsize=12 fontcolor="#6b8390" color="#91a8b3"]`
    : `${from} -> ${to}`;
}).join('\n  ');
const dot = `strict digraph decoder_layer_0_compact {
  graph [ordering=in rankdir=TB pad="0.25" nodesep="0.2" ranksep="0.26"]
  node [shape=box style="rounded,filled" fontname="Microsoft YaHei" fontsize=16 color="#b8cbd2" penwidth=1.4 margin="0.13,0.09"]
  edge [color="#557080" penwidth=1.7 arrowsize=0.8]
  ${nodeDot}
  subgraph cluster_attention {
    label="01 ATTENTION\\l从可见位置取信息\\l"
    labelloc=t labeljust=l fontname="Microsoft YaHei" fontsize=17 fontcolor="#176877"
    color="#7bb8c0" fillcolor="#f1fafb" style="rounded,filled" penwidth=1.8 margin=18
    2; 3; 4; 5
  }
  subgraph cluster_mlp {
    label="02 MLP\\l加工当前位置的特征\\l"
    labelloc=t labeljust=l fontname="Microsoft YaHei" fontsize=17 fontcolor="#604b8f"
    color="#ad9bcd" fillcolor="#f7f3fc" style="rounded,filled" penwidth=1.8 margin=18
    6; 7; 8; 9
  }
  subgraph cluster_ple {
    label="03 PLE\\l接入本层逐层输入\\l"
    labelloc=t labeljust=l fontname="Microsoft YaHei" fontsize=17 fontcolor="#a25f22"
    color="#d5aa7e" fillcolor="#fff9f1" style="rounded,filled" penwidth=1.8 margin=18
    1; 10; 11; 12; 13; 14; 15; 16
  }
  ${edgeDot}
}`;
await writeFile(resolve(out, 'decoder_layer_0_compact.dot'), dot, 'utf8');
const viz = await instance();
const svg = viz.renderString(dot, { format: 'svg', engine: 'dot' });
await writeFile(resolve(out, 'decoder_layer_0_compact.svg'), svg, 'utf8');
await sharp(Buffer.from(svg), { density: 160 }).png().toFile(resolve(out, 'decoder_layer_0_compact.png'));
