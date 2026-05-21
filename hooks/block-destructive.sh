#!/bin/bash
# block-destructive.sh — Bloque les commandes destructives et demande validation utilisateur
# Lit le JSON stdin de Claude Code, extrait la commande, verifie les patterns dangereux.

INPUT=$(cat)

# Extraire la commande du JSON (sans jq, parsing basique)
# Cherche "command" : "..." dans le JSON — capture jusqu'au dernier guillemet non echappe
CMD=$(echo "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1 | sed 's/\\"/"/g' | sed 's/\\\\/\\/g')

if [ -z "$CMD" ]; then
  exit 0
fi

# Normaliser : minuscules, espaces multiples -> simple
CMD_LOWER=$(echo "$CMD" | tr '[:upper:]' '[:lower:]' | tr -s ' ')

# === PATTERNS DESTRUCTIFS ===

BLOCKED=false
REASON=""

# -- Suppression de fichiers --
if echo "$CMD_LOWER" | grep -qE 'rm\s+(-[a-z]*r|--recursive|-rf|-fr)'; then
  BLOCKED=true
  REASON="Suppression recursive de fichiers (rm -r / rm -rf)"
fi

if echo "$CMD_LOWER" | grep -qE 'rm\s+.*\*'; then
  BLOCKED=true
  REASON="Suppression avec wildcard (rm *)"
fi

if echo "$CMD_LOWER" | grep -qE '(^|\s)rmdir\s+'; then
  BLOCKED=true
  REASON="Suppression de repertoire (rmdir)"
fi

# -- Git destructif --
if echo "$CMD_LOWER" | grep -qE 'git\s+reset\s+--hard'; then
  BLOCKED=true
  REASON="Git reset hard (perte de modifications non commitees)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+push\s+.*(-f|--force)'; then
  BLOCKED=true
  REASON="Git force push (ecrase l historique distant)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+clean\s+.*-[a-z]*f'; then
  BLOCKED=true
  REASON="Git clean -f (supprime fichiers non suivis)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+checkout\s+(--\s+\.|-- \.)'; then
  BLOCKED=true
  REASON="Git checkout -- . (ecrase toutes les modifications locales)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+checkout\s+\.\s*$'; then
  BLOCKED=true
  REASON="Git checkout . (ecrase toutes les modifications locales)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+restore\s+\.\s*$'; then
  BLOCKED=true
  REASON="Git restore . (ecrase toutes les modifications locales)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+restore\s+--staged\s+\.\s*$'; then
  BLOCKED=true
  REASON="Git restore --staged . (unstage tout)"
fi

# Note: -D devient -d apres lowercase, on matche les deux
if echo "$CMD" | grep -qE 'git\s+branch\s+(-D|.*\s-D)'; then
  BLOCKED=true
  REASON="Git branch -D (suppression forcee de branche)"
fi

if echo "$CMD_LOWER" | grep -qE 'git\s+stash\s+(drop|clear)'; then
  BLOCKED=true
  REASON="Git stash drop/clear (suppression de stash)"
fi

# -- Base de donnees --
if echo "$CMD_LOWER" | grep -qiE '(drop\s+(table|database|schema)|truncate\s+table|delete\s+from)'; then
  BLOCKED=true
  REASON="Commande SQL destructive (DROP/TRUNCATE/DELETE)"
fi

# -- Systeme --
if echo "$CMD_LOWER" | grep -qE 'chmod\s+.*777'; then
  BLOCKED=true
  REASON="chmod 777 (permissions trop ouvertes)"
fi

if echo "$CMD_LOWER" | grep -qE 'kill\s+-9'; then
  BLOCKED=true
  REASON="kill -9 (arret force de processus)"
fi

# -- Windows specifique --
if echo "$CMD_LOWER" | grep -qE '(rd|rmdir)\s+/s'; then
  BLOCKED=true
  REASON="Suppression recursive Windows (rd /s)"
fi

if echo "$CMD_LOWER" | grep -qE 'del\s+/s'; then
  BLOCKED=true
  REASON="Suppression recursive Windows (del /s)"
fi

# -- npm/package destructif --
if echo "$CMD_LOWER" | grep -qE 'npm\s+unpublish'; then
  BLOCKED=true
  REASON="npm unpublish (supprime un package publie)"
fi

# -- Docker destructif --
if echo "$CMD_LOWER" | grep -qE 'docker\s+(system\s+prune|rm\s+-f|rmi\s+-f)'; then
  BLOCKED=true
  REASON="Docker destructif (prune/rm -f/rmi -f)"
fi

# === VERDICT ===

if [ "$BLOCKED" = true ]; then
  # Echapper les guillemets dans la commande pour JSON valide
  SAFE_CMD=$(echo "$CMD" | head -c 200 | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
  cat <<ENDJSON
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "BLOQUE: $REASON | Commande: $SAFE_CMD"
  }
}
ENDJSON
  exit 0
fi

# Commande safe, on laisse passer
exit 0
