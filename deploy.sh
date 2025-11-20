#!/bin/bash

# Besta Apparels VPS Deployment Script
# This script automates the deployment process on your VPS

set -e  # Exit on any error

echo "==================================="
echo "Besta Apparels VPS Deployment"
echo "==================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run with sudo: sudo bash deploy.sh${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${BLUE}Step 1: Updating system packages...${NC}"
apt-get update && apt-get upgrade -y

# Step 2: Install Docker
echo -e "${BLUE}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully!${NC}"
else
    echo -e "${GREEN}Docker is already installed.${NC}"
fi

# Step 3: Install Docker Compose
echo -e "${BLUE}Step 3: Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
else
    echo -e "${GREEN}Docker Compose is already installed.${NC}"
fi

# Step 4: Install Git
echo -e "${BLUE}Step 4: Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt-get install -y git
    echo -e "${GREEN}Git installed successfully!${NC}"
else
    echo -e "${GREEN}Git is already installed.${NC}"
fi

# Step 5: Clone repository
echo -e "${BLUE}Step 5: Setting up application...${NC}"
APP_DIR="/opt/besta-apparels"

if [ -d "$APP_DIR" ]; then
    echo -e "${BLUE}Application directory exists. Pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin main
else
    echo -e "${BLUE}Cloning repository...${NC}"
    git clone https://github.com/Hacnine/BestaTechnology.git $APP_DIR
    cd $APP_DIR
fi

# Step 6: Setup environment file
echo -e "${BLUE}Step 6: Setting up environment variables...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}Creating .env.production file...${NC}"
    cp .env.production.example .env.production
    echo -e "${RED}IMPORTANT: Please edit .env.production file with your actual values!${NC}"
    echo -e "${RED}Press Enter after you've edited the file...${NC}"
    read
fi

# Step 7: Configure firewall
echo -e "${BLUE}Step 7: Configuring firewall...${NC}"
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 3001/tcp # Backend API
ufw --force enable
echo -e "${GREEN}Firewall configured successfully!${NC}"

# Step 8: Build and start containers
echo -e "${BLUE}Step 8: Building and starting Docker containers...${NC}"
docker-compose -f docker-compose.prod.yml --env-file .env.production down
docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Step 9: Wait for services to be healthy
echo -e "${BLUE}Step 9: Waiting for services to start...${NC}"
sleep 10

# Step 10: Run database migrations
echo -e "${BLUE}Step 10: Running database migrations...${NC}"
docker exec besta-backend-prod npx prisma migrate deploy

# Step 11: Display status
echo -e "${BLUE}Step 11: Checking deployment status...${NC}"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${GREEN}==================================="
echo "Deployment Complete!"
echo "===================================${NC}"
echo ""
echo "Your application is now running:"
echo "- Frontend: http://108.181.187.124"
echo "- Backend API: http://108.181.187.124:3001"
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo -e "${RED}Don't forget to:"
echo "1. Setup SSL certificate (use Certbot)"
echo "2. Configure domain name if you have one"
echo "3. Setup regular backups${NC}"
