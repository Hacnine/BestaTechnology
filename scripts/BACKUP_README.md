# Database Backup System

Automated MySQL database backup with gzip compression and Google Cloud Storage (GCS) upload.

## Features

- ✅ Automated daily backups via Docker Compose
- ✅ Gzip compression to save space
- ✅ Upload to Google Cloud Storage (Always Free 5GB)
- ✅ Automatic local backup rotation (configurable retention)
- ✅ Secure credential management via environment variables
- ✅ Docker volume integration with existing `mysql_data`

## Setup Instructions

### 1. Install Dependencies (Local Development)

If running the script locally (outside Docker):

```bash
cd scripts
npm install
```

### 2. Configure Google Cloud Storage (Optional but Recommended)

#### A. Create GCS Bucket in Always Free Region

```bash
# Install gcloud CLI if not already installed
# See: https://cloud.google.com/sdk/docs/install

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Create bucket in an Always Free region
gsutil mb -l us-central1 gs://YOUR-BACKUP-BUCKET-NAME

# Enable versioning (optional but recommended)
gsutil versioning set on gs://YOUR-BACKUP-BUCKET-NAME

# Set lifecycle policy to delete backups older than 30 days
cat > lifecycle.json <<EOF
{
  "rule":[
    {
      "action":{"type":"Delete"},
      "condition":{"age":30}
    }
  ]
}
EOF
gsutil lifecycle set lifecycle.json gs://YOUR-BACKUP-BUCKET-NAME
```

#### B. Create Service Account with Minimal Permissions

```bash
# Create service account
gcloud iam service-accounts create backup-uploader \
  --display-name="Backup uploader"

# Grant storage object creator role (upload only)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:backup-uploader@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectCreator"

# Create and download key
gcloud iam service-accounts keys create gcs-service-account-key.json \
  --iam-account=backup-uploader@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

#### C. Secure the Service Account Key

```bash
# Move key to project root (add to .gitignore!)
mv gcs-service-account-key.json ../gcs-service-account-key.json

# Restrict permissions
chmod 600 ../gcs-service-account-key.json

# Add to .gitignore
echo "gcs-service-account-key.json" >> ../.gitignore
```

### 3. Configure docker-compose.yml

Edit `docker-compose.yml` and update the `backup` service environment:

```yaml
backup:
  environment:
    UPLOAD_TO_GCS: "true"  # Enable GCS upload
    GCS_BUCKET: "YOUR-BACKUP-BUCKET-NAME"  # Your bucket name
    GCS_PREFIX: "besta/"  # Folder path in bucket
    KEEP_LOCAL_BACKUP: "true"  # Keep local copies
    LOCAL_RETENTION_DAYS: "7"  # Delete local backups older than 7 days
    GOOGLE_APPLICATION_CREDENTIALS: /app/gcs-key.json
  volumes:
    - ./backups:/app/backups
    - ./gcs-service-account-key.json:/app/gcs-key.json:ro  # Mount key file
```

### 4. Build the Backup Container

```bash
# From project root
docker compose build backup
```

## Usage

### Run Backup Manually

```bash
# From project root
docker compose run --rm backup
```

### Schedule Daily Automated Backups

#### Option 1: Cron Job (Linux/Mac)

```bash
# Make script executable
chmod +x scripts/backup-cron.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /path/to/BestaApparels/scripts/backup-cron.sh >> /path/to/BestaApparels/backups/backup.log 2>&1
```

#### Option 2: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task → Daily at 2:00 AM
3. Action: Start a Program
   - Program: `powershell.exe`
   - Arguments: `-File "D:\BestaApparels\scripts\backup-cron.ps1"`
4. Create `scripts/backup-cron.ps1`:

```powershell
Set-Location "D:\BestaApparels"
docker compose run --rm backup
```

#### Option 3: Docker Cron Container (Advanced)

Add a separate cron container to `docker-compose.yml`:

```yaml
backup-scheduler:
  image: mcuadros/ofelia:latest
  container_name: besta-backup-scheduler
  depends_on:
    - backup
  command: daemon --docker
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
  labels:
    ofelia.job-run.backup.schedule: "0 0 2 * * *"  # Daily at 2 AM
    ofelia.job-run.backup.container: "besta-backup"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `mysql` | MySQL host (container name in Docker network) |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `bestauser` | MySQL username |
