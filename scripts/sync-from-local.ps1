<#
.SYNOPSIS
  Synchronise ~/.claude/skills/, ~/team-plugins/ et le hook vers ce repo (pour commit).

.DESCRIPTION
  - Copie ~/.claude/skills/* (sauf symlinks externes) vers repo/skills/
  - Copie ~/team-plugins/* vers repo/team-plugins/
  - Copie ~/.claude/hooks/block-destructive.sh vers repo/hooks/
  - Affiche un git status apres
  - Ne touche PAS aux templates (CLAUDE.md, settings.json) — c'est volontaire, ils sont generiques

.EXAMPLE
  .\scripts\sync-from-local.ps1
#>

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ClaudeDir = Join-Path $env:USERPROFILE ".claude"
$TeamPluginsDir = Join-Path $env:USERPROFILE "team-plugins"

Write-Host ""
Write-Host "=== Sync local -> repo ===" -ForegroundColor Cyan
Write-Host "Source Claude   : $ClaudeDir"
Write-Host "Source plugins  : $TeamPluginsDir"
Write-Host "Cible repo      : $RepoRoot"
Write-Host ""

# Symlinks externes a exclure (geres par plugins tiers)
$ExcludedSkills = @(
    "dispatch",
    "gsap",
    "hyperframes",
    "hyperframes-cli",
    "hyperframes-registry",
    "website-to-hyperframes",
    "_last-sync.txt"
)

# --- 1. Skills ---
Write-Host "1/3 Sync skills..." -ForegroundColor Cyan
$SkillsSrc = Join-Path $ClaudeDir "skills"
$SkillsDest = Join-Path $RepoRoot "skills"

# Nettoyer la cible (en preservant .gitkeep si present)
Get-ChildItem -Path $SkillsDest -Directory | Where-Object { $_.Name -notin $ExcludedSkills } | Remove-Item -Recurse -Force

$syncedCount = 0
Get-ChildItem -Path $SkillsSrc -Directory | ForEach-Object {
    $name = $_.Name
    # Skip symlinks externes
    if ($name -in $ExcludedSkills) { return }
    # Skip si c'est un reparse point (symlink Windows)
    if ($_.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        Write-Host "[SKIP] $name (symlink externe)" -ForegroundColor Yellow
        return
    }
    $dest = Join-Path $SkillsDest $name
    Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
    $syncedCount++
}
Write-Host "[OK] $syncedCount skills synchronises" -ForegroundColor Green
Write-Host ""

# --- 2. Team plugins ---
Write-Host "2/3 Sync team-plugins..." -ForegroundColor Cyan
$TPDest = Join-Path $RepoRoot "team-plugins"
if (Test-Path $TPDest) { Remove-Item -Path $TPDest -Recurse -Force }
Copy-Item -Path $TeamPluginsDir -Destination $TPDest -Recurse -Force

# Nettoyer artefact zip si present
$ZipArtefact = Join-Path $TPDest "plugins\head-of-.zip"
if (Test-Path $ZipArtefact) { Remove-Item $ZipArtefact -Force }

$pluginCount = (Get-ChildItem -Path (Join-Path $TPDest "plugins") -Directory).Count
Write-Host "[OK] $pluginCount plugins synchronises" -ForegroundColor Green
Write-Host ""

# --- 3. Hook ---
Write-Host "3/3 Sync hook block-destructive..." -ForegroundColor Cyan
$HookSrc = Join-Path $ClaudeDir "hooks\block-destructive.sh"
$HookDest = Join-Path $RepoRoot "hooks\block-destructive.sh"
if (Test-Path $HookSrc) {
    Copy-Item -Path $HookSrc -Destination $HookDest -Force
    Write-Host "[OK] hook synchronise" -ForegroundColor Green
} else {
    Write-Host "[WARN] hook non trouve en local, skip" -ForegroundColor Yellow
}
Write-Host ""

# --- Git status ---
Write-Host "=== SYNC TERMINE ===" -ForegroundColor Green
Write-Host ""

Push-Location $RepoRoot
try {
    if (Test-Path (Join-Path $RepoRoot ".git")) {
        Write-Host "Git status :" -ForegroundColor Cyan
        git status --short
        Write-Host ""
        Write-Host "Pour committer :" -ForegroundColor Cyan
        Write-Host "  git add ."
        Write-Host "  git commit -m 'sync: skills + plugins'"
        Write-Host "  git push"
    } else {
        Write-Host "[INFO] Pas encore de repo git. Pour initialiser :" -ForegroundColor Yellow
        Write-Host "  cd $RepoRoot"
        Write-Host "  git init"
        Write-Host "  git add ."
        Write-Host "  git commit -m 'initial: flip claude setup'"
        Write-Host "  gh repo create flip-claude-setup --private --source=. --push"
    }
} finally {
    Pop-Location
}
Write-Host ""
