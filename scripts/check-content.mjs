import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
function markdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (['reference', '.git', 'node_modules'].includes(e.name)) return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? markdown(p) : /\.md$/i.test(e.name) ? [p] : [];
  });
}
let checked = 0;
for (const file of markdown(root)) {
  // Fenced code is illustrative, not navigation.
  const content = fs.readFileSync(file, 'utf8').replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const m of content.matchAll(/!?\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
    if (/^(?:[a-z]+:|#)/i.test(m[1])) continue;
    const target = path.resolve(path.dirname(file), decodeURI(m[1].split('#')[0]));
    const rel = path.relative(root, target);
    checked++;
    if (rel.startsWith('..') || path.isAbsolute(rel) || /^reference(?:[\\/]|$)/i.test(rel)) {
      errors.push(`${path.relative(root, file)}: link leaves published content: ${m[1]}`);
    } else if (!fs.existsSync(target)) errors.push(`${path.relative(root, file)}: missing ${m[1]}`);
  }
}
const index = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const excluded = new Set(['reference', '.git', 'node_modules', 'scripts']);
const blogs = fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory() && !excluded.has(e.name)
  && fs.existsSync(path.join(root, e.name, 'README.md'))).map(e => e.name);
for (const blog of blogs) {
  if (!index.includes(`](${blog}/README.md)`)) errors.push(`Article absent from index: ${blog}/README.md`);
  const englishPath = path.join(root, blog, 'README.en.md');
  if (fs.existsSync(englishPath)) {
    if (!index.includes(`](${blog}/README.en.md)`)) errors.push(`English edition absent from index: ${blog}`);
    for (const [name, other, language] of [['README.md', 'README.en.md', 'zh'], ['README.en.md', 'README.md', 'en']]) {
      const body = fs.readFileSync(path.join(root, blog, name), 'utf8');
      if (!body.includes(`](${other})`)) errors.push(`${blog}/${name}: missing language switch`);
      if (!body.includes(`](assets/generated/cover-${language}.png)`)) errors.push(`${blog}/${name}: missing language-specific cover`);
      if (/\]\([^)]*(?:github\.com\/boyangwang1991-design\/|reference\/|notes\/|sources\.json)/i.test(body)) {
        errors.push(`${blog}/${name}: public article links to private or editorial material`);
      }
    }
  }
  const manifestPath = path.join(root, blog, 'sources.json');
  // Original writing does not require an import manifest.
  if (!fs.existsSync(manifestPath)) continue;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const file of manifest.files) {
    const destination = path.resolve(root, blog, file.destination);
    const rel = path.relative(path.join(root, blog), destination);
    if (rel.startsWith('..') || path.isAbsolute(rel)) errors.push(`${blog}: provenance destination escapes article folder`);
    else if (!fs.existsSync(destination)) errors.push(`${blog}: missing imported file ${file.destination}`);
  }
}
for (const file of fs.readdirSync(root)) {
  if (/\.md$/i.test(file) && !['README.md', 'AGENTS.md'].includes(file)) errors.push(`Move article out of root: ${file}`);
}
const git = args => execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, ...args], { cwd: root, encoding: 'utf8' });
try {
  git(['check-ignore', '-q', 'reference/']);
  if (git(['ls-files', '--', 'reference']).trim()) errors.push('reference contains tracked files');
} catch { errors.push('Cannot confirm reference ignore/tracking status'); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${blogs.length} articles indexed; ${checked} local links checked; reference ignored and untracked. Remote availability and Markdown anchors are not checked.`);
