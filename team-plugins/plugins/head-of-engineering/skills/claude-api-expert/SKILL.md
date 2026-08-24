---
name: claude-api-expert
description: Expert intégration Claude API (Anthropic) en production — setup TypeScript SDK, patterns avancés (streaming, tool use, prompt caching, batch API, vision), optimisation des coûts (choix Haiku/Sonnet/Opus, minimisation tokens, cache hit rate), patterns production (retry logic, timeouts, rate limiting client, observabilité). À utiliser pour intégrer Claude dans une app, optimiser les coûts d'API, débugger un appel qui plante, configurer le prompt caching, ou choisir entre les modèles. À utiliser même si l'utilisateur dit juste "j'utilise Claude API", "ma facture explose", "comment je stream une réponse".
---

# Claude API Integration Expert

## Rôle

Tu es un expert en **intégration de l'API Claude (Anthropic)** dans des applications production. Tu maîtrises les **patterns de prompting avancés** et l'**optimisation des coûts**.

Ton angle : **un appel Claude bien structuré coûte 10× moins** qu'un appel mal structuré. Caching, choix du modèle et minimisation des tokens sont les 3 leviers majeurs.

## Inputs nécessaires

- Le cas d'usage (chatbot, classification, extraction, génération, agent avec tools)
- Le volume estimé (requêtes / jour ou / mois)
- Le contexte d'exécution (Node, Edge, navigateur via proxy)
- Le besoin (latence, coût, qualité)
- Les outils ou intégrations nécessaires

## Livrable

### Setup de base (TypeScript SDK)

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // optionnel : retry, timeout, baseURL
});

const message = await client.messages.create({
  model: "claude-opus-4-8",  // ou claude-sonnet-5, claude-haiku-4-5-20251001
  max_tokens: 1024,
  system: "You are a helpful assistant.",
  messages: [
    { role: "user", content: "Hello" },
  ],
});
```

### Patterns avancés

**Streaming** — pour les réponses longues en temps réel
```typescript
const stream = await client.messages.stream({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "..." }],
});

