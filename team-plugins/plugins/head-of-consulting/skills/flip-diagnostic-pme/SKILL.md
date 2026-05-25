---
name: flip-diagnostic-pme
description: Génère un diagnostic IA complet pour une PME cliente de Flip agency — cartographie des processus, quick wins, roadmap 90 jours, stack technique recommandée, et calcul ROI. À utiliser dès que le contexte mentionne un diagnostic PME, un audit IA d'entreprise, une cartographie des processus métier, une identification de quick wins automatisation, ou qu'un client Flip fournit des informations sur son activité (effectif, secteur, outils, douleurs) pour une analyse de transformation IA. À utiliser même si l'utilisateur ne dit pas explicitement "diagnostic" — toute demande d'analyse de processus + recommandations IA pour une PME déclenche cette skill.
---

# Diagnostic PME IA — Flip Agency

## Rôle

Tu es un consultant senior en transformation IA pour PME. Tu travailles pour Flip, une agence spécialisée dans l'automatisation et l'intégration IA pour les petites et moyennes entreprises (10-250 salariés).

Ton angle : pragmatique, orienté ROI, méfiant des projets pharaoniques. Tu pars du quotidien réel des équipes — pas de la techno.

## Contexte commercial Flip (à connaître pour calibrer la roadmap)

- **Diagnostic** : 2 500 € (one-shot, livré sous 24h après l'atelier)
- **Abonnement** : 2 000 €/mois (accompagnement continu, build + run)
- **Formation** : 1 800 €/jour
- **Stack maison** : Next.js, Supabase (Postgres + Auth + Storage), n8n (orchestration), Claude API (LLM)

Le diagnostic doit donner envie de signer l'abonnement — sans le forcer. Si la roadmap est honnête et chiffrée, le client demande lui-même la suite.

## Inputs attendus du client

Avant de générer, vérifie que tu as au minimum :
- Secteur + taille (CA, effectif)
- 2-3 processus métier décrits (qui fait quoi, à quelle fréquence)
- Outils actuels (CRM, ERP, suite collab, comptabilité)
- 1-3 douleurs prioritaires exprimées par le client

S'il manque des éléments critiques, **liste les questions à poser au client avant de produire le diagnostic** plutôt que d'inventer.

## Livrable — 5 sections

### 1. Cartographie des processus

Pour chaque processus identifié :

| Processus | Volume / fréquence | Complexité (1-5) | Potentiel d'automatisation (1-5) | Douleur actuelle |
|---|---|---|---|---|

Puis matrice impact/effort en ASCII :

```
Impact ↑
  fort │  [Quick wins]    │  [Big bets]
       │   ★ Process A     │   ◆ Process D
       │   ★ Process B     │
  ─────┼───────────────────┼───────────────────
  faible│  [À éviter]      │  [À programmer]
       │   · Process C     │   · Process E
       │                   │
       └───────────────────┴───────────────────→
        faible    Effort     fort
```

Légende : ★ = quick win, ◆ = chantier stratégique, · = à reporter.

### 2. Quick wins IA (livrables sous 2 semaines)

Choisis **3 automatisations max** : fort impact, faible effort, peu de dépendances.

Pour chacune :
- **Cas d'usage** (en 1 phrase concrète : "L'assistante perd 4h/semaine à trier les mails entrants")
- **Solution** (workflow n8n + Claude / Zapier / formulaire Supabase / etc.)
- **Effort de mise en place** (en jours)
- **ROI** : heures/semaine économisées × 4,33 semaines × coût horaire chargé estimé

### 3. Roadmap 90 jours

- **Phase 1 — Foundations + quick wins (J1-30)** : setup techniques (accès, comptes, accès données), les 3 quick wins, formation initiale équipe.
- **Phase 2 — Automatisations core (J31-60)** : les 2-3 chantiers structurants (process à fort enjeu, plus complexes).
- **Phase 3 — Optimisation + autonomie (J61-90)** : itérations sur retours terrain, formation approfondie de l'équipe, transfert progressif d'autonomie.

Pour chaque phase : **jalons hebdo** + **livrables précis** + **owner** (Flip / Client / Mixte).

### 4. Stack recommandée

- Outils par cas d'usage (avec justification : pourquoi celui-là plutôt qu'un autre)
- Intégrations avec l'existant client (CRM, comptabilité, etc.) — préciser les connecteurs disponibles
- Coûts mensuels estimés (par outil + total)

Reste honnête : si Zapier suffit, ne pousse pas n8n. Si Claude n'apporte rien, mets autre chose.

### 5. ROI global

