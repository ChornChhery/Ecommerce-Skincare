# 🧴 Skincare E-commerce Platform - Clone & Setup Guide

This guide provides step-by-step instructions for cloning, setting up, and running the Skincare E-commerce Platform on a fresh machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Git** (2.0 or higher) - [Download Git](https://git-scm.com/downloads)
- **Node.js** (18.x or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (8.x or higher) - Usually comes with Node.js
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **A code editor** (VS Code recommended)

## 🚀 Quick Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Ecommerce-Skincare.git
cd Ecommerce-Skincare
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skincare_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=admin
MONGO_PASSWORD=your_secure_mongo_password

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start Database Services

```bash
# Make sure Docker Desktop is running, then start services
docker-compose up -d
```

Wait for databases to be fully initialized (about 30 seconds).

### 4. Set up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Access the Application

- **Frontend:** Open [http://localhost:3000](http://localhost:3000) in your browser
- **Admin Panel:** Access [http://localhost:3000/admin](http://localhost:3000/admin)
- **Database Admin:** PostgreSQL on port 5432, MongoDB on port 27017

## 🔧 Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/Ecommerce-Skincare.git

# Navigate to the project directory
cd Ecommerce-Skincare
```

### Step 2: Install Dependencies

```bash
# Ensure you're in the project root
cd Ecommerce-Skincare

# Install root dependencies (if any)
npm install

# Navigate to frontend and install dependencies
cd frontend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root directory with these settings:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skincare_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=admin
MONGO_PASSWORD=your_secure_mongo_password

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Port Configuration
PORT=3000
DB_PORT=5432
MONGO_PORT=27017
```

### Step 4: Start Database Services

```bash
# Ensure Docker Desktop is running
# Navigate to project root (where docker-compose.yml is located)
cd Ecommerce-Skincare

# Start database containers in detached mode
docker-compose up -d

# Check if services are running
docker-compose ps

# Wait for databases to be fully initialized (may take 30-60 seconds)
```

Verify database connectivity:
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Check MongoDB logs  
docker-compose logs mongodb
```

### Step 5: Initialize Database Schema

Since the project uses mock APIs for development, the database schemas are defined in `db.txt`. You'll need to manually set up the database structure or wait for the backend API to initialize the databases when connected.

### Step 6: Run the Application

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not done already)
npm install

# Start the development server with Turbopack
npm run dev
```

The application will start at `http://localhost:3000` using the Next.js development server with Turbopack enabled.

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Issue: Port already in use
**Solution:** Change the port in your `.env` file and package.json scripts:
```bash
# In package.json, modify the dev script:
"dev": "next dev --turbopack -p 3001"  # Use port 3001 instead
```

#### Issue: Database connection errors
**Solution:** 
1. Ensure Docker Desktop is running
2. Verify database containers are active: `docker-compose ps`
3. Check that environment variables match the docker-compose configuration

#### Issue: Module not found errors
**Solution:** Clear cache and reinstall dependencies:
```bash
# In frontend directory
rm -rf node_modules
rm package-lock.json
npm install
```

#### Issue: Docker permission errors (Windows)
**Solution:** 
1. Right-click Docker Desktop and select "Run as administrator"
2. Ensure Windows Subsystem for Linux (WSL) is properly configured

## 🌐 Project Structure

```
project-root/
├── frontend/                 # Next.js frontend application
│   ├── public/
│   │   └── locales/          # Internationalization files (en/kh)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── admin/        # Admin panel routes
│   │   │   └── [other pages] # Customer-facing routes
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React context providers
│   │   ├── lib/              # Utility functions and API
│   │   └── types/            # Type definitions
│   ├── package.json
│   └── next.config.ts
├── docker-compose.yml        # Container orchestration
├── db.txt                    # Database schema
└── README.md
```

## 🌍 Available Scripts

In the `frontend` directory, you can run:

- `npm run dev` - Starts the development server with Turbopack on port 3000
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Checks for linting errors

## 📱 Access Points

- **Customer Store:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Admin Login:** http://localhost:3000/admin/login
- **Product Catalog:** http://localhost:3000/products
- **User Profile:** http://localhost:3000/profile

## 🐳 Docker Services

The application uses Docker Compose to orchestrate:
- PostgreSQL database (port mapped to 5432)
- MongoDB database (port mapped to 27017)
- Environment variables loaded from .env files

## 🧪 Development Notes

- The application currently uses mock APIs for development purposes
- All API calls are abstracted through the `lib/api.ts` and `lib/mockApi.ts` files
- For production, connect to actual backend services by configuring the API endpoints

## 📋 Checklist for Successful Setup

- [ ] Git repository cloned successfully
- [ ] Node.js and npm installed and verified
- [ ] Docker Desktop running and accessible
- [ ] Environment variables configured
- [ ] Database services started with `docker-compose up -d`
- [ ] Dependencies installed in frontend directory
- [ ] Application running at http://localhost:3000
- [ ] Both customer and admin interfaces accessible

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check that all prerequisites are properly installed
2. Verify that Docker services are running
3. Ensure environment variables match your configuration
4. Review the console output for specific error messages
5. Create an issue in the repository for persistent problems