#!/usr/bin/env bash
# Met à jour la conf Team Plugins depuis ce repo (mac/linux).
# Pull + sync + suppression des skills/plugins qui ne sont plus dans le marketplace.
#
# Usage:
#   ./scripts/update.sh             # pull + sync + clean
#   ./scripts/update.sh --no-pull   # skip git pull (état déjà à jour)
#   ./scripts/update.sh --dry-run   # affiche sans rien faire

set -euo pipefail

NO_PULL=0
DRY_RUN=0
for arg in "$@"; do
    case "$arg" in
        --no-pull) NO_PULL=1 ;;
        --dry-run) DRY_RUN=1 ;;
        *) echo "Argument inconnu: $arg" >&2; exit 1 ;;
    esac
done

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_DIR="$HOME/.claude"
TEAM_PLUGINS_DIR="$HOME/team-plugins"
SKILLS_DEST="$CLAUDE_DIR/skills"
MANIFEST_PATH="$CLAUDE_DIR/.team-plugins-manifest.json"

# Skills explicitement deprecated (retirées de versions antérieures).
DEPRECATED_SKILLS=(
    "apprentissages"
    "autoecole-expert"
    "maintenance"
    "orchestrator"
    "plugin-syncer"
    "skill-feeder"
    "switch-diagnostic-pme"
    "switch-proposition-commerciale"
    "veille-vendredi"
)

run() {
    if [ "$DRY_RUN" -eq 1 ]; then
        echo "[DRY] $*"
    else
        eval "$@"
    fi
}

echo ""
echo "=== Team Plugins - Update ==="
echo "Repo            : $REPO_ROOT"
echo "Cible Claude    : $CLAUDE_DIR"
echo "Manifest        : $MANIFEST_PATH"
[ "$DRY_RUN" -eq 1 ] && echo "Mode            : DRY RUN"
echo ""

# --- 1. Git pull ---
if [ "$NO_PULL" -eq 0 ]; then
    echo "1/5 Pull des updates..."
    run "cd '$REPO_ROOT' && git pull"
    echo ""
else
    echo "1/5 Pull skippé (--no-pull)"
    echo ""
fi

# --- 2. État du repo ---
echo "2/5 Lecture de l'état du repo..."
REPO_SKILLS=()
if [ -d "$REPO_ROOT/skills" ]; then
    while IFS= read -r -d '' d; do
        REPO_SKILLS+=("$(basename "$d")")
    done < <(find "$REPO_ROOT/skills" -mindepth 1 -maxdepth 1 -type d -print0)
fi

REPO_PLUGINS=()
if [ -d "$REPO_ROOT/team-plugins/plugins" ]; then
    while IFS= read -r -d '' d; do
        REPO_PLUGINS+=("$(basename "$d")")
    done < <(find "$REPO_ROOT/team-plugins/plugins" -mindepth 1 -maxdepth 1 -type d -print0)
fi

echo "[INFO] ${#REPO_SKILLS[@]} skills dans le repo"
echo "[INFO] ${#REPO_PLUGINS[@]} plugins dans le repo"
echo ""

# --- 3. Lecture du manifest ---
echo "3/5 Lecture du manifest précédent..."
PREV_SKILLS=()
PREV_PLUGINS=()
if [ -f "$MANIFEST_PATH" ]; then
    if command -v jq >/dev/null 2>&1; then
        while IFS= read -r s; do PREV_SKILLS+=("$s"); done < <(jq -r '.skills[]' "$MANIFEST_PATH" 2>/dev/null || true)
        while IFS= read -r p; do PREV_PLUGINS+=("$p"); done < <(jq -r '.plugins[]' "$MANIFEST_PATH" 2>/dev/null || true)
        LAST_SYNC=$(jq -r '.lastSync' "$MANIFEST_PATH" 2>/dev/null || echo "?")
        echo "[INFO] Manifest trouvé (dernier sync : $LAST_SYNC)"
    else
        echo "[WARN] jq absent, manifest ignoré"
    fi
else
    echo "[INFO] Pas de manifest (premier run)"
fi
echo ""

# --- 4. Calcul des suppressions ---
echo "4/5 Calcul des suppressions..."

