---
name: plugin-bundler
description: Génère un plugin Claude Code complet à partir de skills existantes — prend un nom de bundle + une liste de skills sources + un cas d'usage, et produit un dossier plugin auto-contenu (manifest package.json, slash command d'orchestration, README, skills copiées) prêt à installer ou distribuer en marque blanche. À utiliser quand l'utilisateur veut "packager" plusieurs skills en une offre cohérente, créer un plugin thématique (ex - "pack onboarding client", "pack lancement produit"), distribuer un set de skills à un client en marque blanche, ou simplement gagner du temps en activant 5 skills d'un coup via une slash command. À utiliser même quand l'utilisateur dit "fais-moi un plugin qui regroupe X et Y", "package ces skills", "bundle-moi ça pour un client".
---

# Plugin Bundler

## Rôle

Tu es l'architecte des plugins Claude Code custom de l'utilisateur. Ton job : prendre N skills déjà existantes et les transformer en **un plugin Claude Code installable et auto-contenu** — soit pour usage interne (gagner du temps via slash command), soit pour distribution marque blanche à un client.

## Inputs nécessaires

Avant de construire, demande systématiquement :

1. **Nom du bundle** (slug en kebab-case, ex: `onboarding-client`)
2. **Description courte** (1-2 phrases — sera dans le manifest et le README)
3. **Liste des skills sources** (par leurs noms exacts dans `~/.claude/skills/`)
4. **Cas d'usage prioritaire** :
   - `internal` → tu utilises le plugin toi-même, skills référencées (pas copiées)
   - `white-label` → distribution client, skills copiées dans le plugin (auto-contenu)
5. **Slash command** — nom de la commande qui orchestre les skills (ex: `/onboarding-client`)
6. **Ordre d'invocation** des skills dans la slash command (séquentiel ou conditionnel)

Si une de ces infos manque, demande-la avant de générer. Pas de placeholder bidon.

## Structure plugin Claude Code à générer

```
{bundle-name}/
├── package.json              # Manifest plugin (name, version, description)
├── README.md                 # Doc d'install + usage + skills incluses
├── commands/
│   └── {slash-command}.md    # Orchestrateur frontmatter + prompt
├── skills/                   # Skills bundled (copiées si white-label, sinon symlinks)
│   ├── skill-1/SKILL.md
│   ├── skill-2/SKILL.md
│   └── ...
└── agents/                   # Optionnel — agent custom pour orchestration parallèle
    └── orchestrator.md
```

## Process de génération (suivre dans l'ordre)

### Étape 1 — Vérifier que les skills sources existent

```bash
ls "~/.claude/skills/{skill-name}/SKILL.md"
```

Si une skill n'existe pas → stop, demande à l'utilisateur la bonne référence. Ne jamais inventer.

### Étape 2 — Créer la structure de dossiers

Emplacement par défaut : `~/Claude-Plugins/{bundle-name}/`

```bash
mkdir -p "~/Claude-Plugins/{bundle-name}/commands"
mkdir -p "~/Claude-Plugins/{bundle-name}/skills"
```

### Étape 3 — Copier ou référencer les skills

**Mode `white-label`** → copie complète :
```bash
cp -r "~/.claude/skills/{skill-name}/." "~/Claude-Plugins/{bundle-name}/skills/{skill-name}/"
```

**Mode `internal`** → laisser un `skills.refs.json` qui liste les skills référencées (pas copiées).

### Étape 4 — Écrire le `package.json`

```json
{
  "name": "{bundle-name}",
  "version": "0.1.0",
  "description": "{description}",
  "author": "your-name",
  "type": "module",
  "keywords": ["claude-code", "plugin", "{cas-d-usage}"],
  "skills": ["{skill-1}", "{skill-2}", "..."]
}
```

### Étape 5 — Écrire la slash command (`commands/{slash-command}.md`)

Format obligatoire (frontmatter + prompt) :

```markdown
---
description: "{Description courte de ce que fait la commande}"
---

# {Nom du bundle}

Tu vas orchestrer une séquence de {N} skills pour {cas d'usage}.

## Étape 1 : {Skill-1}
Invoque le skill `{skill-1}` via Skill tool. Récupère son output.

## Étape 2 : {Skill-2}
Invoque le skill `{skill-2}` en passant les éléments pertinents de l'étape 1 en contexte.

## Étape 3 : ...

## Synthèse finale
Produis un livrable consolidé qui agrège les outputs des skills dans un format cohérent.
```

### Étape 6 — Écrire le `README.md`

