---
name: apprentissages
description: Mémoire vivante de tous les apprentissages validés sur Flip, Buddy, lePERMISLIBRE, tech, content, marketing, business — insights terrain, patterns qui ont marché, erreurs à ne plus refaire, objections + réponses validées. Lit la BDD Notion "Veilles Claude" (id 621e0992-0c74-4610-bb22-0d04677bd174) pour intégrer les veilles validées (statut "À intégrer") dans les skills concernés. À utiliser le lundi pour traiter les veilles validées, dès qu'un apprentissage doit être capturé ("note pour la suite", "à retenir", "ça a marché"), qu'on veut consulter un retour d'expérience passé, ou en complément des autres skills (cette mémoire les nourrit). À utiliser même si l'utilisateur dit juste "intègre la veille", "rappel-moi ce qui marche", "qu'est-ce qu'on a appris sur X", "/apprentissages".
---

# Apprentissages — Mémoire vivante

## Rôle

Ce skill centralise **tout ce qui fonctionne vraiment** : insights terrain, patterns validés, erreurs à ne plus refaire, objections récurrentes + réponses qui closent.

Il nourrit tous les autres skills. Quand `flip-proposition-commerciale` rédige une propal, il pioche dans les "ce qui convainc les clients PME" pour calibrer. Quand `linkedin-content-creator` écrit un post, il vérifie quels hooks ont déjà cartonné dans le passé.

Ton angle : **un apprentissage non-capturé est un apprentissage qu'on refait**. La mémoire vivante coûte 5 minutes par semaine à entretenir et fait gagner des heures de tâtonnement.

## Configuration Notion (HARDCODÉE)

Tu utilises le **connecteur Notion** intégré pour lire et mettre à jour les pages.

- **Database "Veilles Claude"** : `621e0992-0c74-4610-bb22-0d04677bd174`
- **Propriétés** : `Titre` (Title), `Date` (Date), `Statut` (Select), `Points intégrés` (Number), `Skills mis à jour` (Text)
- **Statuts** :
  - `🔉 À lire` — créé par `veille-vendredi`, pas encore lu par Romain
  - `À intégrer` — lu et commenté par Romain, prêt à intégrer
  - `Intégrée` — traité par ce skill, archivé

## Mode 1 — Intégration de la veille du week-end (lundi)

Quand l'utilisateur dit `/apprentissages`, "intègre la veille", ou similaire :

### Étape 1 — Trouver la veille à intégrer

1. Liste les pages de la BDD `Veilles Claude` avec `Statut = À intégrer`
2. Si **0 page** : dis-le clairement ("Pas de veille à intégrer cette semaine — Romain n'a pas marqué de veille comme prête")
3. Si **1+ pages** : prends la plus récente d'abord (par `Date`)
4. Si l'utilisateur a précisé une date, cible cette page-là

### Étape 2 — Parser la page

