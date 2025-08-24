# 🧴 Skincare E-commerce Platform

A comprehensive full-stack e-commerce solution built specifically for skincare businesses, featuring a modern customer storefront and powerful administrative dashboard.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This platform provides a complete e-commerce solution tailored for skincare businesses, offering both customer-facing shopping experiences and comprehensive administrative tools. The system handles everything from product catalog management to order fulfillment, customer relationships, and business analytics.

### Key Highlights
- 🛒 **Complete Shopping Experience** - Product browsing, cart, checkout, order tracking
- 👑 **Comprehensive Admin Panel** - 11 specialized management sections
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🐳 **Containerized Deployment** - Docker-ready for easy deployment
- 🧪 **Development-Friendly** - Mock APIs for rapid development
- 📊 **Business Intelligence** - Built-in analytics and reporting

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**
  - Browse skincare products by category
  - Detailed product pages with ingredients and skin type recommendations
  - Product search and filtering capabilities
  - High-quality product imagery

- **Shopping Experience**
  - Intuitive shopping cart functionality
  - Secure checkout process
  - Wishlist for saving favorite products
  - Order tracking and history

- **User Management**
  - Customer registration and authentication
  - Profile management with skincare preferences
  - Order history and account settings

### 👨‍💼 Administrative Features
- **Dashboard Analytics** - Revenue, orders, customer metrics with growth tracking
- **Product Management** - Complete CRUD operations for product catalog
- **Order Processing** - Order tracking, status updates, and fulfillment management
- **Customer Management** - Customer profiles, purchase history, and support tools
- **Inventory Control** - Stock level monitoring and management
- **Marketing Tools** - Coupon creation, discount management, and promotional campaigns
- **Content Moderation** - Review approval and management system
- **Business Intelligence** - Sales reports, analytics, and performance metrics
- **Category Management** - Product categorization and organization
- **System Configuration** - Application settings and customization
- **Multi-level Access** - Role-based admin permissions

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript/JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Authentication:** Custom JWT implementation

### Backend
- **Services:** RESTful API architecture
- **Database:** Comprehensive relational database schema
- **Authentication:** Secure user and admin authentication systems

### DevOps
- **Containerization:** Docker & Docker Compose
- **Development:** Hot reload, mock APIs
- **Production:** Scalable containerized deployment

## 📁 Project Structure

```
skincare/
├── frontend/                    # Next.js Application
│   ├── app/                    # App Router Pages
│   │   ├── admin/              # Admin Panel (11 sections)
│   │   │   ├── categories/     # Category management
│   │   │   ├── coupons/        # Discount management
│   │   │   ├── customers/      # Customer management
│   │   │   ├── inventory/      # Stock management
│   │   │   ├── login/          # Admin authentication
│   │   │   ├── orders/         # Order management
│   │   │   ├── products/       # Product management
│   │   │   ├── reports/        # Business analytics
│   │   │   ├── reviews/        # Review moderation
│   │   │   ├── sales/          # Sales analytics
│   │   │   └── settings/       # System settings
│   │   ├── cart/               # Shopping cart
│   │   ├── login/              # Customer auth
│   │   ├── orders/             # Order history
│   │   ├── products/           # Product catalog
│   │   ├── profile/            # User profiles
│   │   ├── register/           # Registration
│   │   └── wishlist/           # Saved items
│   ├── components/             # Reusable Components
│   ├── contexts/               # State Management
│   └── lib/                    # APIs & Utilities
├── services/                   # Backend Services
├── docker-compose.yml          # Container Configuration
├── db.txt                      # Database Schema
└── README.md                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skincare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start with Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

4. **Or start manually**
   ```bash
   # Start backend services
   cd services
   npm run dev

   # Start frontend (in new terminal)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - **Customer Store:** http://localhost:3000
   - **Admin Panel:** http://localhost:3000/admin

### Default Credentials

**Customer Demo Account:**
- Email: `demo@example.com`
- Password: `demo123`

