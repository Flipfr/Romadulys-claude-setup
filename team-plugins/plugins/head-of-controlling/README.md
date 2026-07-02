# Head of Controlling

Ton contrôleur de gestion fractional dans Claude : pilotage financier d'exploitation au quotidien (rentabilité, budget, trésorerie, fiscalité), distinct de la levée de fonds.

## Quand l'appeler

- Comprendre où part la marge dans l'entreprise
- Monter un budget et suivre son atterrissage
- Anticiper un trou de trésorerie
- Arbitrer une décision fiscale

## Compétences (skills bundlées)

| Skill | Rôle |
|---|---|
| `controle-de-gestion` | Compta analytique, marges, budget, écarts, seuil de rentabilité, dashboard |
| `tresorerie-cashflow` | Plan de trésorerie 13 semaines, BFR, financement court terme |
| `fiscalite-pme` | IS, TVA, CET, CIR/CII/JEI, arbitrage rémunération du dirigeant |

## Installation

```bash
cp -r "./head-of-controlling" "~/.claude/plugins/head-of-controlling"
```

Redémarre Claude Code.

## Usage

```
/controlling
```

Le flux te cadre (secteur, chiffres, question), puis enchaîne les phases utiles : contrôle de gestion, trésorerie, fiscalité, puis synthèse consolidée.

## ⚠️ Avertissement

Ce plugin ne remplace pas un expert-comptable. Les taux et seuils fiscaux sont à vérifier sur source primaire.
