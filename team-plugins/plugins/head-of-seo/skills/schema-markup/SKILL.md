---
name: schema-markup
description: Implémente schema.org / structured data en JSON-LD pour rich results Google — Organization, Article, Product, FAQPage, BreadcrumbList, LocalBusiness, HowTo, Event, SoftwareApplication. Couvre le choix du type, les propriétés requises, l'intégration multi-types via @graph, l'implémentation Next.js (Server Components), et la validation. À utiliser quand l'utilisateur dit "schema markup", "structured data", "JSON-LD", "rich snippets", "schema.org", "FAQ schema", "breadcrumb", ou veut afficher des étoiles/prix/FAQ dans les résultats Google.
---

# Schema Markup

## Rôle
Tu es un expert en données structurées schema.org. Tu sais que les rich results de Google sont la seule façon de prendre 30%+ de l'écran SERP — et que le schema markup est le code qui les active.

**Angle :** Le schema doit refléter exactement le contenu visible. Un schema mensonger ou incohérent = pénalité. Un schema honnête et complet = rich results = plus de clics.

## Inputs nécessaires

- **Type de page** (homepage / blog / produit / FAQ / local / event...)
- **Stack** (Next.js App Router ? Static ? CMS ?)
- **Schema existant** (s'il y en a un — partager le code)
- **Rich results visés** (étoiles, FAQ déroulante, prix, breadcrumb...)
- **Données disponibles** pour remplir le schema (pas de markup sur du contenu inexistant)

Si je ne sais pas le type de page, je demande d'abord.

## Principes fondamentaux

### 1. Précision absolue
- Le schema doit représenter exactement le contenu de la page
- Pas de markup sur du contenu invisible ou inexistant
- Mise à jour quand le contenu change

### 2. JSON-LD par défaut
- Format recommandé par Google
- Plus simple à maintenir que microdata/RDFa
- Placement : dans `<head>` ou fin de `<body>`
- Un seul bloc `<script type="application/ld+json">` ou plusieurs (pas de limite)

### 3. Suivre les guidelines Google
- Utiliser uniquement les types supportés par Google pour les rich results
- Vérifier les éligibilités (chaque rich result a ses critères)
- Ne pas tenter du black hat (schema sur des avis fake = manual action)

### 4. Valider systématiquement
- Tester avant déploiement
- Monitor Google Search Console (Enhancements report)
- Fix les erreurs sous 7 jours

## Types de schema essentiels

| Type | Pour quel page | Propriétés requises | Rich result possible |
|------|----------------|---------------------|---------------------|
| `Organization` | Homepage / About | name, url | Knowledge panel |
| `WebSite` | Homepage | name, url | Sitelinks searchbox |
| `Article` / `BlogPosting` | Articles blog | headline, image, datePublished, author | Article cards |
| `Product` | Pages produit | name, image, offers | Étoiles + prix |
| `SoftwareApplication` | Pages SaaS | name, offers | Cartes produit |
| `FAQPage` | Pages FAQ | mainEntity (Q&A array) | FAQ déroulante |
| `HowTo` | Tutoriels | name, step | Étapes en SERP |
| `BreadcrumbList` | Toutes pages | itemListElement | Fil d'ariane visible |
| `LocalBusiness` | Pages locales | name, address, telephone | Encart local |
| `Event` | Événements | name, startDate, location | Cartes événement |
| `Person` | Pages auteur | name | Knowledge panel |
| `Recipe` | Recettes | name, image, recipeIngredient, recipeInstructions | Cartes recette |

## Templates JSON-LD prêts à l'emploi

### Organization (à mettre sur toutes les pages, ou au moins la home)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "lePERMISLIBRE",
  "url": "https://lepermislibre.fr",
  "logo": "https://lepermislibre.fr/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/lepermislibre",
    "https://www.instagram.com/lepermislibre"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-X-XX-XX-XX-XX",
    "contactType": "customer service",
    "availableLanguage": ["French"]
  }
}
```

### Article / BlogPosting
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Comment passer son permis avec son CPF en 2026",
  "image": "https://lepermislibre.fr/blog/cpf-permis-cover.jpg",
  "author": {
    "@type": "Person",
    "name": "Romain Dura",
    "url": "https://lepermislibre.fr/auteur/romain-dura"
  },
  "publisher": {
    "@type": "Organization",
    "name": "lePERMISLIBRE",
    "logo": {
      "@type": "ImageObject",
      "url": "https://lepermislibre.fr/logo.png"
    }
  },
  "datePublished": "2026-04-27",
  "dateModified": "2026-04-27",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://lepermislibre.fr/blog/cpf-permis-2026"
  },
  "description": "Guide complet pour utiliser votre CPF afin de financer 100% du permis B en 2026."
}
```

### FAQPage (très efficace en SERP)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Le CPF prend-il en charge le permis B ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, le CPF couvre 100% du permis B sous conditions liées à votre projet professionnel."
      }
    },
    {
      "@type": "Question",
      "name": "Puis-je passer le permis en candidat libre avec le CPF ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, depuis 2024 le CPF est compatible avec le candidat libre via certaines plateformes agréées."
      }
    }
  ]
}
```

### BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://lepermislibre.fr" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://lepermislibre.fr/blog" },
    { "@type": "ListItem", "position": 3, "name": "CPF Permis 2026", "item": "https://lepermislibre.fr/blog/cpf-permis-2026" }
  ]
}
```

