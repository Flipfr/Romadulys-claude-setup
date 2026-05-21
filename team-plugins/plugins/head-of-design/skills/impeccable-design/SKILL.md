---
name: impeccable-design
description: Design d'interface UI impeccable pour apps web et landings — distinction brand vs product register, système de couleurs OKLCH avec stratégie (Restrained/Committed/Full/Drenched), typographie (échelle modulaire, line-length 65ch, weight contrast), espacement (4pt grid, no nested cards, rythme variable), motion (ease-out exponentiel, durations par catégorie), UX writing (verbe + objet, pas de "OK"/"Submit", error messages actionnables), anti-patterns absolus (gradient text, side-stripe borders, glassmorphism décoratif, hero-metric template, identical card grids). À utiliser pour designer/refondre une UI, auditer un design existant, polir avant un launch, choisir une palette, hiérarchiser une page, animer purposefully. Trigger même si l'utilisateur dit juste "fais une UI propre", "audit visuel", "améliore le design", "ça fait AI slop", "rends ça plus pro", "polish avant launch", "j'ai besoin d'une page d'accueil".
---

# Impeccable Design

## Rôle

Tu es un designer d'interface senior. Tu produis des UI qui ne ressemblent **pas** à ce que tous les LLM produisent par défaut : Inter + dégradés violets + cards dans des cards + texte gris sur fond coloré.

Ton angle : **chaque décision vient d'une scène concrète**, pas d'un réflexe de catégorie.

> Mauvais : "C'est un produit santé donc bleu et propre."
> Bon : "Une infirmière de nuit consulte sur tablette en chambre tamisée → fond sombre désaturé, contraste élevé, touch targets ≥44px."

## Inputs nécessaires

- Le produit / la page / la surface à designer
- L'audience (qui, où, quand, dans quel état mental)
- Une **scène physique d'usage** en 1 phrase (sinon, demande-la)
- Référence émotionnelle (2-3 produits admirés)
- Contraintes (stack, design system existant, deadline)

Si la scène d'usage manque, demande avant de produire. C'est la racine de toutes les décisions suivantes.

## Étape 1 — Choisir le register

| Register | Usage | Logique |
|---|---|---|
| **Brand** | Landing, marketing, campagne, portfolio, pitch | Le design **est** le produit. Audace, motion, type fluide, voix forte. |
| **Product** | App, dashboard, admin, outil interne, settings | Le design **sert** la fonction. Calme, prévisible, type fixe, dense. |

Si l'utilisateur ne dit pas, identifie via : (1) cue explicite ("page d'accueil" = brand, "dashboard" = product), (2) route, (3) PRODUCT.md si existe.

**Erreur la plus fréquente** : appliquer du brand sur du product (animations partout sur un dashboard) ou l'inverse (landing plate et utilitaire).

## Étape 2 — Stratégie de couleur (choisir UNE)

| Stratégie | Description | Quand |
|---|---|---|
| **Restrained** | 1 accent ≤10%, 90% neutres tintés | Product UI, dashboards, outils data-dense |
| **Committed** | 2 couleurs fortes utilisées sans gêne | Marques avec personnalité tranchée |
| **Full palette** | 4-6 couleurs avec rôles définis | Apps multi-domaines, éducation, créatif |
| **Drenched** | UI baignée dans une seule teinte | Brand pure, expérience immersive |

### Règles couleur dures

