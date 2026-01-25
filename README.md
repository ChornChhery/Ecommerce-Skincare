# 🧴 Skincare E-commerce Platform

A comprehensive full-stack e-commerce solution built specifically for skincare businesses, featuring a modern customer storefront and powerful administrative dashboard with multilingual support.

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

This platform provides a complete e-commerce solution tailored for skincare businesses, offering both customer-facing shopping experiences and comprehensive administrative tools. The system handles everything from product catalog management to order fulfillment, customer relationships, and business analytics with multilingual support (English and Khmer).

### Key Highlights
- 🛒 **Complete Shopping Experience** - Product browsing, cart, checkout, order tracking
- 👑 **Comprehensive Admin Panel** - 11 specialized management sections
- 🌍 **Multilingual Support** - English and Khmer language support
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
  - Multilingual support (English/Khmer)

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
- **Framework:** Next.js 15.4.1 with App Router
- **Language:** TypeScript/JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Authentication:** Custom JWT implementation
- **Internationalization:** i18next with English and Khmer support
- **Icons:** Heroicons and Lucide React
- **Charts:** Recharts
- **UI Library:** Headless UI

### Backend
- **Services:** RESTful API architecture (currently using mock API for development)
- **Databases:** PostgreSQL (users/products/orders), MongoDB (reviews/user preferences)
- **Authentication:** Secure user and admin authentication systems

### DevOps
- **Containerization:** Docker & Docker Compose
- **Development:** Hot reload, mock APIs
- **Production:** Scalable containerized deployment

## 📁 Project Structure

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

## 🌐 Route Structure

### Customer Routes
- **`/`** - Homepage
- **`/products`** - Product catalog
- **`/products/[id]`** - Individual product page
- **`/cart`** - Shopping cart
- **`/checkout`** - Checkout process
- **`/wishlist`** - Saved items
- **`/profile`** - User profile
- **`/profile/edit`** - Edit profile
- **`/orders`** - Order history
- **`/login`** - User login
- **`/register`** - User registration

### Admin Routes
- **`/admin`** - Dashboard
- **`/admin/login`** - Admin authentication
- **`/admin/products`** - Product management
- **`/admin/products/new`** - Create product
- **`/admin/products/[id]`** - Edit product
- **`/admin/orders`** - Order management
- **`/admin/orders/[id]`** - Order details
- **`/admin/customers`** - Customer management
- **`/admin/customers/[id]`** - Customer profile
- **`/admin/categories`** - Category management
- **`/admin/inventory`** - Stock control
- **`/admin/coupons`** - Discount codes
- **`/admin/reviews`** - Review moderation
- **`/admin/reports`** - Analytics dashboard
- **`/admin/sales`** - Sales metrics
- **`/admin/settings`** - System configuration

## ✨ Key Features

### Architecture
- **Next.js 15+ App Router** - Modern file-based routing
- **React Context** - Global state management
- **TypeScript** - Type-safe development
- **Component Architecture** - Reusable UI components

### Customer Experience
- Product browsing and search
- Shopping cart functionality
- User authentication and profiles
- Order tracking and history
- Wishlist management
- Responsive design
- Multilingual support (English/Khmer)
- Skin type recommendations

### Admin Capabilities
- **Product Management** - Full CRUD operations
- **Order Processing** - Track and manage orders
- **Customer Support** - User account management
- **Inventory Control** - Stock level monitoring
- **Marketing Tools** - Categories and coupons
- **Analytics** - Sales reports and insights
- **Content Moderation** - Review management
- **System Administration** - Settings and configuration

### Technical Features
- Server-side rendering (SSR)
- Dynamic routing with parameters
- Separate admin authentication
- API abstraction layer
- Mock API for development
- Context-based state management
- Internationalization (i18n) support

## 🚀 Getting Started

For a complete setup guide when cloning this project for the first time, see the [CLONE_AND_RUN.md](CLONE_AND_RUN.md) file.

### Quick Start (after initial setup)

1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:3000`
5. Access admin panel at `http://localhost:3000/admin`

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15.4.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Routing:** App Router (file-based)
- **Authentication:** Custom implementation
- **Internationalization:** i18next
- **Icons:** Heroicons, Lucide React

## 🌍 Multilingual Support

The application supports multiple languages:
- English (en)
- Khmer (kh)

The internationalization is implemented using i18next with language detection and automatic switching.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 📊 Database Schema

The platform uses a comprehensive database schema supporting:
- **PostgreSQL** - Users, products, orders, and categories
- **MongoDB** - Reviews, user preferences, wishlists, and analytics
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

## 🐳 Docker Configuration

The application uses Docker Compose to orchestrate:
- PostgreSQL database (port mapped to DB_PORT)
- MongoDB database (port mapped to MONGO_PORT)
- Environment variables loaded from .env files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](Chhery_Chorn) file for details.

## 👥 Team

**Developer:** Jame  
**Student ID:** 6520310203  
**Project Type:** Front-End E-commerce Platform  

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `README.md`
- Review the database schema in `db.txt`

---

**Built with ❤️ for the skincare industry**