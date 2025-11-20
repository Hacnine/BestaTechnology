# 🚀 Super Quick VPS Deployment (5 Minutes)

This is the FASTEST way to deploy your application to the VPS. Perfect for testing and getting started quickly.

## Prerequisites
- VPS IP: `108.181.187.124`
- SSH Access: `administrator` / `Eco******121`

## 🎯 One-Command Deployment

### Method 1: Fully Automated (Recommended for Beginners)

Just run this ONE command from your VPS:

```bash
bash <(curl -s https://raw.githubusercontent.com/Hacnine/BestaTechnology/main/deploy.sh)
```

**That's it!** The script will:
✅ Install Docker & Docker Compose
✅ Install Git
✅ Clone your repository
✅ Setup environment
✅ Configure firewall
✅ Start all services
✅ Run database migrations

---

## 📋 Step-by-Step (If You Prefer Manual Control)

### 1️⃣ Connect to VPS
On your computer, open **PowerShell** (Windows) or **Terminal** (Mac/Linux):

```bash
ssh administrator@108.181.187.124
```

When prompted for password, enter: `Eco******121`

### 2️⃣ Run This Single Command

Once connected to the VPS, copy and paste this command:

```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/Hacnine/BestaTechnology/main/deploy.sh)"
```

### 3️⃣ Follow Prompts

The script will ask you to configure environment variables. When the editor opens:

1. Press `i` to enter insert mode
2. Change these values:
   ```
   MYSQL_ROOT_PASSWORD=YourStrongPassword123!
   MYSQL_PASSWORD=YourStrongPassword123!
   JWT_SECRET=YourSuperSecretKey32CharactersLong!
   ```
3. Press `Esc`
4. Type `:wq` and press Enter

### 4️⃣ Access Your Application

- **Frontend**: http://108.181.187.124
- **Backend API**: http://108.181.187.124:3001

---

## 🔄 Alternative: Manual Quick Deploy

If the automated script doesn't work, use these commands:

```bash
# Connect to VPS
ssh administrator@108.181.187.124

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
cd /opt
sudo git clone https://github.com/Hacnine/BestaTechnology.git
cd BestaTechnology

# Setup environment
sudo cp .env.production.example .env.production
sudo nano .env.production  # Edit the values

# Configure firewall
sudo ufw allow 22,80,443,3001/tcp
sudo ufw --force enable

# Deploy
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Run migrations
sudo docker exec besta-backend-prod npx prisma migrate deploy
```

---

## ✅ Verify Deployment

Check if everything is running:

```bash
sudo docker ps
```

You should see 4 containers running:
- `besta-mysql-prod`
- `besta-backend-prod`
- `besta-frontend-prod`
- `besta-backup-scheduler-prod`

---

## 🔧 Common Issues & Quick Fixes

### Issue: "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Issue: "Port already in use"
```bash
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml up -d
```

### Issue: "Database connection failed"
```bash
# Check MySQL logs
sudo docker logs besta-mysql-prod

# Restart MySQL
sudo docker restart besta-mysql-prod
```

### Issue: Frontend shows blank page
```bash
# Check if backend is running
curl http://localhost:3001

# Restart all services
sudo docker-compose -f docker-compose.prod.yml restart
```

---

## 📱 From Your Windows Computer

### Push to GitHub First
Open PowerShell in your project folder:

```powershell
cd d:\BestaApparels
git add .
git commit -m "Add VPS deployment files"
git push origin main
```

### Then Deploy
Run the quick deploy script:

```powershell
.\quick-deploy.ps1
```

Or manually SSH:

```powershell
ssh administrator@108.181.187.124
```

---

## 🎉 Success Indicators

Your deployment is successful when you can:

1. ✅ Visit http://108.181.187.124 and see your frontend
2. ✅ Visit http://108.181.187.124:3001 and get API response
3. ✅ All 4 Docker containers show "Up" status
4. ✅ No errors in logs: `sudo docker-compose -f docker-compose.prod.yml logs`

---

## 🛠️ Useful Commands

```bash
# View logs
sudo docker-compose -f docker-compose.prod.yml logs -f

# Restart services
sudo docker-compose -f docker-compose.prod.yml restart

# Stop everything
sudo docker-compose -f docker-compose.prod.yml down

# Update application
cd /opt/BestaTechnology
sudo git pull
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📞 Need Help?

1. Check logs: `sudo docker-compose -f docker-compose.prod.yml logs`
2. Check containers: `sudo docker ps -a`
3. Check disk space: `df -h`
4. Check memory: `free -h`

---

## ⏱️ Estimated Time

- **Automated script**: 5-10 minutes
- **Manual deployment**: 15-20 minutes
- **With domain + SSL**: 25-30 minutes

---

**Ready? Let's deploy!** 🚀

Just run:
```bash
bash <(curl -s https://raw.githubusercontent.com/Hacnine/BestaTechnology/main/deploy.sh)
```