Lis le contenu complet de la page Notion via le connecteur (`notion-fetch` sur l'ID page).

Pour chaque **block de type `to_do`** dans la page :
- Si `checked: false` (`☐`) → **IGNORE**, Romain n'a pas validé cette proposition
- Si `checked: true` (`☑`) → **À INTÉGRER**, c'est une proposition validée

Pour chaque proposition à intégrer, extrais :
- **Le titre** (texte du block to_do lui-même)
- **Les détails** (sous-bullets : ce que c'est, lien, pourquoi pertinent, suggestion skill)
- **La note Romain** (si elle est remplie au-delà du placeholder `[...]`)

**Important** : ne traite **jamais** les sections "Méta" (Skills à améliorer, Apprentissage à immortaliser, Question ouverte) comme des propositions. Ce sont des notes libres, pas des to-dos. Si Romain a écrit du contenu là, lis-le pour contexte mais ne crée pas de modifications de skills automatiques sur cette base — c'est de la réflexion, pas une instruction.

### Étape 3 — Intégrer dans les skills

Pour chaque commentaire non-vide :

1. Identifie le **skill cible** (suggéré dans la veille, ou déduis du contexte)
2. Détermine le **type de mise à jour** :
   - **Description** (frontmatter) — si c'est une nouvelle façon de déclencher la skill
   - **Heuristique** (section "Heuristiques") — si c'est une règle de décision
   - **Anti-pattern** (section "À éviter") — si c'est une erreur à ne plus refaire
   - **Exemple** — si c'est un cas concret à montrer
3. Édite le fichier `SKILL.md` du skill cible dans `C:\Users\rdura\.claude\skills\<nom>\SKILL.md` (et aussi `C:\Users\rdura\flip-plugin\skills\<nom>\SKILL.md`)
4. Ajoute aussi l'apprentissage daté dans la **Mémoire vivante** (voir section ci-dessous)

### Étape 4 — Mettre à jour la page Notion

À la fin du traitement, mets à jour la page Notion via le connecteur :

- `Statut` → `Intégrée`
- `Points intégrés` → nombre exact d'items intégrés
- `Skills mis à jour` → liste des skills modifiés, séparés par virgules (ex : `linkedin-content-creator, flip-proposition-commerciale, growth-hacker`)

### Étape 5 — Reporter à Romain

Synthèse claire :

```
✅ Veille du [date] intégrée

Points intégrés : 4
Skills mis à jour :
  - linkedin-content-creator (1 nouveau hook ajouté en exemple)
  - flip-proposition-commerciale (1 anti-pattern client PME)
  - growth-hacker (1 heuristique sur le funnel B2B)
  - apprentissages (4 entrées datées dans la mémoire vivante)

Page Notion mise à jour : [URL]

Pour repackage / upload Claude.ai, dis-moi "package & upload".
```

## Mode 2 — Capture d'un apprentissage en cours de session

Quand l'utilisateur dit en cours de conversation "note ça", "à retenir", "garde en mémoire", "ça a marché" :

1. Reformule l'insight en 1 phrase actionnable
2. Identifie la section où il appartient (Flip / Buddy / LPL / Tech / Content / Général)
3. Ajoute une entrée datée dans la mémoire vivante (voir format ci-dessous)
4. Confirme à l'utilisateur où c'est noté

## Mode 3 — Consultation

Quand l'utilisateur demande "qu'est-ce qu'on a appris sur X", "rappel-moi ce qui marche pour Y" :

1. Cherche dans la mémoire vivante (sections + entrées datées)
2. Retourne uniquement les entrées **pertinentes au contexte**, avec leur source et leur date
3. Si rien de pertinent, dis-le clairement plutôt que d'inventer

## Inputs nécessaires

Selon l'usage :
- **Capture** : l'observation/insight à mémoriser + le contexte (projet, date, source)
- **Consultation** : la question / le contexte pour pouvoir extraire les apprentissages pertinents
- **Mise à jour** : ce qui a changé, ce qui n'est plus vrai, ce qui s'est confirmé

## Structure de la mémoire

### Flip Agency

- **Ce qui convainc les clients PME** : (à alimenter — ex : "le ROI chiffré sur leur secteur précis bat tous les arguments génériques")
- **Ce qui bloque les deals** : (ex : "discuter prix avant d'avoir cadré les douleurs = perdu")
- **Formats de livrables qui marchent** : (ex : "roadmap PDF 24h après diag = gros déclic")
- **Objections récurrentes + réponses validées** : (objection → réponse qui a closé, avec exemple)

### Buddy

- **Ce qui fonctionne avec les fabricants chinois** : (ex : "RFQ ultra-précise + visite physique avant signature")
- **Arguments qui résonnent avec les parents** : (ex : "screen-free + sécurité enfant > fonctionnalités tech")
- **Learnings hardware** (erreurs à ne pas refaire) : (ex : "valider IP67 en DVT, pas en PVT — coûte 3 mois sinon")

### lePERMISLIBRE

- **Ce qui convertit les prospects permis** : (ex : "FAQ honnête sur le prix > arguments commerciaux")
- **Contenu qui performe** : (ex : "articles "combien ça coûte vraiment" battent les guides généraux")
- **Insights CPF / réglementaires** : (ex : "anticiper les changements de seuil 6 mois avant")

### Tech (tous projets)

- **Patterns de code qui ont bien fonctionné** : (ex : "Server Actions + Zod = formulaires solides")
- **Erreurs d'archi à éviter** : (ex : "n8n pour orchestrer SaaS, jamais pour la logique métier complexe")

### Contenu & Marketing

- **Hooks qui ont le mieux performé** : (ex : '"J'ai dépensé X € pour Y" > toute autre formule')
- **Formats qui génèrent le plus d'engagement** : (ex : "carrousel LinkedIn 7 slides > thread")

### Général

- **Insights business notables** : (apprentissages cross-projets)
- **Ce que j'ai appris cette semaine** : (alimenté chaque vendredi)

## Comment alimenter

### En cours de session
Dès qu'un apprentissage est validé en discussion (résultat client, métrique, retour terrain) :
1. Reformule l'insight en 1 phrase actionnable
2. Identifie la section où il appartient
3. Ajoute la date + la source (client, post, conversation)
4. Si l'insight contredit un apprentissage précédent → on ne supprime pas, on date et on garde l'évolution

### Chaque vendredi
Via le skill `veille-vendredi` qui propose les apprentissages de la semaine à intégrer ici.

### Lundi matin
Session de consolidation : intégration des apprentissages validés dans les skills concernés (mise à jour des descriptions, des heuristiques, des anti-patterns).

## Format des entrées

Chaque entrée suit ce template :

```
- **[Insight en 1 phrase]** (date, source)
  Contexte : [comment c'est arrivé]
  Pourquoi ça compte : [implication]
  Application : [skill ou décision où s'en servir]
```

Exemple :
```
- **Le ROI chiffré sur leur secteur bat tous les arguments génériques** (2026-04-15, client Nelson)
  Contexte : pendant l'atelier, on a sorti "12h/sem économisées × salaire chargé estimé 50k€" plutôt que "améliorer la productivité"
  Pourquoi ça compte : transforme l'objection "c'est cher" en réflexe "c'est rentabilisé en 3 mois"
  Application : skill flip-proposition-commerciale, section ROI attendu
```

## Heuristiques

- **Capturer plus, garder moins.** Au début, on note tout. Au fil du temps, on archive ce qui n'est plus vrai (sans le supprimer — on garde l'historique).
- **Date tout.** Un insight de 2024 peut être périmé en 2026.
- **Source > Opinion.** Un apprentissage adossé à un cas réel pèse 10× plus qu'un "je pense que".
- **Anti-pattern : la mémoire morte.** Une page Notion jamais consultée n'est pas une mémoire — c'est un cimetière. La consultation hebdo est non-négociable.

## Format de sortie

Document Markdown / Notion structuré par section, prêt à dupliquer comme template ou à enrichir comme registre vivant. Quand consulté pour nourrir un autre skill, retourne uniquement les entrées **pertinentes au contexte** + leur source.

---

## 📚 Mise à jour — Veille du 24 avril 2026


**Date d'intégration** : 2026-04-27 (veille semaine du 24 avril 2026)
**11 entrées datées** à ajouter dans la mémoire vivante

---

## ➕ Section `Flip Agency` — Nouvelles entrées datées

- **L'écosystème MCP a atteint le seuil critique en avril 2026** (2026-04-27, source veille — activepieces, Linux Foundation)
  Contexte : MCP officiellement donné à la Linux Foundation, ~400 serveurs MCP via activepieces, adopté par Anthropic, OpenAI, Microsoft, Google.
  Pourquoi ça compte : pour Flip, ça change la conversation client — on n'est plus dans le custom par défaut, on est dans l'intégration par défaut. Argument de rapidité + de coût.
  Application : skill flip-diagnostic-pme (étape "MCP shopping"), skill architecture-decision-advisor (3 colonnes self-host/managed/custom).

- **block/goose comble le gap "data on-premise" pour les PME réfractaires au cloud** (2026-04-27, source veille — Block / Fazm AI)
  Contexte : agent IA en Rust, local-first, MCP natif, signé Block, 4 900 stars en 2 semaines.
  Pourquoi ça compte : on a enfin une réponse crédible à l'objection "on ne veut pas envoyer nos données dans le cloud" qui bloquait 30-40% des deals dans certains secteurs.
  Application : skill architecture-decision-advisor, skill flip-diagnostic-pme.

- **Le pitch "SaaSpocalypse" segmente fort selon le profil du dirigeant** (2026-04-27, source veille — Bloomberg / L'Agence Sauvage)
  Contexte : terme inventé par un trader Jefferies, repris par Bloomberg le 3 février 2026. 285Md$ de capitalisation perdus en 48h sur les SaaS éditeurs.
  Pourquoi ça compte : narratif puissant mais à double tranchant. Avec un patron tech-savvy ça crée une connivence forte. Avec un patron terrain ça repousse.
  Application : skill flip-proposition-commerciale (deux versions de hook propal), skill personal-branding (post pilier mensuel).

- **Le marché PME bascule : 26% en 2026 vs 13% en 2024** (2026-04-27, source veille — France Num / Bpifrance Le Lab)
  Contexte : doublement en 18 mois. 29% des TPE 1-9 salariés. 53% des PME 100+. Mais 95% des projets IA échouent (MIT Sloan).
  Pourquoi ça compte : "FOMO + crédibilité" qui marche en B2B 2026. Argument d'urgence + argument de méthode dans un même slide.
  Application : skill flip-proposition-commerciale (slide contexte marché systématique), skill pitch-deck (slide problème pitch investisseur).

- **Le format "Lab IA/PME" émerge comme 3e tier intermédiaire entre diag et abonnement** (2026-04-27, source veille — agence-ia.com)
  Contexte : modèle co-développement agence-PME sur 3-6 mois, demande croissante d'autonomie progressive, particulièrement chez PME industrielles ou régulées.
  Pourquoi ça compte : potentiellement une 3e ligne de revenus pour Flip, plus margée que l'abonnement, plus structurée que le diag. À tester avec 2-3 pilotes au S2 2026.
  Application : skill flip-proposition-commerciale (3e tier), skill pricing-strategy-expert (tier 5-8K€/mois, 3-6 mois).

- **Anthropic Managed Agents (public beta) = option turnkey pour PME non-tech** (2026-04-27, source veille — Anthropic platform release notes)
  Contexte : harness hosted by Anthropic, sandboxing, streaming SSE, mémoire en beta. Header `managed-agents-2026-04-01`.
  Pourquoi ça compte : pour les PME qui veulent du turnkey et acceptent le cloud, on a enfin une option officielle Anthropic plutôt que de bricoler.
  Application : skill flip-diagnostic-pme (3e option dans la stack reco).

## ➕ Section `Buddy` — Nouvelles entrées

- **L'AI Act devient enforceable le 2 août 2026 — toute IA pour enfant est dans le viseur** (2026-04-27, source veille — Legal Nodes / European Parliament)
  Contexte : Article 6 + Annexe III rendent les systèmes IA pour enfants potentiellement high-risk. Voice-activated toys explicitement cités. Sanctions jusqu'à 7% CA mondial.
  Pourquoi ça compte : pour Buddy, deadline structurante. Si dialogue IA / voice intégré, classification high-risk possible → 3-6 mois de travail conformity en plus.
  Application : skill hardware-product (section conformité AI Act), skill legal-review (clauses fournisseurs IA), à acter en board Buddy avant tout coup de feu MP.

## ➕ Section `Tech (tous projets)` — Nouvelles entrées

- **Le pattern "skill-first" qu'on utilise depuis le départ est validé par le marché en avril 2026** (2026-04-27, source veille — Archon, Superpowers, agents-radar)
  Contexte : la communauté open-source crée des frameworks (Archon, Superpowers, hermes-agent) pour formaliser ce qu'on faisait déjà. Hermes-agent +6 438 stars en un jour autour du positioning "agent qui grandit avec toi".
  Pourquoi ça compte : argument de crédibilité pour le pitch Flip + argument de focus interne (on ne se trompe pas de direction).
  Application : skill orchestrator (référencer Archon/Superpowers), skill flip-proposition-commerciale (slide méthode).

- **MCP est le standard de fait en avril 2026** (2026-04-27, source veille — Linux Foundation, activepieces)
  Contexte : MCP donné à la Linux Foundation, adopté par Anthropic, OpenAI, Microsoft, Google. ~400 serveurs.
  Pourquoi ça compte : la décision d'archi "comment je connecte mon agent à mon SaaS X" se résout 80% du temps par un MCP existant en 2026.
  Application : skill architecture-decision-advisor (étape "MCP shopping"), skill flip-diagnostic-pme.

- **Les visualisations inline Claude transforment l'expérience d'atelier** (2026-04-27, source veille — Anthropic release notes avril 2026)
  Contexte : Claude génère désormais charts et diagrammes en SVG natif directement dans la conversation, sans outil externe.
  Pourquoi ça compte : pour Flip, on peut produire la dataviz en live au lieu de promettre un rendu post-réunion. Effet "wow" + accélération du cycle livrable.
  Application : skill data-analyst, skill flip-diagnostic-pme.

## ➕ Section `Contenu & Marketing` — Nouvelles entrées

- **L'algo LinkedIn 2026 favorise la niche extrême** (2026-04-27, source veille — Linkboost, InvolvDigital, Edelman-LinkedIn)
  Contexte : Authenticity Update mars 2026, Depth Score remplace network-based, profile-to-content alignment vérifié, -60% reach sur liens externes.
  Pourquoi ça compte : la stratégie "ratisser large" est définitivement morte. Pour Romain, discipline éditoriale forte — IA × PME et rien d'autre, 6-12 mois minimum.
  Application : skill linkedin-content-creator (filtrage niche systématique), skill personal-branding (audit profil + calendrier 90j).

- **Carousel PDF = format dominant à 7x le texte** (2026-04-27, source veille — InvolvDigital benchmark)
  Contexte : 6.6% engagement vs 0.9% texte. Hook + 5-7 slides "Universal Alpha" + CTA.
  Pourquoi ça compte : format idéal pour les cartographies de process Flip, les benchmarks sectoriels, les cas client anonymisés. Pour Buddy, idéal pour les insights parents et les specs hardware.
  Application : skill linkedin-content-creator (template carousel par défaut), créer un template Canva/Figma "Flip carousel".

- **Le founder-led growth est la moat de distribution B2B 2026** (2026-04-27, source veille — Edelman-LinkedIn / InvolvDigital)
  Contexte : 60% des B2B buyers découvrent les marques via creator content avant le formulaire. 95% des décideurs disent que le thought leadership influence leurs achats. 79% ignorent les cold DMs.
  Pourquoi ça compte : confirme l'intuition d'investir Romain × LinkedIn pour Flip. La page entreprise est secondaire.
  Application : skill personal-branding (calendrier 90j hyper-niche), skill linkedin-content-creator (priorité absolue Romain).

## ➕ Section `Veille du 3 mai 2026` — Nouvelles entrées

### Tech & écosystème Claude

- **Agent Memory Systems — 3 approches en parallèle, à creuser pour V0.3** (2026-05-03, source veille — zilliz/claude-context, alash3al/stash, GenericAgent)
  Contexte : trois projets s'attaquent à la mémoire long-terme des agents. Postgres-based (stash), context compression à 30K (GenericAgent), vector search (claude-context).
  Pourquoi ça compte : le système de memory CCD actuel (fichiers .md) ne scale pas pour un memory layer partagé équipe. Ces 3 approches dessinent le pattern V0.3 — probablement vector DB ou Postgres pour la mémoire collective.
  Application : à monitorer pour la V0.3 du système nourriture continue, pas d'intégration immédiate. Décision à prendre : remplacer fichiers MEMORY.md par layer Postgres partagé ou rester sur fichiers ?

- **Cowork scheduled tasks — automatiser pipeline veille/feeder/syncer** (2026-05-03, source veille — Anthropic release notes)
  Contexte : Anthropic Cowork supporte désormais les tasks programmées (récurrentes + on-demand). Permet de scheduler des skills sans gérer cron externe.
  Pourquoi ça compte : trio veille-vendredi (vendredi 9h) + skill-feeder (lundi 10h) + plugin-syncer (lundi 18h) peut désormais tourner 100% auto. Plus de manuel pour le pipeline d'enrichissement.
  Application : activer le skill `schedule` pour cabler ces 3 jobs en cron Cowork. À tester en mode dry-run d'abord pour valider le timing.

### Hardware / Buddy

- **O Watch (Kickstarter, Arduino) — variante Buddy Maker à explorer en V2** (2026-05-03, source veille — iot4kids.com)
  Contexte : O Watch propose une approche éducative — les kids apprennent à coder leur propre smartwatch. Arduino-based, hackable. Niche différente mais inspirante.
  Pourquoi ça compte : possible "Buddy Maker" en V2 ou édition limitée. Différenciation forte vs concurrence "smartwatch consommation". Cible parents tech / makers.
  Application : pas d'intégration immédiate, à garder en veille pour le board roadmap Buddy V2 (post-MP V1).

---

## 📚 Mise à jour — Veille du 8 mai 2026

**Date d'intégration** : 2026-05-11 (veille semaine du 2-8 mai 2026)
**27 entrées datées** sur 30 propositions (3 non cochées : CPF Permis B verrouillé, Permis 17 ans, Qualiopi)

### Tech & écosystème Claude

- **Code with Claude 2026 (conf Anthropic 6 mai) — Managed Agents passe en public beta avec 3 features lourdes** (2026-05-11, source veille — Anthropic platform release notes + Simon Willison liveblog)
  Contexte : header `managed-agents-2026-04-01` débloque Outcomes (eval rubrique évaluée par un 2e Claude, agent itère jusqu'à passer), Multiagent (lead délègue à des spécialistes en parallèle sur filesystem partagé), Dreaming (agent relit ses sessions et met à jour sa mémoire — Harvey rapporte ×6 sur completion rates).
  Pourquoi ça compte : change radicalement comment construire les head-of-*. Outcomes = livrable client mesurable et reproductible. Multiagent = parallélisation des skills (orchestrator devient un vrai lead agent).
  Application : skill flip-diagnostic-pme (rubrique Outcomes = "diagnostic livrable avec 5 quick wins chiffrés"), skill orchestrator (migrer head-of-content en Multiagent lead → hook-generator + seo-content-writer + reels-script en parallèle), skill architecture-decision-advisor (3e option dans le matrix de choix).

- **Claude Code 2.1.132 + 2.1.136 — hooks réécrivent l'output de n'importe quel tool, plugins via URL** (2026-05-11, source veille — releasebot.io + CHANGELOG GitHub)
  Contexte : `--plugin-url` charge un plugin depuis une URL d'archive (plus besoin de cloner). PostToolUse hooks réécrivent l'output de n'importe quel tool via `hookSpecificOutput.updatedToolOutput` (avant : MCP-only). `hard_deny` rules en auto mode bloquent inconditionnellement. Hooks reçoivent `$CLAUDE_EFFORT`. Fix : MCP servers de `.mcp.json` qui disparaissaient après `/clear` réparé.
  Pourquoi ça compte : passe l'autopilot Claude Code en mode plus sûr (hard_deny secrets) et plus expressif (PostToolUse universel). Le `--plugin-url` simplifie la distribution des plugins head-of-*.
  Application : skill update-config (ajouter hard_deny `Write(.env)` + `Write(*credentials*)` au settings.json global), créer ou enrichir skill claude-code-security, skill plugin-bundler (distribuer via URL d'archive plutôt que git).

- **Routines Anthropic — automations async en background pour Claude Code** (2026-05-11, source veille — Simon Willison Code w/ Claude 2026)
  Contexte : Routines = setup d'automations asynchrones qui tournent en background (PRs prêtes à merger au réveil). CI auto-fix = Claude push des fixes auto sur les PRs en échec.
  Pourquoi ça compte : la routine devient le pattern par défaut pour les jobs récurrents (veille-vendredi, dependency updates, refactos simplify). Plus de manuel.
  Application : skill veille-vendredi (déléguer le déclenchement à une Routine au lieu d'invoquer manuellement), skill schedule (router les jobs récurrents en Routines).

- **Webhooks Managed Agents + refresh OAuth automatique** (2026-05-11, source veille — platform.claude.com release notes)
  Contexte : webhooks pour events de session/vault, filtres avancés (status, type, created_at). `mcp_oauth` credentials se refresh tout seul en background.
  Pourquoi ça compte : pour l'admin marque blanche SaaS (projet Globber, cf memory `admin_whitelabel_project.md`), permet de notifier en temps réel sans polling. Architecture event-driven enfin propre côté Claude Platform.
  Application : skill architecture-decision-advisor (intégrer le pattern webhook dans la doc Claude Platform), skill claude-api-expert (section nouveaux events + filtres).

- **Limites API doublées (Pro/Max/Team/Enterprise) + accord SpaceX 220k GPUs** (2026-05-11, source veille — anthropic.com/news/higher-limits-spacex)
  Contexte : rate limits doublés sur Pro/Max/Team, fin de la réduction heures de pointe. Accord SpaceX = +300 MW (220k+ GPUs NVIDIA) ce mois-ci.
  Pourquoi ça compte : on peut désormais paralléliser plus agressivement les scripts batch (Flip diagnostics, génération LinkedIn en masse). `head-of-content` peut tourner sur 10 sujets simultanés sans throttling.
  Application : skill claude-api-expert (mettre à jour la section rate limits), skill content-repurposer (autoriser le batch x10 sans throttling).

- **browserbase/skills — Pack 11 skills officiel pour piloter un vrai browser depuis Claude Code** (2026-05-11, source veille — github.com/browserbase/skills)
  Contexte : pack officiel de 11 skills qui pilotent un browser headless authentifié depuis Claude. Installation 1 commande, 3 115 stars (+1 403 cette semaine), 34 PRs ouvertes.
  Pourquoi ça compte : comble le trou n°1 de Claude Code aujourd'hui — interagir avec sites authentifiés en prod. Permet d'auditer un site client en autonomie (login, parcours, formulaires).
  Application : créer un nouveau skill `client-website-audit` qui chaîne browserbase + skill `seo-audit` existant → audit autonome de sites clients PME pour Flip. Ajouter une étape dans flip-diagnostic-pme : "scan automatique du site web prospect avant le call".

- **anthropics/claude-plugins-official — Marketplace officiel ouvert aux submissions tiers** (2026-05-11, source veille — github.com/anthropics/claude-plugins-official)
  Contexte : annuaire officiel et modéré des plugins Claude Code. Submission form ouverte pour partenaires/tiers. 19 100 stars.
  Pourquoi ça compte : canal de distribution gratuit avec audience Claude Code. On a 16 plugins head-of-* prêts. Lead-gen passif Flip.
  Application : skill partnership-outreach (ajouter "soumission marketplace officiel" comme canal de distribution), skill plugin-bundler (préparer un format de soumission propre). Action 30j : soumettre head-of-consulting comme premier test.

- **microsoft/mcp — Catalogue MCP officiel Microsoft (M365, Azure, SQL, Teams, SharePoint)** (2026-05-11, source veille — github.com/microsoft/mcp)
  Contexte : catalogue officiel des serveurs MCP Microsoft. Release 6 mai 2026, 3 100 stars. Branche Claude sur l'écosystème Microsoft d'un client en 10 minutes.
  Pourquoi ça compte : 80% des PME françaises sont sur M365. Argument commercial Flip béton : "on automatise vos process M365 sans toucher à votre stack, en 10 min".
  Application : skill flip-diagnostic-pme (checklist "MCP M365 ready" → quick wins identifiables en discovery : Outlook automation, SharePoint search, Teams notifications), skill architecture-decision-advisor (intégrer le catalogue MS dans le MCP shopping).

- **mattpocock/skills — Skills senior engineer prod-grade pour Claude Code** (2026-05-11, source veille — github.com/mattpocock/skills)
  Contexte : skills par Matt Pocock (Total TypeScript, autorité reconnue). 69 794 stars (+12 722 cette semaine). Focus sur les patterns que les LLM ratent encore en 2026.
  Pourquoi ça compte : référence de qualité pour les skills tech. À comparer avec typescript-strict et code-review-nextjs existants pour cherry-pick les patterns gagnants.
  Application : skill typescript-strict (audit comparatif + cherry-pick 1-2 patterns), skill code-review-nextjs (idem), plugin head-of-engineering (intégrer les patterns retenus).

- **ruvnet/ruflo — Orchestration multi-agents (swarm, hive-mind, mémoire partagée)** (2026-05-11, source veille — github.com/ruvnet/ruflo)
  Contexte : plateforme d'orchestration multi-agents déjà installée dans le MCP. 48 634 stars (+10 779 cette semaine). Permet de remplacer la logique séquentielle par du parallèle.
  Pourquoi ça compte : devient la référence pour agents collaboratifs. Combiné avec Managed Agents Multiagent, on a 2 options pour le parallèle.
  Application : créer skill `switch-diagnostic-swarm` qui lance 4 agents en parallèle (process, growth, tech, finance) → diagnostic PME en 5 min au lieu de 25. Skill orchestrator : documenter ruflo comme alternative à Managed Agents Multiagent.

### Flip Agency

- **IA Booster BPI : diagnostic 10k€ pris en charge à 25% (reste 7,5k€) depuis le 1er janv. 2026** (2026-05-11, source veille — francenum.gouv.fr + Stema Partners)
  Contexte : diagnostic IA Booster BPI cadré à 10 000€ HT (8 jours), 25% pris en charge pour PME 10-2000 salariés (>1M€ CA, >1 an). BPI finance 50-70% d'un projet IA combiné.
  Pourquoi ça compte : Flip à 2500€ se positionne explicitement comme "alternative agile" (3x moins cher, livrable en 2 semaines, sans paperasse). OU devenir prestataire référencé BPI = canal d'acquisition gratuit.
  Application : skill flip-proposition-commerciale (slide comparatif "IA Booster BPI vs Flip" systématique), skill partnership-outreach (lancer une démarche de référencement BPI prestataire IA).

- **AI Act : deadline du 2 août 2026 — fenêtre tactique critique pour Flip** (2026-05-11, source veille — entreprendre.service-public.gouv.fr + aiacto.eu)
  Contexte : obligations dures s'appliquent au 2 août 2026 (T-3 mois). PME en IA RH / scoring client / surveillance employés tombent en "haut risque". Sanctions jusqu'à 15M€ ou 3% du CA mondial.
  Pourquoi ça compte : la majorité des dirigeants PME ignorent qu'ils sont concernés. Hook commercial puissant : urgence + risque légal chiffré.
  Application : skill pricing-strategy-expert (lancer offre tactique "Audit AI Act PME — 990€" comme trojan horse vers le diagnostic 2500€), skill linkedin-content-creator (série 6 posts sur 30j ton alarmiste sourcé), skill email-campaign (séquence prospection deadline-driven).

- **Baromètre France Num 2026 : 26% des TPE/PME utilisent l'IA (x2 en 12 mois) — secteurs sous-pénétrés à cibler** (2026-05-11, source veille — francenum.gouv.fr + bpifrance lelab)
  Contexte : 26% des TPE/PME (vs 13% en 2024). 31% en IA générative. 58% considèrent IA prioritaire. Disparité : 41% NTIC, 9% agriculture. Objectif gouv 80% d'ici 2030 ("Osez l'IA").
  Pourquoi ça compte : la stratégie Flip doit cibler les secteurs **sous-pénétrés mais matures** (artisanat, BTP, services pro : avocats/comptables/notaires) — moins concurrencés, douleur réelle, budget existant.
  Application : skill growth-hacker (intégrer le mapping sectoriel comme matrice d'opportunités), skill seo-cluster-strategist (créer des verticales "IA pour [secteur]" en pillar+spokes), hook : "1 PME sur 4 utilise l'IA. La vôtre n'est pas dedans. On vous y met en 90 jours."

- **Marché agences IA PME : sweet spot vide entre Stema/Digitallia (15-20k€) et freelances (600-900€/j)** (2026-05-11, source veille — Cartelis + Koino + agence-ia.com)
  Contexte : marché en 2 camps. (1) Agences structurées 15-20k€ minimum (Stema, Digitallia) audit→industrialisation. (2) Micro-agences niche en explosion + freelances. Flip à 2000€/mois positionné dans un sweet spot vide.
  Pourquoi ça compte : la fenêtre pour planter un drapeau de niche est étroite (3-6 mois) avant que les cabinets descendent en gamme. Positionnement explicite obligatoire.
  Application : skill competitor-analysis (fiche détaillée 3 concurrents directs : Stema, Digitallia, freelances top), skill brand-identity (refonte du positionnement avec comparatif explicite "Stema = 20k€ et 4 mois / Freelance = pas de continuité / Flip = 2500€ + 2k€/mois, démarrage J+7"), identifier 2-3 verticales pour devenir LA micro-agence (ex : cabinets comptables).

- **ROI IA PME documenté : médian 159,8% sur 12 mois, pricing dynamique e-com à 280%** (2026-05-11, source veille — yes-we-prompt.fr + lagencesauvage.com)
  Contexte : ROI médian IA en PME = 159,8% sur 12 mois (données France Num). Pricing dynamique retail/e-com 500-5000 réf. = 280% ROI médian. Chatbot support multilingue = 80% deflection. Automatisation factures = gain massif documenté.
  Pourquoi ça compte : argument vente béton contre l'objection prix : "diagnostic Flip rentabilisé en 4 mois (ROI moyen 159% documenté France Num)". Permet de standardiser 3 "packs ROI prouvés".
  Application : skill flip-diagnostic-pme (intégrer les benchmarks ROI dans le livrable), skill sales-script (réponse à l'objection prix avec ce chiffre), standardiser 3 packs vendables pendant le diagnostic : (1) pricing dynamique e-com, (2) chatbot support 80% deflection, (3) automatisation comptable.

### Buddy

- **🚨 EN71-3:2026 entrée en vigueur le 13 février 2026 — re-test obligatoire avant production de masse** (2026-05-11, source veille — Bureau Veritas + RTS Lab)
  Contexte : EN71-3 (migration des métaux lourds) nouvelle version effective au 13/02/2026 remplaçant EN71-3:2019+A1:2021. EN71-1:2026 aussi publié (vigueur juillet 2027). Toute prod hardware enfant doit re-tester.
  Pourquoi ça compte : **bloquant production**. Si tests conformité lancés avant fév 2026, re-test obligatoire. Impact : 2-6 semaines + 5-15k€.
  Application : skill hardware-product (ajouter EN71-3:2026 en checkpoint obligatoire avant DVT→PVT), skill launch-checklist (bloquer la prod de masse tant que EN71-3:2026 n'est pas validé). Action immédiate : caller le labo pour re-test.

- **EU Age Verification app — rollout accéléré (29 avril 2026), DSA Art.28 enforcement** (2026-05-11, source veille — Commission EU + The Register)
  Contexte : Commission EU urge rollout accéléré de l'app open-source de vérif d'âge (mini-wallet anonyme, interop EUDI Wallet). France/Italie/Espagne front-runners. DSA Art.28 = obligation "high level of privacy, safety, security of minors".
  Pourquoi ça compte : opportunité de positionnement "DSA-ready by design" — si Buddy intègre nativement le standard EUDI/age-verification dans l'onboarding parent, différenciateur fort vs Xplora/Pixbee.
  Application : skill legal-review (ajouter DSA Art.28 + EUDI Wallet à la check-list compliance kids), skill product-launch-strategist (intégrer la conformité DSA dans le launch plan EU).

- **Littlebird (CES Innovation Award 2026) entre chez Amazon + Walmart US** (2026-05-11, source veille — GeekWire + CES.tech)
  Contexte : wearable kid tracker **sans écran**, sur réseau maillé Amazon Sidewalk + BLE + Wi-Fi + GPS, range 2 miles **sans data plan**. Distribution Amazon + Walmart confirmée.
  Pourquoi ça compte : menace directe sur positionnement "buddy parental sans distraction". Avantage Buddy = eSIM (dépendance Sidewalk inexistante en EU). Risque mid-term si Littlebird arrive en EU.
  Application : skill competitor-analysis (ajouter Littlebird en concurrent direct USA, à monitorer pour expansion EU), skill hardware-product (exploiter en messaging : "Buddy fonctionne partout en Europe sans réseau communautaire propriétaire").

- **Nordic nRF54LM20B (NPU edge AI) — sampling Q2 2026, audio AI on-device** (2026-05-11, source veille — Nordic Semi + AllAboutCircuits)
  Contexte : Nordic sort nRF54LM20B avec NPU Axon intégré (ML on-device). Dispo large début Q2 2026. Permet voice trigger / classification audio Opus on-device sans envoi cloud.
  Pourquoi ça compte : si Buddy V2 prévoit features audio smart (mot-clé réveil, détection détresse), passer au nRF54LM20B au prochain spin = "AI on-device = pas de cloud audio enfant" = killer feature RGPD-K + DSA.
  Application : skill hardware-product (intégrer nRF54LM20B en option d'évaluation au prochain spin PCB), skill architecture-decision-advisor (décision "audio cloud vs edge" avec ce SoC comme option edge).

- **CNIL — 8 recommandations protection mineurs (cadre actif 2026)** (2026-05-11, source veille — CNIL)
  Contexte : CNIL pousse 8 reco opérationnelles : consentement parental <15 ans documenté, design "by privacy", vérif âge, contrôle parental respectueux, droits exerçables par l'enfant. Loi 2024-120 impose obligations aux parents eux-mêmes (droit à l'image).
  Pourquoi ça compte : l'app parent Buddy doit (a) implémenter consentement parental documenté <15 ans, (b) interface enfant compréhensible (Reco 6), (c) ne pas pousser partage photos/vidéos par défaut.
  Application : skill legal-review (intégrer les 8 reco CNIL en check-list compliance app parent FR), skill product-manager (auditer l'UX app parent avant launch FR sur les 8 critères).

### lePERMISLIBRE

- **Permis numérique sur smartphone + validité 15 ans (réforme UE 2026) — vague SEO à capter** (2026-05-11, source veille — service-public.gouv.fr + Ulys)
  Contexte : permis dématérialisé sur smartphone (app officielle UE) déployé en 2026 + fin du permis à vie (validité 15 ans cat. A/B, simple renouvellement administratif sans repassage).
  Pourquoi ça compte : pic de recherche garanti sur "comment renouveler permis 2026", "permis numérique". Vague SEO à capter avant que les concurrents éditorialisent.
  Application : skill seo-cluster-strategist (créer un pillar "Réforme permis 2026" + 8-12 spokes), skill seo-content-writer (rédiger en priorité les 12 articles sous 30 jours).

- **Taux réussite permis B 2024 : 58,2% national, AAC à 75% — proof points landing + programmatic SEO départemental** (2026-05-11, source veille — securite-routiere.gouv.fr + Codes Rousseau)
  Contexte : permis B = 58,2% (national), code = 50,7%, AAC = 75%. Écart énorme par département (Hautes-Alpes 75,9% vs Guadeloupe 32,2%, Paris 47,7%).
  Pourquoi ça compte : si LPL bat le 58,2% national, l'afficher comme chiffre de référence sur landing + ads. Programmatic SEO : page par département × taux LPL vs moyenne nationale = volume search énorme.
  Application : skill programmatic-seo (template "Taux réussite permis [département] : LPL vs moyenne nationale" × 96 départements), skill ecommerce-optimizer (intégrer le proof point 58,2% comme contre-référence sur la landing principale).

### Growth / Marketing

- **TikTok Symphony "Recommended Creatives" — Halara : -70% CPA, URL → vidéo générée** (2026-05-11, source veille — TikTok For Business)
  Contexte : Smart+ génère des vidéos complètes (script, voix off, avatar) à partir d'une simple URL de destination. Halara (athleisure) = -70% CPA vs campagne contrôle. Automatic Enhancements ajoute resize, dub multilingue, upscale.
  Pourquoi ça compte : on n'a plus besoin de tourner pour tester. Budget test 300€/campagne, vidéo générée en 24h. ROI mesurable sous 7 jours.
  Application : skill ads-copy (intégrer le pattern "brief = URL + 3 variantes texte" pour TikTok Symphony), tester en priorité sur Buddy (B2C panier ~30€) et LPL (lead permis ~5€).

- **Founder LinkedIn quotidien = 5-10x demos B2B inbound vs founders silencieux** (2026-05-11, source veille — Leadfeeder)
  Contexte : founders qui postent 1 post/jour ouvré reportent 5-10x plus de demos inbound. Combiné à l'ABM hyper-perso : deal value +171%.
  Pourquoi ça compte : confirme l'intuition Romain × LinkedIn pour Flip. Routine "1 post/jour ouvré" pendant 30j = test net mesurable.
  Application : skill linkedin-content-creator (passer le quota de 3/semaine à 5/semaine pour le founder), skill personal-branding (calendrier 30j founder Romain avec pipeline 4 carrousels diagnostic + 3 stories client + 3 contrarian/semaine), skill content-repurposer (recette "1 diagnostic PME → 5 posts").

- **LinkedIn algo 2026 : dwell time > CTR — carrousels PDF 10 slides à 6,6% engagement** (2026-05-11, source veille — Dataslayer + Linkboost)
  Contexte : l'algo a pivoté du CTR vers le **dwell time**. Carrousels PDF 10 slides = 6,6% engagement (record tous formats). Les 60-90 premières minutes déterminent 70% du reach. Hooks gagnants : contrarian / data / narrative (in medias res).
  Pourquoi ça compte : confirme et amplifie la veille du 24 avril (carrousel = 7x texte). Le format narratif "in medias res" est l'évolution.
  Application : skill linkedin-content-creator (rythme cible : 2 carrousels PDF/semaine + 1 post narratif "in medias res" hebdo, mardi/jeudi 8h, mobiliser 5 commentaires réseau dans la 1ère heure), skill hook-generator (ajouter le format narratif "I almost fired..." / "Le moment où j'ai cru tout perdre" en pattern).

- **Google AI Overviews : CTR organique -46,7% — pivot vers AI Citations (GEO)** (2026-05-11, source veille — Stackmatix + Search Engine Land)
  Contexte : AI Overviews apparaissent sur 50% des requêtes US (39% sur queries info). CTR organique chute de 46,7%. Nouvelle métrique : être cité dans la réponse IA, pas ranker. Pattern gagnant : "best short answer + best deeper answer + best cited answer" dans le même article.
  Pourquoi ça compte : la stratégie SEO classique "ranker n°1" est en train de basculer vers "être cité par l'IA". Tout le corpus LPL est à restructurer.
  Application : skill seo-content-writer (template d'article = bloc "réponse en 40 mots" en H2 dès le début snippet-ready, puis long format), skill seo-audit (auditer les 20 articles top-traffic LPL et les restructurer), skill schema-markup (FAQ + HowTo systématique pour augmenter chances de citation AI).

- **Meta Ads — engage-through conversions séparées + Threads App Ads global** (2026-05-11, source veille — Anchour + Dataslayer)
  Contexte : Meta sépare désormais click-through et engage-through conversions (vues longues, interactions) dans le reporting natif. Les créas storytelling longues remontent dans l'attribution. Threads s'ouvre aux App Ads globalement via Marketing API.
  Pourquoi ça compte : les créas 30-45s narratives vont remonter (vs UGC court qui dominait). Threads = canal vierge en mirror d'Instagram.
  Application : skill ads-copy (passer la stratégie créa Meta vers formats 30-45s narratifs pour Flip + Buddy), skill growth-hacker (activer Threads App Ads en mirror IG sur Buddy, audience early adopter parents).

---

## 📚 Mise à jour — Veille du 15 mai 2026 (intégrée 2026-05-25)

**Date d'intégration** : 2026-05-25
**12 entrées datées** sur 12 propositions cochées

### Tech & écosystème Claude

- **mattpocock/skills explose à 75 700 stars (+6400/sem) — référence skills senior eng à benchmarker** (2026-05-25, source veille — github.com/mattpocock/skills)
  Contexte : Matt Pocock publie les 17 fichiers .claude/ perso : TDD, triage GitHub, vertical slices.
  Pourquoi ça compte : audit comparatif obligatoire avec nos skills orchestrator/maintenance/typescript-strict — confirme la direction skill-first et donne des patterns concrets à cherry-picker.
  Application : skill orchestrator (référencer + cherry-pick patterns TDD workflow), skill maintenance (workflow triage GitHub).

- **Meta MCP officiel + CLI ads (29 avril 2026) — setup 5-7 min vs 25 min+** (2026-05-25, source veille — github.com/pipeboard-co/meta-ads-mcp)
  Contexte : Meta lance serveur MCP officiel + CLI. Query perfs, modifier budgets, pauser ads depuis terminal/Claude.
  Pourquoi ça compte : workflow MCP pour gestion ads clients Flip + Buddy + LPL. Réduction massive de friction opérationnelle.
  Application : skill ads-copy (intégrer Meta MCP comme outil par défaut pour piloter campagnes).

- **Écosystème Claude Code explose : 4200+ skills, 770+ MCP servers, Tool Search réduit contexte 95%** (2026-05-25, source veille — claudemarketplaces.com)
  Contexte : MCP Tool Search (lazy loading) réduit usage contexte de 95%. Serveurs officiels first-party (Notion, Stripe, Slack, Vercel, Cloudflare) remplacent alternatives community.
  Pourquoi ça compte : audit MCP servers internes obligatoire — migrer vers les officiels où dispo.
  Application : skill claude-api-expert (section "MCP Tool Search + serveurs officiels first-party").

- **Claude Managed Agents — 3 features lourdes (Dreaming, Outcomes, Multi-agent) + tarif 0.08$/session-hour** (2026-05-25, source veille — 9to5mac.com)
  Contexte : Dreaming = agent review sessions passées pour s'améliorer. Outcomes = rubrique de succès, agent s'auto-évalue. Multi-agent = lead délègue. Prix : tokens + 0.08$/session-hour.
  Pourquoi ça compte : permet de packager des agents autonomes pour clients PME Flip — l'agent s'améliore tout seul entre les sessions.
  Application : skill claude-api-expert (section Managed Agents avec pricing).

- **Claude Platform on AWS — billing AWS + IAM + Files/Batch API + Managed Agents** (2026-05-25, source veille — platform.claude.com)
  Contexte : API sur infra Anthropic mais billing AWS, IAM, Files API, Batch API, Managed Agents, code execution.
  Pourquoi ça compte : pour clients Flip déjà sur AWS, moins de friction d'onboarding (pas de nouveau contrat fournisseur).
  Application : skill claude-api-expert (option déploiement AWS pour PME).

- **Advisor Tool (beta) — pattern "Opus conseille, Haiku exécute" pour réduire coûts** (2026-05-25, source veille — platform.claude.com)
  Contexte : pairing modèle fort + rapide. Réduit coûts en gardant qualité raisonnement.
  Pourquoi ça compte : optimisation coûts en production pour agents Flip — Opus en phase analyse, Haiku en phase exécution répétitive.
  Application : skill claude-api-expert (pattern d'optimisation coûts production).

### Flip Agency

- **34% des PME françaises utilisent l'IA (vs 13% un an avant) — doublement en 1 an** (2026-05-25, source veille — francenum.gouv.fr)
  Contexte : 60% des dirigeants n'ont pas de stratégie IA formalisée. 88% citent manque d'expertise.
  Pourquoi ça compte : argument de vente clé — "34% de vos concurrents utilisent déjà l'IA. 60% n'ont pas de stratégie. On vous en donne une."
  Application : skill flip-diagnostic-pme, skill flip-proposition-commerciale (slide contexte marché).

- **McKinsey France : +20-25% productivité, -15-20% coûts ops PME ayant adopté l'IA <18 mois** (2026-05-25, source veille — ai.axiiz.com)
  Contexte : chiffres McKinsey France sur PME ayant adopté l'IA dans les 18 premiers mois.
  Pourquoi ça compte : benchmark ROI à intégrer dans calcul du diagnostic Flip — donne fourchette crédible aux PME prospects.
  Application : skill flip-diagnostic-pme (section ROI attendu), skill flip-proposition-commerciale (slide bénéfices).

- **AI Summit Europe : alliances éditeurs (Mistral, Gemini EU) × agences IA locales — modèle hybride** (2026-05-25, source veille — agence-ia.com)
  Contexte : modèle hybride puissance éditeur + agilité agence locale. PME accèdent à offres réservées aux grandes entreprises.
  Pourquoi ça compte : explorer partenariat éditeur (Anthropic partner program ?) pour Flip OU risque court-circuit si Mistral/Gemini lance son réseau d'agences.
  Application : skill partnership-outreach (démarche partenaire Anthropic/Mistral), skill competitor-analysis (monitoring alliances éditeur+agence).

### Buddy (compliance kids tech)

- **COPPA US — deadline compliance 22 avril 2026 (passée) : consentement parental séparé pour pub ciblée** (2026-05-25, source veille — wsgr.com)
  Contexte : nouvelles obligations COPPA : consentement parental séparé pour pub ciblée, définition élargie données perso (device IDs, biométrie, géolocalisation, comportement), règles strictes rétention/suppression.
  Pourquoi ça compte : si Buddy vise marché US, vérification de conformité obligatoire — sinon sanctions FTC.
  Application : skill hardware-product (checklist COPPA US), skill legal-review (audit compliance avant expansion US).

- **EDPB Europe : focus protection données enfants + DSA enforcement — vérif d'âge obligatoire** (2026-05-25, source veille — edpb.europa.eu)
  Contexte : Europe accélère sur protection mineurs. Vérification d'âge, paramètres vie privée par défaut, transparence. GDPR-K seuil 16 ans (abaissable à 13 par pays). DSA enforcement monte.
  Pourquoi ça compte : privacy by design obligatoire pour Buddy dès la conception — pas un add-on post-launch.
  Application : skill hardware-product (privacy by design dans specs), skill legal-review (check-list GDPR-K + DSA Art.28).

- **Marché connected toys : 19,5Md$ → 120Md$ en 2033 (CAGR 25,5%)** (2026-05-25, source veille — credenceresearch.com)
  Contexte : Bluetooth (1,5Md$) et Wi-Fi (2Md$) dominent. Jouets interactifs = 40%+ ventes totales en 2026. Leaders : LEGO, Hasbro, Mattel, Spin Master, VTech.
  Pourquoi ça compte : valide timing Buddy, marché en hyper-croissance, fenêtre ouverte avant que les leaders aspirent toute l'attention.
  Application : skill hardware-product (slide marché pitch Buddy), skill competitor-analysis (mapping leaders + niches).

### lePERMISLIBRE

- **1/3 des candidats choisit auto-école en ligne en 2026 — marché stabilisé à 4 acteurs (Ornikar 15913/trim, EVS 5505, Stych, LPL)** (2026-05-25, source veille — autoecolemagazine.fr)
  Contexte : Ornikar 15913 candidats/trim, 82 départements. En Voiture Simone 5505. Stych. LPL. Marché stabilisé.
  Pourquoi ça compte : benchmark concurrentiel à jour pour LPL, identifier angle de différenciation (taux réussite, prix, parcours, CPF).
  Application : skill competitor-analysis (fiches Ornikar/EVS/Stych), skill autoecole-expert (positionnement LPL vs Ornikar).

### Growth / Marketing

- **Meta Advantage+ Creative ON par défaut depuis février 2026 + ASC seuil baissé à 25 conv/sem** (2026-05-25, source veille — admanage.ai)
  Contexte : nouvelles campagnes Sales/Leads/App Promo avec TOUTES les améliorations Advantage+ Creative activées par défaut. ASC seuil baissé 25 conv/sem.
  Pourquoi ça compte : vertical-first obligatoire dès la production de créatives. Buddy (crowdfunding) et LPL peuvent enfin tester ASC avec budget modeste.
  Application : skill ads-copy (vertical-first dès brief), skill growth-hacker (activer ASC sur Buddy/LPL).

- **Meta "Describe Your Audience" — targeting langage naturel via Advantage+ Targeting** (2026-05-25, source veille — gezar.dk)
  Contexte : Advantage+ Targeting accepte description en texte libre du client idéal, IA Meta fait le ciblage.
  Pourquoi ça compte : raccourcit drastiquement le setup ciblage — passer de structures audiences complexes à descriptions narratives.
  Application : skill ads-copy (tester immédiatement sur Flip+Buddy+LPL), skill growth-hacker (mettre à jour workflow setup campagne).

- **LinkedIn algo 2026 — pivot "value delivered" + dwell time comme signal clé** (2026-05-25, source veille — blog.linkboost.co)
  Contexte : algo priorise pertinence, expertise, engagement qualitatif. Dwell time = signal clé. Commentaires = levier visibilité (apparaissent dans feed followers). Stratégie : 3-5 posts/sem, hooks forts, carousels, storytelling + data, 10-15 min commentaires avant/après post.
  Pourquoi ça compte : ajuster stratégie LinkedIn Romain (Flip) — focus hooks + dwell time, routine commentaires obligatoire.
  Application : skill linkedin-content-creator (rythme 3-5/sem + dwell time), skill hook-generator (hooks forts <10 mots), skill personal-branding (routine 10-15 min commentaires avant/après chaque post).

---

## 📚 Mise à jour — Veille du 22 mai 2026 (intégrée 2026-05-25)

**Date d'intégration** : 2026-05-25
**16 entrées datées** sur 16 propositions cochées

### Tech & écosystème Claude

- **addyosmani/agent-skills — Addy Osmani (ex-Google Chrome) publie lib skills "drop-in"** (2026-05-25, source veille — github.com/addyosmani/agent-skills)
  Contexte : 5 des 20 repos GitHub les plus en croissance contiennent "skills". Confirme la vague.
  Pourquoi ça compte : valide notre architecture skill-first et donne une lib à benchmarker côte à côte.
  Application : skill orchestrator (audit comparatif vs notre stack + cherry-pick).

- **muratcankoylan/Agent-Skills-for-Context-Engineering — context engineering = compétence 2026** (2026-05-25, source veille — github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)
  Contexte : skills dédiés context engineering et multi-agents — comment ne pas "noyer" un agent IA sous trop d'infos.
  Pourquoi ça compte : context engineering = compétence différenciante 2026 pour livrer agents IA chez PME (Flip).
  Application : skill architecture-decision-advisor (intégrer comme dimension de choix d'archi), skill claude-api-expert (patterns context engineering).

- **anthropics/financial-services — repo Anthropic verticalisé secteur financier, +12000 stars/sem** (2026-05-25, source veille — github.com/anthropics/financial-services)
  Contexte : repo officiel Anthropic verticalisé secteur financier, +12000 stars en une semaine.
  Pourquoi ça compte : modèle directement transposable pour Flip — **packs sectoriels** (cabinet comptable, agence immo, artisan BTP) plutôt qu'offre générique. Confirme la stratégie verticale.
  Application : skill flip-diagnostic-pme (templates sectoriels), skill competitor-analysis (Anthropic comme acteur direct sur les verticales).

- **Karpathy CLAUDE.md = 70 lignes, 110k stars en 3 mois — densité > volume** (2026-05-25, source veille — github karpathy CLAUDE.md)
  Contexte : fichier CLAUDE.md de 70 lignes (distillation Forrest Chang depuis Karpathy), 110k stars en 3 mois, #1 GitHub Trending pendant 28 jours.
  Pourquoi ça compte : la valeur n'est pas dans le volume mais la densité d'instructions — auditer notre CLAUDE.md global ligne par ligne.
  Application : skill code-review-nextjs (référence pour densité d'instructions), skill nextjs-patterns (compresser instructions à l'os).

- **🚨 Claude for Small Business — MENACE CONCURRENTIELLE FRONTALE pour Flip** (2026-05-25, source veille — releasebot.io/updates/anthropic/claude)
  Contexte : Anthropic lance "Claude for Small Business" — branché QuickBooks, PayPal, HubSpot, Canva, Docusign, Google Workspace, M365 avec workflows prêts pour paie/facturation/ventes/marketing/clôture.
  Pourquoi ça compte : **Flip ne vend plus "l'accès à l'IA" mais "le diagnostic, l'orchestration, l'accompagnement humain"**. Hook : "on installe et on pilote Claude for Business pour vous".
  Application : skill flip-diagnostic-pme (pivot positionnement), skill flip-proposition-commerciale (refondre l'offre vs Claude SMB), skill competitor-analysis (Anthropic comme concurrent direct sur la cible PME).

- **Multiagent orchestration Managed Agents — lead agent + spécialistes parallèles sur filesystem partagé** (2026-05-25, source veille — 9to5mac.com)
  Contexte : agent "lead" découpe la tâche et délègue à des spécialistes (modèle+prompt+tools dédiés) qui travaillent en parallèle sur filesystem partagé.
  Pourquoi ça compte : aligner notre orchestrator + skills head-of-* sur la terminologie et architecture officielle Anthropic.
  Application : skill orchestrator (vocabulaire Multiagent officiel + filesystem partagé comme pattern).

- **MCP tunnels + self-hosted sandboxes — réponse anti-objection "données privées"** (2026-05-25, source veille — 9to5mac.com)
  Contexte : MCP tunnels permettent à un agent d'atteindre des serveurs MCP dans un réseau privé sans les exposer sur Internet.
  Pourquoi ça compte : argument anti-objection #1 PME ("je ne veux pas que mes données sortent du réseau interne") — réponse de réassurance directe.
  Application : skill flip-diagnostic-pme (anti-objection "données privées"), skill architecture-decision-advisor (option self-hosted sandbox + tunnel).

- **Cache diagnostics (beta) — `cache_miss_reason` pour debug facture API** (2026-05-25, source veille — docs.anthropic.com)
  Contexte : passer `diagnostics.previous_message_id` dans une requête Messages renvoie un `cache_miss_reason`.
  Pourquoi ça compte : débugger facture API qui grimpe quand le cache ne prend pas — outil essentiel d'observabilité coûts.
  Application : skill claude-api-expert (debug cache hit/miss).

### Flip Agency — Marché PME

- **58% des TPE-PME utilisent déjà l'IA (Baromètre BPI/Rexecode T2 2026)** (2026-05-25, source veille — finyear.com)
  Contexte : 58% TPE-PME utilisent IA. France Num : 34% PME (vs 13% un an avant). Évolution rapide.
  Pourquoi ça compte : **pivot du pitch Flip** — le prospect n'a plus besoin qu'on lui dise "l'IA c'est important" mais "vous l'utilisez de façon désordonnée, voici comment en tirer du ROI".
  Application : skill flip-diagnostic-pme (pivot accroche), skill sales-script (nouveau script discovery).

- **Frein n°1 PME = "je sais pas quoi automatiser" = value prop directe Flip (54% des dirigeants)** (2026-05-25, source veille — lelab.bpifrance.fr)
  Contexte : 54% des dirigeants citent "difficulté à identifier cas d'usage pertinents" comme frein principal. 88% des bloqués invoquent manque d'expertise.
  Pourquoi ça compte : accroche directe sales — "54% des dirigeants ne savent pas par où commencer — notre diagnostic transforme ça en roadmap concrète en 2 semaines".
  Application : skill flip-proposition-commerciale (slide problème), skill sales-script (accroche cold), skill flip-diagnostic-pme (positionnement).

- **Diagnostic IA BPI cofinance 50% pour PME <250 salariés — destruction objection prix** (2026-05-25, source veille — koino.fr)
  Contexte : BPI France cofinance 50% un Diagnostic IA pour PME <250 salariés. France Num jusqu'à 50% sur transformation numérique.
  Pourquoi ça compte : "votre diagnostic à 2500€ peut être cofinancé à 50% par BPI — reste à charge 1250€". Destruction de l'objection prix.
  Application : skill flip-proposition-commerciale (slide financement BPI), skill pricing-strategy-expert (positionnement vs cofinancement). **À vérifier : éligibilité exacte du diagnostic Flip avant de promettre.**

- **ROI médian IA documenté : +159,8% sur 24 mois (Baromètre IA & ROI 2022-2025, 200+ projets France)** (2026-05-25, source veille — denisatlan.fr/barometre-ia-pme)
  Contexte : Baromètre IA & ROI 2022-2025 (200+ projets France) — ROI médian 159,8%.
  Pourquoi ça compte : chiffre de réassurance section ROI propal + pitch deck investisseur, sourcé proprement.
  Application : skill flip-proposition-commerciale (slide ROI), skill pitch-deck (slide marché/proof points).

### Growth / Marketing

- **Meta Advantage+ Shopping seuil 25 conv/sem (baissé de 50 à 25)** (2026-05-25, source veille — dataslayer.ai)
  Contexte : seuil ASC baissé de 50 à 25 conversions/semaine.
  Pourquoi ça compte : Buddy (crowdfunding) et LPL peuvent enfin tester Advantage+ avec budget modeste.
  Application : skill ads-copy (tester ASC dès 25 conv/sem), skill growth-hacker (activer ASC sur projets B2C).

- **Meta disclosure IA obligatoire depuis mars 2026 sur toute pub contenant contenu IA** (2026-05-25, source veille — nicreated.com.au)
  Contexte : depuis mars 2026, Meta exige mention sur toute pub contenant contenu généré/modifié par IA.
  Pourquoi ça compte : checklist obligatoire en production de creatives — sinon campagnes rejetées.
  Application : skill ads-copy (ajouter disclosure IA en check-list de production creative Meta).

- **LinkedIn Authenticity Update — engagement-baiting pénalisé depuis mars 2026** (2026-05-25, source veille — connectsafely.ai)
  Contexte : LinkedIn pénalise les posts qui demandent explicitement de l'interaction ("commente X", "partage si..."). Curiosity-gap et contrarian = ×2,3 d'engagement. Accroches <10 mots = +40%. 65% des users décident d'ouvrir sur la 1ère ligne.
  Pourquoi ça compte : retirer tout call-to-engagement explicite des templates, prioriser curiosity-gap et contrarian, viser <10 mots sur l'accroche.
  Application : skill linkedin-content-creator (retirer CTAs engagement-baiting), skill hook-generator (cible <10 mots + curiosity-gap/contrarian).

- **Vertical 9:16 = 90% inventaire Meta — Stories/Reels fusionnés en safe zone unique** (2026-05-25, source veille — admove.ai)
  Contexte : Meta a fusionné Stories et Reels en safe zone unique, 90% inventaire pub est vertical.
  Pourquoi ça compte : toute creative Buddy + LPL doit être pensée 9:16 dès le départ, pas de recadrage.
  Application : skill reels-script (9:16 par défaut), skill ads-copy (brief créa = 9:16 native).

---

## 📚 Mise à jour — Veille du 25 mai 2026 (intégrée 2026-06-01)

**Date d'intégration** : 2026-06-01 (veille semaine du 25 mai 2026, produite en rattrapage le 01/06)
**19 entrées datées** sur 19 propositions cochées

### Tech & écosystème Claude

- **Claude Opus 4.8 (28 mai 2026) — fast mode 3x moins cher, prix inchangé, swap direct** (2026-06-01, source veille — anthropic.com/news/claude-opus-4-8)
  Contexte : nouveau modèle frontier 41 jours après 4.7. Coding agentique 64,3% → 69,2%, meilleure honnêteté (reconnaît quand il bloque). Prix inchangé (5$/M in, 25$/M out). Dispo API, Bedrock, Vertex, Foundry.
  Pourquoi ça compte : swap modèle sans surcoût, testable aujourd'hui. Le fast mode réduit la facture sur les tâches volumineuses (batch Flip, génération contenu en masse).
  Application : skill claude-api-expert (mettre à jour la matrice modèles + fast mode comme levier coût).

- **Dynamic Workflows (Claude Code) — orchestration jusqu'à 1000 sous-agents en parallèle** (2026-06-01, source veille — techcrunch.com)
  Contexte : Claude Code écrit un script JS qui pilote des sous-agents à grande échelle pour migrations/refactors massifs. Nécessite v2.1.154+. Research preview.
  Pourquoi ça compte : utile pour grosse migration/refactor de code. ⚠️ Anti-pattern coût : 1000 agents = facture qui grimpe vite, toujours cadrer le périmètre avant de lancer.
  Application : skill claude-api-expert (pattern orchestration scriptée + garde-fou coût), skill nextjs-patterns (migrations massives).

- **Managed Agents — webhooks signés + orchestration lead/spécialistes + sandboxes self-hosted AWS** (2026-06-01, source veille — 9to5mac.com)
  Contexte : le Claude Developer Platform ajoute des webhooks (events session/vault, signés whsec_), l'orchestration lead/spécialistes, et des sandboxes self-hosted sur AWS.
  Pourquoi ça compte : events push au lieu de polling pour le stack d'agents (admin marque blanche / Globber). Archi lead/specialist sans tout coder. Self-hosted AWS = anti-objection "données privées".
  Application : skill claude-api-expert (section webhooks + events), skill architecture-decision-advisor (option self-hosted sandbox AWS).

- **forrestchang/andrej-karpathy-skills (~109k stars) — CLAUDE.md de 65 lignes pour discipliner Claude Code** (2026-06-01, source veille — github.com/forrestchang/andrej-karpathy-skills)
  Contexte : fichier dérivé des observations de Karpathy sur les pièges LLM en coding (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven). À déposer à la racine d'un projet.
  Pourquoi ça compte : gain immédiat, 30 s à installer, zéro dépendance. Confirme (encore) la veille 22 mai : densité > volume sur les CLAUDE.md.
  Application : skill nextjs-patterns (cherry-pick les 4 principes), skill code-review-nextjs (référence densité d'instructions).

- **claude-mem v12.0.0 — mémoire persistante Claude Code entre sessions (déjà dans l'environnement)** (2026-06-01, source veille — github.com/topics/claude-code)
  Contexte : capture ce que Claude fait, compresse avec l'IA, réinjecte le contexte au démarrage suivant. Déjà présent dans l'environnement de Romain.
  Pourquoi ça compte : supprime le "réexpliquer le contexte" sur les projets multi-sessions (Buddy notamment).
  Application : outil (pas un skill) — action : vérifier la config claude-mem sur le projet Buddy.

### Flip Agency

- **Baromètre Bpifrance-Rexecode T2 2026 : 58% des TPE-PME utilisent déjà l'IA, frein n°1 = identifier les cas d'usage (54%)** (2026-06-01, source veille — finyear.com / presse.bpifrance.fr)
  Contexte : enquête 13-26 avril 2026, 4 073 dirigeants. 58% utilisent l'IA ; 54% citent l'incapacité à identifier les cas d'usage pertinents comme frein principal, devant temps et compétences.
  Pourquoi ça compte : confirme et rafraîchit le pivot du pitch Flip (cf veille 22 mai). L'accroche "on identifie VOS cas d'usage" est adossée au frein chiffré n°1.
  Application : skill flip-diagnostic-pme (accroche), skill expert-copywriter (hook landing/pitch sur le frein 54%).

- **IA Booster France 2030 : diagnostic IA financé à 80% (reste à charge 780–2 600 €)** (2026-06-01, source veille — francenum.gouv.fr)
  Contexte : diagnostic IA 3 900–13 000 € HT pris en charge à 80% via IA Booster. Diagnostic Data-IA = 10 j d'expert cofinancés à 40%. 16 régions, 300 M€ cumulables.
  Pourquoi ça compte : levier commercial direct — "diagnostic à partir de 780 € reste à charge". ⚠️ Action préalable : vérifier l'éligibilité de Flip comme prestataire référencé avant de promettre (même prudence que le cofinancement BPI 50% de la veille 22 mai).
  Application : skill flip-proposition-commerciale (slide financement), skill pricing-strategy-expert (positionnement vs cofinancement).

- **Benchmark prix agences IA France 2026 — "opéré + ROI" est devenu un standard, plus un différenciateur** (2026-06-01, source veille — koino.fr)
  Contexte : audit 1 500–5 000 €, POC 10–50 k€, déploiement 30–150 k€. Agent IA simple 3–8 k€, multicanal 10–25 k€ + 80–600 €/mois. Concurrents proches : Kokoro, Stema Partners, Support Flow ("livré, documenté, opéré").
  Pourquoi ça compte : caler la grille tarifaire Flip. Anti-pattern de positionnement : l'angle "opéré + ROI mesuré" est maintenant martelé par tous → ne plus le vendre comme différenciateur, chercher un angle vertical/sectoriel.
  Application : skill pricing-strategy-expert (grille + positionnement), skill competitor-analysis (fiches Kokoro/Stema/Support Flow).

### Buddy

- **Littlebird : wearable enfant sans écran + Amazon Sidewalk (1er tiers), modèle par abonnement** (2026-06-01, source veille — geekwire.com)
  Contexte : tracker enfant sans écran, tracking 2 miles sans forfait data via Amazon Sidewalk (réseau Echo/Ring) + BLE/Wi-Fi/GPS. ~1000 unités les premiers jours, 200k$ au lancement, Walmart en août. Abo 25$/mois, 250$/an, 375$/2 ans.
  Pourquoi ça compte : valide le positionnement "device dédié sans écran". Le modèle d'abonnement + réseau alternatif (vs dépendance eSIM pure) est à creuser pour la marge récurrente. Avantage Buddy en EU : eSIM fonctionne sans réseau communautaire propriétaire (Sidewalk inexistant en EU).
  Application : skill hardware-product (structure de marge récurrente), skill competitor-analysis (Littlebird en concurrent direct USA, monitorer expansion EU).

- **🚨 EU Toy Safety Regulation en vigueur (1er janv. 2026) — EN 18031-2 + Digital Product Passport** (2026-06-01, source veille — eurofins.com)
  Contexte : nouveau Règlement Jouets = conformité cyber + privacy. EN 18031-2 vise les équipements radio portables / jouets traitant des données perso. Un Digital Product Passport (DPP) remplacera la Déclaration de Conformité UE (application pleine 1er août 2030).
  Pourquoi ça compte : si Buddy est classé "jouet connecté", EN 18031-2 + DPP deviennent structurants. À clarifier avec le bureau de certif sous 30 j pour ne pas refaire un cycle DVT (même logique que EN71-3:2026, veille 8 mai).
  Application : skill hardware-product (checkpoint EN 18031-2 + DPP avant DVT→PVT), skill legal-review (conformité jouets connectés).

- **RED 3.3 — incident-reporting cybersécurité obligatoire au 11 septembre 2026** (2026-06-01, source veille — sgs.com)
  Contexte : exigences cyber du RED obligatoires depuis le 1er août 2025 ; le mécanisme de signalement d'incidents devient requis au 11 sept. 2026, le reste au 11 déc. 2027.
  Pourquoi ça compte : échéance proche — vérifier que le firmware/MQTT Buddy intègre un process de signalement d'incident.
  Application : skill hardware-product (checklist RED 3.3 incident-reporting).

- **AI Act — interdiction des pratiques IA manipulant les enfants pleinement applicable au 2 août 2026** (2026-06-01, source veille — digital-strategy.ec.europa.eu)
  Contexte : AI Act pleinement applicable au 2 août 2026. Interdiction des "jouets à commande vocale encourageant un comportement dangereux", obligation de labelliser le contenu généré par IA. Ajout mai 2026 : interdiction génération CSAM (applicable 2 déc. 2026).
  Pourquoi ça compte : confirme la deadline structurante (cf veille 24 avril). Si la messagerie audio Buddy passe par de l'IA (TTS, modération), prévoir labelling + garde-fous anti-manipulation avant le 2 août.
  Application : skill hardware-product (conformité AI Act audio), skill legal-review (labelling IA + anti-manipulation enfants).

### lePERMISLIBRE

- **🚨 Loi anti-fraude formation adoptée (~11-13 mai 2026) — entrée en vigueur dès le 1er juillet 2026** (2026-06-01, source veille — centre-inffo.fr)
  Contexte : obligation de se présenter aux examens sous peine de remboursement, publication obligatoire des taux de réussite, vérification d'identité forte + traçabilité numérique des présences, rétractation portée de 14 à 30 j, sanctions jusqu'à 500k€ et 5 ans.
  Pourquoi ça compte : action sous 30 j (deadline 1er juillet). Les taux de réussite publics deviennent une arme marketing si bons, un risque sinon. Conformité identité forte + traçabilité présences à mettre en place avant.
  Application : skill autoecole-expert (mise en conformité + exploitation marketing des taux), skill legal-review (check-list conformité loi anti-fraude).

- **Plafonnement CPF à 900 € pour les épreuves VL en vigueur depuis le 26 février 2026** (2026-06-01, source veille — digiformag.com)
  Contexte : loi de finances 2026 = plafond CPF de 900 € pour la prépa des épreuves théoriques/pratiques VL. Contrôles 2026-2027 ciblant éligibilité, publicité, sous-traitance. En Voiture Simone a mis en pause les nouveaux dossiers CPF.
  Pourquoi ça compte : packager une formule LPL pile sous le plafond 900 €. Le retrait/pause de concurrents = fenêtre de capture de parts de marché.
  Application : skill autoecole-expert (offre sous plafond + capture concurrents), skill pricing-strategy-expert (formule 900 €).

- **Réforme permis : CPF permis B réservé emploi + cofinancement 100 € pour salariés** (2026-06-01, source veille — ecf.asso.fr)
  Contexte : CPF permis B limité aux situations liées à l'emploi. Demandeurs d'emploi restent éligibles ; salariés uniquement avec cofinancement externe ≥ 100 €. Permis dématérialisé (France Identité) et permis à 17 ans opérationnels.
  Pourquoi ça compte : segmenter le tunnel CPF (demandeur d'emploi vs salarié) et créer un module cofinancement 100 € pour ne pas perdre la cible salariée.
  Application : skill autoecole-expert (segmentation tunnel CPF + module cofinancement).

### Growth / Marketing

- **Meta Ads : fenêtre d'audiences d'achat passée de 180 à 730 jours (18 mai 2026)** (2026-06-01, source veille — tryvizup.com)
  Contexte : appliqué automatiquement le 18 mai 2026 sauf opt-out. Plus gros levier de reciblage B2B élargi. Aussi : CAPI one-click gratuit dans Events Manager, assistant IA dans Ads Manager.
  Pourquoi ça compte : auditer les comptes clients Flip pour exploiter la fenêtre 730 j (cycles B2B longs = gain réel). Activer le CAPI one-click sur les comptes sans tracking serveur.
  Application : skill ads-copy (exploiter fenêtre 730 j + CAPI), skill growth-hacker (audit comptes clients).

- **Google AI Max sort de bêta + AI Brief (Gemini) — setup campagne en langage naturel** (2026-06-01, source veille — blog.google)
  Contexte : AI Max en disponibilité générale, s'étend au Shopping, intègre "AI Brief" (décrire son business en langage naturel pour piloter ciblage/messaging). Les DSA migrent vers AI Max.
  Pourquoi ça compte : tester AI Brief pour réduire le temps de setup — argument d'offre "campagnes Google pilotées par IA" parfaitement aligné Flip.
  Application : skill ads-copy (workflow AI Max + AI Brief), skill growth-hacker (argument d'offre Flip).

- **LinkedIn B2B 2026 : le "save" devient le signal roi, format saveable > opinion** (2026-06-01, source veille — blog.linkboost.co)
  Contexte : les saves sont le signal d'engagement n°1 pour la distribution. Sweet spot 3-4 posts/semaine à forte valeur, carrousels 2-3x plus d'engagement. 2 000 vues ciblées > 100 000 vues larges en leads qualifiés.
  Pourquoi ça compte : prolonge le pivot dwell-time (veilles 8 et 22 mai). Repenser le contenu LinkedIn Flip vers du "saveable" (frameworks, checklists IA pour PME en carrousel) plutôt que des posts d'opinion.
  Application : skill linkedin-content-creator (prioriser le saveable), skill hook-generator (hooks qui annoncent une valeur enregistrable).

- **GEO/AEO : se rendre citable par les LLM — nouvelle ligne d'offre Flip possible** (2026-06-01, source veille — scrunch.com)
  Contexte : émergence d'outils de suivi de visibilité dans ChatGPT/Perplexity/Gemini (Profound, Scrunch, HubSpot AEO). Les PME chercheront bientôt des prestataires via ces moteurs, pas Google.
  Pourquoi ça compte : double usage — (1) optimiser la présence Flip pour être citée par les LLM, (2) nouvelle ligne d'offre "visibilité IA" à vendre aux PME. Prolonge la veille 8 mai (AI Overviews -46,7% CTR organique).
  Application : skill seo-audit (volet AEO/citabilité LLM), skill seo-cluster-strategist (offre "visibilité IA" pour PME).