**Admin Account:**
- Email: `admin@skincare.com`
- Password: `admin123`

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linting
```

### Backend Development
```bash
cd services
npm run dev          # Start backend services
npm run test         # Run tests
```

### Using Mock Data
The frontend includes comprehensive mock data for development:
- 27+ skincare products with detailed information
- Customer profiles and order history
- Admin analytics and reports
- Review and rating systems
- Coupon and discount management

## 🐳 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skincare
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API
API_BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📚 API Documentation

### Customer Endpoints
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product details
POST   /api/auth/login         # Customer login
POST   /api/auth/register      # Customer registration
GET    /api/orders             # Get user orders
POST   /api/orders             # Create new order
```

### Admin Endpoints
```
POST   /api/admin/login        # Admin authentication
GET    /api/admin/dashboard    # Dashboard analytics
GET    /api/admin/products     # Product management
POST   /api/admin/products     # Create product
PUT    /api/admin/products/:id # Update product
DELETE /api/admin/products/:id # Delete product
GET    /api/admin/orders       # Order management
GET    /api/admin/customers    # Customer management
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Run unit tests
npm run test:coverage # Coverage report
```

### Backend Testing
```bash
cd services
npm run test          # Run API tests
npm run test:e2e      # End-to-end tests
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Write comprehensive tests
- Update documentation for new features

## 📊 Database Schema

The platform uses a comprehensive database schema supporting:
- **Products & Categories** - Complete product management
- **Users & Authentication** - Customer and admin accounts
- **Orders & Transactions** - E-commerce operations
- **Reviews & Ratings** - Customer feedback system
- **Coupons & Promotions** - Marketing campaigns
- **Analytics & Reporting** - Business intelligence

*See `db.txt` for complete schema documentation.*

## 🔐 Security Features

- JWT-based authentication
- Password hashing and validation
- Role-based access control
- CSRF protection
- Input validation and sanitization
- Secure API endpoints

## 📈 Performance Optimizations

- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Caching strategies
- Database query optimization
- CDN integration ready

## 🌍 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](Chhery_Chorn) file for details.

## 👥 Team

**Developer:** Jame  
**Student ID:** 6520310203  
**Project Type:** Full-Stack E-commerce Platform  

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `README.md`
- Review the database schema in `db.txt`

---

**Built with ❤️ for the skincare industry**


# Skincare E-commerce Platform

A multilingual skincare e-commerce platform with AI-powered recommendations supporting Thai, English, and Khmer languages.

## Tech Stack
- **Frontend**: Next.js + React + TypeScript
- **Backend**: Go (Microservices) + Python FastAPI (ML)
- **Databases**: PostgreSQL + MongoDB
- **Cache**: Redis

## Architecture
Microservices architecture with separate services for different concerns.

## Setup Instructions
See individual service README files for setup instructions.

## Development
1. Start databases: `docker-compose up -d`
2. Start services in separate terminals
3. Access frontend at http://localhost:3000
```

## Step 4: Frontend Setup (Next.js)

```bash
cd frontend
```

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

```bash
npm install react-i18next i18next-browser-languagedetector i18next-http-backend
```

```bash
npm install @headlessui/react @heroicons/react axios zustand
```

```bash
npm install @types/node @types/react @types/react-dom
```

Create `frontend/README.md`:
```markdown
# Frontend - Skincare E-commerce

## Setup
```bash
npm install
npm run dev
```

## Features
- Multilingual support (Thai, English, Khmer)
- Responsive design
- Product catalog
- Shopping cart
- User authentication
```

## Step 5: API Gateway Setup (Go)

```bash
cd ..\services\api-gateway
```

```bash
go mod init github.com/yourusername/skincare/api-gateway
```

```bash
go get github.com/gin-gonic/gin
```

```bash
go get github.com/gin-contrib/cors
```

```bash
go get gorm.io/gorm gorm.io/driver/postgres
```

