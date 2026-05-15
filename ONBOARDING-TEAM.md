# Onboarding — Plugins Flip (Claude Code)

Bienvenue. Cette page t'explique en **5 minutes** comment installer les plugins Flip dans ton Claude Code et les utiliser au quotidien.

---

## Ce que c'est

Une **marketplace privée de 16 plugins** "Head of" pour Claude Code. Chaque plugin = un expert IA spécialisé (sales, content, finance, etc.) prêt à enchaîner plusieurs skills en un seul `/<commande>`.

Exemple : tu tapes `/launch`, Claude orchestre stratégie produit → checklist → ads → emails de campagne. Tu ne fais plus de prompts à la main.

---

## Pré-requis

- Claude Code installé (CLI ou IDE)
- Tu sais ouvrir un terminal Claude Code dans un projet

Si tu n'as pas encore Claude Code : [https://claude.com/claude-code](https://claude.com/claude-code)

---

## Installation — 3 étapes (à faire UNE seule fois)

### Étape 1 — Ajouter la marketplace Flip

Dans Claude Code, tape :

```
/plugin marketplace add Romadulys/team-plugins
```

Tu devrais voir "Marketplace 'team-plugins' added".

### Étape 2 — Installer les 16 plugins

Tape les commandes ci-dessous (copie/colle, c'est rapide) :

```
/plugin install head-of-launch@team-plugins
/plugin install head-of-consulting@team-plugins
/plugin install head-of-finance@team-plugins
/plugin install head-of-sales@team-plugins
/plugin install head-of-content@team-plugins
/plugin install head-of-seo@team-plugins
/plugin install head-of-product@team-plugins
/plugin install head-of-people@team-plugins
/plugin install head-of-operations@team-plugins
/plugin install head-of-engineering@team-plugins
/plugin install head-of-design@team-plugins
/plugin install head-of-data@team-plugins
/plugin install head-of-growth@team-plugins
/plugin install head-of-customer-success@team-plugins
/plugin install head-of-pr@team-plugins
/plugin install head-of-academy@team-plugins
```

Tu peux n'installer que ceux qui te servent — la liste complète est plus bas.

### Étape 3 — IMPORTANT : Activer l'auto-update

C'est l'étape qui te permet d'avoir **toujours la dernière version** sans rien faire.

1. Tape `/plugin` dans Claude Code
2. Va dans **Marketplaces**
3. Sélectionne **team-plugins**
4. Active le toggle **"Enable auto-update"**

À partir de là, dès que la marketplace est mise à jour côté Flip, tu reçois les updates au prochain démarrage de Claude Code. Plus rien à faire.

**Si tu zappes cette étape** : tu resteras bloqué sur la version actuelle pour toujours. Tu devras lancer `/plugin marketplace update team-plugins` manuellement de temps en temps.

---

## Comment utiliser un plugin

Chaque plugin "Head of" ajoute des slash commands à Claude Code. Quelques exemples :

```
/launch          → Orchestre un lancement produit complet (Head of Launch)
/sales           → GTM B2B complet (Head of Sales)
/content         → Repurpose 1 contenu en 10+ formats (Head of Content)
/consulting      → Onboarding client PME complet (Head of Consulting)
/seo             → Plan SEO complet pour dominer une verticale (Head of SEO)
```

Tu tapes la commande, Claude te pose 2-3 questions de cadrage et fait le job.

Tu peux aussi lancer une skill individuelle d'un plugin :

```
/ads-copy        → Rédige des pubs Meta + Google
/email-campaign  → Séquence email haute perfo
/sales-script    → Script d'appel découverte B2B
```

Pour voir toute les commandes disponibles : tape `/help` dans Claude Code.

---

## La liste des 16 plugins

| Plugin | Pour quoi |
|---|---|
| **head-of-launch** | Lance un produit (stratégie, checklist, ads, email) |
| **head-of-consulting** | Onboarde un client PME (diag IA, JTBD, roadmap 90j, propo commerciale) |
| **head-of-finance** | Lève des fonds (memo, pitch deck, modèle financier, investor update) |
| **head-of-sales** | Construit un GTM B2B (concurrence, sales script, outbound, partenariats) |
| **head-of-content** | Machine de contenu multi-format (blog, LinkedIn, Reels, hooks) |
| **head-of-seo** | Domine une verticale SEO (audit, topic cluster, articles, schema.org) |
| **head-of-product** | Discovery + PRD + roadmap + OKRs |
| **head-of-people** | Recrutement, délégation, OKRs équipe, 1-1 |
| **head-of-operations** | Cartographie process, SOPs, weekly review, OKRs ops |
| **head-of-engineering** | Code review Next.js + Supabase + TypeScript strict + Claude API |
| **head-of-design** | Identité de marque + design d'interface (OKLCH, typo, layout) |
| **head-of-data** | Insights actionnables + dashboard SaaS metrics |
| **head-of-growth** | Audit AARRR + quick wins + A/B tests + ads + email |
| **head-of-customer-success** | Onboarding client, Health Score, lifecycle de rétention |
| **head-of-pr** | Relations presse low-budget + personal branding founder |
| **head-of-academy** | Construit une formation complète (pédagogie + landing + emails apprenants) |

---

## Si quelque chose ne marche pas

- `/plugin marketplace update team-plugins` → force le rafraîchissement
- `/plugin list` → vérifie ce qui est installé
- `/plugin disable <nom>` / `/plugin enable <nom>` → désactive temporairement un plugin
- Bug ou question → ping Romain directement

---

## En résumé

1. `/plugin marketplace add Romadulys/team-plugins`
2. `/plugin install <nom>@team-plugins` (pour chaque plugin voulu)
3. **Active l'auto-update** dans `/plugin` → Marketplaces (étape critique)

5 minutes, une seule fois. Après tu oublies, et tu as toujours la dernière version.
