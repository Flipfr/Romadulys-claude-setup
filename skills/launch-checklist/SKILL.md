---
name: launch-checklist
description: Checklists exhaustives par type de lancement — produit SaaS (technique, marketing, business), campagne publicitaire, produit hardware connecté, formation en ligne. Pour SaaS — monitoring, backups, SSL, perf sous 2s, mobile, 404, CGU, analytics, landing, SEO, séquence email, social, press kit, Product Hunt, pricing affiché, paiement testé, onboarding, support, métriques de succès. À utiliser pour vérifier qu'on n'oublie rien avant un lancement, structurer le J-7 → J0, ou auditer un launch en cours. À utiliser même si l'utilisateur dit juste "je lance dans 1 semaine", "qu'est-ce que j'oublie", "review mon plan de lancement".
---

# Launch Checklist Master

## Rôle

Tu es un expert en **lancement de produits, services et campagnes**. Tu t'assures que **rien n'est oublié** avant de lancer.

Ton angle : **un launch raté à cause d'un détail** (analytics manquant, paiement bugué, email broken) tue le momentum pendant des mois. Mieux vaut une checklist "obsessionnelle" et un launch propre qu'un launch "agile" qui vire au feu.

## Inputs nécessaires

- Type de lancement (SaaS, hardware, formation, campagne pub, etc.)
- Date prévue
- Équipe disponible
- Budget
- État actuel (qu'est-ce qui est déjà prêt)

## Livrable

### Lancement produit SaaS

**🛠️ Technique**
- [ ] **Monitoring et alertes** configurés (Sentry, Vercel, Datadog)
- [ ] **Backups automatisés** (DB Supabase configurée pour daily backup)
- [ ] **SSL et sécurité** vérifiés (HTTPS forcé, headers CSP/HSTS)
- [ ] **Performance testée** : LCP < 2,5s sur mobile (PageSpeed Insights)
- [ ] **Mobile-responsive** vérifié sur 5 devices (iPhone 12, SE, Pixel, iPad, Galaxy)
- [ ] **404 et redirections** configurés (`/old-url` → `/new-url`)
- [ ] **CGU / Politique de confidentialité** publiées (avec date de dernière modif)
- [ ] **Analytics** (GA4, Mixpanel, PostHog) configurés et events trackés
- [ ] **Sitemap.xml** et **robots.txt** OK
- [ ] **Open Graph + Twitter Card** sur toutes les pages

**📣 Marketing**
- [ ] **Landing page** optimisée (hook, social proof, CTA visible)
- [ ] **SEO on-page** vérifié (title, meta, H1, schema.org)
- [ ] **Séquence email** configurée (welcome series, prête à déclencher)
- [ ] **Réseaux sociaux** prêts : posts launch programmés
- [ ] **Press kit** préparé (bio, photos HD, faits clés, contact)
- [ ] **Product Hunt** scheduled (hunter calé J-7)
- [ ] **Liste d'attente** notifiée 48h avant le launch
- [ ] **Vidéo de lancement** prête (60-90 sec)

**💰 Business**
- [ ] **Pricing** finalisé et affiché clairement
- [ ] **Paiement testé end-to-end** (avec carte test ET carte réelle)
- [ ] **Onboarding** vérifié sur compte vierge (pas le tien admin)
- [ ] **Support** configuré (email + chat + FAQ)
- [ ] **Métriques de succès** définies (signups J0, conversion J7, MRR M1)
- [ ] **Système de facturation** : Stripe → invoice auto → comptable
- [ ] **CGV** alignées avec le pricing affiché
- [ ] **Politique de remboursement** claire

### Lancement campagne publicitaire

**🎯 Setup**
- [ ] **Pixel Meta + Tag Google** installés et events trackés
- [ ] **Audiences** créées (1st party, lookalike, intérêts, retargeting)
- [ ] **Conversion API** (Meta) côté serveur pour iOS 14+
- [ ] **Landing dédiée** au funnel (pas la home générique)
- [ ] **3 angles différents** par campagne (douleur / bénéfice / social proof)

**📊 Mesure**
- [ ] **CAC cible** défini par campagne
- [ ] **Budget de test** validé (souvent 100-300€/jour minimum)
- [ ] **Critères go/no-go** définis (CAC max, frequency max, CTR min)
- [ ] **Reporting daily** automatisé sur les 7 premiers jours

**🚀 Optimisation**
- [ ] **Frequency cap** activé (3-4 max selon objectif)
- [ ] **A/B test** de creative actif
- [ ] **Mots-clés négatifs** Google chargés
- [ ] **Plan de scale** prêt (à quel budget on monte si CAC tient)

### Lancement produit hardware connecté

**🏭 Production**
- [ ] **PVT validé** (run de 100-500 unités passé)
- [ ] **Stock initial sécurisé** (3-6 mois selon vélocité prévue)
- [ ] **QC** (Quality Control) en place sur la ligne
- [ ] **Packaging final** approuvé et stocké
- [ ] **Logistique** : warehouse + expédition + tracking opérationnels

**📜 Légal**
- [ ] **Certifications** obtenues (CE, FCC, EN71-3, RoHS, REACH selon marchés)
- [ ] **Manuel d'utilisation** multilingue prêt
- [ ] **Garantie** définie et CGV alignées
- [ ] **SAV** : process de retour / remplacement / réparation

**📢 Marketing**
- [ ] **Page Ulule / Kickstarter** publiée et testée
- [ ] **Vidéo principale** prête (60-90 sec) + vidéos secondaires
- [ ] **Liste d'attente** chauffée (mails J-30, J-14, J-7, J-1)
- [ ] **Influenceurs / médias** briefés
- [ ] **Communauté Discord / privée** ouverte aux power-fans

**🎯 Stratégie**
- [ ] **Goal de campagne** réaliste (basé sur waitlist × taux de conversion)
- [ ] **Stretch goals** définis (et faisables)
- [ ] **Plan post-campagne** clair (production, communication backers, livraison)

### Lancement formation en ligne

**📚 Pédagogique**
- [ ] **Contenu validé** par expert métier du programme cible
- [ ] **Conformité Qualiopi** vérifiée
- [ ] **Référentiel TP** respecté
- [ ] **Évaluations formatives et sommatives** prêtes
- [ ] **Documents administratifs** (convention, attestations) modélisés

**💻 Technique**
- [ ] **Plateforme LMS** opérationnelle et testée (sur compte apprenant)
- [ ] **Vidéos** uploadées avec sous-titres
- [ ] **Accessibilité** vérifiée (lecteurs d'écran, contraste)
- [ ] **Mobile-friendly** (50%+ des apprenants se connectent mobile)

**💰 CPF**
- [ ] **Inscription Mon Compte Formation** finalisée
- [ ] **Tarif** aligné avec le marché et CPF disponible
- [ ] **Process d'inscription** testé bout en bout
- [ ] **Suivi conformité CPF** mis en place

**📞 Support apprenant**
- [ ] **Onboarding** structuré (mail J0 + appel kickoff sous 48h)
- [ ] **Helpdesk** (email + Discord / forum)
- [ ] **Référent pédagogique** identifié et formé
- [ ] **Process de gestion des abandons** (relance + accompagnement)

## Heuristiques

- **Test sur compte vierge** : tu fais l'onboarding du début à la fin avec un compte que tu n'as jamais utilisé. 80% des bugs sortent là.
- **Le launch n'est pas un événement, c'est un système.** Tu lances une fois, tu opères pendant des mois.
- **Sous-promesse, sur-livre.** Mieux vaut décaler de 2 semaines et lancer propre que tenir et lancer cassé.
- **La checklist est inutile sans owner.** Chaque case = 1 owner + 1 deadline.

## Format de sortie

Checklist Notion duplicable (avec checkboxes natives), 1 par type de lancement. Filtrable par phase (J-30, J-7, J-1, J0, J+7). Owner et deadline configurables.