Sections obligatoires :
- **Installation** : `cd ~/.claude/plugins && ln -s {chemin-plugin} {bundle-name}` (ou via marketplace si publié)
- **Usage** : exemple de la slash command
- **Skills incluses** : liste avec une ligne par skill
- **Cas d'usage** : 2-3 scénarios concrets
- **Personnalisation** : comment éditer la slash command pour adapter l'ordre

### Étape 7 — Vérifier l'output

Liste les fichiers créés :
```bash
find "~/Claude-Plugins/{bundle-name}" -type f
```

Vérifier qu'on a bien : `package.json`, `README.md`, `commands/{slash}.md`, et N dossiers dans `skills/` (mode white-label).

### Étape 8 — Donner les instructions d'install à l'utilisateur

Format de réponse final :

```
Plugin {bundle-name} généré dans ~/Claude-Plugins/{bundle-name}/

Pour l'installer en local :
1. Copier le dossier dans ~/.claude/plugins/{bundle-name}/
2. Redémarrer Claude Code
3. Tester avec /{slash-command}

Pour le distribuer à un client :
- Mode white-label : zipper le dossier, le client le décompresse dans ~/.claude/plugins/
- Mode marketplace : publier sur GitHub + ajouter à un marketplace.json

Skills incluses : {liste}
```

## Règles strictes

1. **Ne jamais générer un plugin sans vérifier que toutes les skills sources existent**
2. **Ne jamais inventer un nom de skill** — toujours utiliser ceux listés dans `~/.claude/skills/`
3. **En mode white-label, toujours copier les fichiers** (pas de symlink — le client n'aura pas tes skills installées)
4. **La slash command DOIT mentionner explicitement chaque skill avec le format `Invoque le skill X via Skill tool`** — sinon Claude ne saura pas les charger
5. **Toujours créer un README** — c'est ce qui permet à un client de comprendre ce qu'il achète
6. **Versionner le plugin en 0.1.0 par défaut** — pas de 1.0.0 tant que pas testé en prod

## Cas d'usage business

Le plugin-bundler est un **levier commercial** pour une agence ou un cabinet conseil :

- **Pack "Lancement produit"** = product-launch-strategist + launch-checklist + ads-copy + email-campaign
- **Pack "Onboarding client SaaS"** = customer-success + customer-interview + email-campaign
- **Pack "Levée de fonds"** = pitch-deck + financial-model + fundraising-prep + investor-update
- **Pack "GTM B2B"** = sales-script + email-campaign + linkedin-content-creator + partnership-outreach

Chaque pack peut être vendu/distribué en marque blanche à un client (intégré à son Claude Code interne) ou utilisé comme accélérateur lors de missions de conseil.

## Anti-patterns à éviter

- ❌ Bundler des skills qui n'ont pas de logique d'enchaînement claire ("juste pour grouper")
- ❌ Plus de 6 skills dans un même bundle → trop lourd, casse la slash command
- ❌ Slash command qui ne fait que lister les skills sans orchestration (perte de valeur)
- ❌ Oublier le README → le plugin devient inutilisable pour quelqu'un d'autre
- ❌ Mode `internal` puis distribution → les skills manqueront chez le client

## Validation finale

Avant de rendre le plugin à l'utilisateur, vérifie :

- [ ] Le dossier existe et contient package.json, README.md, commands/, skills/
- [ ] La slash command référence explicitement chaque skill du bundle
- [ ] Toutes les skills sources sont copiées (mode white-label) ou référencées (mode internal)
- [ ] Le README contient les instructions d'install
- [ ] Aucun TODO laissé dans les fichiers générés

---

## 📚 Mise à jour — Veille du 3 mai 2026

**Item intégré** : Everything Claude Code (ECC) — référence cross-tool 163K stars

ECC (augmentcode.com) est devenu LA référence "shared config layer" pour les coding agents : 48 agents + 183 skills + rules + hooks + security scanning, packagés en un projet portable Claude Code/Cursor/Codex/OpenCode.

**Patterns à observer dans tes prochains bundles** :
- **Naming conventions strictes** (kebab-case, préfixes par domaine type `code-`, `ops-`, `growth-`)
- **Hooks de sécurité par défaut** (security-scanning sur outputs sensibles)
- **Layer "rules" séparé des skills** (règles transverses appliquées à toutes les skills du bundle, type "ne jamais commiter sans test", "toujours valider en Zod")
- **Cross-tool readiness** : skills neutres (pas de référence dure à un seul harness Claude Code)

**Idée méta-plugin à cadrer** : un bundle `head-of-platform` qui embarque `plugin-bundler` + `skill-feeder` + `plugin-syncer` — partage équipe d'un système skills clé en main. À cadrer en V0.3 du système nourriture continue.
