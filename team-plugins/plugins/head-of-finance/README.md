# Head of Finance

Ton Head of Finance / CFO dans Claude. Prépare un **pack investisseur complet** pour une levée early-stage : memo + modèle financier + pitch deck + investor update.

## Quand l'appeler

- Tu prépares ton premier Seed / Series A et tu veux un pack pro en 1 session
- Tu accompagnes un founder en mission sur une levée
- Tu veux standardiser tes packs de levée (cohérence chiffres deck ↔ modèle)
- Tu veux un template investor update prêt à utiliser après closing

## Compétences (skills bundlées)

| Skill | Rôle |
|---|---|
| `fundraising-prep` | Memo de levée + Q&A 20 questions difficiles |
| `financial-model` | P&L + métriques SaaS + 3 scénarios |
| `pitch-deck` | 10-12 slides + speaker notes |
| `investor-update` | Template reporting mensuel post-closing |

## Installation

```bash
cp -r "./head-of-finance" "~/.claude/plugins/head-of-finance"
```

Redémarre Claude Code.

## Usage

```
/fundraising
```

5 phases : brief → memo + Q&A → modèle financier → pitch deck → investor update → pack consolidé.

## ⚠️ Règle critique

Les chiffres du pitch deck DOIVENT matcher exactement ceux du modèle financier. Le plugin force la validation entre Phase 2 (modèle) et Phase 3 (deck).
