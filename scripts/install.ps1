<#
.SYNOPSIS
  Installe la conf Team Plugins depuis ce repo vers ~/.claude/ et ~/team-plugins/.

.DESCRIPTION
  - Copie les skills custom dans ~/.claude/skills/
  - Copie le marketplace team-plugins dans ~/team-plugins/
  - Installe le hook block-destructive.sh dans ~/.claude/hooks/
  - Installe les templates CLAUDE.md, settings.json, .mcp.json (avec backup si existants)
  - Substitue __USERPROFILE__ par le vrai chemin Windows

.PARAMETER Force
  Ecrase les fichiers existants sans demander confirmation.

.EXAMPLE
  .\scripts\install.ps1
  .\scripts\install.ps1 -Force
#>

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# --- Determine paths ---
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ClaudeDir = Join-Path $env:USERPROFILE ".claude"
$TeamPluginsDir = Join-Path $env:USERPROFILE "team-plugins"

Write-Host ""
Write-Host "=== Team Plugins - Install ===" -ForegroundColor Cyan
Write-Host "Repo source     : $RepoRoot"
Write-Host "Cible Claude    : $ClaudeDir"
Write-Host "Cible plugins   : $TeamPluginsDir"
Write-Host ""

# --- Verifs prerequis ---
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "[ERREUR] Claude Code CLI non trouve. Installe-le d'abord : https://claude.com/claude-code" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ClaudeDir)) {
    Write-Host "[INFO] ~/.claude/ n'existe pas. Lance 'claude' une fois pour qu'il soit cree, puis relance ce script." -ForegroundColor Yellow
    exit 1
}

# --- Helper ---
function Copy-WithBackup {
    param([string]$Source, [string]$Dest, [string]$Label)

    if (Test-Path $Dest) {
        if (-not $Force) {
            $backup = "$Dest.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Copy-Item -Path $Dest -Destination $backup -Recurse -Force
            Write-Host "[BACKUP] $Label existant sauvegarde -> $backup" -ForegroundColor Yellow
        }
    }
    Copy-Item -Path $Source -Destination $Dest -Recurse -Force
    Write-Host "[OK] $Label installe" -ForegroundColor Green
}

# --- 1. Skills ---
Write-Host "1/5 Installation des skills custom..." -ForegroundColor Cyan
$SkillsSrc = Join-Path $RepoRoot "skills"
$SkillsDest = Join-Path $ClaudeDir "skills"

if (-not (Test-Path $SkillsDest)) { New-Item -Path $SkillsDest -ItemType Directory -Force | Out-Null }

Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object {
    $skillName = $_.Name
    $destPath = Join-Path $SkillsDest $skillName
    Copy-WithBackup -Source $_.FullName -Dest $destPath -Label "skill $skillName"
}
Write-Host ""

# --- 2. Team plugins marketplace ---
Write-Host "2/5 Installation du marketplace team-plugins..." -ForegroundColor Cyan
$TeamPluginsSrc = Join-Path $RepoRoot "team-plugins"
Copy-WithBackup -Source $TeamPluginsSrc -Dest $TeamPluginsDir -Label "team-plugins marketplace"
Write-Host ""

# --- 3. Hook block-destructive ---
Write-Host "3/5 Installation du hook block-destructive..." -ForegroundColor Cyan
$HooksDest = Join-Path $ClaudeDir "hooks"
if (-not (Test-Path $HooksDest)) { New-Item -Path $HooksDest -ItemType Directory -Force | Out-Null }
$HookSrc = Join-Path $RepoRoot "hooks\block-destructive.sh"
$HookDest = Join-Path $HooksDest "block-destructive.sh"
Copy-WithBackup -Source $HookSrc -Dest $HookDest -Label "hook block-destructive.sh"
Write-Host ""

# --- 4. Templates avec substitution __USERPROFILE__ ---
Write-Host "4/5 Installation des templates (CLAUDE.md, settings.json, .mcp.json)..." -ForegroundColor Cyan
$EscapedUserProfile = $env:USERPROFILE -replace '\\', '\\'

