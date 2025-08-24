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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## Frontend Structure

# E-commerce Platform

A full-featured e-commerce application built with Next.js 13+ App Router, featuring both customer-facing store and comprehensive admin panel.

## 🏗️ Project Structure

### Root Directory
```
project-root/
├── app/                      # Next.js App Router pages
├── components/               # Reusable UI components
├── contexts/                 # React context providers
├── lib/                      # Utility functions and API
└── [other Next.js files]
```

### App Directory Structure

#### Customer Pages
```
app/
├── cart/
│   └── page.tsx             # Shopping cart
├── login/
│   └── page.tsx             # User authentication
├── orders/
│   └── page.tsx             # Order history
├── products/
│   ├── [id]/
│   │   └── page.tsx         # Product details
│   └── page.tsx             # Products catalog
├── profile/
│   ├── edit/
│   │   └── page.tsx         # Edit profile
│   └── page.tsx             # View profile
├── register/
│   └── page.tsx             # User registration
├── wishlist/
│   └── page.tsx             # Saved items
├── layout.tsx               # Root layout
└── page.tsx                 # Homepage
```

#### Admin Panel
```
app/admin/
├── categories/
│   └── page.tsx             # Manage categories
├── coupons/
│   └── page.tsx             # Discount management
├── customers/
│   ├── [id]/
│   │   └── page.tsx         # Customer details
│   └── page.tsx             # Customer list
├── inventory/
│   └── page.tsx             # Stock management
├── login/
│   └── page.tsx             # Admin authentication
├── orders/
│   ├── [id]/
│   │   └── page.tsx         # Order details
│   └── page.tsx             # Order management
├── products/
│   ├── [id]/
│   │   └── page.tsx         # Edit product
│   ├── new/
│   │   └── page.tsx         # Create product
│   └── page.tsx             # Product management
├── reports/
│   └── page.tsx             # Analytics
├── reviews/
│   └── page.tsx             # Review moderation
├── sales/
│   └── page.tsx             # Sales analytics
├── settings/
│   └── page.tsx             # Admin settings
├── layout.tsx               # Admin layout
└── page.tsx                 # Admin dashboard
```

### Components
```
components/
├── AdminQuickAccess.tsx     # Quick admin navigation
├── Footer.tsx               # Site footer
└── Navbar.tsx               # Navigation bar
```

### State Management
```
contexts/
├── AuthContext.tsx          # User authentication state
└── WishlistContext.tsx      # Wishlist management
```

### API Layer
```
lib/
├── api.ts                   # Production API calls
└── mockApi.ts               # Development/testing API
```

### Upload File
```
components/
├── FileUpload/
│   ├── ProfilePictureUpload.tsx
│   ├── ReviewPhotoUpload.tsx
│   ├── ProgressPhotoUpload.tsx
│   └── FileUploadArea.tsx
├── Feedback/
│   ├── EnhancedReviewForm.tsx
│   ├── ProgressTracker.tsx
│   ├── BeforeAfterComparison.tsx
│   └── QuestionAnswerSystem.tsx
├── Analytics/
│   ├── ProgressChart.tsx
│   ├── ReviewPhotoGallery.tsx
│   └── UserEngagementStats.tsx
└── Moderation/
    ├── ContentModerationQueue.tsx
    ├── ReviewApprovalSystem.tsx
    └── FileProcessingStatus.tsx
```

## 🌐 Route Structure

### Customer Routes
- **`/`** - Homepage
- **`/products`** - Product catalog
- **`/products/[id]`** - Individual product page
- **`/cart`** - Shopping cart
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
- **Next.js 13+ App Router** - Modern file-based routing
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

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:4000`
5. Access admin panel at `http://localhost:4000/admin`

## 🛠️ Tech Stack

- **Framework:** Next.js 13+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Routing:** App Router (file-based)
- **Authentication:** Custom implementation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

---

*This e-commerce platform provides a complete solution for online retail with powerful admin tools and excellent user experience.*

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
**Project Type:** Front-End E-commerce Platform  

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `README.md`
- Review the database schema in `db.txt`

---

**Built with ❤️ for the skincare industry**

