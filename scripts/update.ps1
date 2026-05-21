<#
.SYNOPSIS
  Met à jour la conf Team Plugins depuis ce repo. Pull + sync + suppression
  des skills/plugins qui ne sont plus dans le marketplace.

.DESCRIPTION
  Contrairement à install.ps1 (qui ne fait qu'ajouter/écraser), update.ps1
  SUPPRIME ce qui n'existe plus côté repo. Pour éviter d'effacer les skills
  perso de l'user, on track ce qu'on a installé via un manifest :
  ~/.claude/.team-plugins-manifest.json

  Au premier run, le manifest est créé avec l'état actuel + une liste
  explicite de skills "deprecated" (= retirées de versions antérieures) qui
  sont nettoyées même sans manifest.

.PARAMETER NoPull
  Ne lance pas git pull (utile pour tester sur un état local déjà à jour).

.PARAMETER DryRun
  Affiche ce qui serait fait sans rien modifier.

.EXAMPLE
  .\scripts\update.ps1
  .\scripts\update.ps1 -DryRun
  .\scripts\update.ps1 -NoPull
#>

param(
    [switch]$NoPull,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# --- Paths ---
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ClaudeDir = Join-Path $env:USERPROFILE ".claude"
$TeamPluginsDir = Join-Path $env:USERPROFILE "team-plugins"
$SkillsDest = Join-Path $ClaudeDir "skills"
$ManifestPath = Join-Path $ClaudeDir ".team-plugins-manifest.json"

# Skills explicitement deprecated (retirées de versions antérieures).
# Toujours nettoyées, même sans manifest.
$DeprecatedSkills = @(
    "apprentissages",
    "autoecole-expert",
    "maintenance",
    "orchestrator",
    "plugin-syncer",
    "skill-feeder",
    "switch-diagnostic-pme",
    "switch-proposition-commerciale",
    "veille-vendredi"
)

Write-Host ""
Write-Host "=== Team Plugins - Update ===" -ForegroundColor Cyan
Write-Host "Repo            : $RepoRoot"
Write-Host "Cible Claude    : $ClaudeDir"
Write-Host "Manifest        : $ManifestPath"
if ($DryRun) { Write-Host "Mode            : DRY RUN (rien ne sera modifié)" -ForegroundColor Yellow }
Write-Host ""

# --- 1. Git pull ---
if (-not $NoPull) {
    Write-Host "1/5 Pull des updates..." -ForegroundColor Cyan
    Push-Location $RepoRoot
    try {
        if ($DryRun) {
            Write-Host "[DRY] git pull" -ForegroundColor Yellow
        } else {
            git pull
            if ($LASTEXITCODE -ne 0) {
                Write-Host "[ERREUR] git pull a échoué" -ForegroundColor Red
                exit 1
            }
        }
    } finally { Pop-Location }
    Write-Host ""
} else {
    Write-Host "1/5 Pull skippé (-NoPull)" -ForegroundColor Yellow
    Write-Host ""
}

# --- 2. Lire l'état actuel du repo ---
Write-Host "2/5 Lecture de l'état du repo..." -ForegroundColor Cyan
$RepoSkillsDir = Join-Path $RepoRoot "skills"
$RepoSkills = if (Test-Path $RepoSkillsDir) {
    (Get-ChildItem -Path $RepoSkillsDir -Directory).Name
} else { @() }

$RepoPluginsDir = Join-Path $RepoRoot "team-plugins\plugins"
$RepoPlugins = if (Test-Path $RepoPluginsDir) {
    (Get-ChildItem -Path $RepoPluginsDir -Directory).Name
} else { @() }

Write-Host "[INFO] $($RepoSkills.Count) skills dans le repo"
Write-Host "[INFO] $($RepoPlugins.Count) plugins dans le repo"
Write-Host ""

# --- 3. Lire le manifest (ce qu'on avait installé avant) ---
Write-Host "3/5 Lecture du manifest précédent..." -ForegroundColor Cyan
$PrevSkills = @()
$PrevPlugins = @()
if (Test-Path $ManifestPath) {
    try {
        $Manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
        $PrevSkills = @($Manifest.skills)
        $PrevPlugins = @($Manifest.plugins)
        Write-Host "[INFO] Manifest trouvé (dernier sync : $($Manifest.lastSync))"
    } catch {
        Write-Host "[WARN] Manifest illisible, considéré vide" -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Pas de manifest (premier run)"
}
Write-Host ""

# --- 4. Calculer ce qu'il faut supprimer ---
Write-Host "4/5 Calcul des suppressions..." -ForegroundColor Cyan

# Skills à supprimer = (skills du manifest + deprecated) ∩ (skills NON dans repo) ∩ (skills installés)
$SkillsToRemove = @(($PrevSkills + $DeprecatedSkills) | Sort-Object -Unique | Where-Object { $_ -notin $RepoSkills })

# Plugins à supprimer = plugins du manifest qui ne sont plus dans le repo
$PluginsToRemove = @($PrevPlugins | Where-Object { $_ -notin $RepoPlugins })

if ($SkillsToRemove.Count -eq 0 -and $PluginsToRemove.Count -eq 0) {
    Write-Host "[OK] Rien à supprimer" -ForegroundColor Green
} else {
    if ($SkillsToRemove.Count -gt 0) {
        Write-Host "[INFO] Skills à supprimer : $($SkillsToRemove -join ', ')" -ForegroundColor Yellow
    }
    if ($PluginsToRemove.Count -gt 0) {
        Write-Host "[INFO] Plugins à supprimer : $($PluginsToRemove -join ', ')" -ForegroundColor Yellow
    }
}

# Exécution des suppressions
foreach ($skill in $SkillsToRemove) {
    $skillPath = Join-Path $SkillsDest $skill
    if (Test-Path $skillPath) {
        if ($DryRun) {
            Write-Host "[DRY] Remove-Item $skillPath" -ForegroundColor Yellow
        } else {
            Remove-Item -Recurse -Force $skillPath -Confirm:$false
            Write-Host "[REMOVED] skill $skill" -ForegroundColor Red
        }
    }
}

foreach ($plugin in $PluginsToRemove) {
    $pluginPath = Join-Path $TeamPluginsDir "plugins\$plugin"
    if (Test-Path $pluginPath) {
        if ($DryRun) {
            Write-Host "[DRY] Remove-Item $pluginPath" -ForegroundColor Yellow
        } else {
            Remove-Item -Recurse -Force $pluginPath -Confirm:$false
            Write-Host "[REMOVED] plugin $plugin" -ForegroundColor Red
        }
    }
}
Write-Host ""

# --- 5. Re-sync (copy avec écrasement pour les MAJ) ---
Write-Host "5/5 Sync des skills et plugins depuis le repo..." -ForegroundColor Cyan

if (-not $DryRun) {
    # Skills (force overwrite)
    if (-not (Test-Path $SkillsDest)) { New-Item -Path $SkillsDest -ItemType Directory -Force | Out-Null }
    foreach ($skill in $RepoSkills) {
        $src = Join-Path $RepoSkillsDir $skill
        $dst = Join-Path $SkillsDest $skill
        if (Test-Path $dst) { Remove-Item -Recurse -Force $dst -Confirm:$false }
        Copy-Item -Path $src -Destination $dst -Recurse -Force
    }
    Write-Host "[OK] $($RepoSkills.Count) skills synchronisées" -ForegroundColor Green

    # Plugins (delete & re-copy le marketplace complet)
    if (Test-Path $TeamPluginsDir) {
        # Backup safety : si symlink, on touche pas
        $item = Get-Item $TeamPluginsDir -Force
        if ($item.LinkType) {
            Write-Host "[SKIP] $TeamPluginsDir est un symlink (dev mode), pas de copie" -ForegroundColor Yellow
        } else {
            Remove-Item -Recurse -Force $TeamPluginsDir -Confirm:$false
            Copy-Item -Path (Join-Path $RepoRoot "team-plugins") -Destination $TeamPluginsDir -Recurse -Force
            Write-Host "[OK] team-plugins marketplace synchronisé ($($RepoPlugins.Count) plugins)" -ForegroundColor Green
        }
    } else {
        Copy-Item -Path (Join-Path $RepoRoot "team-plugins") -Destination $TeamPluginsDir -Recurse -Force
        Write-Host "[OK] team-plugins marketplace installé ($($RepoPlugins.Count) plugins)" -ForegroundColor Green
    }

    # Update manifest
    $newManifest = @{
        skills = $RepoSkills
        plugins = $RepoPlugins
        lastSync = (Get-Date -Format "o")
    } | ConvertTo-Json -Depth 3
    Set-Content -Path $ManifestPath -Value $newManifest -Encoding utf8
    Write-Host "[OK] Manifest mis à jour" -ForegroundColor Green
} else {
    Write-Host "[DRY] Sync skills + plugins + update manifest" -ForegroundColor Yellow
}
Write-Host ""

# --- Fin ---
Write-Host "=== UPDATE TERMINÉ ===" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Cyan
Write-Host "  1. Dans Claude Code : /plugin -> Reload marketplace"
Write-Host "  2. Si un plugin a été retiré du marketplace, le désinstaller via /plugin"
Write-Host ""
