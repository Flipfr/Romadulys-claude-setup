import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const HOME = process.env.USERPROFILE || process.env.HOME;
const AGENTS_DIR = process.env.AGENTS_DIR || join(HOME, '.claude', 'agents');
const EXPECTED_TOOLS = 'Read, Grep, Glob, WebSearch, WebFetch, Skill';

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function main() {
  const files = readdirSync(AGENTS_DIR).filter((f) => f.startsWith('head-of-') && f.endsWith('.md'));
  const errors = [];
  for (const f of files) {
    const md = readFileSync(join(AGENTS_DIR, f), 'utf8');
    const fm = frontmatter(md);
    const toolsLine = (fm.match(/^tools:.*$/m) || [''])[0].trim();
    const name = f.replace(/\.md$/, '');
    if (!fm.includes(`name: ${name}`)) errors.push(`${f}: name incoherent`);
    if (toolsLine !== `tools: ${EXPECTED_TOOLS}`) errors.push(`${f}: tools non lecture-seule`);
    if (/\b(Edit|Write|Bash|NotebookEdit)\b/.test(toolsLine)) errors.push(`${f}: outil de mutation present`);
    if (md.replace(/^---[\s\S]*?---/, '').trim().length < 100) errors.push(`${f}: corps trop court`);
  }
  if (errors.length) {
    console.error('Validation echouee :');
    errors.forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  console.log(`OK : ${files.length} agents Head of valides (lecture seule, bien formes).`);
}

main();
