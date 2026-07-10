# C-suite délégable : Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer les 21 plugins `head-of-*` en sous-agents lecture seule dispatchables, générés automatiquement, et upgrader le skill `orchestrator` pour router vers eux avec un gate d'exécution.

**Architecture:** Un générateur Node (fonctions pures testées + un script de câblage) lit le `marketplace.json` et chaque plugin `head-of-X` (persona = `commands/*.md`, description = `plugin.json`), et écrit 21 fichiers d'agent read-only dans `C:/Users/rdura/.claude/agents/`. Le skill `orchestrator` gagne une section « comité de direction délégable » : registre de routage, dispatch parallèle, gate d'exécution (demande à Romain + anti-cannibalisation) déléguant aux mains `flip-*` existantes.

**Tech Stack:** Node.js ESM (`.mjs`), tests via `node:test` + `node:assert` (zéro dépendance), markdown pour agents et skill.

> **Note commits :** les steps incluent des commits (hygiène TDD) dans le repo `team-plugins`. Respecte la règle de Romain : ne committer/pousser que sur son go. Les agents générés vont dans `.claude/agents/` (hors git, artefact régénérable) : rien à committer là-bas.

---

## File Structure

**Créés (repo `team-plugins`, versionnés) :**
- `scripts/lib/build-agent.mjs` : fonctions pures `stripFrontmatter`, `buildAgentMarkdown` + constantes `READONLY_TOOLS`, `CONTRACT`. Cœur du système.
- `scripts/lib/build-agent.test.mjs` : tests du cœur.
- `scripts/lib/read-roster.mjs` : fonction pure `parseRoster` (filtre les head-of, dérive le domaine).
- `scripts/lib/read-roster.test.mjs` : tests du roster.
- `scripts/generate-head-of-agents.mjs` : câblage FS (lit marketplace + plugins, écrit les agents).
- `scripts/validate-agents.mjs` : garde-fou (vérifie que chaque agent généré est bien read-only et bien formé). Réutilisable en CI et après chaque régénération.

**Générés (hors git, `C:/Users/rdura/.claude/agents/`, artefacts) :**
- `head-of-<domaine>.md` × 21.

**Modifiés :**
- `C:/Users/rdura/.claude/skills/orchestrator/SKILL.md` : ajout d'une section de délégation.
- (miroir `team-plugins/skills/orchestrator/SKILL.md` : réconcilié ensuite via `plugin-syncer`.)

---

## Task 1 : Cœur — `buildAgentMarkdown` (fonction pure, TDD)

**Files:**
- Create: `scripts/lib/build-agent.mjs`
- Test: `scripts/lib/build-agent.test.mjs`

- [ ] **Step 1 : Écrire le test qui échoue**

```js
// scripts/lib/build-agent.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAgentMarkdown, stripFrontmatter, READONLY_TOOLS } from './build-agent.mjs';

const COMMAND = `---
description: "Construit un GTM."
---
# Head of Sales
Tu es le Head of Sales.`;

test('stripFrontmatter retire le bloc yaml de tête', () => {
  assert.equal(stripFrontmatter(COMMAND), '# Head of Sales\nTu es le Head of Sales.');
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
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `cd "C:/Users/rdura/team-plugins" && node --test scripts/lib/build-agent.test.mjs`
Expected: FAIL (`Cannot find module './build-agent.mjs'`).

- [ ] **Step 3 : Écrire l'implémentation minimale**

```js
// scripts/lib/build-agent.mjs
export const READONLY_TOOLS = 'Read, Grep, Glob, WebSearch, WebFetch, Skill';

export const CONTRACT = `Tu es un membre du comité de direction de Flip, en **lecture seule**.

Ton rôle : analyser et conseiller. Jamais exécuter.
- Tu peux lire les fichiers du repo, chercher sur le web, et invoquer tes skills.
- Tu ne modifies rien : tu n'as aucun outil d'édition, d'écriture ou de shell, c'est voulu.
- Tu rends un livrable structuré, actionnable, en français, sans tirets cadratins.
- Si l'exécution s'impose (écrire du code, modifier un projet), tu ne la fais pas :
  tu la recommandes explicitement en fin de livrable. L'orchestrateur demandera
  le feu vert de Romain avant de mobiliser une main (un agent flip-*).

Ta mission et ta méthode :`;

export function stripFrontmatter(md) {
  const m = md.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? md.slice(m[0].length).replace(/^\s+/, '') : md;
}

export function buildAgentMarkdown({ name, description, commandBody, model = 'opus' }) {
  const persona = stripFrontmatter(commandBody);
  const desc = `${description} À dispatcher pour un livrable conseil (lecture seule).`;
  return `---
name: ${name}
description: ${desc}
tools: ${READONLY_TOOLS}
model: ${model}
---

${CONTRACT}

${persona}
`;
}
```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `cd "C:/Users/rdura/team-plugins" && node --test scripts/lib/build-agent.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5 : Commit (sur go de Romain)**