```bash
go get github.com/golang-jwt/jwt/v5
```

```bash
go get github.com/go-redis/redis/v8
```

## Step 6: Product Service Setup (Go)

```bash
cd ..\product-service
```

```bash
go mod init github.com/yourusername/skincare/product-service
```

```bash
go get github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/postgres
```

```bash
go get github.com/go-playground/validator/v10
```

```bash
go get github.com/google/uuid
```

## Step 7: Auth Service Setup (Go)

```bash
cd ..\auth-service
```

```bash
go mod init github.com/yourusername/skincare/auth-service
```

```bash
go get github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/postgres
```

```bash
go get golang.org/x/crypto/bcrypt
```

```bash
go get github.com/golang-jwt/jwt/v5
```

## Step 8: Order Service Setup (Go)

```bash
cd ..\order-service
```

```bash
go mod init github.com/yourusername/skincare/order-service
```

```bash
go get github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/postgres
```

## Step 9: ML Service Setup (Python)

```bash
cd ..\ml-service
```

```bash
python -m venv venv
```

```bash
venv\Scripts\activate
```

```bash
pip install fastapi uvicorn pymongo motor pandas scikit-learn
```

```bash
pip install python-multipart pydantic python-jose[cryptography]
```

```bash
pip freeze > requirements.txt
```

Create `services/ml-service/README.md`:
```markdown
# ML Service - Recommendation Engine

## Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Features
- Product recommendations
- User behavior analysis
- Content-based filtering
- Collaborative filtering
```

## Step 10: Docker Setup

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: skincare_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

## Step 11: VS Code Workspace Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch API Gateway",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/services/api-gateway",
      "cwd": "${workspaceFolder}/services/api-gateway"
    },
    {
      "name": "Launch Product Service",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/services/product-service",
      "cwd": "${workspaceFolder}/services/product-service"
    }
  ]
}
```

Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      },
      "group": "build"
    },
    {
      "label": "Start Databases",
      "type": "shell",
      "command": "docker-compose up -d",
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "group": "build"
    }
  ]
}
```

## Step 12: Environment Files Setup

Create environment template files:

`frontend/.env.example`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Skincare Store
```

`services/api-gateway/.env.example`:
```
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=skincare_products
JWT_SECRET=your-jwt-secret-key
REDIS_URL=redis://localhost:6379
```

## Step 13: GitHub Repository Setup

```bash
git add .
```

```bash
git commit -m "Initial project setup with microservices architecture"
```

Create repository on GitHub, then:

```bash
git remote add origin https://github.com/yourusername/skincare-ecommerce.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

## Step 14: Development Scripts

Create `package.json` in root for convenience:
```json
{
  "name": "skincare-ecommerce",
  "version": "1.0.0",
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:db": "docker-compose up -d",
    "dev:api": "cd services/api-gateway && go run main.go",
    "dev:ml": "cd services/ml-service && venv\\Scripts\\activate && uvicorn main:app --reload --port 8001",
    "install:frontend": "cd frontend && npm install",
    "install:ml": "cd services/ml-service && pip install -r requirements.txt"
  }
}
```

## Step 15: Database Setup with DBeaver

1. **Install DBeaver** from https://dbeaver.io/
2. **Start PostgreSQL**:
```bash
docker-compose up -d postgres
```

3. **Connect in DBeaver**:
   - Host: localhost
   - Port: 5432
   - Database: skincare_db
   - Username: postgres
   - Password: password123

## Development Workflow on Windows:

1. **Start databases**:
```bash
docker-compose up -d
```

2. **Start services** (in separate Command Prompt/PowerShell windows):
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - API Gateway
cd services\api-gateway
go run main.go

# Terminal 3 - ML Service
cd services\ml-service
venv\Scripts\activate
uvicorn main:app --reload --port 8001
```

## Git Workflow:
```bash
# Daily workflow
git pull origin main
# Make changes
git add .
git commit -m "Your commit message"
git push origin main