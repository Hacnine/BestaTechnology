#!/bin/bash
# Cron job script to run daily database backups
# Usage: Add to crontab with: 0 2 * * * /path/to/backup-cron.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Starting backup at $(date) ==="

# Option 1: Run via Docker Compose (recommended)
cd "$PROJECT_ROOT"
docker compose run --rm backup

# Option 2: Run directly with Node (if not using Docker)
# cd "$SCRIPT_DIR"
# node dump-db.js

echo "=== Backup completed at $(date) ==="
