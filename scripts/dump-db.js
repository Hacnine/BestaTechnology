const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');

// Read from environment with safe fallbacks (from your docker-compose)
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const user = process.env.DB_USER || 'bestauser';
const password = process.env.DB_PASSWORD || 'bestapass';
const database = process.env.DB_NAME || 'besta';
const outDir = process.env.DUMP_DIR || path.resolve(__dirname, '..', 'backups');
const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
const outFile = path.join(outDir, `besta_backup_${date}.sql`);

fs.mkdirSync(outDir, { recursive: true });

async function dump() {
  console.log('Dumping database:', database, '->', outFile);
  try {
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
    process.exit(0);
  } catch (err) {
    console.error('Database dump failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

dump();


// New-Item -ItemType Directory -Force -Path D:\BestaApparels\backups ; docker exec besta-mysql sh -c 'exec mysqldump -u"bestauser" -p"bestapass" besta > /tmp/besta_backup.sql' ; docker cp besta-mysql:/tmp/besta_backup.sql D:\BestaApparels\backups\besta_backup_20251119.sql ; docker exec besta-mysql rm /tmp/besta_backup.sql