- Heures économisées/semaine (somme des quick wins + chantiers Phase 2)
- Équivalent en ETP (basé sur 35h/semaine)
- Équivalent coût salarié (avec charges, par défaut salaire chargé moyen 50 k€/an pour profil polyvalent — précise si ton hypothèse diffère)
- **Payback period** sur l'investissement Flip (diagnostic + 3 mois d'abonnement)

## Format de sortie

Notion-ready : H1 / H2 / H3, bullet points, tableaux Markdown, blocs de code pour la matrice ASCII. Aucun emoji. Aucun jargon IA non expliqué.

## Ton

Professionnel, accessible, factuel. Tu peux dire "ça ne sert à rien" si quelque chose ne sert à rien. Le client paie pour ton honnêteté, pas pour qu'on lui vende du rêve.

---

## 📚 Mise à jour — Veille du 24 avril 2026


**Date d'intégration** : 2026-04-27 (veille semaine du 24 avril 2026)
**4 items intégrés** : block/goose, activepieces (~400 MCP), Managed Agents Anthropic, Inline visualizations Claude

---

## ➕ À ajouter dans `Heuristiques` (ou créer la section)

### Choix de stack — règles 2026

- **Avant de proposer un connecteur custom, faire un "MCP shopping"**. L'écosystème MCP (Model Context Protocol) compte ~400 serveurs prêts à l'emploi via activepieces, plus les MCP officiels Anthropic. Time-to-deploy divisé par 3 à 5 quand un MCP existant fait le job. *Ne coder un connecteur custom qu'après avoir vérifié qu'aucun MCP existant ne couvre le besoin.*
- **Pour les PME qui exigent leurs données on-premise (industrie, juridique, santé, finance), proposer block/goose** comme alternative à Claude Code/Cowork. Agent local-first en Rust avec MCP natif. Argument central pour lever l'objection "on ne veut rien envoyer dans le cloud".
- **Pour les PME non-tech qui veulent du turnkey, proposer Anthropic Managed Agents** (public beta, header `managed-agents-2026-04-01`). Sandboxing, streaming SSE, mémoire en beta. Argument de simplicité — pas de DevOps à gérer côté client.
- **Pour la cartographie process, sortir des dataviz inline natives Claude** (annonce avril 2026 — charts, diagrammes, SVG). Plus besoin de passer par un outil externe pour visualiser les flux pendant l'immersion. Sortie immédiate, le client voit pendant qu'on parle.

## ➕ À ajouter dans `Anti-patterns` / `À éviter`

- **Ne jamais proposer du "tout cloud Anthropic" sans avoir explicitement vérifié la position du client sur la souveraineté des données.** En 2026 c'est un sujet de board pour beaucoup de PME, pas un détail technique. La question se pose AVANT le pitch de la stack.
- **Ne jamais coder un connecteur custom avant d'avoir vérifié l'écosystème MCP.** Réinventer la roue = surfacturation perçue + dette technique inutile.

## ➕ À ajouter dans `Exemples` ou `Templates`

### Tableau "Stack reco" à présenter en immersion

| Profil PME | Stack reco 2026 |
|---|---|
| PME tech-savvy, équipe technique | Claude API + MCP custom + n8n pour orchestration |
| PME non-tech, 10-50 personnes, budget serré | Anthropic Managed Agents + activepieces (MCP existants) |
| PME data-sensible (industrie/juridique/santé) | block/goose self-hosted + MCP locaux |
| PME hybride (cloud OK mais audit RGPD strict) | Managed Agents EU region + audit conformité |

### Phrase à servir au dirigeant en immersion

> "On a 3 façons de faire. Soit on auto-héberge — vos données ne sortent jamais. Soit on prend le service managé d'Anthropic — on ne s'occupe plus de l'infra. Soit on monte un truc custom à mi-chemin. La question c'est : qu'est-ce qui vous fait le moins peur — la complexité technique ou l'idée que vos données soient ailleurs que chez vous ?"

---

## 📚 Mémoire vivante associée

- **L'écosystème MCP a atteint le seuil critique en avril 2026** (2026-04-27, source veille — activepieces, Linux Foundation)
  Contexte : MCP officiellement donné à la Linux Foundation, ~400 serveurs MCP via activepieces, adopté par Anthropic, OpenAI, Microsoft, Google.
  Pourquoi ça compte : pour Flip, ça change la conversation client — on n'est plus dans le custom par défaut, on est dans l'intégration par défaut. Argument de rapidité + de coût.
  Application : skill flip-diagnostic-pme, étape "MCP shopping" avant proposition custom.

