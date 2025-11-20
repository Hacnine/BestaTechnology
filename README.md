# Besta Apparels ERP System

A comprehensive ERP system for apparel manufacturing and management, built with modern web technologies.

## 📁 Monorepo Structure

```
BestaApparels/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express + Prisma backend
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Docker orchestration
└── package.json       # Root workspace configuration
```

## ✨ Features

### 🏭 Manufacturing Management
- **TNA (Time & Action) Management**: Track production timelines and milestones
- **CAD Design Workflow**: Manage design approvals and file handling
- **Fabric Booking**: Handle fabric procurement and tracking
- **Sample Development**: Oversee sample creation and quality control
- **Cost Sheet Management**: Comprehensive costing for garments

### � User Management
- **Role-based Access Control**: Admin, Management, Merchandiser, CAD, Sample Room, Sample Fabric roles
- **Employee Management**: Staff information and department tracking
- **Audit Logging**: Complete activity tracking for compliance

### 📊 Dashboard & Analytics
- **Real-time Dashboards**: Role-specific dashboards with key metrics
- **Progress Tracking**: Visual progress indicators for all workflows
- **Export Capabilities**: Excel export for reports and data

### 🔄 Workflow Automation
- **Automated Notifications**: Status updates and deadline alerts
- **Approval Workflows**: Multi-step approval processes
- **Status Management**: Track items through production lifecycle

## �🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Docker & Docker Compose
- MySQL 8 (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hacnine/BestaApparels.git
cd BestaApparels

# Install all dependencies
npm run install:all

# Or install individually
npm install          # Root workspace
cd frontend && npm install
cd ../backend && npm install
```

### Development

```bash
# Start with Docker (recommended)
npm run docker:up

# Or start services individually
npm run dev:frontend  # Start frontend dev server (http://localhost:8081)
npm run dev:backend   # Start backend dev server (http://localhost:3001)
```

### Building

```bash
npm run build:frontend
npm run build:backend
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

## 📦 Workspaces

This monorepo uses npm workspaces to manage dependencies across frontend and backend.

### Frontend
- **Tech Stack**: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS, shadcn/ui
- **Port**: 8081
- **Path**: `/frontend`
- **Key Libraries**: React Router, React Hot Toast, Lucide Icons

### Backend
- **Tech Stack**: Node.js, Express, Prisma, MySQL
- **Port**: 3001
- **Path**: `/backend`
- **Key Libraries**: Express, Prisma ORM, JWT, bcrypt, multer

## 🔧 CI/CD

GitHub Actions workflows are configured for:
- Automated testing (Vitest, ESLint)
- Building artifacts
- Deployment to staging (develop branch)
- Deployment to production (main branch)

## 📝 Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3001
```

### Backend `.env`
```env
DATABASE_URL=mysql://bestauser:bestapass@localhost:3306/besta
PORT=3001
JWT_SECRET=your-jwt-secret-here
```

## 📋 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Core Resources
- `GET /api/users` - User management
- `GET /api/employees` - Employee management
- `GET /api/tnas` - TNA management
- `GET /api/cad-designs` - CAD design workflow
- `GET /api/fabric-bookings` - Fabric booking management
- `GET /api/sample-developments` - Sample development tracking
- `GET /api/cost-sheets` - Cost sheet management

### File Upload
- `POST /api/upload` - File upload endpoint
- Supports images, documents, and CAD files

## � Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests (if configured)
cd backend
npm run test
```

## �🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes following the existing code style
3. Add tests for new features
4. Submit a pull request with a clear description

### Code Style
- Frontend: ESLint configuration
- Backend: Standard Node.js practices
- Commit messages: Conventional commits

## 📄 License

UNLICENSED - Proprietary

## 👥 Support

For support or questions, please contact the development team.

## 🌐 VPS Deployment

Deploy to your VPS server in just 5 minutes! See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for the easiest deployment method.

### Quick Deploy Command
```bash
bash <(curl -s https://raw.githubusercontent.com/Hacnine/BestaTechnology/main/deploy.sh)
```

### Deployment Options
1. **[Quick Deploy](./QUICK_DEPLOY.md)** - 5-minute automated deployment (recommended)
2. **[Full VPS Guide](./VPS_DEPLOYMENT_GUIDE.md)** - Comprehensive deployment documentation
3. **Docker Compose Production** - Use `docker-compose.prod.yml` for manual deployment

### Access Your Deployed App
- Frontend: http://YOUR_SERVER_IP
- Backend API: http://YOUR_SERVER_IP:3001

For detailed instructions, see:
- **Windows Users**: Run `quick-deploy.ps1` in PowerShell
- **Linux/Mac Users**: Follow [VPS_DEPLOYMENT_GUIDE.md](./VPS_DEPLOYMENT_GUIDE.md)

## 🔄 Recent Updates

- Added VPS deployment automation
- Production-ready Docker configuration
- Automated backup system
- Enhanced security configurations
- Migrated to monorepo structure
- Enhanced CI/CD pipelines
- Improved Docker configuration
- Added comprehensive testing setup
