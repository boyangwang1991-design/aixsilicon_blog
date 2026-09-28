// Optional PNG export of the editable SVGs. Pass a node_modules directory
// containing sharp, as with render-dot.mjs.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const modules = process.argv[2];
if (!modules) throw new Error('Usage: node render-tokenizer-figures.mjs <node_modules path>');
const sharp = require(resolve(modules, 'sharp'));
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../generated');
for (const name of ['token-split-zh', 'chat-template-zh']) {
  const svg = await readFile(resolve(out, `${name}.svg`));
  await sharp(svg, { density: 160 }).png().toFile(resolve(out, `${name}.png`));
}
