# Team Plugins — Ton équipe virtuelle dans Claude Code

Marketplace local de **16 personas "Head of"**, chacun bundlant 2-6 skills experts orchestrés par une slash command. Conçu pour les équipes et solo-founders qui veulent industrialiser leur usage de Claude Code.

## 🧑‍🤝‍🧑 L'équipe (16 Heads of)

| Persona | Slash command | Skills | Domaine |
|---|---|---|---|
| 🚀 Head of Launch | `/launch` | 4 | Lancement produit |
| 🤝 Head of Consulting | `/consulting` | 5 | Onboarding client PME |
| 💰 Head of Finance | `/fundraising` | 4 | Levée de fonds |
| 🎯 Head of Sales | `/sales` | 5 | GTM B2B |
| ✍️ Head of Content | `/content` | 5 | Machine de contenu |
| 🔍 Head of SEO | `/seo` | 6 | Domination SEO |
| 📦 Head of Product | `/product` | 5 | Discovery + PRD + roadmap |
| 👥 Head of People | `/people` | 4 | RH / délégation / 1-1 |
| ⚙️ Head of Operations | `/operations` | 4 | Process + SOPs + reviews |
| 💻 Head of Engineering | `/engineering` | 5 | Code review + Next.js + Supabase |
| 🎨 Head of Design | `/design` | 2 | Brand + UI impeccable |
| 📊 Head of Data | `/data` | 2 | Analytics + métriques SaaS |
| 📈 Head of Growth | `/growth` | 5 | AARRR + ads + email |
| 💚 Head of Customer Success | `/customer-success` | 3 | Onboarding + rétention |
| 📰 Head of PR | `/pr` | 3 | Presse + personal branding |
| 🎓 Head of Academy | `/academy` | 4 | Formation + EdTech |

**Total :** 16 plugins, ~70 skills bundlées (avec doublons cross-plugins comme `email-campaign` qui sert 5 personas).

---

## 🚀 Installation

### Prérequis

- [Claude Code](https://claude.ai/code) installé sur ton poste
- Clone ou copie locale de ce repo

### Étape 1 — Récupérer le marketplace

```bash
git clone https://github.com/<votre-org>/team-plugins.git ~/team-plugins
```

### Étape 2 — Ajouter le marketplace dans Claude Code

Dans Claude Code, lance la commande :
```
/plugin
```

Choisis **"Add marketplace"** et pointe vers le dossier :
```
~/team-plugins
```

(Sur Windows : `C:/Users/<toi>/team-plugins`)

Le marketplace `team-plugins` apparaîtra avec ses 16 plugins.

### Étape 3 — Installer les plugins dont tu as besoin

Active les plugins selon ton rôle :

- **Consultant / agence** → `/consulting`, `/fundraising`, `/sales`, `/operations`, `/people`
- **EdTech / formation** → `/academy`, `/customer-success`, `/seo`, `/content`, `/growth`
- **Dev tech** → `/engineering`, `/product`, `/design`
- **Marketing** → `/content`, `/growth`, `/seo`, `/pr`, `/launch`
- **Tout activer** → recommandé pour les founders multi-casquettes

### Étape 4 — Redémarre Claude Code

Les slash commands deviennent disponibles. Tape `/` dans le chat pour voir la liste.

---

## 📚 Comment utiliser un Head of

Chaque persona suit le même pattern :

1. **Tu lances la slash command** (ex: `/sales`)
2. **Le persona te demande un brief** (5-10 questions de cadrage)
3. **Il enchaîne ses skills** dans un ordre cohérent (orchestration)
4. **Il te livre un pack consolidé** — un seul document final qui agrège les outputs de chaque skill

Tu peux **valider/ajuster** entre chaque phase.

Si tu veux juste UNE compétence isolée (ex: juste rédiger une fiche de poste), invoque directement le skill correspondant sans passer par le Head of.

---

## 🔄 Mise à jour des plugins

```bash
cd ~/team-plugins
git pull
```

Puis dans Claude Code : `/plugin` → "Reload marketplace".

> ⚠️ **Note importante :** les skills bundlées dans les plugins sont des copies. Si tu enrichis tes skills personnelles dans `~/.claude/skills/`, elles ne se propagent PAS automatiquement aux plugins.

---

## 🛠️ Roadmap

- [x] V0.1 — 16 Heads of opérationnels (lancement)
- [ ] V0.2 — Mécanisme de sync skills sources → plugins (script + commande)
- [ ] V0.3 — Versioning par plugin avec changelog
- [ ] V0.4 — Hooks SessionStart pour propager les updates automatiquement
- [ ] V0.5 — Personas spécifiques verticaux

---

## 🤝 Contribuer

Tu identifies un manque ? Tu veux ajouter un Head of (ex: Head of Legal, Head of Hardware) ? Ouvre une issue.

Pour proposer un nouveau Head of, fournir :
- Nom du persona + slash command proposée
- Liste de 2-6 skills sources existantes à bundler
- Cas d'usage (1-2 phrases)
- Ordre d'orchestration souhaité

Le méta-skill `plugin-bundler` le génère en 5 minutes.

---

## 📁 Structure du repo

```
team-plugins/
├── .claude-plugin/
│   └── marketplace.json          # Manifest du marketplace
├── plugins/
│   ├── head-of-launch/
│   ├── head-of-consulting/
│   ├── ... (16 plugins)
│   └── head-of-academy/
└── README.md                     # Ce fichier
```

Chaque plugin contient :
```
head-of-X/
├── package.json                  # Manifest plugin
├── README.md                     # Doc du persona
├── commands/
│   └── X.md                      # Slash command orchestratrice
└── skills/
    └── ... (2-6 skills bundlées)
```

---

Built with [Claude Code](https://claude.ai/code).
