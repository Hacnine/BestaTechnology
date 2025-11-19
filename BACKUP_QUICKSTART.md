# Quick Reference - Automated Backup System

## ✅ System Status

The automated backup system is now **RUNNING** and will backup your database **automatically every day at 2:00 AM**.

## How It Works

### Automatic Backups (Daily at 2 AM)
- Container: `besta-backup-scheduler` (always running)
- Schedule: `0 2 * * *` (Every day at 2:00 AM)
- Location: `D:\BestaApparels\backups\`
- Format: `besta_backup_YYYY-MM-DDTHH-MM-SS.sql.gz`
- Compression: Gzip (level 9) - saves ~83% space
- Retention: Keeps backups for 7 days (configurable)

### Containers
- `besta-backup-scheduler` - **Always running**, schedules automatic backups via cron
- `besta-backup` - For manual one-time backups only

## Common Commands

### Check if scheduler is running
```powershell
docker compose ps
# Should show besta-backup-scheduler as "Up"
```

### View backup logs
```powershell
docker exec besta-backup-scheduler cat /app/backups/backup.log
```

### List all backups
```powershell
Get-ChildItem .\backups\*.gz | Sort-Object LastWriteTime -Descending
```

### Run manual backup (outside schedule)
```powershell
docker compose run --rm backup
```

### Test backup manually from scheduler
```powershell
docker exec besta-backup-scheduler node /app/dump-db.js
```

### Stop automatic backups
```powershell
docker compose stop backup-scheduler
```

### Restart automatic backups
```powershell
docker compose start backup-scheduler
```

### View cron schedule
```powershell
docker exec besta-backup-scheduler crontab -l
```

## Restore Database

### Option 1: Using restore script (Linux/Mac)
```bash
chmod +x scripts/restore-backup.sh
./scripts/restore-backup.sh backups/besta_backup_2025-11-19T12-35-09.sql.gz
```

### Option 2: Direct restore (PowerShell on Windows)
```powershell
# View backup contents first (optional)
Get-Content .\backups\besta_backup_2025-11-19T12-35-09.sql.gz | 
  & 7z e -si -so | Select-String -Pattern "CREATE TABLE" | Select-Object -First 10

# Restore backup
Get-Content .\backups\besta_backup_2025-11-19T12-35-09.sql.gz | 
  & 7z e -si -so | 
  docker exec -i besta-mysql mysql -u bestauser -pbestapass besta
```

### Option 3: Manual decompress then restore
```powershell
# Decompress
7z e .\backups\besta_backup_2025-11-19T12-35-09.sql.gz

# Restore
Get-Content .\besta_backup_2025-11-19T12-35-09.sql | 
  docker exec -i besta-mysql mysql -u bestauser -pbestapass besta
```

## Configuration

### Change backup schedule
Edit `scripts/Dockerfile.backup-cron` and change the cron expression:
```dockerfile
# Current: Daily at 2 AM
RUN echo "0 2 * * * cd /app && node dump-db.js >> /app/backups/backup.log 2>&1"

# Examples:
# Every 6 hours:  0 */6 * * *
# Every day at 3 AM: 0 3 * * *
# Twice daily (2 AM and 2 PM): 0 2,14 * * *
# Every Sunday at midnight: 0 0 * * 0
```

Then rebuild:
```powershell
docker compose build backup-scheduler
docker compose up -d backup-scheduler
```

### Change retention period
Edit `docker-compose.yml` under `backup-scheduler` environment:
```yaml
LOCAL_RETENTION_DAYS: "7"  # Change to desired number of days
```

Then restart:
```powershell
docker compose up -d backup-scheduler
```

### Enable Google Cloud Storage upload
1. Create GCS bucket and service account (see `scripts/BACKUP_README.md`)
2. Download `gcs-service-account-key.json` to project root
3. Edit `docker-compose.yml` under `backup-scheduler`:
   ```yaml
   environment:
     UPLOAD_TO_GCS: "true"
     GCS_BUCKET: "your-backup-bucket-name"
     GOOGLE_APPLICATION_CREDENTIALS: /app/gcs-key.json
   volumes:
     - ./gcs-service-account-key.json:/app/gcs-key.json:ro
   ```
4. Restart: `docker compose up -d backup-scheduler`

## Monitoring

### Check if backups are running
```powershell
# View recent backup files
Get-ChildItem .\backups\*.gz | 
  Sort-Object LastWriteTime -Descending | 
  Select-Object -First 10

# View backup log
docker exec besta-backup-scheduler tail -n 50 /app/backups/backup.log
```

### Check container health
```powershell
docker compose ps
docker compose logs backup-scheduler
```

### Alert on failures
Set up Windows Task Scheduler to run a monitoring script that checks:
- Last backup file age (should be < 24 hours)
- Backup log for errors
- Container running status

## Troubleshooting

### Scheduler not running
```powershell
docker compose up -d backup-scheduler
```

### Backups not being created
```powershell
# Check logs
docker compose logs backup-scheduler

# Test manual backup
docker exec besta-backup-scheduler node /app/dump-db.js

# Check cron is running
docker exec besta-backup-scheduler ps aux | Select-String cron
```

### Old backups not being deleted
- Check `LOCAL_RETENTION_DAYS` in docker-compose.yml
- Check file permissions in `backups/` folder
- Verify `KEEP_LOCAL_BACKUP` is `"true"`

### MySQL connection failed
- Verify MySQL container is healthy: `docker compose ps`
- Check `DB_HOST` matches MySQL service name
- Verify credentials in environment variables

## Security Notes

- ✅ Backups are compressed and stored locally
- ✅ Service account key (if using GCS) is mounted read-only
- ✅ Credentials passed via environment variables
- ⚠️ Never commit `gcs-service-account-key.json` to Git
- ⚠️ Restrict access to `backups/` folder

## Next Steps

1. ✅ Automated backups running (every day at 2 AM)
2. ✅ Local retention (7 days)
3. ⏳ Optional: Set up Google Cloud Storage upload
4. ⏳ Optional: Set up monitoring/alerting
5. ⏳ Test restore procedure regularly

For detailed documentation, see `scripts/BACKUP_README.md`
