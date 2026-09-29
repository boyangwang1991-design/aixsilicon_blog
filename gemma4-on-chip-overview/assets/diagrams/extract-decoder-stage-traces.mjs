// Extract three faithful node/edge views from the saved official torchview trace.
// Usage: node extract-decoder-stage-traces.mjs <workspace node_modules path>
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packageDir = process.argv[2];
if (!packageDir) throw new Error('Usage: node extract-decoder-stage-traces.mjs <node_modules path>');
const { instance } = require(resolve(packageDir, '@viz-js/viz'));
const sharp = require(resolve(packageDir, 'sharp'));
const out = dirname(fileURLToPath(import.meta.url));
const source = await readFile(resolve(out, 'decoder_layer_0_depth_2.dot'), 'utf8');
const nodes = new Map([...source.matchAll(/^\s*(\d+) \[label=<([\s\S]*?)fillcolor=([^\]]+)\]/gm)]
  .map(match => [Number(match[1]), `${match[1]} [label=<${match[2]}fillcolor=${match[3]}]`]));
const edges = [...source.matchAll(/^\s*(\d+) -> (\d+)\s*$/gm)]
  .map(match => [Number(match[1]), Number(match[2])]);
if (nodes.size !== 18 || edges.length !== 20) {
  throw new Error(`Unexpected source trace: ${nodes.size} nodes, ${edges.length} edges`);
}

const stages = [
  { name: 'decoder-attention-local', ids: [0, 2, 3, 4, 5], boundary: { 0: 'X0 input-tensor' } },
  { name: 'decoder-mlp-local', ids: [5, 6, 7, 8, 9], boundary: { 5: 'X1 / add' } },
  { name: 'decoder-ple-local', ids: [1, 9, 10, 11, 12, 13, 14, 15, 16, 17], boundary: { 1: 'PLE input-tensor', 9: 'X2 / add' } },
];
const viz = await instance();
for (const { name, ids, boundary } of stages) {
  const selected = new Set(ids);
  const displayNode = id => {
    let node = nodes.get(id);
    if (!node) throw new Error(`Missing node ${id}`);
    if (boundary[id]) {
      node = node.replace(/(input-tensor|add)<BR\/>depth:[02]/, boundary[id]);
    }
    return node.replaceAll('CELLPADDING="4"', 'CELLPADDING="9"')
      .replaceAll('<BR/>depth:0', '').replaceAll('<BR/>depth:2', '');
  };
  const dot = `strict digraph ${name.replaceAll('-', '_')} {
    graph [ordering=in rankdir=TB pad="0.28" nodesep="0.36" ranksep="0.5"]
    node [align=left fontname="Arial" fontsize=16 height=0.2 margin=0 shape=plaintext style=filled]
    edge [color="#476171" penwidth=1.8]
    ${ids.map(displayNode).join('\n    ')}
    ${edges.filter(([from, to]) => selected.has(from) && selected.has(to)).map(([from, to]) => `${from} -> ${to}`).join('\n    ')}
  }`;
  await writeFile(resolve(out, `${name}.dot`), dot, 'utf8');
  const svg = viz.renderString(dot, { format: 'svg', engine: 'dot' });
  await writeFile(resolve(out, `${name}.svg`), svg, 'utf8');
  await sharp(Buffer.from(svg), { density: 180 }).png().toFile(resolve(out, `${name}.png`));
}