```bash
cd "C:/Users/rdura/team-plugins"
git add scripts/lib/build-agent.mjs scripts/lib/build-agent.test.mjs
git commit -m "feat(csuite): buildAgentMarkdown (agent Head of lecture seule)"
```

---

## Task 2 : Roster — `parseRoster` (fonction pure, TDD)

**Files:**
- Create: `scripts/lib/read-roster.mjs`
- Test: `scripts/lib/read-roster.test.mjs`

- [ ] **Step 1 : Écrire le test qui échoue**

```js
// scripts/lib/read-roster.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoster } from './read-roster.mjs';

test('parseRoster ne garde que les head-of et dérive le domaine', () => {
  const roster = parseRoster({ plugins: [
    { name: 'head-of-sales', description: 'x', source: './team-plugins/plugins/head-of-sales' },
    { name: 'head-of-customer-success', description: 'y', source: './s' },
    { name: 'apprentissages', description: 'z', source: './a' },
  ]});
  assert.equal(roster.length, 2);
  assert.deepEqual(roster.map((r) => r.domain), ['sales', 'customer-success']);
  assert.equal(roster[0].name, 'head-of-sales');
});
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `cd "C:/Users/rdura/team-plugins" && node --test scripts/lib/read-roster.test.mjs`
Expected: FAIL (`Cannot find module './read-roster.mjs'`).

- [ ] **Step 3 : Écrire l'implémentation minimale**

```js
// scripts/lib/read-roster.mjs
export function parseRoster(marketplace) {
  const plugins = marketplace.plugins || [];
  return plugins
    .filter((p) => (p.name || '').startsWith('head-of-'))
    .map((p) => ({
      name: p.name,
      domain: p.name.replace(/^head-of-/, ''),
      description: p.description || '',
      source: p.source || '',
    }));
}
```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `cd "C:/Users/rdura/team-plugins" && node --test scripts/lib/read-roster.test.mjs`
Expected: PASS (1 test).

- [ ] **Step 5 : Commit (sur go de Romain)**

```bash
cd "C:/Users/rdura/team-plugins"
git add scripts/lib/read-roster.mjs scripts/lib/read-roster.test.mjs
git commit -m "feat(csuite): parseRoster (extraction des Head of depuis le marketplace)"
```

---

## Task 3 : Câblage — `generate-head-of-agents.mjs`

**Files:**
- Create: `scripts/generate-head-of-agents.mjs`

- [ ] **Step 1 : Écrire le script de génération**

```js
// scripts/generate-head-of-agents.mjs
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

function readDescription(sourceDir, fallback) {
  const pj = join(sourceDir, '.claude-plugin', 'plugin.json');
  if (existsSync(pj)) {
    try { return JSON.parse(readFileSync(pj, 'utf8')).description || fallback; }
    catch { return fallback; }
  }
  return fallback;
}

function main() {
  const marketplace = JSON.parse(readFileSync(MARKETPLACE, 'utf8'));
  const roster = parseRoster(marketplace);
  if (!existsSync(AGENTS_DIR)) mkdirSync(AGENTS_DIR, { recursive: true });
  let n = 0;
  for (const head of roster) {
    const sourceDir = resolve(REPO_ROOT, head.source);
    const commandBody = readCommandBody(sourceDir);
    const description = readDescription(sourceDir, head.description);
    const md = buildAgentMarkdown({ name: head.name, description, commandBody });
    writeFileSync(join(AGENTS_DIR, `${head.name}.md`), md, 'utf8');
    n += 1;
    console.log(`✓ ${head.name}.md`);
  }
  console.log(`\n${n} agents Head of generes dans ${AGENTS_DIR}`);
}