# CLAUDE.md
$ClaudeMdSrc = Join-Path $RepoRoot "templates\CLAUDE.md.template"
$ClaudeMdDest = Join-Path $ClaudeDir "CLAUDE.md"
if ((Test-Path $ClaudeMdDest) -and -not $Force) {
    Write-Host "[SKIP] CLAUDE.md existe deja (utilise -Force pour ecraser)" -ForegroundColor Yellow
} else {
    Copy-Item -Path $ClaudeMdSrc -Destination $ClaudeMdDest -Force
    Write-Host "[OK] CLAUDE.md installe" -ForegroundColor Green
}

# settings.json (substitution path)
$SettingsSrc = Join-Path $RepoRoot "templates\settings.json.template"
$SettingsDest = Join-Path $ClaudeDir "settings.json"
if ((Test-Path $SettingsDest) -and -not $Force) {
    Write-Host "[SKIP] settings.json existe deja (utilise -Force pour ecraser)" -ForegroundColor Yellow
} else {
    $content = Get-Content $SettingsSrc -Raw
    $content = $content -replace '__USERPROFILE__', $EscapedUserProfile
    Set-Content -Path $SettingsDest -Value $content -NoNewline
    Write-Host "[OK] settings.json installe (paths substitues vers $env:USERPROFILE)" -ForegroundColor Green
}

# .mcp.json
$McpSrc = Join-Path $RepoRoot "templates\.mcp.json.template"
$McpDest = Join-Path $ClaudeDir ".mcp.json"
if ((Test-Path $McpDest) -and -not $Force) {
    Write-Host "[SKIP] .mcp.json existe deja (utilise -Force pour ecraser)" -ForegroundColor Yellow
} else {
    Copy-Item -Path $McpSrc -Destination $McpDest -Force
    Write-Host "[OK] .mcp.json installe" -ForegroundColor Green
}
Write-Host ""

# --- 5. Manifest (track ce qu'on installe pour que update.ps1 puisse nettoyer plus tard) ---
Write-Host "5/6 Ecriture du manifest..." -ForegroundColor Cyan
$ManifestPath = Join-Path $ClaudeDir ".team-plugins-manifest.json"
$installedSkills = (Get-ChildItem -Path $SkillsSrc -Directory).Name
$installedPlugins = (Get-ChildItem -Path (Join-Path $RepoRoot "team-plugins\plugins") -Directory).Name
$manifest = @{
    skills = $installedSkills
    plugins = $installedPlugins
    lastSync = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 3
Set-Content -Path $ManifestPath -Value $manifest -Encoding utf8
Write-Host "[OK] Manifest ecrit : $ManifestPath" -ForegroundColor Green
Write-Host ""

# --- 6. Resume ---
Write-Host "6/6 Verifications finales..." -ForegroundColor Cyan
$skillCount = (Get-ChildItem -Path $SkillsDest -Directory).Count
$pluginCount = (Get-ChildItem -Path (Join-Path $TeamPluginsDir "plugins") -Directory).Count
Write-Host "[INFO] $skillCount skills installes dans ~/.claude/skills/"
Write-Host "[INFO] $pluginCount plugins installes dans ~/team-plugins/plugins/"
Write-Host ""

Write-Host "=== INSTALL TERMINE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "  1. Lance 'claude' (pour authentification si nouveau PC)"
Write-Host "  2. Verifie : /plugin -> les 16 head-of doivent etre actives"
Write-Host "  3. Verifie : /help -> tu dois voir tes skills custom listes"
Write-Host "  4. Recree tes .env.local dans tes repos (clefs API)"
Write-Host "  5. Re-authentifie tes MCP servers OAuth (Notion, Slack, HubSpot, Figma) via 'claude mcp'"
Write-Host ""
Write-Host "(Optionnel) Restaurer ta memoire perso :"
Write-Host "  .\scripts\backup-personal.ps1 -Restore -SourceZip <chemin-vers-zip>"
Write-Host ""