for await (const chunk of stream) {
  if (chunk.type === "content_block_delta") {
    process.stdout.write(chunk.delta.text);
  }
}
```

**Tool use** — agents avec actions
```typescript
const message = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  tools: [{
    name: "get_weather",
    description: "Get current weather",
    input_schema: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
    },
  }],
  messages: [{ role: "user", content: "Quelle météo à Paris ?" }],
});
```

**Prompt caching** — pour réduire les coûts sur les longs prompts système
```typescript
const message = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "[Long system prompt, doc technique, etc.]",
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [...],
});
```

5 minutes de cache, 90% de réduction sur les tokens cached. Idéal pour les apps avec gros system prompts répétés.

**Batch API** — pour le traitement asynchrone en masse (jusqu'à 50% moins cher)
```typescript
const batch = await client.messages.batches.create({
  requests: [
    { custom_id: "1", params: { model: "claude-haiku-4-5-20251001", ... } },
    { custom_id: "2", params: { model: "claude-haiku-4-5-20251001", ... } },
  ],
});
```

**Vision** — analyse d'images
```typescript
const message = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "..." } },
      { type: "text", text: "Décris cette image" },
    ],
  }],
});
```

### Optimisation des coûts

> ⚠️ **Source de vérité des IDs et prix = skill `claude-api` officielle (dans l'env) + `models.md`.** Ne pas re-hardcoder les IDs de modèles ailleurs : ils re-périment à chaque sortie de modèle. En cas de doute, requêter la skill officielle plutôt que se fier à la table ci-dessous.

**Choisir le bon modèle (gamme actuelle, juillet 2026)**

| Modèle | ID | Usage type | Prix |
|---|---|---|---|
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Classification, extraction simple, scoring, ultra-rapide | le moins cher |
| **Sonnet 5** | `claude-sonnet-5` | Agentique par défaut (orchestration, tool-use, jobs récurrents), 1M contexte | 2$/10$ par MTok, devenu le prix standard (hausse du 01/09/2026 annulée, cf veille 21 août) |
| **Opus 4.8** | `claude-opus-4-8` | Cas lourds, raisonnement complexe, code production-critical (money/sécurité/RLS), 1M contexte | tier premium |
| **Fable 5** | `claude-fable-5` | Frontier long-horizon, SOTA quasi tous benchmarks | ~5× Opus (10$/50$ MTok), pas de ZDR |

**Minimiser les tokens**
- System prompt court et efficace > pavé verbeux
- `max_tokens` réaliste (pas 4096 par défaut si la réponse fait 200 tokens)
- Streaming pour libérer le contexte rapidement
- Compresser le contexte historique sur les conversations longues

**Prompt caching intelligemment**
- Cache le system prompt long (constant entre appels)
- Cache les longs documents de référence
- Surveille le `cache_read_input_tokens` vs `input_tokens`

**Monitoring**
- Log les usages par requête (`input_tokens`, `output_tokens`, `cache_*`)
- Alertes sur dépassement de budget
- Dashboard quotidien (coût par feature, par user)

### Patterns de production

- **Retry logic** : exponential backoff sur 429 / 503
- **Timeouts** : agressifs (30s max) pour éviter les requêtes zombies
- **Rate limiting client** : queue avec p-queue ou similar
- **Observabilité** : Sentry / Datadog avec traces, OpenTelemetry pour distributed tracing
- **Error handling** : codes 400 (input invalide) vs 5xx (transient) → stratégies différentes

### Cas d'usage Flip Agency

Pipeline type :
1. **Audio client** → Whisper (transcription)
2. **Transcription** → Claude (extraction structurée des informations)
3. **Données structurées** → Notion (création de la fiche client)
4. **Notion** → Claude (génération de la roadmap depuis la fiche)
5. **Roadmap** → PDF (livraison sous 24h)

Caching aggressif sur le system prompt "consultant senior Flip" répété sur chaque diagnostic.

## Format de sortie

Code TypeScript prêt à coller, blocs séparés par pattern (streaming / tool use / caching / batch), commentaires sur les choix de modèles, estimations de coûts pour chaque appel.

---

## 📚 Mise à jour — Veille du 3 mai 2026

**3 items intégrés** : Opus 4.7 GA, Managed Agents beta, Claude Context MCP

### Opus 4.7 — généralement disponible (16 avril 2026)

Nouveautés à exploiter en production :
- **`xhigh` effort level** : pour les tâches longues qui demandent réflexion soutenue (PRD complet, plan GTM 90j, pack levée). À privilégier sur les Heads of qui produisent des livrables structurés en 1 shot.
- **Task budgets** : permet de plafonner explicitement le compute par tâche (évite les fugues de coûts sur les jobs auto).
- **Meilleure instruction following** : moins besoin de répéter les contraintes en chain-of-thought.

**Recommandation modèle par cas d'usage** :

| Cas | Modèle | Pourquoi |
|---|---|---|
| Livrable structuré long (PRD, pitch deck) | Opus 4.8 + `xhigh` | qualité > coût |
| Génération roadmap PME (Flip) | Opus 4.8 standard | équilibre qualité/coût |
| Tool-use orchestration, agents H24 | Sonnet 5 | latence + coût |
| Classification, extraction, scoring | Haiku 4.5 | volume + coût |

### Managed Agents — public beta (header `managed-agents-2026-04-01`)

Harness managé par Anthropic avec sandboxing + tools intégrés, sans gestion d'infra côté client. Pour Flip, c'est un nouveau modèle d'offre PME :
- L'agent tourne H24 sur un process (relances, pipeline, suivi commissions) sans que la PME gère VM/queues/storage.
- Réduit le ticket d'entrée pour les PME non-tech.
- À considérer pour un pricing tier "Flip H24" à mi-chemin entre diagnostic ponctuel et abonnement custom.

### Claude Context (MCP Zilliz) — pour grosses codebases

Quand un Head of bosse sur un repo > 200K LOC (Flip app, Buddy app), la fenêtre contexte explose. Claude Context (`github.com/zilliztech/claude-context`) expose le codebase entier via vector search sémantique, peu importe la taille.

**Quand le câbler** : sur un repo > 200K LOC, ou dès qu'on perd des références cross-fichiers en review.
**MCP recommandé par défaut** dans `head-of-engineering` pour les missions Flip sur codebases existants.

---

## 📚 Apprentissages intégrés — Veille 8 mai 2026

### Rate limits doublés (Pro/Max/Team/Enterprise) — paralléliser plus agressivement

Source : anthropic.com/news/higher-limits-spacex. Accord SpaceX = +300 MW (220k+ GPUs NVIDIA).

- Rate limits **doublés** sur Pro/Max/Team/Enterprise (mai 2026).
- Fin de la réduction heures de pointe sur Pro/Max.
- Conséquence : on peut désormais lancer `head-of-content` sur **10 sujets simultanés** sans throttling.

→ Mettre à jour les scripts batch (Flip diagnostics, content repurposer, génération LinkedIn en masse) pour exploiter la nouvelle capacité.

### Managed Agents (public beta, 6 mai 2026)

Header `managed-agents-2026-04-01` débloque :

- **Outcomes** : rubrique d'évaluation par 2e Claude, agent itère jusqu'à passer.
- **Multiagent** : lead agent délègue à des spécialistes en parallèle sur filesystem partagé.
- **Dreaming** (research preview) : l'agent relit ses sessions et met à jour sa mémoire (×6 completion rates rapportés par Harvey).

**Setup minimal** (TypeScript SDK) :
```ts
const response = await anthropic.messages.create({
  model: "claude-opus-4-8",
  // ...
}, {
  headers: { "anthropic-beta": "managed-agents-2026-04-01" }
});
```

### Webhooks Managed Agents + refresh OAuth automatique

- Webhooks pour events de session/vault, filtres avancés (status, type, created_at).
- `mcp_oauth` credentials se refresh tout seul en background.
- Plus besoin de polling.

À intégrer dans le pattern event-driven pour l'admin marque blanche SaaS (Globber).

### Claude Code 2.1.132 + 2.1.136 — features dev qui changent les patterns

- `--plugin-url` charge un plugin depuis une URL d'archive (plus besoin de cloner).
- **PostToolUse hooks réécrivent l'output de n'importe quel tool** via `hookSpecificOutput.updatedToolOutput` (avant : MCP-only).
- `hard_deny` rules en auto mode bloquent inconditionnellement (sécurité settings).
- Hooks reçoivent `$CLAUDE_EFFORT` (routing par profondeur de réflexion).
- Fix : MCP servers de `.mcp.json` qui disparaissaient après `/clear` réparé.

Action immédiate : ajouter `hard_deny` sur `Write(.env)` + `Write(*credentials*)` dans `settings.json` global.

---

## 🔄 Veille intégrée (MAJ 2026-06-15)

### Claude Fable 5 (`claude-fable-5`) dispo API depuis le 9 juin 2026

Modèle le plus capable au-dessus d'Opus 4.8. Prix API 10$/M input, 50$/M output (~5x Opus 4.8) : à réserver aux tâches à forte valeur. Pièges en prod : contexte 1M par défaut, adaptive thinking forcé (désactiver le thinking renvoie une erreur 400), la réponse peut renvoyer `stop_reason: "refusal"` (prévoir le param `fallbacks`), et pas de zero-data-retention (rétention 30j obligatoire, donc bloquant pour client sensible aux données). Source : anthropic.com/news/claude-fable-5-mythos-5 + platform.claude.com/docs/en/release-notes/overview.

### Advanced tool use (header beta `advanced-tool-use`)

Tool Search (`defer_loading`) charge les définitions d'outils à la demande, jusqu'à -85% de tokens quand elles dépassent 10K. Programmatic Tool Calling laisse Claude orchestrer via Python en sandbox, -37% sur recherches complexes. Idéal pour agents multi-outils/multi-MCP. Réserve : support documenté sur Sonnet 4.5, à revérifier pour Opus 4.8/Fable 5 avant prod (à confirmer). Source : anthropic.com/engineering/advanced-tool-use.

### Structured Outputs (constrained decoding)

`output_format` force du JSON valide, `strict: true` garantit les paramètres d'outils. Remplace le bricolage "tool-call qui simule du JSON" + retry dans les pipelines d'extraction. Réserve : support documenté Sonnet 4.5/Opus 4.1, à confirmer pour les modèles cibles. Source : platform.claude.com/docs/en/build-with-claude/structured-outputs.

### Cache diagnostics (beta)

Passer `diagnostics.previous_message_id` renvoie un `cache_miss_reason` qui indique où le préfixe de cache a divergé. À coupler aux mid-conversation system messages qui préservent les hits de cache. Levier de coût direct sur agents longs. Source : platform.claude.com/docs/en/release-notes/overview.

## 📚 Apprentissage — Veille 19 juin 2026

- **🚀 Claude Fable 5 + Mythos 5 — nouveau modèle frontier (9 juin 2026)** (2026-06-22, veille 19 juin) — Fable 5 (classe Mythos) = SOTA quasi tous benchmarks, **1M tokens contexte par défaut**, 128k output, adaptive thinking à niveaux d'effort (low/medium/high/xhigh), bien plus fiable pour piloter des subagents en parallèle. ⚠️ requêtes pluri-minutes en xhigh → adapter timeouts/streaming/progress côté client. Mettre à jour la table des modèles + le routing coût (Fable 5 pour long-horizon/agentique, Haiku/Sonnet pour le routinier).
- **Opus 4.8 passe à 1M contexte par défaut (API, Bedrock, Vertex)** (2026-06-22).

## 📚 Apprentissage — Veille 26 juin 2026 (intégré 2026-06-29)

### Opus 4.8 — fiabilité du code généré ×4 vs 4.7 → heuristique de choix de modèle

Opus 4.8 est **4× moins susceptible que 4.7 de laisser passer un défaut dans le code qu'il génère** (accent honnêteté/fiabilité du modèle). Sources : anthropic.com/news + releasebot.io.

Implication directe pour le choix de modèle sur du code :
- **Moins de review humaine nécessaire** sur le code produit par Opus 4.8 (réduit le besoin, ne le supprime pas).
- **Privilégier Opus 4.8 pour le code production-critical** (pricing engine, commissions, invoicing, webhooks signés) où un défaut qui passe coûte cher.

| Cas | Modèle | Pourquoi |
|---|---|---|
| Code production-critical (money, sécurité, RLS) | Opus 4.8 | fiabilité ×4 sur les défauts laissés passer |
| Génération de code lourde / agents multi-étapes | Opus 4.8 | qualité + moins de re-review |
| Code routinier, scaffolding, classification | Sonnet / Haiku | coût + latence |

## 📚 Apprentissage — Veille 6 juillet 2026

### Claude Sonnet 5 (sorti 30 juin 2026) — le Sonnet le plus agentique

`claude-sonnet-5`. SOTA agentique de la gamme Sonnet, **1M tokens de contexte**, **128k output**. **Promo de lancement : 2$/M input, 10$/M output jusqu'au 31 août 2026** (à mettre à jour dans la matrice modèles/prix ci-dessous). Action : **benchmarker Sonnet 5 vs Opus 4.8 avant la fin de la promo** (31 août) sur les workflows agentiques Flip (orchestration, tool-use, jobs Inngest), le rapport qualité/prix peut basculer une grande partie du volume vers Sonnet 5. Source : anthropic.com/news.

**Matrice modèle mise à jour (juillet 2026)** :

| Cas | Modèle | Pourquoi |
|---|---|---|
| Majorité des workflows agentiques (orchestration, tool-use, jobs récurrents) | **Sonnet 5** | le plus agentique, 1M ctx, promo 2$/10$ jusqu'au 31 août |
| Code production-critical (money, sécurité, RLS) | Opus 4.8 | fiabilité ×4 sur les défauts laissés passer |
| Livrable long-horizon frontier | Fable 5 | SOTA mais ~5× le prix + pas de ZDR |
| Classification, extraction, scoring | Haiku 4.5 | volume + coût |

### Contrôle des modèles côté Enterprise (1er juillet 2026) — levier de gouvernance des coûts

Les admins Enterprise peuvent désormais **choisir les modèles autorisés + les niveaux d'effort par utilisateur**. Ce n'est plus qu'une décision technique, c'est un **levier de gouvernance des coûts** : réserver Opus (et les efforts `xhigh`) aux profils/usages qui le justifient, imposer Sonnet 5 par défaut au reste. À traduire côté Flip en **politique de modèle par rôle** (cf skill maintenance) : qui a le droit à quoi, pour éviter la fugue de coûts sur les jobs auto. Source : anthropic.com/news.

## 📚 Apprentissage — Veille 10 juillet 2026

### Endpoint API `/v1/skills` — les Agent Skills s'invoquent aussi par API

Les **Agent Skills** ne vivent pas que dans l'app Claude Code : Anthropic expose un endpoint **`/v1/skills`** qui permet de les enregistrer et de les invoquer directement via l'API (même logique que ce qui a été fait pour MCP : ouvrir un mécanisme interne à l'API). Une skill = un bundle de contexte + instructions + scripts, chargé à la demande côté API.

**Implication Flip (directe)** : on peut **exposer nos skills aux systèmes clients déployés** (Next.js + Claude API), pas seulement en session Claude Code. Un système client peut charger une skill Flip (ex : procédure métier, prompt diag, format de livrable) au runtime via l'API, sans dupliquer la logique dans le code applicatif. À évaluer pour packager de la logique réutilisable côté produits livrés (au lieu de la réécrire en dur dans chaque app). Source : medium.com/the-context-layer.

## 📚 Apprentissage — Veilles 31 juillet et 21 août 2026

### Skills API, Files API et computer use passés en GA (19-20 août 2026) : la beta évoquée le 10 juillet est terminée

- **Skills API (`/v1/skills`) en disponibilité générale** : plus de header beta `skills-2025-10-02`. On uploade un dossier de skill (instructions + scripts + templates), versionné côté Anthropic, chargé à la demande dans le sandbox Claude. Un cockpit client peut appeler une skill Flip directement, sans hébergement côté agence : facturable dans l'abonnement.
- **Files API en GA** : upload une fois, référence par ID, récupération des fichiers produits par l'agent. Expiration auto, rate limits x5, **1 To de stockage par organisation**. Cas Flip direct : GoExport (2 Excel SharePoint), Veditex (extraction Taonix), évite de repasser le contenu à chaque tour (tokens payés en double sinon).
- **Computer use en GA + nouveau "browser use tool"** : lit la structure de la page en plus de la capture d'écran (cible un champ/bouton nommé, pas une position à l'écran), enchaîne plusieurs actions par tour. Cas client cité : traitement de dossiers 32 min → 13 min, -30% de coût. Éligible HIPAA sous BAA. **Rouvre le dossier legacy/Sage** classé "opportuniste, bloqué par l'accès" (cf mémoire flip-cockpit-positioning) : si le logiciel a une interface web, plus besoin d'API. Candidat de test : Taonix chez Veditex.

Source : claude.com/blog/computer-use-skills-api-files-api.

### Endpoints dépréciés et dates de coupure (à tenir à jour)

- **Workbench legacy + endpoints `generate_prompt` / `improve_prompt` / `templatize_prompt`** : coupés le **17/08/2026**. Prompts, variables et evals du legacy non repris dans le nouveau Workbench, export manuel nécessaire avant la coupure. Source : docs.anthropic.com/en/release-notes/api.

### Sonnet 5 : le prix promo devient le prix standard

La hausse prévue au 01/09/2026 est annulée, 2$/10$ par MTok reste le prix (cf table des modèles ci-dessus). Impact direct sur la marge des abonnements cockpit, argument de réassurance client (le coût de la couche IA ne dérive pas).
