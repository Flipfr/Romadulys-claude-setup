# C-suite délégable : les 21 Head of en sous-agents

> Design validé le 2026-07-10 (Romain). Repo foyer : `team-plugins`. Ne concerne PAS la plateforme Flip commerciale.

## Objectif

Transformer les 21 plugins `head-of-*` (aujourd'hui des paquets de skills que le Claude principal applique lui-même) en un **comité de direction délégable** : chaque Head of devient un sous-agent qu'on dispatche, qui réfléchit dans son propre contexte et rend une reco. Un orchestrateur (boucle principale) choisit les bons Head of, les lance en parallèle, et ne passe à l'exécution qu'avec le feu vert de Romain.

## Le modèle mental : têtes + mains + charnière

Le système repose sur une séparation nette de trois couches, dont deux existent déjà :

- **Les têtes (nouveau)** : 21 agents `head-of-*`, en **lecture seule**. Ils analysent et conseillent. Zéro capacité de modification.
- **Les mains (existant)** : les agents `flip-builder`, `flip-sweeper`, `flip-maintainer`, `flip-prototyper`, `flip-grower`, `flip-fleet`. Ils exécutent (écrivent du code, modifient des fichiers).
- **La charnière (upgrade)** : le skill `orchestrator`. Il route les demandes vers les têtes, synthétise, et ne mobilise une main qu'après avoir demandé à Romain.

Insight clé : Romain a déjà bâti la couche exécution (`flip-*`). Ce projet ajoute la couche conseil au-dessus, et relie les deux.

## Décisions actées (brainstorming 2026-07-10)

| Décision | Choix | Raison |
|---|---|---|
| Périmètre | Les 21 Head of, 1:1 avec les plugins | Couverture totale ; le coût de maintenance est neutralisé par la génération auto |
| Rôle par défaut | Lecture seule | Garanti par les outils de l'agent, pas par une promesse |
| Exécution | Déléguée aux `flip-*`, sur validation | L'orchestrateur pose la question à chaque fois + vérifie l'absence de cannibalisation |
| Orchestration | Option C : skill au quotidien + Workflow en escalade | La règle « demande à chaque fois » impose de garder l'orchestrateur dans la boucle principale (seul endroit qui peut s'arrêter pour demander) |
| Emplacement des agents | `.claude/agents/` (global) | Un comité de direction doit être disponible dans toutes les sessions et projets |
| Workflow salve-comex | Phase 2 (différé) | On valide le cœur en usage réel avant d'ajouter la puissance de fan-out |

Option B (méta-agent « Chief of Staff » autonome) écartée : un sous-agent en tâche de fond ne peut pas s'arrêter proprement pour demander une validation, ce qui casse la règle d'exécution.

## Brique 1 : le roster (21 agents lecture seule)

### Forme d'un agent
Fichier `C:/Users/rdura/.claude/agents/head-of-<domaine>.md`, frontmatter :

```yaml
---
name: head-of-sales
description: <reprise du plugin.json + "À dispatcher pour un livrable conseil (lecture seule)">
tools: Read, Grep, Glob, WebSearch, WebFetch, Skill
model: opus
---
```

- **Outils volontairement limités à `Read, Grep, Glob, WebSearch, WebFetch, Skill`.** Pas d'Edit, pas de Write, pas de Bash. L'agent est physiquement incapable de modifier le système. La « lecture seule de base » est garantie par construction.
- **Corps du prompt** = la persona + le déroulé par phases repris du `commands/<domaine>.md` du plugin (ex : Head of Sales → brief GTM → `competitor-analysis` → `sales-script` → `email-campaign` → `linkedin-content-creator` → `partnership-outreach`), enveloppé d'un contrat commun (voir ci-dessous).
- **Livrable** : l'agent **retourne** son analyse comme message final (l'orchestrateur la récupère). Il ne pose aucun fichier lui-même. Si un fichier doit être matérialisé, c'est l'orchestrateur qui le fait, dans la boucle principale, après validation.

### Contrat commun injecté dans chaque agent
Bloc de texte identique en tête de chaque agent :

```
Tu es un membre du comité de direction (lecture seule). Ton rôle :
analyser et conseiller, jamais exécuter. Tu peux lire le repo, chercher
sur le web, et invoquer tes skills. Tu ne modifies rien.
Rends un livrable structuré, actionnable, en français, sans tirets cadratins.
Si l'exécution s'impose, dis-le explicitement dans ta reco (l'orchestrateur
demandera à Romain avant de mobiliser une main).
```

