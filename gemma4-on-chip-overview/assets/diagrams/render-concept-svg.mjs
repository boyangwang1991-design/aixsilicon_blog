// Render editable SVG teaching figures to PNG for Markdown platforms.
// Usage: node render-concept-svg.mjs <node_modules path> <svg basename> [...]
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = process.argv[2];
const names = process.argv.slice(3);
if (!packageDir || names.length === 0) {
  throw new Error('Usage: node render-concept-svg.mjs <node_modules path> <svg basename> [...]');
}
const require = createRequire(import.meta.url);
const sharp = require(resolve(packageDir, 'sharp'));
const dir = dirname(fileURLToPath(import.meta.url));
for (const name of names) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid SVG basename: ${name}`);
  const svg = await readFile(resolve(dir, `${name}.svg`));
  await sharp(svg, { density: 144 }).png().toFile(resolve(dir, `${name}.png`));
}