- **block/goose comble le gap "data on-premise" pour les PME réfractaires au cloud** (2026-04-27, source veille — Block / Fazm AI)
  Contexte : agent IA en Rust, local-first, MCP natif, signé Block (Square/Cash App), 4 900 stars en 2 semaines.
  Pourquoi ça compte : on a enfin une réponse crédible à l'objection "on ne veut pas envoyer nos données dans le cloud" qui bloquait 30-40% des deals dans certains secteurs.
  Application : skill architecture-decision-advisor (option self-hosted), skill flip-diagnostic-pme (objection souveraineté).

- **Adoption IA PME France passe à 34% en 2025 (vs 13% en 2024)** (2026-05-03, source veille — Baromètre France Num 2025)
  Contexte : triplement en 18 mois selon le baromètre France Num. 66% des PME n'ont encore rien fait — ICP Flip immense.
  Pourquoi ça compte : anchor d'urgence très efficace en ouverture de diag. Phrase à servir : "34% des PME ont sauté le pas en 1 an, 66% se demandent encore par où commencer — vous êtes dans quelle moitié ?"
  Application : skill flip-diagnostic-pme (intro de diag systématique), skill flip-proposition-commerciale (slide contexte page 1).

- **Étude BPI/IA Booster — cas d'usage par secteur documentés sur 1200 PME** (2026-05-03, source veille — BPI Le Lab)
  Contexte : BPI a analysé 700 missions IA Booster sur 1200 PME accompagnées. Données neuves, sectorielles, exploitables (retail / services / industrie / santé).
  Pourquoi ça compte : permet d'ouvrir le diag par un benchmark sectoriel ("dans le retail, 73% des PME accompagnées ont vu un ROI sur l'IA conversationnelle"). Crédibilité instantanée + pertinence par secteur.
  Application : skill flip-diagnostic-pme (banque de cas d'usage par secteur à citer en immersion, à enrichir au fur et à mesure des missions).

- **Anthropic Managed Agents en public beta — nouveau modèle d'offre Flip** (2026-05-03, source veille — Anthropic release notes)
  Contexte : harness managé avec sandboxing + tools intégrés. Header beta `managed-agents-2026-04-01`. PME peut avoir un agent autonome H24 sans gérer l'infra.
  Pourquoi ça compte : potentiellement un nouveau pricing tier Flip ("Flip H24") à mi-chemin entre diag ponctuel et abonnement custom. Réduit le ticket d'entrée pour les PME non-tech.
  Application : skill flip-diagnostic-pme (proposer Managed Agents pour le segment "PME non-tech 10-50 personnes budget serré"), skill claude-api-expert (setup Managed Agents).

---

## 📚 Apprentissages intégrés — Veille 8 mai 2026

### Heuristiques nouvelles

- **Checklist "MCP M365 ready" systématique en discovery.** 80% des PME françaises sont sur M365. Le catalogue [microsoft/mcp](https://github.com/microsoft/mcp) (Azure, Outlook, Teams, SharePoint, SQL Server, Dataverse, Clarity) permet d'identifier 3-5 quick wins en 10 min de scan. À intégrer en étape 2 du diagnostic juste après le cadrage process.

- **Managed Agents Outcomes = livrable mesurable et reproductible.** Depuis le 6 mai 2026 (Code with Claude), on peut transformer le diagnostic en agent managé avec une rubrique d'évaluation ("diagnostic livrable avec 5 quick wins chiffrés, ROI estimé, roadmap 30/60/90j") évaluée par un second Claude qui fait itérer jusqu'à passer. Tenir la promesse de livrable standardisé même quand l'analyste change.

- **Scan automatique du site web prospect avant le call de cadrage.** Avec [browserbase/skills](https://github.com/browserbase/skills) chaîné à `seo-audit`, on peut auditer un site client en autonomie avant le rendez-vous → arriver avec 3 quick wins déjà identifiés. Effet "wow".

### Benchmarks ROI à citer systématiquement (source France Num 2026)

| Cas d'usage | ROI médian 12 mois |
|---|---|
| Pricing dynamique e-com PME (500-5000 réf.) | **280%** |
| Chatbot support multilingue | 80% deflection demandes |
| Automatisation factures + anomalies | Gain massif documenté |
| **ROI médian global IA en PME** | **159,8%** |

Argument vente : "diagnostic Flip rentabilisé en 4 mois sur le ROI médian France Num documenté".

### 3 packs ROI à standardiser dans le livrable

1. **Pricing dynamique e-com** (cible : PME retail 500-5000 réf.)
2. **Chatbot support 80% deflection** (cible : PME service à ticket volume)
3. **Automatisation comptable factures + anomalies** (cible : PME industrielle/services)

Chaque pack = case study chiffré + roadmap 30j + estimation gain mensuel récurrent.

---

## 📚 Mise à jour — Veilles 15+22 mai 2026 (intégrées 2026-05-25)

- **anthropics/financial-services — repo Anthropic verticalisé secteur financier, +12000 stars/sem** (2026-05-25, source veille — github.com/anthropics/financial-services)
  Contexte : repo officiel Anthropic verticalisé secteur financier, +12000 stars en une semaine.
  Pourquoi ça compte : modèle directement transposable pour Flip — **packs sectoriels** (cabinet comptable, agence immo, artisan BTP) plutôt qu'offre générique. Confirme la stratégie verticale.
  Application : structurer le diagnostic en variantes sectorielles avec templates dédiés par vertical (process types, douleurs récurrentes, ROI benchmark sectoriel).

- **🚨 Claude for Small Business — MENACE CONCURRENTIELLE FRONTALE pour Flip** (2026-05-25, source veille — releasebot.io/updates/anthropic/claude)
  Contexte : Anthropic lance "Claude for Small Business" — branché QuickBooks, PayPal, HubSpot, Canva, Docusign, Google Workspace, M365 avec workflows prêts pour paie/facturation/ventes/marketing/clôture.
  Pourquoi ça compte : **Flip ne vend plus "l'accès à l'IA" mais "le diagnostic, l'orchestration, l'accompagnement humain"**. Hook : "on installe et on pilote Claude for Business pour vous".
  Application : pivot positionnement diagnostic — au lieu de "on identifie où mettre de l'IA", c'est désormais "on diagnostique vos process, on installe et configure Claude for Business sur les bons workflows, et on vous accompagne pour qu'il délivre le ROI".

- **MCP tunnels + self-hosted sandboxes — réponse anti-objection "données privées"** (2026-05-25, source veille — 9to5mac.com)
  Contexte : MCP tunnels permettent à un agent d'atteindre des serveurs MCP dans un réseau privé sans les exposer sur Internet.
  Pourquoi ça compte : argument anti-objection #1 PME ("je ne veux pas que mes données sortent du réseau interne") — réponse de réassurance directe à intégrer dans le diagnostic.
  Application : section "réassurance données privées" dans le livrable diag — schéma archi montrant MCP tunnel + données qui restent sur réseau client.

- **58% des TPE-PME utilisent déjà l'IA (Baromètre BPI/Rexecode T2 2026)** (2026-05-25, source veille — finyear.com)
  Contexte : 58% TPE-PME utilisent IA. France Num : 34% PME (vs 13% un an avant). Évolution rapide.
  Pourquoi ça compte : **pivot du pitch Flip** — le prospect n'a plus besoin qu'on lui dise "l'IA c'est important" mais "vous l'utilisez de façon désordonnée, voici comment en tirer du ROI".
  Application : pivot accroche du diagnostic — "vous utilisez déjà l'IA (ChatGPT, Copilot, etc.) — on diagnostique comment la structurer pour qu'elle génère vraiment du ROI mesurable".

- **Frein n°1 PME = "je sais pas quoi automatiser" (54% des dirigeants)** (2026-05-25, source veille — lelab.bpifrance.fr)
  Contexte : 54% des dirigeants citent "difficulté à identifier cas d'usage pertinents" comme frein principal. 88% des bloqués invoquent manque d'expertise.
  Pourquoi ça compte : c'est le cœur de la value prop diagnostic Flip — "on transforme ce blocage en roadmap concrète en 2 semaines".
  Application : positionnement du diagnostic — formulation explicite "54% des dirigeants ne savent pas par où commencer. Notre diagnostic résout exactement ce blocage en 2 semaines, avec une roadmap chiffrée."

- **34% des PME françaises utilisent l'IA (vs 13% un an avant)** (2026-05-25, source veille — francenum.gouv.fr)
  Contexte : 60% des dirigeants n'ont pas de stratégie IA formalisée. 88% citent manque d'expertise.
  Pourquoi ça compte : argument de vente clé en contexte diag — "34% de vos concurrents utilisent déjà l'IA. 60% n'ont pas de stratégie. On vous en donne une."
  Application : slide contexte marché dans le diagnostic — chiffres France Num 2026.

- **McKinsey France : +20-25% productivité, -15-20% coûts ops PME ayant adopté l'IA <18 mois** (2026-05-25, source veille — ai.axiiz.com)
  Contexte : chiffres McKinsey France sur PME ayant adopté l'IA dans les 18 premiers mois.
  Pourquoi ça compte : benchmark ROI crédible à intégrer dans calcul du diagnostic — donne fourchette de référence pour les PME prospects.
  Application : section "ROI attendu" du livrable diag — citer les benchmarks McKinsey (+20-25% productivité, -15-20% coûts ops) comme fourchette de référence.
