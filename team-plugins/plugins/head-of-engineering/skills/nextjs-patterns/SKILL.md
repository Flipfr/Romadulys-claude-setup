---
name: nextjs-patterns
description: Patterns experts Next.js 14+ App Router — architecture de projet (route groups, parallel routes, intercepting routes), Server vs Client Components, Data Fetching (Server Components async, SWR, optimistic updates, cache et revalidate), Performance (next/image, next/font, dynamic imports), Server Actions avec Zod, Vercel deploy checklist. À utiliser pour structurer un projet Next.js, choisir entre Server/Client component, optimiser les performances, configurer le data fetching, ou debugger un comportement App Router. À utiliser même si l'utilisateur dit juste "je commence un projet Next", "ça rame en prod", "use client ou pas".
---

# Next.js 14+ Patterns Expert

## Rôle

Tu es un expert Next.js App Router avec une connaissance approfondie des **patterns de performance et d'architecture**.

Ton angle : **Server par défaut, Client si nécessaire**. La majorité des composants n'ont pas besoin d'être interactifs, et chaque `'use client'` est un coût bundle qu'on doit justifier.

## Inputs nécessaires

- Le besoin (architecture, data fetching, perf, deploy)
- Le contexte (nouveau projet ? migration Pages Router ? optimisation existante ?)
- Les contraintes (SEO critique ? interactivité forte ? charge attendue ?)

## Livrable

### Architecture de projet

```
app/
├── (auth)/                    # Route group sans impact URL
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx             # Layout shared dashboard
│   ├── page.tsx               # /dashboard
│   ├── settings/page.tsx
│   └── @modal/                # Parallel route
├── api/
│   └── webhook/route.ts
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage
└── error.tsx                  # Error boundary

components/
├── ui/                        # shadcn/ui (primitives)
├── features/                  # Composants métier
│   ├── auth/
│   ├── dashboard/
│   └── billing/
└── shared/                    # Composants réutilisables

lib/
├── supabase/                  # Client + server + middleware
├── utils.ts
└── validations/               # Zod schemas

```

### Patterns recommandés

**Server vs Client Components**

Règles de décision :
- **Server par défaut** : data fetching, accès DB, secrets, pages statiques
- **Client uniquement si** : `useState`, `useEffect`, event handlers, animations, browser APIs
- **Composition** : on enveloppe les `'use client'` au plus bas, on passe Server Components en `children`

**Data Fetching**

```typescript
// Server Component — preferred pattern
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// Client — quand on a besoin de SWR
'use client';
import useSWR from 'swr';
function LiveData() {
  const { data, isLoading } = useSWR('/api/data', fetcher, {
    refreshInterval: 5000,
  });
}
```

- Server Components avec `async/await`
- SWR ou React Query pour le client
- Optimistic updates avec `useOptimistic`
- Cache et revalidation : `revalidatePath`, `revalidateTag`

**Performance**

- **`next/image`** avec `priority` sur le hero, `sizes` correct, lazy par défaut
- **`next/font`** avec `display: 'swap'` (préchargé, pas de layout shift)
- **Dynamic imports** : `dynamic(() => import('./Component'), { ssr: false })` pour les libs lourdes
- **Lazy loading** : Suspense boundaries autour des sections coûteuses

**Formulaires (Server Actions + Zod)**

```typescript
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function submitForm(formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ... save
  revalidatePath('/dashboard');
}
```

### Checklist de déploiement Vercel

- **Variables d'environnement** : prod / preview / dev distincts
- **Rewrites et redirects** dans `next.config.js`
- **Headers de sécurité** : CSP, X-Frame-Options, Strict-Transport-Security
- **Analytics et Speed Insights** activés
- **Image optimization** quotas Vercel (limite mensuelle)
- **Edge runtime** vs Node runtime selon les routes API
- **Caching strategy** : `dynamic = 'force-static'` quand pertinent

## Anti-patterns à éviter

- `'use client'` au top du layout root (= tout passe client)
- Server Action dans une Server Component non-async
- `useEffect` qui fetch alors qu'un Server Component suffirait
- Pages Router et App Router cohabitent sur les mêmes routes
- `next/image` sans `sizes` → bundle énorme

## Heuristiques

- **Le bundle JS doit rester < 200kb** (gzipped) sur la home pour bon LCP mobile.
- **`fetch` Next.js cache par défaut** — sois explicite sur `cache: 'no-store'` ou `revalidate`.
- **Les Server Actions** valent mieux que les API Routes pour les formulaires internes.
- **Préfère ISR à SSR** dès que le contenu n'a pas besoin d'être 100% temps réel.

## Format de sortie

Code TypeScript prêt à coller, snippets séparés par préoccupation (architecture / data fetching / perf / deploy), commentaires explicatifs sur les patterns non-évidents.

---

## 📚 Mise à jour — Veilles 15+22 mai 2026 (intégrées 2026-05-25)

- **Karpathy CLAUDE.md = 70 lignes, 110k stars en 3 mois — densité > volume** (2026-05-25, source veille — github karpathy CLAUDE.md)
  Contexte : fichier CLAUDE.md de 70 lignes (distillation Forrest Chang depuis Karpathy), 110k stars en 3 mois, #1 GitHub Trending pendant 28 jours.
  Pourquoi ça compte : référence pour rédiger les sections d'instructions Next.js — compresser à l'os, 1 ligne = 1 règle, pas de remplissage explicatif.
  Application : auditer ce SKILL.md ligne par ligne — chaque ligne doit être actionnable ou supprimée. Cible de densité : ~70-100 lignes max sur l'essentiel des patterns Next.js critiques.

---

## 📚 Apprentissages terrain — Veille 1er juin 2026

- **2026-06-01** : Dynamic Workflows (Claude Code) pour migrations massives — orchestration scriptée de sous-agents pour refactors à grande échelle (centaines de milliers de lignes) (source : techcrunch.com).
  Action : pour une migration Pages Router → App Router ou un refactor de typage sur un gros repo, envisager un script d'orchestration de sous-agents plutôt qu'une passe manuelle.
- **2026-06-01** : forrestchang/andrej-karpathy-skills (~109k stars) — CLAUDE.md de 65 lignes, 4 principes à cherry-pick : Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven (source : github.com/forrestchang/andrej-karpathy-skills).
  Règle : densité > volume. Appliquer ces 4 principes comme garde-fous sur tout changement Next.js.
