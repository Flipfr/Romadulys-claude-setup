# Team Plugins — Claude Code Setup

Configuration partageable de Claude Code : **skills custom + 16 plugins head-of + hooks + templates**, packagés en marketplace installable en une commande.

Ne contient **PAS** : mémoire perso, transcripts, clés API, tokens OAuth. Ces données peuvent être sauvegardées séparément via `scripts/backup-personal.ps1`.

---

## Ce qui est versionné

| Dossier / Fichier | Contenu |
|---|---|
| `.claude-plugin/marketplace.json` | Marketplace **à la racine** (pour `claude plugin marketplace add github:<votre-org>/team-plugins-marketplace`) |
| `skills/` | Skills custom (orchestrator, plugin-syncer, head-of-*, etc.) |
| `team-plugins/` | Source des 16 plugins head-of-X (le marketplace racine y référence) |
| `web/` | Landing Next.js — catalogue visuel des 16 Heads of (déployée sur Vercel) |
| `.github/workflows/` | CI GitHub Actions (validation marketplace + build landing) |
| `hooks/` | `block-destructive.sh` — protection contre `rm -rf`, etc. |
| `templates/` | Modèles de `CLAUDE.md`, `settings.json`, `.mcp.json` |
| `scripts/` | Install + sync + backup + validation marketplace |

---

## Pour les membres de l'équipe (installer en 1 commande)

```bash
claude plugin marketplace add github:<votre-org>/team-plugins-marketplace
```

Puis installer les Heads of dont tu as besoin :

```bash
claude plugin install head-of-sales@team-plugins
claude plugin install head-of-academy@team-plugins
# etc.
```

Catalogue visuel : **https://romadulys-claude-setup.vercel.app**

---

## Setup nouveau PC (5 min)

