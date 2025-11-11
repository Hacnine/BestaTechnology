# Docker Commands Reference for Besta Apparels

## Location
Run these commands from: `d:\BestaApparels\BestaApparelsBackend`

---

## Common Commands

### Start Containers
```powershell
# Start all containers in detached mode (recommended)
docker compose up -d

# Start with logs visible
docker compose up

# Rebuild and start (use when code changes)
docker compose up --build -d
```

### Stop Containers
```powershell
# Stop all containers (keeps data)
docker compose stop

# Stop and remove containers (keeps volumes/data)
docker compose down

# Stop, remove containers AND volumes (DANGER - loses all data!)
docker compose down -v
```

### View Logs
```powershell
# Backend logs (last 20 lines)
docker logs besta-backend --tail 20

# Backend logs (follow/live)
docker logs besta-backend --tail 20 -f

# Frontend logs
docker logs besta-frontend --tail 20 -f

# MySQL logs
docker logs besta-mysql --tail 20 -f

# Redis logs
docker logs besta-redis --tail 20 -f

# All containers logs
docker compose logs -f
```

### Container Management
```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Check status of services
docker compose ps

# Restart all containers
docker compose restart

# Restart specific container
docker restart besta-backend
```

### Access Container Shell
```powershell
# Access backend container
docker exec -it besta-backend bash

# Access frontend container
docker exec -it besta-frontend bash

# Access MySQL container
docker exec -it besta-mysql bash
```

### Database Operations
```powershell
# Access MySQL CLI
docker exec -it besta-mysql mysql -u bestauser -pbestapass besta

# Backup database
docker exec besta-mysql mysqldump -u bestauser -pbestapass besta > backup.sql

# Restore database
docker exec -i besta-mysql mysql -u bestauser -pbestapass besta < backup.sql
```

### Cleanup Commands
```powershell
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused (CAREFUL!)
docker system prune -a
```

---

## Service URLs

- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3001
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

---

## Default Credentials

### MySQL Database
- Host: localhost (or mysql in Docker network)
- Port: 3306
- Database: besta
- Username: bestauser
- Password: bestapass
- Root Password: rootpassword

### Admin User
- Email: admin@tna.com
- Password: admin123

---

## Port Mappings

| Service  | Container Port | Host Port |
|----------|----------------|-----------|
| Frontend | 3000           | 8081      |
| Backend  | 3001           | 3001      |
| MySQL    | 3306           | 3306      |
| Redis    | 6379           | 6379      |

---

## Troubleshooting

### Frontend can't reach backend
1. Check if backend is running: `docker logs besta-backend --tail 20`
2. Verify backend is accessible: `curl http://localhost:3001/`
3. Check port mappings: `docker compose ps`

### Backend can't connect to database
1. Check if MySQL is ready: `docker logs besta-mysql --tail 20`
2. Verify database connection in .env file
3. Wait a few seconds for MySQL to initialize

### Need to rebuild after code changes
```powershell
# Stop containers
docker compose down

# Rebuild and start
docker compose up --build -d
```

### View real-time container resource usage
```powershell
docker stats
```

---

## Quick Start Guide

1. Navigate to backend directory:
   ```powershell
   cd d:\BestaApparels\BestaApparelsBackend
   ```

2. Start all services:
   ```powershell
   docker compose up -d
   ```

3. Check if all services are running:
   ```powershell
   docker compose ps
   ```

4. View backend logs to confirm it's ready:
   ```powershell
   docker logs besta-backend --tail 20
   ```

5. Access frontend in browser:
   ```
   http://localhost:8081
   ```

6. When done, stop services:
   ```powershell
   docker compose down
   ```
