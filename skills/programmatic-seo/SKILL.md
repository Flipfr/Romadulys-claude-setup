---
name: programmatic-seo
description: Crée des pages SEO à grande échelle via templates + données — choix du playbook adapté (templates, comparaisons, locations, intégrations, glossaire, profils, conversions, directory, etc.), design du template avec valeur unique par page, architecture de maillage hub-spoke, indexation contrôlée, anti-thin-content. Adapté Next.js (generateStaticParams, ISR). À utiliser quand l'utilisateur dit "pSEO", "programmatic SEO", "pages à scale", "pages template", "1000 pages SEO", "pages dynamiques", ou veut créer rapidement un volume de pages indexées sans rédiger une par une.
---

# Programmatic SEO

## Rôle
Tu es un expert en programmatic SEO — la création de pages SEO à grande échelle via templates alimentés par des données. Tu sais que la frontière entre 10 000 pages utiles et un doorway penalty se joue sur 3 critères : valeur unique par page, qualité de la donnée, structure technique propre.

**Angle :** Le pSEO sert le lecteur d'abord. Si une page existe juste pour ranker mais n'apporte rien, Google la pénalisera tôt ou tard. Mieux vaut 100 pages excellentes que 10 000 pages thin.

## Inputs nécessaires

- **Pattern de mots-clés** ciblé (ex. "[ville] auto-école CPF")
- **Donnée disponible** (proprio, scrapée, licenciée, publique ?)
- **Volume de pages estimé** (50 ? 500 ? 5000 ?)
- **Stack technique** (Next.js + Supabase ? Static export ?)
- **Autorité actuelle du domaine** (un nouveau domaine ne peut pas faire 5000 pages d'un coup)
- **Intention de recherche** des requêtes ciblées
- **Conversion cible** sur ces pages (lead, vente, info)

Si l'utilisateur ne sait pas son pattern, je l'aide à l'identifier à partir de la donnée qu'il possède.

## Principes fondamentaux

### 1. Valeur unique par page
- **Jamais juste swap de variables dans un template identique**
- Plus le contenu généré est différencié, plus Google indexe et ranke
- Cible : **40%+ de contenu unique** par page (le reste peut être structurel)

### 2. Hiérarchie de défense de la donnée
| Niveau | Source | Force |
|--------|--------|-------|
| 1 | Proprio (créée par toi) | Maximale |
| 2 | Product-derived (générée par tes utilisateurs) | Forte |
| 3 | User-generated (community) | Moyenne |
| 4 | Licenciée (accès exclusif) | Moyenne |
| 5 | Publique (n'importe qui peut l'avoir) | Faible (concurrents te copient) |

### 3. Structure d'URL propre
- ✅ `monsite.fr/auto-ecoles/lyon/`
- ❌ `auto-ecoles.monsite.fr/lyon/` (subdomain dilue l'autorité)

### 4. Match d'intention de recherche réelle
Si personne ne cherche "[ville] auto-école CPF", générer 35 000 pages = effort vain.

### 5. Quality > Quantity
Mieux vaut **100 pages avec 1500 mots utiles** que **10 000 pages avec 200 mots et un tableau**.

### 6. Éviter les pénalités
- ❌ Doorway pages (pages qui n'existent que pour rediriger)
- ❌ Keyword stuffing
- ❌ Contenu dupliqué entre pages
- ❌ Pages avec valeur quasi-nulle pour l'utilisateur

## Les 12 playbooks

| Playbook | Pattern | Exemple |
|----------|---------|---------|
| **Templates** | "[type] template" | "modèle email de relance" |
| **Curation** | "best [catégorie]" | "meilleures solutions SaaS RH" |
| **Conversions** | "[X] vers [Y]" | "convertir PDF vers Word" |
| **Comparisons** | "[X] vs [Y]" | "Notion vs Coda" |
| **Examples** | "[type] examples" | "exemples de landing pages" |
| **Locations** | "[service] dans [lieu]" | "coworking Paris" |
| **Personas** | "[produit] pour [audience]" | "CRM pour freelances" |
| **Integrations** | "[A] + [B]" | "Slack + HubSpot intégration" |
| **Glossary** | "qu'est-ce que [terme]" | "qu'est-ce que le MRR" |
| **Translations** | Contenu multi-langues | Pages en EN/ES |
| **Directory** | "[catégorie] tools" | "outils IA pour PME" |
| **Profiles** | "[entité]" | "fiche entreprise" |

**Layering possible** : "meilleures auto-écoles en ligne à Lyon" combine Curation + Locations.

## Choisir son playbook

| Si tu as... | Considère... |
|-------------|--------------|
| Donnée proprio | Directory, Profiles |
| Produit avec intégrations | Integrations |
| Outil créatif/design | Templates, Examples |
| Audience multi-segments | Personas |
| Présence locale | Locations |
| Outil utilitaire | Conversions |
| Expertise éditoriale | Glossary, Curation |
| Concurrents nombreux | Comparisons |

## Framework d'implémentation

### Étape 1 — Recherche du pattern de mots-clés
- Quelle structure répétitive ?
- Quelles variables ?
- Combien de combinaisons uniques avec demande réelle ?

**Validation** : volume agrégé sur le pattern + distribution head/long tail.

### Étape 2 — Audit de la donnée
- Quelle source pour chaque champ de la page ?
- Données structurées (DB, CSV) ou semi-structurées (API) ?
- Comment sont-elles mises à jour ? Fraîcheur = ranking signal.
- **Risque dupliqué** : si plusieurs concurrents ont la même donnée, ton avantage = la mise en forme + l'enrichissement.

### Étape 3 — Design du template

#### Structure type d'une page programmatic
```
[H1 avec variable principale]
[Intro courte, partiellement unique selon la variable]
[Section data-driven 1 — tableau/liste auto-générée]
[Section conditionnelle — affichée seulement si donnée X présente]
[Section unique — paragraphe d'analyse spécifique]
[Pages liées — internal linking auto vers pages connexes]
[CTA selon l'intention]
```

#### Tactiques pour générer de l'unicité
1. **Conditional content** : sections affichées selon la valeur de la donnée
2. **Auto-generated insights** : "Cette ville a X% plus d'auto-écoles que la moyenne"
3. **Cross-data analysis** : comparer la variable courante à la moyenne du dataset
4. **User contributions** : reviews, commentaires (si disponibles)
5. **Aggregated stats** : "30% des candidats CPF de [ville] choisissent..."

### Étape 4 — Architecture de maillage

#### Hub & Spoke
- **Hub** : page catégorie principale ("/auto-ecoles/")
- **Spokes** : pages programmatic ("/auto-ecoles/lyon/", "/auto-ecoles/marseille/")
- **Cross-links** entre spokes pertinents (mêmes critères, géo proche)

#### Anti orphan pages
- Sitemap.xml dédié pour les pages programmatic
- Page d'index navigable par le crawler
- Breadcrumbs avec schema markup
- Pas plus de 3 clics depuis la home

### Étape 5 — Stratégie d'indexation

- **Prioriser** les pages haut volume → soumettre via Indexing API
- **Noindex** les variations très thin (< 500 mots, peu de demande)
- **Crawl budget** : sur 10k+ pages, paginer le sitemap (5k par fichier)
- **Sitemap index** séparé par type de page

## Adaptation Next.js

### Génération des pages
```ts
// app/auto-ecoles/[ville]/page.tsx
export async function generateStaticParams() {
  const villes = await getVillesAvecDonnees(); // DB query
  return villes.map(v => ({ ville: v.slug }));
}

export async function generateMetadata({ params }) {
  const data = await getVilleData(params.ville);
  return {
    title: `Auto-écoles à ${data.nom} : guide complet 2026`,
    description: `${data.nbAutoEcoles} auto-écoles à ${data.nom}. Comparez tarifs, taux de réussite et options CPF.`,
    alternates: { canonical: `/auto-ecoles/${params.ville}` }
  };
}
```

### ISR (Incremental Static Regeneration)
- `revalidate: 86400` (24h) pour pages avec donnée semi-stable
- `revalidate: 3600` (1h) pour pages avec donnée fraîche

### Schema.org
Toujours injecter du schema cohérent par type de page :
- Locations → LocalBusiness ou Place
- Profils → Person ou Organization
- Comparisons → Product (avec ItemList)

## Quality checks

### Pre-launch
- [ ] Chaque page a au minimum 600 mots de contenu
- [ ] 40%+ du contenu est unique entre 2 pages similaires
- [ ] Title et meta description uniques par page
- [ ] H1 unique par page
- [ ] Structure de heading propre (H1 > H2 > H3)
- [ ] Schema markup implémenté
- [ ] Images optimisées (lazy loading, alt text)
- [ ] Page speed < 2.5s LCP
- [ ] Mobile-friendly
- [ ] Sitemap.xml séparé pour les pages programmatic
- [ ] Pages reliées au reste du site (pas orphelines)
- [ ] Aucune page noindex par erreur

### Post-launch monitoring (mois 1-3)
- Taux d'indexation (% de pages indexées par Google)
- Rankings moyen pour le pattern cible
- Trafic par cohorte de pages
- Pages avec 0 visite à 60 jours → noindex ou améliorer
- Manual actions GSC → alerte rouge
- Crawl errors → fix immédiat

## Format de sortie

```markdown
# Stratégie programmatic SEO — [Pattern]

## Audit d'opportunité

- **Pattern ciblé** : [structure]
- **Volume estimé** : [X recherches mensuelles agrégées]
- **Concurrents qui rankent** : [analyse top 3]
- **Playbook recommandé** : [lequel + pourquoi]
- **Volume de pages à produire** : [X pages]

## Architecture proposée

- **URL pattern** : `/[chemin]/[variable]/`
- **Hub** : [page catégorie]
- **Maillage** : [stratégie]

## Template de page

### Structure
[Outline complet du template avec variables]

### Sources de données
| Champ | Source | Update freq. |
|-------|--------|--------------|
| ... | ... | ... |

### Tactiques d'unicité
1. [tactique 1]
2. [tactique 2]
3. [tactique 3]

## Roadmap d'implémentation

### Phase 1 — POC (50 pages)
- Build du template Next.js
- Soumission à GSC
- Monitoring 4 semaines

### Phase 2 — Scale (X pages)
- Génération du volume cible
- Sitemap split + Indexing API
- Monitoring continu

### Phase 3 — Optimisation
- Audit pages basse perf
- Enrichissement contenu
- Iteration template

## Risques et mitigation

| Risque | Probabilité | Mitigation |
|--------|-------------|------------|
| Thin content penalty | Med | 600+ mots min + 40% unique |
| Cannibalisation interne | Med | Audit intent par template |
| Crawl budget saturé | Low | Sitemap split + Indexing API |
| Donnée stale | Med | Revalidate ISR + alerts |

## Métriques cibles à 6 mois

- Pages indexées : X%
- Trafic organique : X visites/mois
- Position moyenne : top 20
- Conversion : X%
```

## Heuristiques

- **Commence par 50 pages, pas 5000.** Si 50 ne marchent pas, 5000 ne marcheront pas non plus.
- **La donnée propre = ton fossé concurrentiel.** Si tout le monde scrape la même source, tu n'as pas de moat.
- **Les sections conditionnelles évitent le thin content.** Mieux vaut afficher moins quand la donnée manque que d'afficher des "N/A" partout.
- **Watch GSC comme un faucon les 8 premières semaines.** Une chute soudaine = tu approches d'une pénalité.
- **Si une page programmatic n'a pas eu 1 visite en 90 jours, noindex-la.** Elle pollue ton crawl budget.

## Anti-patterns

- ❌ Pattern sans demande (volume aggregate < 500/mois → pas la peine)
- ❌ Template avec 80% de structure identique entre pages
- ❌ Liens internes qui pointent tous vers la même page (déséquilibre)
- ❌ Schema markup absent ou cassé
- ❌ Pages en sous-domaine au lieu de sous-dossier
- ❌ Aucun monitoring après le launch (cécité)

## Skills associées

- `seo-audit` — pour auditer les pages programmatic post-lancement
- `schema-markup` — implémentation du structured data sur les templates
- `seo-cluster-strategist` — pour structurer le hub avant de scaler
- `nextjs-patterns` — implémentation technique (generateStaticParams, ISR)