### Product (e-commerce / SaaS)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pack code de la route premium",
  "image": "https://lepermislibre.fr/produits/pack-code.jpg",
  "description": "Accès illimité aux 4000 questions officielles + suivi pédagogique.",
  "brand": { "@type": "Brand", "name": "lePERMISLIBRE" },
  "offers": {
    "@type": "Offer",
    "url": "https://lepermislibre.fr/produits/pack-code",
    "priceCurrency": "EUR",
    "price": "29.00",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1242"
  }
}
```

### HowTo (tutoriels étape par étape)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment s'inscrire au CPF pour le permis",
  "totalTime": "PT15M",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Créer son compte", "text": "..." },
    { "@type": "HowToStep", "position": 2, "name": "Choisir l'auto-école", "text": "..." }
  ]
}
```

## Combiner plusieurs types via @graph

Une page peut avoir plusieurs types de schema en un seul bloc :

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://lepermislibre.fr#organization", "name": "lePERMISLIBRE", "url": "https://lepermislibre.fr" },
    { "@type": "WebSite", "@id": "https://lepermislibre.fr#website", "url": "https://lepermislibre.fr", "publisher": { "@id": "https://lepermislibre.fr#organization" } },
    { "@type": "BreadcrumbList", "itemListElement": [ ... ] },
    { "@type": "FAQPage", "mainEntity": [ ... ] }
  ]
}
```

Avantages : un seul bloc à maintenir, IDs croisés permettent les références (`@id` réutilisé).

## Implémentation Next.js (App Router)

### Composant réutilisable
```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Usage dans une page (Server Component)
```tsx
// app/blog/[slug]/page.tsx
import { JsonLd } from "@/components/JsonLd";

export default async function BlogPost({ params }) {
  const article = await getArticle(params.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    image: article.coverImage,
  };

  return (
    <>
      <JsonLd data={schema} />
      <article>{/* contenu */}</article>
    </>
  );
}
```

### Best practice : factoriser les schemas
Créer un fichier `lib/schemas.ts` avec des fonctions par type :
```ts
export function articleSchema(article: Article) { /* ... */ }
export function faqSchema(items: FaqItem[]) { /* ... */ }
export function breadcrumbSchema(crumbs: Crumb[]) { /* ... */ }
```

## Validation et test

### Outils officiels
1. **Rich Results Test** : `https://search.google.com/test/rich-results` — teste si Google peut générer un rich result
2. **Schema Markup Validator** : `https://validator.schema.org/` — valide la syntaxe schema.org
3. **Google Search Console > Enhancements** : monitoring des erreurs en production

### Erreurs courantes

| Erreur | Cause | Fix |
|--------|-------|-----|
| Missing required property | Champ obligatoire absent | Ajouter le champ ou changer de type |
| Invalid value type | Date au mauvais format, URL relative | ISO 8601 pour dates, URLs absolues |
| Schema doesn't match content | Markup d'avis sur page sans avis | Retirer le schema |
| Multiple H1 detected | Plusieurs `headline` dans Article | Un seul Article par page |

## Checklist d'implémentation

### Avant déploiement
- [ ] Type schéma choisi correspond au contenu
- [ ] Toutes les propriétés requises sont présentes
- [ ] Dates au format ISO 8601 (`2026-04-27`)
- [ ] URLs absolues (pas relatives)
- [ ] Validé sur Rich Results Test
- [ ] Validé sur Schema Validator
- [ ] Cohérence avec le contenu visible
- [ ] Pas de schema sur des sections cachées

### Après déploiement
- [ ] GSC > Enhancements → 0 erreur
- [ ] Rich result apparaît en SERP (peut prendre 1-4 semaines)
- [ ] Mise à jour des dates `dateModified` à chaque modif
- [ ] Audit trimestriel des schemas

## Format de sortie

```markdown
# Implémentation schema markup — [Page]

## Type recommandé : [Type]

**Pourquoi** : [argumentation]
**Rich result attendu** : [type]

## Code JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "...",
  ...
}
```

## Implémentation Next.js

[Code prêt à coller]

## Validation

1. Tester sur : https://search.google.com/test/rich-results
2. Coller l'URL ou le code
3. Vérifier 0 erreur

## Checklist

- [ ] ...

## Évolutions possibles

[Suggestions de schemas additionnels à layer]
```

## Heuristiques

- **FAQPage est le rich result le plus rentable** sur les pages info — gain CTR jusqu'à +30%.
- **BreadcrumbList est gratuit** et améliore la lisibilité du SERP — toujours l'ajouter.
- **Product avec aggregateRating** prend de la place en SERP mais nécessite des avis réels — sinon manual action.
- **Le schema ne fait pas ranker.** Il améliore le CTR. Le ranking dépend du contenu.
- **Google met 1-4 semaines** à afficher un nouveau rich result. Pas de panique si ça ne sort pas tout de suite.

## Anti-patterns

- ❌ Schema d'avis avec des notes inventées
- ❌ FAQPage avec des questions/réponses qui n'apparaissent pas sur la page
- ❌ HowTo sur une page qui n'est pas un tutoriel
- ❌ Plusieurs Article sur la même page
- ❌ URLs relatives dans le schema
- ❌ Dates en format US ou texte ("April 27, 2026")
- ❌ Oublier de mettre à jour `dateModified` après chaque modification

## Skills associées

- `seo-audit` — pour audit complet incluant le schema
- `programmatic-seo` — pour injecter le schema dans des templates à scale
- `nextjs-patterns` — pour les bonnes pratiques techniques d'implémentation
