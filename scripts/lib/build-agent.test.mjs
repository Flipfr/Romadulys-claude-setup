import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAgentMarkdown, stripFrontmatter, cleanDescription, READONLY_TOOLS } from './build-agent.mjs';

const COMMAND = `---
description: "Construit un GTM."
---
# Head of Sales
Tu es le Head of Sales.`;

test('stripFrontmatter retire le bloc yaml de tête', () => {
  assert.equal(stripFrontmatter(COMMAND), '# Head of Sales\nTu es le Head of Sales.');
});

test('cleanDescription retire les tirets cadratins et le hint Slash', () => {
  assert.equal(
    cleanDescription('Head of Finance / CFO — prépare un pack levée. Slash: /fundraising'),
    'Head of Finance / CFO : prépare un pack levée.',
  );
  assert.doesNotMatch(cleanDescription('A — B – C'), /[—–]/);
});

test('frontmatter de l’agent = lecture seule (aucun outil de mutation)', () => {
  const md = buildAgentMarkdown({ name: 'head-of-sales', description: 'Head of Sales.', commandBody: COMMAND });
  const fm = md.split('---')[1];
  assert.match(fm, /name: head-of-sales/);
  assert.equal(fm.includes(`tools: ${READONLY_TOOLS}`), true);
  assert.doesNotMatch(fm, /Edit|Write|Bash|NotebookEdit/);
});

test('le corps porte le contrat + la persona, sans le frontmatter du command', () => {
  const md = buildAgentMarkdown({ name: 'head-of-sales', description: 'Head of Sales.', commandBody: COMMAND });
  assert.match(md, /lecture seule/);
  assert.match(md, /# Head of Sales/);
  assert.doesNotMatch(md, /Construit un GTM/);
});
