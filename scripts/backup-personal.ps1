<#
.SYNOPSIS
  Backup OU restore les donnees personnelles de Claude (memoire, transcripts, credentials).

.DESCRIPTION
  Cree un zip contenant :
    - .credentials.json
    - .mcp.json (avec tokens si renseignes)
    - mcp-needs-auth-cache.json
    - projects/ (memoire vivante par projet)
    - sessions/ (transcripts sessions actuelles)
    - history.jsonl
    - todos/

  Ce zip est PERSONNEL et NE DOIT PAS aller sur GitHub. Stocke-le sur :
    - OneDrive perso
    - Google Drive perso
    - Cle USB chiffree

.PARAMETER Restore
  Mode restauration au lieu de backup.

.PARAMETER SourceZip
  Chemin du zip a restaurer (requis avec -Restore).

.PARAMETER OutputDir
  Dossier ou ecrire le zip de backup. Defaut : Desktop.

.EXAMPLE
  # Backup
  .\scripts\backup-personal.ps1

  # Backup vers un dossier specifique
  .\scripts\backup-personal.ps1 -OutputDir "D:\backups"

  # Restore
  .\scripts\backup-personal.ps1 -Restore -SourceZip "<chemin>\claude-personal-YYYY-MM-DD.zip"
#>

param(
    [switch]$Restore,
    [string]$SourceZip,
    [string]$OutputDir = (Join-Path $env:USERPROFILE "Desktop")
)

$ErrorActionPreference = "Stop"

$ClaudeDir = Join-Path $env:USERPROFILE ".claude"

if (-not (Test-Path $ClaudeDir)) {
    Write-Host "[ERREUR] ~/.claude/ introuvable" -ForegroundColor Red
    exit 1
}

# === MODE RESTORE ===
if ($Restore) {
    if (-not $SourceZip) {
        Write-Host "[ERREUR] -SourceZip requis en mode -Restore" -ForegroundColor Red
        exit 1
    }
    if (-not (Test-Path $SourceZip)) {
        Write-Host "[ERREUR] Zip non trouve : $SourceZip" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "=== Restore donnees perso Claude ===" -ForegroundColor Cyan
    Write-Host "Source zip : $SourceZip"
    Write-Host "Cible      : $ClaudeDir"
    Write-Host ""

    # Backup defensif de l'etat actuel
    $existingBackup = Join-Path $env:USERPROFILE "Desktop\claude-pre-restore-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
    Write-Host "[INFO] Sauvegarde defensive de l'etat actuel -> $existingBackup" -ForegroundColor Yellow
    $itemsToBackup = @("projects", "sessions", "history.jsonl", "todos", ".credentials.json", ".mcp.json", "mcp-needs-auth-cache.json") |
        ForEach-Object { Join-Path $ClaudeDir $_ } |
        Where-Object { Test-Path $_ }
    if ($itemsToBackup.Count -gt 0) {
        Compress-Archive -Path $itemsToBackup -DestinationPath $existingBackup -Force
    }

    # Extraction
    Expand-Archive -Path $SourceZip -DestinationPath $ClaudeDir -Force
    Write-Host "[OK] Restauration terminee" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifie : lance 'claude' et regarde si tes memoires + historique sont la." -ForegroundColor Cyan
    exit 0
}

# === MODE BACKUP ===
Write-Host ""
Write-Host "=== Backup donnees perso Claude ===" -ForegroundColor Cyan
Write-Host "Source  : $ClaudeDir"
Write-Host "Cible   : $OutputDir"
Write-Host ""

if (-not (Test-Path $OutputDir)) {
    New-Item -Path $OutputDir -ItemType Directory -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd"
$zipName = "claude-personal-$timestamp.zip"
$zipPath = Join-Path $OutputDir $zipName

# Liste des elements a backupper
$items = @(
    "projects",
    "sessions",
    "history.jsonl",
    "todos",
    "session-env",
    ".credentials.json",
    ".mcp.json",
    "mcp-needs-auth-cache.json",
    "settings.json",
    "settings.local.json",
    "CLAUDE.md"
)

$itemsFull = $items |
    ForEach-Object { Join-Path $ClaudeDir $_ } |
    Where-Object { Test-Path $_ }

if ($itemsFull.Count -eq 0) {
    Write-Host "[WARN] Rien a backupper" -ForegroundColor Yellow
    exit 0
}

Write-Host "Items inclus :" -ForegroundColor Cyan
$itemsFull | ForEach-Object {
    $size = if (Test-Path $_ -PathType Container) {
        $b = (Get-ChildItem $_ -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        if ($b) { "{0:N1} MB" -f ($b / 1MB) } else { "0 KB" }
    } else {
        "{0:N1} KB" -f ((Get-Item $_).Length / 1KB)
    }
    Write-Host "  - $(Split-Path -Leaf $_) ($size)"
}
Write-Host ""

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path $itemsFull -DestinationPath $zipPath -CompressionLevel Optimal

$zipSize = "{0:N1} MB" -f ((Get-Item $zipPath).Length / 1MB)
Write-Host "=== BACKUP TERMINE ===" -ForegroundColor Green
Write-Host "Fichier : $zipPath ($zipSize)" -ForegroundColor Green
Write-Host ""
Write-Host "RAPPEL : ce zip est PERSONNEL." -ForegroundColor Yellow
Write-Host "  - PAS sur GitHub"
Write-Host "  - PAS dans ce repo (jamais committer la memoire perso)"
Write-Host "  - Stocke sur OneDrive perso, GDrive perso, ou cle USB chiffree"
Write-Host ""