main();
```

- [ ] **Step 2 : Dry-run vers un dossier temporaire (ne pas polluer `.claude/agents/` encore)**

Run:
```bash
cd "C:/Users/rdura/team-plugins" && AGENTS_DIR="$(pwd)/.tmp-agents" node scripts/generate-head-of-agents.mjs
```
Expected: `21 agents Head of generes dans .../.tmp-agents`, 21 lignes `✓ head-of-*.md`.

- [ ] **Step 3 : Inspecter un agent généré**

Run: `cat "C:/Users/rdura/team-plugins/.tmp-agents/head-of-finance.md" | head -20`
Expected: frontmatter `name: head-of-finance`, `tools: Read, Grep, Glob, WebSearch, WebFetch, Skill`, puis le contrat, puis le corps repris de `commands/fundraising.md` (persona Head of Finance). Confirme que le mapping filename≠domaine est bien géré (le command s'appelle `fundraising.md`).

- [ ] **Step 4 : Nettoyer le dry-run**

Run: `rm -rf "C:/Users/rdura/team-plugins/.tmp-agents"`

- [ ] **Step 5 : Commit (sur go de Romain)**

```bash
cd "C:/Users/rdura/team-plugins"
git add scripts/generate-head-of-agents.mjs
git commit -m "feat(csuite): generateur d'agents Head of depuis le marketplace"
```

---

## Task 4 : Garde-fou — `validate-agents.mjs` + génération réelle

**Files:**
- Create: `scripts/validate-agents.mjs`

- [ ] **Step 1 : Écrire le validateur**

```js
// scripts/validate-agents.mjs
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
```

- [ ] **Step 2 : Générer les 21 agents pour de vrai**

Run: `cd "C:/Users/rdura/team-plugins" && node scripts/generate-head-of-agents.mjs`
Expected: `21 agents Head of generes dans C:/Users/rdura/.claude/agents`.

- [ ] **Step 3 : Valider les 21 agents générés**

Run: `cd "C:/Users/rdura/team-plugins" && node scripts/validate-agents.mjs`
Expected: `OK : 21 agents Head of valides (lecture seule, bien formes).`

- [ ] **Step 4 : Vérifier la présence dans le registre d'agents**

Run: `ls "C:/Users/rdura/.claude/agents/" | grep -c '^head-of'`
Expected: `21`.

- [ ] **Step 5 : Commit du validateur (sur go de Romain)**

```bash
cd "C:/Users/rdura/team-plugins"
git add scripts/validate-agents.mjs
git commit -m "feat(csuite): validateur read-only des agents Head of generes"
```

---

## Task 5 : Vérification de contrôle — dispatch réel de `head-of-sales`

Vérifie en conditions réelles qu'un Head of se comporte en conseil pur (aucune écriture) et rend un livrable exploitable. À faire dans une session Claude Code (pas un script).

- [ ] **Step 1 : Dispatcher head-of-sales sur une demande advisory**

Via l'outil Agent, `subagent_type: "head-of-sales"`, prompt court, ex :
> « Flip vend des systèmes IA sur-mesure aux PME (build one-shot + abo). ICP : PME 10-50 salariés. Donne-moi une reco GTM outbound + 3 angles de différenciation. Conseil uniquement. »

- [ ] **Step 2 : Vérifier le comportement**

Expected :
- L'agent retourne une reco structurée (analyse + angles), en français.
- Aucune tentative d'écriture/modification (il n'a pas les outils).
- Si l'agent suggère une exécution, il la formule comme reco, pas comme action.

- [ ] **Step 3 : Ajuster le contrat si besoin**

Si le ton ou le format ne convient pas, ajuster `CONTRACT` dans `scripts/lib/build-agent.mjs`, relancer Task 4 Step 2-3 (régénérer + valider), re-dispatcher. Commit de l'ajustement sur go de Romain.

---

## Task 6 : Upgrade du skill `orchestrator`

**Files:**
- Modify: `C:/Users/rdura/.claude/skills/orchestrator/SKILL.md` (insérer avant la section « ## 📚 Mise à jour — Veille du 24 avril 2026 »)

- [ ] **Step 1 : Insérer la section de délégation**

Insérer ce bloc :

```markdown
## 🏛️ Comité de direction délégable (Head of en sous-agents)

En plus de router vers des skills, tu peux **déléguer à un Head of**. Chaque domaine a un sous-agent `head-of-*` (lecture seule) que tu dispatches via l'outil Agent. Il réfléchit dans son propre contexte et rend une reco, sans polluer la conversation.

