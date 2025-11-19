# PowerShell script to restore a MySQL backup from gzipped SQL file
# Usage: .\restore-backup.ps1 -BackupFile "backup_file.sql.gz" [-Database "db_name"]

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    
    [Parameter(Mandatory=$false)]
    [string]$Database = "besta",
    
    [Parameter(Mandatory=$false)]
    [string]$Container = "besta-mysql",
    
    [Parameter(Mandatory=$false)]
    [string]$User = "bestauser",
    
    [Parameter(Mandatory=$false)]
    [string]$Password = "bestapass"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    Write-Error "Backup file not found: $BackupFile"
    exit 1
}

Write-Host "=== MySQL Backup Restore ===" -ForegroundColor Cyan
Write-Host "Backup file: $BackupFile"
Write-Host "Target database: $Database"
Write-Host "Container: $Container"
Write-Host ""

# Confirm
$confirm = Read-Host "This will OVERWRITE the database '$Database'. Are you sure? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nDecompressing and restoring backup..." -ForegroundColor Green

# Method 1: Decompress locally and pipe to docker exec
try {
    # Decompress the gzip file and pipe directly to mysql in container
    $process = Start-Process -FilePath "docker" -ArgumentList @(
        "exec", "-i", $Container,
        "mysql", "-u$User", "-p$Password", $Database
    ) -NoNewWindow -PassThru -RedirectStandardInput (
        [System.IO.Compression.GZipStream]::new(
            [System.IO.File]::OpenRead($BackupFile),
            [System.IO.Compression.CompressionMode]::Decompress
        )
    )
    
    $process.WaitForExit()
    
    if ($process.ExitCode -eq 0) {
        Write-Host "`n✓ Database restored successfully from $BackupFile" -ForegroundColor Green
    } else {
        Write-Error "Restore failed with exit code: $($process.ExitCode)"
    }
} catch {
    Write-Error "Restore failed: $_"
    
    Write-Host "`nAlternative method: Decompress first, then restore" -ForegroundColor Yellow
    Write-Host "Run these commands manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "# Decompress:" -ForegroundColor Gray
    Write-Host "gunzip -k $BackupFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "# Restore:" -ForegroundColor Gray
    $sqlFile = $BackupFile -replace '\.gz$', ''
    Write-Host "Get-Content '$sqlFile' | docker exec -i $Container mysql -u$User -p$Password $Database" -ForegroundColor Gray
}