### Mapping des 21
1:1 avec les plugins `head-of-*` du marketplace : academy, consulting, content, controlling, customer-success, data, design, engineering, finance, growth, launch, legal, operations, people, pr, product, risk, sales, seo, supply, sustainability. Le générateur lit la liste depuis `team-plugins/.claude-plugin/marketplace.json` (source de vérité), jamais en dur.

## Brique 2 : l'orchestrateur (upgrade du skill `orchestrator`)

Le skill `orchestrator` (source : `C:/Users/rdura/.claude/skills/orchestrator/`, miroir dans `team-plugins/skills/orchestrator/`) évolue de « active le bon skill dans la conversation » vers « route vers les bons Head of et synthétise ».

### Boucle de routage
1. **Analyse** la demande de Romain, la mappe vers 1..n Head of (registre domaine → agent).
2. **Dispatch en parallèle**, en lecture seule, quand les Head of sont indépendants (ex : « prépare mon lancement produit » → Launch + Growth + Content + Design en une salve).
3. **Synthétise** les retours en une réponse unique et hiérarchisée.
4. **Gate d'exécution** : si un livrable exige d'écrire/modifier un projet réel, l'orchestrateur s'arrête, **pose la question à Romain** (AskUserQuestion), vérifie l'absence de cannibalisation, puis seulement dispatche la main adéquate (`flip-builder`, `flip-sweeper`...) en worktree isolé.

### Registre de routage
Petite table maintenue dans le skill : `domaine / mots-clés déclencheurs → agent head-of-*`. Permet un routage déterministe et lisible. Régénérable depuis le marketplace.

## Garde-fous

- **Lecture seule** : garantie par la liste d'outils des agents (aucun outil de mutation).
- **Gate d'exécution** : aucune exécution sans validation explicite de Romain, une question à chaque fois.
- **Anti-cannibalisation** : jamais deux mains sur les mêmes fichiers en parallèle. Avant tout dispatch d'exécution multiple, l'orchestrateur détecte le chevauchement de périmètre. En cas de chevauchement : worktree isolé par main, ou séquencement. Règle documentée dans le skill orchestrateur.

## Brique 3 : la salve Workflow (Phase 2, différé)

Pour les gros chantiers (« audit complet de Flip par tout le comex »), un Workflow déterministe qui fan-out N Head of en parallèle, vérifie, synthétise. Opt-in explicite de Romain. Non construit en Phase 1 : on valide d'abord le cœur en usage réel.

## Génération et maintenance

Script générateur (Node, dans `team-plugins/scripts/`) :

- **Entrée** : pour chaque `head-of-X`, lit `plugins/head-of-X/.claude-plugin/plugin.json` (nom + description), `plugins/head-of-X/commands/*.md` (persona + phases), `plugins/head-of-X/skills/` (bundle de skills).
- **Sortie** : `C:/Users/rdura/.claude/agents/head-of-X.md` (frontmatter + contrat commun + corps repris du command).
- **Idempotent** : régénère les 21 d'un coup. À relancer après chaque `plugin-syncer` (les agents suivent l'évolution des plugins, zéro maintenance à la main).

## Plan de build (Phase 1)

1. Écrire le **template** d'agent + le **script générateur** (`team-plugins/scripts/generate-head-of-agents.mjs`).
2. Générer **1 agent à la main / de contrôle** (`head-of-sales`) et le tester en dispatch réel pour valider la forme.
3. **Générer les 21** vers `.claude/agents/`.
4. **Upgrader le skill `orchestrator`** (routage vers Head of + gate d'exécution + anti-cannibalisation + registre).
5. Test bout en bout : une demande mono-Head of, une demande multi-Head of en parallèle, un cas qui déclenche le gate d'exécution.

## Hors périmètre (YAGNI)

- Pas de Workflow salve-comex en Phase 1 (Phase 2 si le besoin se confirme).
- Pas de méta-agent Chief of Staff autonome (contredit la règle d'exécution).
- Pas de mémoire persistante par Head of en Phase 1 (chaque dispatch repart propre ; à évaluer plus tard).
- Pas de modification des agents `flip-*` existants (ils sont les mains, réutilisés tels quels).