### Quand déléguer plutôt qu'activer un skill
- La demande est **cadrée** et mérite un livrable fouillé (analyse concurrence, stratégie de lancement, revue légale).
- Tu veux mobiliser **plusieurs domaines en parallèle** (ex : lancement produit -> Launch + Growth + Content + Design d'un coup).
- Tu veux **préserver ton contexte** pour la synthèse.
Pour une demande courte et directe (un hook LinkedIn), reste en skill, ne délègue pas.

### Registre domaine -> agent
| Domaine / déclencheurs | Agent |
|---|---|
| vente, GTM, outbound, closing | `head-of-sales` |
| growth, acquisition, funnel | `head-of-growth` |
| contenu, éditorial, social | `head-of-content` |
| SEO, référencement | `head-of-seo` |
| produit, roadmap, specs | `head-of-product` |
| design, UI, brand visuel | `head-of-design` |
| dev, archi, code | `head-of-engineering` |
| legal, RGPD, CGV, contrats | `head-of-legal` |
| finance, levée, prévisionnel | `head-of-finance` |
| controlling, tréso, fiscalité | `head-of-controlling` |
| ops, process, OKR | `head-of-operations` |
| RH, recrutement, GPEC | `head-of-people` |
| lancement, go-live | `head-of-launch` |
| data, metrics, analytics | `head-of-data` |
| customer success, rétention | `head-of-customer-success` |
| diagnostic PME, propal Flip | `head-of-consulting` |
| formation, academy, pédagogie | `head-of-academy` |
| RP, presse, communication | `head-of-pr` |
| risque, assurance, continuité | `head-of-risk` |
| achats, supply, logistique | `head-of-supply` |
| RSE, carbone, CSRD | `head-of-sustainability` |

(Registre régénérable depuis `team-plugins/.claude-plugin/marketplace.json`.)

### Méthode de délégation
1. **Mappe** la demande vers 1..n agents du registre.
2. **Dispatche en parallèle** (un seul message, plusieurs appels Agent) quand les Head of sont indépendants. Chaque agent est en lecture seule : aucun risque.
3. **Synthétise** en une réponse unique, hiérarchisée. Attribue les recos (« côté Sales / côté Legal »).

### Gate d'exécution (règle inviolable)
Les Head of **conseillent**, ils n'exécutent pas. Si un livrable réclame d'écrire ou de modifier un projet réel :
1. **Arrête-toi et demande à Romain** (AskUserQuestion) : « Head of X recommande Y. Je lance une main (`flip-builder`) pour l'exécuter ? »
2. **Vérifie l'anti-cannibalisation** AVANT de lancer : jamais deux mains sur les mêmes fichiers en parallèle. Chevauchement de périmètre -> worktree isolé par main, ou séquencement.
3. Seulement après feu vert : dispatche la main adéquate (`flip-builder`, `flip-sweeper`) en worktree isolé.
Ne délègue jamais l'exécution à un `head-of-*` (il n'en a pas les outils), ni en silence.

### Escalade (Phase 2, à venir)
Pour les très gros chantiers (« audit complet par tout le comex »), une salve Workflow fan-out tous les Head of pertinents. Non disponible tant que la Phase 2 n'est pas construite : d'ici là, dispatche en parallèle à la main (max ~4-5 à la fois).
```

- [ ] **Step 2 : Vérifier la cohérence du skill**

Run: `grep -c "head-of-" "C:/Users/rdura/.claude/skills/orchestrator/SKILL.md"`
Expected: >= 21 (le registre est présent).

- [ ] **Step 3 : Propager vers le miroir + plugins (pipeline existant)**

Lancer le skill `plugin-syncer` (ou copier manuellement vers `team-plugins/skills/orchestrator/SKILL.md`) pour réconcilier la source et le plugin. Ne PAS committer sans go de Romain.

- [ ] **Step 4 : Commit (sur go de Romain)**

```bash
cd "C:/Users/rdura/team-plugins"
git add skills/orchestrator/SKILL.md
git commit -m "feat(csuite): orchestrator route vers les Head of + gate d'execution"
```

---

## Task 7 : Vérification bout en bout

À faire dans une session Claude Code. Valide les 3 chemins du système.

- [ ] **Step 1 : Mono-Head of**

Demande : « J'ai besoin d'une revue RGPD de ma page de vente. » Attendu : l'orchestrateur dispatche `head-of-legal` seul, rend une reco, ne modifie rien.

- [ ] **Step 2 : Multi-Head of en parallèle**

Demande : « Prépare le lancement de mon nouveau produit. » Attendu : dispatch parallèle `head-of-launch` + `head-of-growth` + `head-of-content` (+ `head-of-design`) dans un seul message, puis synthèse attribuée par domaine.

- [ ] **Step 3 : Déclenchement du gate d'exécution**

Demande : « Et code-moi la landing page tant qu'à faire. » Attendu : l'orchestrateur s'arrête, pose la question (AskUserQuestion) avant de mobiliser `flip-builder`, mentionne le worktree isolé, ne lance rien sans le feu vert.

- [ ] **Step 4 : Bilan**

Confirmer : lecture seule respectée partout, gate d'exécution déclenché au bon moment, aucune cannibalisation. Si un écart : ajuster le skill orchestrator (Task 6) ou le contrat (Task 1) et régénérer.

---

## Definition of Done (Phase 1)

- [ ] `node --test scripts/lib/*.test.mjs` : tous verts.
- [ ] 21 agents `head-of-*.md` présents dans `.claude/agents/`, `validate-agents.mjs` OK.
- [ ] `head-of-sales` dispatché en réel : conseil pur, zéro écriture.
- [ ] Skill `orchestrator` route vers les Head of + gate d'exécution documenté.
- [ ] Les 3 chemins (mono / multi-parallèle / gate) vérifiés bout en bout.
- [ ] Workflow salve-comex : NON fait (Phase 2, hors périmètre).
