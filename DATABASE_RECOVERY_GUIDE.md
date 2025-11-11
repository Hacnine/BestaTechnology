# Database Recovery Guide: Docker Volume Data Restoration

## The Full Story: What Happened to Your Database

This guide explains how to recover data when Docker volume names change during container migrations, causing data to appear "lost" when it's actually stored in a different volume.

## 📋 Scenario
- You had separate frontend/backend repositories with individual Docker setups
- During monorepo migration, Docker volume names changed
- New containers used fresh volumes, making old data appear inaccessible
- Data was never actually lost - just stored in old Docker volumes

## 🔍 Step-by-Step Investigation & Recovery

### Step 1: Check Current Database Status
```bash
# Check what Docker volumes exist
docker volume ls

# Check current database content
docker exec <your-mysql-container> mysql -u root -p<your-password> -e "USE <your-db>; SELECT COUNT(*) as users FROM users; SELECT COUNT(*) as tnas FROM tnas;"
```

**Expected Output:**
```
DRIVER    VOLUME NAME
local     bestaapparels_mysql_data          # NEW volume (may be empty)
local     bestaapparelsbackend_mysql_data   # OLD volume (contains your data)
```

### Step 2: Access Old Database Volume
```bash
# Create temporary container using OLD volume
docker run -d --name temp-mysql-recovery \
  -v bestaapparelsbackend_mysql_data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=your_root_password \
  mysql:8.
docker exec temp-mysql-recovery mysql -u root -pyour_root_password -e "USE your_db_name; SHOW TABLES; SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM tnas;"
```

### Step 3: Backup Old Database
```bash
# Create SQL dump of old database
docker exec temp-mysql-recovery mysqldump -u root -pyour_root_password your_db_name > old_database_backup.sql

# Or pipe directly to new database (recommended)
docker exec temp-mysql-recovery mysqldump -u root -pyour_root_password your_db_name | \
docker exec -i <new-mysql-container> mysql -u root -pyour_root_password your_db_name
```

### Step 4: Verify Data Restoration
```bash
# Check restored data in new database
docker exec <new-mysql-container> mysql -u root -pyour_root_password -e "
USE your_db_name;
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as tnas FROM tnas;
SELECT COUNT(*) as employees FROM employees;
SELECT userName, role FROM users ORDER BY userName;
"
```

### Step 5: Cleanup
```bash
# Stop and remove temporary container
docker stop temp-mysql-recovery
docker rm temp-mysql-recovery

# Optional: Remove old volume after confirming data is restored
# docker volume rm bestaapparelsbackend_mysql_data
```

## 🐛 Debugging Commands

### Check Docker Volumes
```bash
# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect <volume_name>

# Check volume disk usage
docker system df -v
```

### Database Connection Testing
```bash
# Test MySQL connection
docker exec <mysql-container> mysql -u root -p<password> -e "SELECT 1;"

# Show databases
docker exec <mysql-container> mysql -u root -p<password> -e "SHOW DATABASES;"

# Show tables in specific database
docker exec <mysql-container> mysql -u root -p<password> -e "USE <db_name>; SHOW TABLES;"

# Count records in tables
docker exec <mysql-container> mysql -u root -p<password> -e "USE <db_name>; SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM tnas;"
```

### Container Debugging
```bash
# Check container logs
docker logs <container_name>

# Check container status
docker ps -a

# Inspect container configuration
docker inspect <container_name>

# Execute shell in running container
docker exec -it <container_name> bash
```

### Volume Data Inspection
```bash
# Mount volume to temporary container for inspection
docker run -it --rm -v <volume_name>:/data alpine ls -la /data

# Copy files from volume
docker run -it --rm -v <volume_name>:/data alpine cp /data/file.txt /host/path/
```

## 🔧 Prisma-Specific Commands

### Check Prisma Status
```bash
# Check current migration status
npx prisma migrate status

# Validate schema
npx prisma validate

# Generate client
npx prisma generate

# Push schema changes (CAUTION: may modify data structure)
npx prisma db push
```

### Database Schema Operations
```bash
# Create migration
npx prisma migrate dev --name <migration_name>

# Reset database (DANGER: destroys all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## 📊 Data Verification Scripts

### Node.js Script to Check Database Content
```javascript
// save as check-db.js
import { PrismaClient } from '@prisma/client';

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('=== DATABASE STATUS ===\n');

    const [userCount, tnaCount, employeeCount] = await Promise.all([
      prisma.user.count(),
      prisma.tNA.count(),
      prisma.employee.count()
    ]);

    console.log(`Users: ${userCount}`);
    console.log(`TNA Records: ${tnaCount}`);
    console.log(`Employees: ${employeeCount}`);

    const users = await prisma.user.findMany({
      select: { userName: true, role: true },
      orderBy: { userName: 'asc' }
    });

    console.log('\n=== USER LIST ===');
    users.forEach(user => {
      console.log(`${user.userName} (${user.role})`);
    });

  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
```

**Run the script:**
```bash
# Copy to container and run
docker cp check-db.js <backend-container>:/app/
docker exec <backend-container> node check-db.js
```

## 🚨 Important Safety Notes

### Before Any Database Operations:
1. **Always backup first**: `mysqldump > backup.sql`
2. **Check volume names**: `docker volume ls`
3. **Verify data exists**: Count records before changes
4. **Test on staging**: Never modify production without testing

### Common Mistakes to Avoid:
- Running `prisma migrate reset` on production data
- Using `docker volume rm` without verifying data is copied
- Assuming volume names stay the same after migrations
- Not checking old volumes when data seems "missing"

### Recovery Checklist:
- [ ] Check `docker volume ls` for old volumes
- [ ] Create temp container with old volume
- [ ] Verify data exists in old volume
- [ ] Backup old data with mysqldump
- [ ] Restore to current database
- [ ] Verify counts match
- [ ] Cleanup temp containers

## 🎯 Quick Recovery Commands

```bash
# One-liner to check if old data exists
docker run --rm -v <old_volume>:/var/lib/mysql mysql:8 mysqldump -u root -p<pass> <db> | wc -l

# Direct volume-to-volume copy (if same MySQL version)
docker run --rm -v <old_volume>:/old -v <new_volume>:/new alpine cp -r /old/mysql /new/

# Emergency data export
docker run --rm -v <volume>:/data alpine tar czf - /data > volume_backup.tar.gz
```

## 📞 When to Use This Guide

Use this guide when:
- Database appears empty after Docker migrations
- Container recreations cause data loss symptoms
- Volume names changed during infrastructure updates
- Need to verify data exists in old Docker volumes

**Remember: Docker volumes persist until explicitly removed. Your data is usually still there!**


import { PrismaClient } from '@prisma/client';

async function showUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('=== USER LIST ===\n');

    const users = await prisma.user.findMany({
      select: {
        userName: true,
        role: true,
        employee: {
          select: {
            name: true,
            email: true,
            status: true
          }
        }
      },
      orderBy: { userName: 'asc' }
    });

    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.userName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Name: ${user.employee?.name || 'N/A'}`);
      console.log(`   Email: ${user.employee?.email || 'N/A'}`);
      console.log(`   Status: ${user.employee?.status || 'N/A'}`);
      console.log('   ---');
    });

    console.log(`\nTotal users: ${users.length}`);

  } catch (error) {
    console.error('Error fetching users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showUsers();