# Helper : est-ce que $1 est dans le tableau passé via stdin ?
in_array() {
    local needle="$1"; shift
    for item in "$@"; do
        [ "$item" = "$needle" ] && return 0
    done
    return 1
}

SKILLS_TO_REMOVE=()
for s in "${PREV_SKILLS[@]}" "${DEPRECATED_SKILLS[@]}"; do
    if ! in_array "$s" "${REPO_SKILLS[@]}"; then
        if ! in_array "$s" "${SKILLS_TO_REMOVE[@]:-}"; then
            SKILLS_TO_REMOVE+=("$s")
        fi
    fi
done

PLUGINS_TO_REMOVE=()
for p in "${PREV_PLUGINS[@]}"; do
    if ! in_array "$p" "${REPO_PLUGINS[@]}"; then
        PLUGINS_TO_REMOVE+=("$p")
    fi
done

if [ "${#SKILLS_TO_REMOVE[@]}" -eq 0 ] && [ "${#PLUGINS_TO_REMOVE[@]}" -eq 0 ]; then
    echo "[OK] Rien à supprimer"
else
    [ "${#SKILLS_TO_REMOVE[@]}" -gt 0 ] && echo "[INFO] Skills à supprimer : ${SKILLS_TO_REMOVE[*]}"
    [ "${#PLUGINS_TO_REMOVE[@]}" -gt 0 ] && echo "[INFO] Plugins à supprimer : ${PLUGINS_TO_REMOVE[*]}"
fi

for skill in "${SKILLS_TO_REMOVE[@]}"; do
    target="$SKILLS_DEST/$skill"
    if [ -d "$target" ]; then
        run "rm -rf '$target'"
        [ "$DRY_RUN" -eq 0 ] && echo "[REMOVED] skill $skill"
    fi
done

for plugin in "${PLUGINS_TO_REMOVE[@]}"; do
    target="$TEAM_PLUGINS_DIR/plugins/$plugin"
    if [ -d "$target" ]; then
        run "rm -rf '$target'"
        [ "$DRY_RUN" -eq 0 ] && echo "[REMOVED] plugin $plugin"
    fi
done
echo ""

# --- 5. Re-sync ---
echo "5/5 Sync des skills et plugins depuis le repo..."
if [ "$DRY_RUN" -eq 0 ]; then
    mkdir -p "$SKILLS_DEST"
    for skill in "${REPO_SKILLS[@]}"; do
        rm -rf "$SKILLS_DEST/$skill"
        cp -R "$REPO_ROOT/skills/$skill" "$SKILLS_DEST/$skill"
    done
    echo "[OK] ${#REPO_SKILLS[@]} skills synchronisées"

    # Plugins : ne pas écraser un symlink (dev mode)
    if [ -L "$TEAM_PLUGINS_DIR" ]; then
        echo "[SKIP] $TEAM_PLUGINS_DIR est un symlink (dev mode), pas de copie"
    else
        rm -rf "$TEAM_PLUGINS_DIR"
        cp -R "$REPO_ROOT/team-plugins" "$TEAM_PLUGINS_DIR"
        echo "[OK] team-plugins marketplace synchronisé (${#REPO_PLUGINS[@]} plugins)"
    fi

    # Manifest update (sans jq, avec printf)
    {
        printf '{\n  "skills": ['
        for i in "${!REPO_SKILLS[@]}"; do
            [ "$i" -gt 0 ] && printf ', '
            printf '"%s"' "${REPO_SKILLS[$i]}"
        done
        printf '],\n  "plugins": ['
        for i in "${!REPO_PLUGINS[@]}"; do
            [ "$i" -gt 0 ] && printf ', '
            printf '"%s"' "${REPO_PLUGINS[$i]}"
        done
        printf '],\n  "lastSync": "%s"\n}\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    } > "$MANIFEST_PATH"
    echo "[OK] Manifest mis à jour"
else
    echo "[DRY] Sync skills + plugins + update manifest"
fi
echo ""

echo "=== UPDATE TERMINÉ ==="
echo ""
echo "Prochaines étapes :"
echo "  1. Dans Claude Code : /plugin -> Reload marketplace"
echo "  2. Si un plugin a été retiré, le désinstaller via /plugin"
echo ""
