#!/bin/bash
# Bash script to restore a MySQL backup from gzipped SQL file
# Usage: ./restore-backup.sh backup_file.sql.gz [database_name]

set -e

BACKUP_FILE="$1"
DATABASE="${2:-besta}"
CONTAINER="${CONTAINER:-besta-mysql}"
USER="${MYSQL_USER:-bestauser}"
PASSWORD="${MYSQL_PASSWORD:-bestapass}"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql.gz> [database_name]"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "=== MySQL Backup Restore ==="
echo "Backup file: $BACKUP_FILE"
echo "Target database: $DATABASE"
echo "Container: $CONTAINER"
echo ""

read -p "This will OVERWRITE the database '$DATABASE'. Are you sure? (yes/no) " -r
if [ "$REPLY" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo ""
echo "Decompressing and restoring backup..."

# Decompress and pipe directly to MySQL in container
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" mysql -u"$USER" -p"$PASSWORD" "$DATABASE"

echo ""
echo "✓ Database restored successfully from $BACKUP_FILE"
