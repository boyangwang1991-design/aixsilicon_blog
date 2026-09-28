// Render torchview DOT without requiring a system Graphviz installation.
// Install @viz-js/viz and sharp separately; pass their node_modules as argument 1.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packageDir = process.argv[2];
if (!packageDir) throw new Error('Usage: node render-dot.mjs <node_modules path>');
const { instance } = require(resolve(packageDir, '@viz-js/viz'));
const sharp = require(resolve(packageDir, 'sharp'));
const viz = await instance();
const out = dirname(fileURLToPath(import.meta.url));
for (const name of ['mlp', 'local_qkv', 'decoder_layer_0_depth_2']) {
  const dot = (await readFile(resolve(out, `${name}.dot`), 'utf8'))
    .replace(/size="[^"]+"/, 'pad="0.45" nodesep="0.35"')
    .replaceAll('fontname="Linux libertine"', 'fontname="Arial"');
  const svg = viz.renderString(dot, { format: 'svg', engine: 'dot' });
  await writeFile(resolve(out, `${name}.svg`), svg, 'utf8');
  await sharp(Buffer.from(svg), { density: 192 })
    .png()
    .toFile(resolve(out, `${name}.png`));
}