| `DB_PASSWORD` | `bestapass` | MySQL password |
| `DB_NAME` | `besta` | Database name |
| `DUMP_DIR` | `../backups` | Local backup directory |
| `UPLOAD_TO_GCS` | `false` | Enable GCS upload (`true`/`false`) |
| `GCS_BUCKET` | `` | GCS bucket name |
| `GCS_PREFIX` | `besta/` | Folder prefix in bucket |
| `KEEP_LOCAL_BACKUP` | `true` | Keep local copy after upload |
| `LOCAL_RETENTION_DAYS` | `7` | Delete local backups older than N days |
| `GOOGLE_APPLICATION_CREDENTIALS` | - | Path to GCS service account key JSON |

## File Structure

```
scripts/
├── dump-db.js               # Main backup script (enhanced)
├── package.json             # Dependencies
├── Dockerfile.backup        # Backup container image
├── backup-cron.sh           # Cron job wrapper script
└── BACKUP_README.md         # This file

backups/                     # Local backup storage (created automatically)
├── besta_backup_2025-11-19T02-00-00.sql.gz
├── besta_backup_2025-11-20T02-00-00.sql.gz
└── ...

gcs-service-account-key.json # GCS credentials (add to .gitignore!)
```

## Verify Backups

### Check Local Backups

```bash
ls -lh backups/
```

### Check GCS Backups

```bash
gsutil ls -lh gs://YOUR-BACKUP-BUCKET-NAME/besta/
```

### Test Restore

```bash
# Download from GCS
gsutil cp gs://YOUR-BACKUP-BUCKET-NAME/besta/besta_backup_TIMESTAMP.sql.gz ./test-restore.sql.gz

# Decompress
gunzip test-restore.sql.gz

# Restore to a test database
docker exec -i besta-mysql mysql -u bestauser -pbestapass test_db < test-restore.sql
```

## Monitoring & Alerts

### Set GCS Billing Alert

1. Go to Google Cloud Console → Billing → Budgets & alerts
2. Create budget with threshold (e.g., $1)
3. Set alert at 50%, 75%, 100%

### Check Backup Logs

```bash
# View recent backup logs
docker compose logs backup

# Cron log (if using cron)
tail -f backups/backup.log
```

## Troubleshooting

### Backup fails with "Permission denied"

- Check that `gcs-service-account-key.json` is mounted correctly
- Verify service account has `roles/storage.objectCreator` role
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set

### "Bucket not found" error

- Verify bucket name in `GCS_BUCKET` environment variable
- Check bucket exists: `gsutil ls gs://YOUR-BUCKET-NAME`
- Ensure service account has access to the bucket

### MySQL connection refused

- Ensure MySQL container is healthy: `docker compose ps`
- Check `DB_HOST` matches the MySQL service name in `docker-compose.yml`
- Verify credentials match the MySQL environment variables

### Local backups not being cleaned up

- Check `LOCAL_RETENTION_DAYS` is set correctly
- Ensure `KEEP_LOCAL_BACKUP` is `"true"` (string)
- Check file permissions in `backups/` directory

## Cost Optimization

### Google Cloud Storage (Always Free)

- **Free tier:** 5 GB-months Standard storage (us-central1/us-west1/us-east1)
- **Tip:** Compress backups (done automatically with gzip)
- **Tip:** Use lifecycle policy to delete old backups (30 days recommended)
- **Tip:** Keep only weekly/monthly backups long-term

### Reduce Backup Size

1. Exclude unnecessary tables:
   ```javascript
   // In dump-db.js, add to mysqldump config:
   excludeTables: ['logs', 'sessions', 'cache']
   ```

2. Incremental backups (advanced):
   - Enable MySQL binary logs
   - Keep full backup weekly + binlog backups daily

## Security Best Practices

- ✅ Never commit `gcs-service-account-key.json` to Git
- ✅ Use minimal IAM permissions (`storage.objectCreator`)
- ✅ Rotate service account keys every 90 days
- ✅ Enable GCS bucket versioning and Object Lock
- ✅ Encrypt sensitive backups client-side before upload (optional)
- ✅ Use separate service accounts for different environments (dev/prod)

## Next Steps

1. Test manual backup: `docker compose run --rm backup`
2. Verify GCS upload: `gsutil ls gs://YOUR-BUCKET/besta/`
3. Set up automated scheduling (cron/Task Scheduler)
4. Configure billing alerts
5. Test restore procedure

## Support

For issues or questions:
- Check Docker logs: `docker compose logs backup`
- Verify GCS access: `gsutil ls gs://YOUR-BUCKET/`
- Review this README and environment variables