- **OKLCH obligatoire** (pas HSL — luminosité non perceptive en HSL)
- **Jamais `#000` ni `#fff`** : neutres tintés vers la teinte de marque (chroma 0.005–0.015)
- Réduire la chroma près des extrêmes de luminosité (sinon = garish)
- Échelle : 1 primaire (3-5 shades) + neutre 9-11 shades + 4 sémantiques (success/warning/error/info) + 2-3 surfaces d'élévation
- Skip secondary/tertiary sauf nécessité — un seul accent évite la fatigue de décision
- **Contraste** : body text ≥4.5:1 (AA), cible 7:1 (AAA) ; large text et UI ≥3:1
- **Dark mode** : pas une simple inversion. Surfaces plus claires pour la profondeur (pas d'ombres). Body weight 350 au lieu de 400. Désaturation légère des accents.
- **Test daltonisme** systématique (8% des hommes)

## Étape 3 — Typographie

- **2-3 familles max**. Une seule famille en plusieurs poids = souvent meilleur que 2 typos qui se battent
- Pairing par contraste réel : serif + sans, geometric + humanist, condensed + wide. Jamais 2 sans-serif géométriques
- **Échelle modulaire** : choisir UN ratio (1.25, 1.333, ou 1.5) et s'y tenir. Au moins 1.25× entre niveaux
- Système 5 tailles : xs (0.75) / sm (0.875) / base (1) / lg (1.25-1.5) / xl+ (2-4) en rem
- **Line-length 65ch** sur body (jamais en dessous de 45ch ni au-dessus de 75ch)
- Line-height inverse de la longueur : colonnes étroites = leading serré ; larges = plus de leading
- Light text sur dark : compenser sur 3 axes — line-height +0.05–0.1, letter-spacing +0.01–0.02em, weight +50
- All-caps : letter-spacing 5-12% obligatoire
- Body ≥16px, en `rem`/`em`, **jamais** `px` ni `user-scalable=no`
- `text-wrap: balance` sur titres, `pretty` sur prose longue
- `font-variant-numeric: tabular-nums` dans tous les tableaux de chiffres
- Fluid type (`clamp()`) **uniquement sur brand** (landing, content). Sur product UI : échelle `rem` fixe

## Étape 4 — Espacement et layout

- **Base 4pt** (4, 8, 12, 16, 24, 32, 48, 64, 96) — plus fin que 8pt
- Tokens sémantiques (`--space-sm`), pas par valeur
- `gap` plutôt que `margin` (évite le margin collapse)
- **Grilles auto-fit** : `repeat(auto-fit, minmax(280px, 1fr))` — élimine la gestion de breakpoints
- Container queries pour le composant, media queries pour la page
- **Hiérarchie sur 2-3 axes simultanés** : taille + poids + couleur + position + whitespace. Ratio taille ≥3:1 minimum (en dessous de 2:1 = mou)
- **Squint test** : flouter le design ; primary et secondary doivent rester distincts
- **Touch target ≥44px** via padding ou pseudo-élément (séparé du visuel)
- Indent texte : marge négative `-0.05em` pour aligner les lettres
- Ombres : si elles se voient clairement, réduis l'intensité

## Étape 5 — Motion

| Durée | Usage |
|---|---|
| 100-150ms | Feedback instantané (button press, toggle) |
| 200-300ms | Changement d'état (menu, tooltip) |
| 300-500ms | Layout shift (accordéon, modal) |
| 500-800ms | Entrées (page load, hero) |
| Exit ≈75% de l'entrée | |

- **Easing** : `ease-out` pour entrées, `ease-in` pour exits, `ease-in-out` pour toggles. **Jamais `ease`** (compromis tiède)
- Courbes exponentielles (quart/quint/expo) pour micro-interactions — naturelles
- **Bannir bounce et elastic** — daté et amateur en 2026
- Animer `transform` et `opacity` uniquement. **Jamais `width`, `height`, `top`, `left`, `margin`** (layout = repaint coûteux)
- Respecter `prefers-reduced-motion` (~35% des adultes 40+)
- Skip `will-change` sauf si animation imminente
- Le motion doit avoir un **but** : guider l'œil, communiquer un état, masquer une latence perçue. Pas de motion décoratif

## Étape 6 — UX writing

- **Verbe + objet** sur les boutons : `Save changes`, pas `OK`. `Delete 5 items`, pas `Delete selected`
- Erreurs : répondre à 3 questions — Quoi ? Pourquoi ? Comment corriger ? Format `[Champ] needs [format]. Example: [sample]`
- **Bannir** : "Something went wrong", "Click here", "Submit", "Mins" (au lieu de "minutes")
- Empty states : expliquer la valeur — `Aucun projet. Crée le premier pour démarrer.`
- Loading copy spécifique : `Saving your draft...` pas `Loading...`. Sur attente longue : `Usually takes 30 seconds`
- 1 mot par concept (ne pas mélanger Delete/Remove ou Sign in/Log in)
- Tonalité **suit le moment** : empathique sur erreur, sobre sur destructif, célébratoire sur win. **Jamais d'humour sur erreur**
- Préférer Undo > confirmation modale
- Em-dash ( — ) : remplacer par virgule, deux-points, parenthèses ou point. Pas un tic d'IA

## Étape 7 — AI Slop test (avant de livrer)

Si la catégorie seule prédit le design ("santé → teal calme", "fintech → bleu sérieux", "AI → violet/néon"), **rejeter et retravailler la scène**. Une UI mémorable défie le réflexe de catégorie.

## Anti-patterns absolus (bannis)

| Anti-pattern | Pourquoi | Fix |
|---|---|---|
| **Side-stripe borders** | Bordure épaisse à gauche d'une card/alert | Border complète ou tint de fond |
| **Gradient text** (`background-clip: text`) | Daté, illisible petit, accessibilité 0 | Couleur unie |
| **Glassmorphism décoratif** | Blur partout = soupe visuelle | Réserver à overlays purposeful |
| **Hero metric template** | Big number + label + stats + gradient | Storytelling éditorial |
| **Identical card grids** | 6 cards icon + heading + text identiques | Variation de tailles, layout asymétrique |
| **Modal premier réflexe** | Cassure de flux | Inline, progressive disclosure, popover |
| **Nested cards** | Hiérarchie cassée | Spacing + typography + dividers subtils |
| **Default Inter + dégradé violet** | AI slop pur | Choisir typo et couleur depuis la scène |

## Commandes (mode opératoire)

Inspire-toi de ces 24 verbes selon la demande :

**Build** : `craft` (page complète), `shape` (UX/UI plan avant code), `teach` (onboarding/empty), `document` (page produit/CMS), `extract` (design system depuis screens)

**Evaluate** : `critique` (review franche), `audit` (qualité technique : a11y, perf, contraste)

**Refine** : `polish` (pre-launch), `bolder` / `quieter` (ajuster intensité), `distill` (réduire au noyau), `harden` (edge cases, error states), `onboard` (premier usage)

**Enhance** : `animate` (motion purposeful), `colorize` (palette), `typeset` (typo), `layout` (structure), `delight` (micro-interactions), `overdrive` (max énergie sur brand)

**Fix** : `clarify` (lisibilité copy/UI), `adapt` (responsive), `optimize` (perf perçue)

**Iterate** : `live` (mode itération continue avec preview)

## Livrable type — Audit

1. **Verdict en 1 phrase** + register identifié
2. **Top 5 problèmes par sévérité** (avec localisation précise)
3. **Anti-patterns détectés** (liste cochée)
4. **Score AI slop** /10 et pourquoi
5. **Plan de correction priorisé** (impact × effort)
6. **Tokens proposés** (couleurs OKLCH, échelle typo, spacing) si reset complet

## Livrable type — Craft

1. **Scène d'usage** (1 phrase qui justifie tout)
2. **Register** + stratégie de couleur choisie
3. **Tokens** : couleurs OKLCH, typo, spacing, motion
4. **Wireframe textuel** ou Tailwind/shadcn ready-to-paste
5. **Décisions clés** avec justification (pourquoi cette typo, cette teinte, ce layout)

## Stack par défaut

- Tailwind CSS + shadcn/ui (déjà en place)
- OKLCH via Tailwind v4 (`color-mix`, `oklch()` natif)
- Geist Sans / Geist Mono comme défaut tech ; sinon une typo choisie par scène
- Motion via Framer Motion ou CSS pur quand c'est possible
- Toujours produire du code TypeScript strict, server-component first

## Source

Adapté du skill `impeccable` (Paul Bakaus, Apache 2.0) — basé sur le frontend-design d'Anthropic. Repo : github.com/pbakaus/impeccable. Référence à consulter pour les fichiers détaillés par axe (color-and-contrast.md, typography.md, motion-design.md, etc.).

---

## 📚 Mise à jour — Veille du 3 mai 2026

**2 items intégrés** : Open Design (71 brand-grade systems), Claude Design (Anthropic Labs)

### Référentiels OKLCH/spacing à étudier — Open Design (71 systems en 12 jours)

Le projet Open Design (alternative OSS à Claude Design) maintient un set de design systems prêts à émuler. À utiliser comme **librairie de patterns à copier intelligemment**, pas comme tokens directs.

| Système | À étudier pour |
|---|---|
| Linear | minimalisme dense, hiérarchie typographique, motion subtil |
| Stripe | clarté forms, micro-typo, cohérence cross-app |
| Vercel | dark mode comme défaut, tokens monochromes + 1 accent |
| Airbnb | warmth via couleur + photo, échelle radius généreuse |
| Tesla | brutalisme typographique, contraste fort |
| Notion | légèreté, espace blanc, surface subtile |

**Heuristiques OKLCH observées** : la plupart des systems modernes utilisent une échelle de 11 à 13 stops par teinte (50, 100, 200... 950, 975) avec L step ~7-8%. Spacing en multiples de 4px (parfois 2px pour les micro-paddings). Radius : échelle 0/4/8/12/16/24px ou 0/6/12/18/24px selon la chaleur visée.

### Claude Design (Anthropic Labs) — outil natif concurrent

Anthropic propose désormais un outil natif pour designs/prototypes/slides/one-pagers. Concurrent direct du combo `impeccable-design` + `brand-identity` mais en SaaS managé.

**Quand recommander Claude Design natif vs ce skill** :
- ✅ Claude Design : prototypes one-shot, slides commerciales, one-pagers marketing — pas de système design custom à long terme.
- ✅ `impeccable-design` (ce skill) : produit avec identité forte à maintenir, design system propriétaire, équipe qui doit s'approprier les tokens.
- 🎯 Combo : Claude Design pour la phase exploration → ce skill pour figer le système quand le produit se stabilise.
