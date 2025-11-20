# Besta Apparels - VPS Deployment Guide

## 📋 Server Information
- **IP Address**: 108.181.187.124
- **Port**: 22
- **Username**: administrator
- **Operating System**: Ubuntu Server 24 LTS 64-bit
- **Resources**: 2 CPU Cores / 4GB RAM / 60GB SSD / 100Mbps

## 🚀 Quick Deployment (Easiest Method)

### Option 1: Automated Deployment Script (Recommended)

#### Step 1: Connect to Your VPS
Open your terminal and connect via SSH:

```bash
ssh administrator@108.181.187.124
```

Enter password: `Eco******121`

#### Step 2: Switch to Root User
```bash
sudo -i
```

#### Step 3: Download and Run Deployment Script
```bash
# Create temporary directory
mkdir -p /tmp/deploy
cd /tmp/deploy

# Download your repository
git clone https://github.com/Hacnine/BestaTechnology.git
cd BestaTechnology

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
sudo bash deploy.sh
```

#### Step 4: Configure Environment Variables
During deployment, you'll be prompted to edit `.env.production`. Update these values:

```env
MYSQL_ROOT_PASSWORD=YourSecureRootPassword123!
MYSQL_DATABASE=besta
MYSQL_USER=bestauser
MYSQL_PASSWORD=YourSecurePassword123!
JWT_SECRET=YourSuperSecretJWTKey_ChangeThisInProduction_MinimumLengthIs32Characters!
NODE_ENV=production
SERVER_IP=108.181.187.124
VITE_API_URL=http://108.181.187.124:3001
```

**IMPORTANT**: Change all passwords and the JWT secret to strong, unique values!

#### Step 5: Access Your Application
- **Frontend**: http://108.181.187.124
- **Backend API**: http://108.181.187.124:3001

---

## 🔧 Option 2: Manual Deployment

### Step 1: Connect to VPS
```bash
ssh administrator@108.181.187.124
sudo -i
```

### Step 2: Install Docker
```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### Step 3: Install Git
```bash
apt-get install -y git
```

### Step 4: Clone Your Repository
```bash
cd /opt
git clone https://github.com/Hacnine/BestaTechnology.git
cd BestaTechnology
```

### Step 5: Setup Environment Variables
```bash
# Copy example file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

Update all values, especially:
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`

Save and exit (Ctrl+X, then Y, then Enter)

### Step 6: Configure Firewall
```bash
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 3001/tcp # Backend API
ufw enable
```

### Step 7: Build and Start Services
```bash
# Build containers
docker-compose -f docker-compose.prod.yml --env-file .env.production build

# Start services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Step 8: Run Database Migrations
```bash
docker exec besta-backend-prod npx prisma migrate deploy
```

### Step 9: Verify Deployment
```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs -f

# Check if services are running
docker ps
```

---

## 📦 What Gets Deployed

1. **MySQL Database** - Running on port 3306
2. **Backend API** - Node.js/Express app on port 3001
3. **Frontend** - React app served via Nginx on port 80
4. **Backup Scheduler** - Automated daily database backups

---

## 🔍 Useful Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker logs besta-backend-prod -f
docker logs besta-frontend-prod -f
docker logs besta-mysql-prod -f
```

### Stop/Start Services
```bash
# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application
```bash
cd /opt/BestaTechnology
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup
```bash
# Manual backup
docker exec besta-mysql-prod mysqldump -u bestauser -p besta > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i besta-mysql-prod mysql -u bestauser -p besta < backup_20241120.sql
```

### Access Database
```bash
docker exec -it besta-mysql-prod mysql -u bestauser -p
```

---

## 🔒 Security Best Practices

1. **Change Default Passwords**
   - Update all passwords in `.env.production`
   - Use strong passwords (min 16 characters)

2. **Setup SSH Key Authentication**
   ```bash
   # On your local machine
   ssh-keygen -t ed25519
   ssh-copy-id administrator@108.181.187.124
   ```

3. **Disable Password Authentication**
   ```bash
   # Edit SSH config
   nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   systemctl restart sshd
   ```

4. **Install Fail2Ban**
   ```bash
   apt-get install -y fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

5. **Setup SSL/HTTPS** (if you have a domain)
   ```bash
   apt-get install -y certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

---

## 🌐 Domain Setup (Optional)

If you want to use a domain name instead of IP:

1. **Point DNS to Your VPS**
   - Add an A record pointing to `108.181.187.124`

2. **Update Environment Variables**
   ```env
   SERVER_IP=yourdomain.com
   VITE_API_URL=https://yourdomain.com/api
   ```

3. **Setup Nginx Reverse Proxy**
   - Configure Nginx to handle both frontend and backend
   - Setup SSL with Let's Encrypt

---

## 🐛 Troubleshooting

### Issue: Containers won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check disk space
df -h

# Check memory
free -h
```

### Issue: Cannot connect to database
```bash
# Check MySQL container
docker logs besta-mysql-prod

# Verify network
docker network ls
docker network inspect bestatechnology_besta-network
```

### Issue: Frontend shows blank page
```bash
# Check frontend logs
docker logs besta-frontend-prod

# Verify backend is running
curl http://localhost:3001

# Check environment variables
docker exec besta-frontend-prod env
```

### Issue: Port already in use
```bash
# Check what's using the port
netstat -tulpn | grep :80
netstat -tulpn | grep :3001

# Kill process using port
kill -9 <PID>
```

---

## 📊 Monitoring

### Check System Resources
```bash
# CPU and Memory
htop

# Disk usage
df -h

# Docker stats
docker stats
```

### Setup Monitoring (Optional)
```bash
# Install monitoring tools
docker run -d --name=cadvisor -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest
```

---

## 📝 Regular Maintenance

### Daily
- Check application logs
- Monitor disk space

### Weekly
- Review backup logs
- Check security updates: `apt-get update && apt-get upgrade`

### Monthly
- Review application performance
- Update Docker images
- Review and rotate logs

---

## 🆘 Support

If you encounter issues:

1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify all services are running: `docker ps`
3. Check firewall: `ufw status`
4. Verify environment variables: `cat .env.production`

---

## 🎉 Success Checklist

- [ ] VPS connection established
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Firewall configured
- [ ] Containers built and running
- [ ] Database migrations completed
- [ ] Frontend accessible at http://108.181.187.124
- [ ] Backend API accessible at http://108.181.187.124:3001
- [ ] Backups configured

---

**Congratulations! Your Besta Apparels application is now live!** 🚀
