const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { Storage } = require('@google-cloud/storage');

// Read from environment with safe fallbacks (from your docker-compose)
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const user = process.env.DB_USER || 'bestauser';
const password = process.env.DB_PASSWORD || 'bestapass';
const database = process.env.DB_NAME || 'besta';
const outDir = process.env.DUMP_DIR || path.resolve(__dirname, '..', 'backups');

// GCS configuration
const gcsBucket = process.env.GCS_BUCKET || ''; // e.g., 'my-backup-bucket'
const gcsPrefix = process.env.GCS_PREFIX || 'besta/'; // folder prefix in bucket
const uploadToGcs = process.env.UPLOAD_TO_GCS === 'true' && gcsBucket;
const keepLocalBackup = process.env.KEEP_LOCAL_BACKUP !== 'false'; // default true
const localRetentionDays = parseInt(process.env.LOCAL_RETENTION_DAYS || '7', 10);

// Timestamp with date and time for multiple backups per day
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-MM-SS
const outFile = path.join(outDir, `besta_backup_${timestamp}.sql`);
const outFileGz = `${outFile}.gz`;

fs.mkdirSync(outDir, { recursive: true });

let storage;
if (uploadToGcs) {
  storage = new Storage(); // Uses GOOGLE_APPLICATION_CREDENTIALS env var
}

async function dump() {
  console.log('Dumping database:', database, '->', outFile);
  try {
    // Step 1: Dump to SQL file
    await mysqldump({
      connection: {
        host,
        port,
        user,
        password,
        database,
      },
      dumpToFile: outFile,
    });
    console.log('Database dump written to', outFile);

    // Step 2: Gzip the dump
    console.log('Compressing backup...');
    await gzipFile(outFile, outFileGz);
    console.log('Backup compressed to', outFileGz);

    // Remove uncompressed SQL file
    fs.unlinkSync(outFile);

    // Step 3: Upload to GCS if configured
    if (uploadToGcs) {
      console.log('Uploading to Google Cloud Storage...');
      const destination = `${gcsPrefix}${path.basename(outFileGz)}`;
      await storage.bucket(gcsBucket).upload(outFileGz, {
        destination,
        metadata: {
          contentType: 'application/gzip',
        },
      });
      console.log(`Backup uploaded to gs://${gcsBucket}/${destination}`);
    }

    // Step 4: Clean up local backups older than retention period
    if (keepLocalBackup) {
      cleanOldBackups(outDir, localRetentionDays);
    } else if (uploadToGcs) {
      // If not keeping local and uploaded successfully, delete local copy
      fs.unlinkSync(outFileGz);
      console.log('Local backup removed (uploaded to GCS)');
    }

    console.log('Backup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Database dump failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

function gzipFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip({ level: 9 }); // max compression

    input
      .pipe(gzip)
      .pipe(output)
      .on('finish', resolve)
      .on('error', reject);
  });
}

function cleanOldBackups(directory, retentionDays) {
  try {
    const now = Date.now();
    const maxAge = retentionDays * 24 * 60 * 60 * 1000; // days to ms
    const files = fs.readdirSync(directory);

    let deleted = 0;
    files.forEach((file) => {
      if (!file.startsWith('besta_backup_') || !file.endsWith('.sql.gz')) return;
      
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      const age = now - stat.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        deleted++;
        console.log(`Deleted old backup: ${file}`);
      }
    });

    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} old backup(s)`);
    }
  } catch (err) {
    console.warn('Error cleaning old backups:', err.message);
  }
}

dump();


// New-Item -ItemType Directory -Force -Path D:\BestaApparels\backups ; docker exec besta-mysql sh -c 'exec mysqldump -u"bestauser" -p"bestapass" besta > /tmp/besta_backup.sql' ; docker cp besta-mysql:/tmp/besta_backup.sql D:\BestaApparels\backups\besta_backup_20251119.sql ; docker exec besta-mysql rm /tmp/besta_backup.sql