**Prérequis** :
1. Windows 10/11, PowerShell 5+
2. [Claude Code CLI](https://claude.com/claude-code) installé (`claude --version` doit répondre)
3. Git pour Windows
4. Logged in Claude Code (`claude` → login navigateur)

**Étapes** :

```powershell
# 1. Cloner ce repo
cd $HOME
git clone https://github.com/<votre-org>/team-plugins-marketplace.git

# 2. Lancer l'install (copie skills + plugins + templates vers ~/.claude/)
cd team-plugins-marketplace
.\scripts\install.ps1

# 3. (Optionnel) Restaurer un backup personnel
.\scripts\backup-personal.ps1 -Restore -SourceZip "chemin\vers\claude-personal-backup.zip"

# 4. Verifier
claude
# Dans Claude : /plugin → tu dois voir tes 16 head-of activés
```

**Re-authentification MCP** : certains MCP servers (Notion, Slack, HubSpot, Figma) utilisent OAuth — il faudra refaire le flow d'auth pour chacun. Ils ne sont **pas** auto-restaurés (sécurité).

---

## Mettre à jour ton installation

Quand le repo évolue (nouvelles skills, plugins retirés, fixes), lance le script `update` au lieu d'un simple `git pull`. Il **synchronise** : ajoute le neuf, met à jour l'existant, et **supprime ce qui n'existe plus** côté repo.

```powershell
# Windows
.\scripts\update.ps1

# Aperçu sans rien modifier
.\scripts\update.ps1 -DryRun
```

```bash
# macOS / Linux
./scripts/update.sh

# Aperçu sans rien modifier
./scripts/update.sh --dry-run
```

**Comment ça marche** :
- Le script garde un manifest (`~/.claude/.team-plugins-manifest.json`) listant ce qu'il a installé.
- À chaque update, il compare l'état du repo avec le manifest et supprime UNIQUEMENT les skills/plugins qu'il avait posés et qui ont disparu. Tes skills perso (jamais dans le manifest) ne sont pas touchées.
- Il maintient aussi une liste de skills explicitement dépréciées qui sont supprimées même au premier run.

Après l'update : dans Claude Code, fais `/plugin` → **Reload marketplace** pour propager les changements.

---

## Workflow daily (PC habituel)

Tu travailles normalement dans `~/.claude/skills/` et `~/team-plugins/`. Pour sauvegarder dans le repo avant un commit :

```powershell
cd $HOME\team-plugins-marketplace
.\scripts\sync-from-local.ps1

# Verifier ce qui a change
git status
git diff

# Commit + push
git add .
git commit -m "feat(skills): update orchestrator + add new pricing skill"
git push
```

---

## Backup personnel (séparé)

La mémoire vivante (`projects/`, `sessions/`, `history.jsonl`) **n'est PAS** dans ce repo. Pour la backupper séparément :

```powershell
# Backup
.\scripts\backup-personal.ps1
# → genere <Desktop>\claude-personal-YYYY-MM-DD.zip

# Restore (nouveau PC)
.\scripts\backup-personal.ps1 -Restore -SourceZip "claude-personal-2026-05-12.zip"
```

Mets ce zip sur **OneDrive perso** ou **Google Drive** — jamais dans le repo Git.

---

## Partager avec un collaborateur

Le repo peut être public ou privé. Pour ajouter quelqu'un :

1. GitHub → repo → **Settings → Collaborators → Add people**
2. Entrer son username GitHub
3. Lui envoyer le lien du repo + ce README
4. Il fait `git clone` puis `install.ps1`

**À noter** : il aura les skills + plugins, mais devra :
- Avoir son propre compte Claude (login)
- Recréer ses propres clés API / tokens OAuth
- (Optionnel) Customiser le `CLAUDE.md` global avec son profil

---

## Structure du repo

```
team-plugins-marketplace/
├── .gitignore              ← bloque secrets, mémoire, transcripts
├── README.md               ← ce fichier
├── skills/                 ← skills custom (orchestrator, plugin-syncer, etc.)
├── team-plugins/           ← marketplace 16 head-of-X
│   ├── .claude-plugin/marketplace.json
│   └── plugins/
│       ├── head-of-academy/
│       ├── head-of-consulting/
│       └── ... (14 autres)
├── hooks/
│   └── block-destructive.sh
├── templates/
│   ├── CLAUDE.md.template
│   ├── settings.json.template
│   └── .mcp.json.template
└── scripts/
    ├── install.ps1          ← deploie repo → ~/.claude/ (premiere install)
    ├── update.ps1           ← maj : pull + sync + supprime ce qui a disparu
    ├── update.sh            ← idem pour macOS/Linux
    ├── sync-from-local.ps1  ← (mainteneur) pull ~/.claude/ → repo
    └── backup-personal.ps1  ← zip separe pour memoire/transcripts
```

---

## Règles d'or

1. **JAMAIS commit** : `.credentials.json`, `.env`, tokens OAuth, `projects/`, `sessions/`, `history.jsonl`
2. **Toujours `sync-from-local.ps1`** avant `git add` (sinon tu push une version périmée du repo)
3. **Backup perso** sur OneDrive/GDrive, jamais sur GitHub
4. **MCP OAuth** se refait à la main sur chaque PC (sécurité)
5. **Garde le username Windows identique** entre PCs sinon les paths absolus dans `settings.json` cassent

---

## Troubleshooting

**`install.ps1` ne trouve pas `~/.claude/`** → lance `claude` une fois pour qu'il crée le dossier.

**Marketplace `team-plugins` pas reconnu** → vérifier que `$HOME\team-plugins\.claude-plugin\marketplace.json` existe. Sinon relancer `install.ps1` ou faire manuellement : `claude plugin marketplace add $HOME\team-plugins`.

**Skills non détectés** → vérifier que chaque skill a un `SKILL.md` avec frontmatter (`name`, `description`).

**Symlinks cassés (`gsap@`, `hyperframes@`, etc.)** → ces skills viennent de plugins tiers (hyperframes, claude-mem). Ils ne sont **pas** dans ce repo (exclus par `.gitignore`). Ils se recréent en installant les plugins sources via Claude.
