import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const article = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.dirname(article);
const read = p => fs.readFileSync(p);
const hash = p => crypto.createHash('sha256').update(read(p)).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const planning = json(path.join(root, 'notes/spec-to-rtl-ai-native-sources.json'));
const generation = json(path.join(article, 'notes/image-generation-records.json'));
const extraSources = [
  'reference/aixsilicon_ip_repo-main/aixsilicon_ip_repo-main/ips/security/firewall/memory_protection_controller/reports/regression/junit.xml',
  'ai-assisted-gpio-development/README.md'
];
const sourcePaths = [...new Set([...planning.files.map(x => x.source), ...extraSources])];
const sourceRecords = sourcePaths.map(source => ({ source, sha256: hash(path.join(root, source)) }));
const generatedAssets = generation.filter(x => x.selected).map(x => {
  const filename = 'assets/generated/' + x.key + '.png';
  const p = path.join(article, filename);
  const png = read(p);
  if (png.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Not PNG: ' + p);
  return {
    purpose: x.key.startsWith('cover-') ? 'conceptual editorial cover' : 'conceptual teaching illustration',
    language: x.language,
    path: filename,
    sha256: hash(p),
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    tool: 'Codex built-in imagegen',
    prompt_record: x.prompt_record,
    prompt_record_sha256: hash(path.join(article, x.prompt_record)),
    generation_output: x.output_file,
    revision: x.revision,
    visual_review: 'Text, relationships and arrows inspected; illustrative, not EDA evidence'
  };
});
if (generatedAssets.length !== 8) throw new Error('Expected eight final bilingual images');
const manifest = {
  written_on: '2026-09-27',
  kind: 'original bilingual article based on local engineering records',
  note: 'Internal provenance only. Source paths are relative to repository root; output paths are relative to this article. No reference files were modified. No EDA runs were performed for this article. Historical records do not certify current full-system qualification.',
  files: [],
  articles: [
    { filename: 'README.md', language: 'zh', status: '图文齐备；待发布审阅' },
    { filename: 'README.en.md', language: 'en', status: 'Complete text and illustrations; pending publication review' }
  ],
  editorial_sources: sourceRecords,
  supplementary_package_inventory: planning.package,
  claim_evidence: [
    { claim: 'Configuration write suppression omission and correction', evidence: ['review_findings.yaml / FIND.AXI_MPU.004', 'regs/axi_mpu.rdl', 'rtl/axi_mpu.sv', 'verification/tc/tc_config_lock.sv', 'reports/regression/junit.xml'], boundary: 'Shared write-enable implementation; no claim of independent region locking or fresh rerun.' },
    { claim: 'VIP symmetric address-mapping error and semantic testing', evidence: ['AXI4 reports/run_log.md / 2026-09-02 S08'], boundary: 'No aggregate coverage or general protocol qualification claim.' },
    { claim: 'Testing method recorded in Skills and templates', evidence: ['AXI4 reports/run_log.md / 2026-09-02 S08'], boundary: 'Same-round adoption, not an invented precise causal timeline.' },
    { claim: 'Usable configuration defaults without randomization', evidence: ['AXI4 reports/run_log.md / 2026-09-04 P1/P2 fixes'], boundary: 'Specific component fix, not a universal all-IP requirement.' },
    { claim: 'Markdown design source and derived canonical models', evidence: ['IP Development Suite / SKILL.md'], boundary: 'Current IP method; not every repository or historical project.' }
  ],
  generated_assets: generatedAssets,
  editable_figure_specification: { path: 'assets/figure-specs.json', sha256: hash(path.join(article, 'assets/figure-specs.json')) },
  deliverable_hashes: ['README.md', 'README.en.md'].map(filename => ({ filename, sha256: hash(path.join(article, filename)) }))
};
fs.writeFileSync(path.join(article, 'sources.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('Recorded ' + sourceRecords.length + ' sources and ' + generatedAssets.length + ' final images.');
