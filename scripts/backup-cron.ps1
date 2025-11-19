# PowerShell script to run daily database backups
# Usage: Schedule with Windows Task Scheduler

$ErrorActionPreference = "Stop"

$ProjectRoot = "D:\BestaApparels"
Set-Location $ProjectRoot

Write-Host "=== Starting backup at $(Get-Date) ==="

try {
    docker compose run --rm backup
    Write-Host "=== Backup completed at $(Get-Date) ==="
} catch {
    Write-Error "Backup failed: $_"
    exit 1
}
