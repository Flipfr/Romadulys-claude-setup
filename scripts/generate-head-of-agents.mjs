import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRoster } from './lib/read-roster.mjs';
import { buildAgentMarkdown } from './lib/build-agent.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MARKETPLACE = join(REPO_ROOT, '.claude-plugin', 'marketplace.json');
const HOME = process.env.USERPROFILE || process.env.HOME;
const AGENTS_DIR = process.env.AGENTS_DIR || join(HOME, '.claude', 'agents');

function readCommandBody(sourceDir) {
  const cmdDir = join(sourceDir, 'commands');
  const files = readdirSync(cmdDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) throw new Error(`Aucun fichier command dans ${cmdDir}`);
  return readFileSync(join(cmdDir, files[0]), 'utf8');
}

function main() {
  const marketplace = JSON.parse(readFileSync(MARKETPLACE, 'utf8'));
  const roster = parseRoster(marketplace);
  if (!existsSync(AGENTS_DIR)) mkdirSync(AGENTS_DIR, { recursive: true });
  let n = 0;
  for (const head of roster) {
    const sourceDir = resolve(REPO_ROOT, head.source);
    const commandBody = readCommandBody(sourceDir);
    // Description depuis le marketplace (propre) ; les plugin.json sont en mojibake.
    const md = buildAgentMarkdown({ name: head.name, description: head.description, commandBody });
    writeFileSync(join(AGENTS_DIR, `${head.name}.md`), md, 'utf8');
    n += 1;
    console.log(`OK ${head.name}.md`);
  }
  console.log(`\n${n} agents Head of generes dans ${AGENTS_DIR}`);
}

main();
