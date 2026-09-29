// Simplify an existing torchview DOT trace without rerunning the model.
// Every hidden-tensor node must have exactly one incoming and outgoing edge.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw new Error('Usage: node strip-hidden-tensors.mjs <diagram.dot>');
const source = await readFile(target, 'utf8');
const nodePattern = /^\t(\d+) \[label=<[\s\S]*?^\s*<\/TABLE>> fillcolor=[^\]]+\]\r?\n/gm;
const blocks = [...source.matchAll(nodePattern)];
const hidden = new Set(blocks.filter((match) => match[0].includes('hidden-tensor')).map((match) => match[1]));
if (hidden.size === 0) throw new Error('No hidden-tensor nodes found');
const edges = [...source.matchAll(/^\t(\d+) -> (\d+)\r?\n/gm)].map((match) => [match[1], match[2]]);
let kept = edges.filter(([from, to]) => !hidden.has(from) && !hidden.has(to));
for (const id of hidden) {
  const incoming = edges.filter(([, to]) => to === id).map(([from]) => from);
  const outgoing = edges.filter(([from]) => from === id).map(([, to]) => to);
  if (incoming.length !== 1 || outgoing.length !== 1 || hidden.has(incoming[0]) || hidden.has(outgoing[0])) {
    throw new Error(`Unexpected edge pattern around hidden node ${id}`);
  }
  kept.push([incoming[0], outgoing[0]]);
}
const withoutEdges = source.replace(/^\t\d+ -> \d+\r?\n/gm, '');
let withoutHidden = withoutEdges;
for (const block of blocks.filter((match) => hidden.has(match[1]))) withoutHidden = withoutHidden.replace(block[0], '');
const edgeText = [...new Set(kept.map(([from, to]) => `\t${from} -> ${to}`))].join('\n');
const simplified = withoutHidden.replace(/}\s*$/, `${edgeText}\n}\n`);
await writeFile(target, simplified, 'utf8');
process.stdout.write(`Removed ${hidden.size} hidden-tensor nodes; kept ${kept.length} edges.\n`);
