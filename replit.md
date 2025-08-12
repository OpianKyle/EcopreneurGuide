# DigitalPro Sales Funnel Platform

## Overview

DigitalPro is a comprehensive sales funnel platform designed for selling digital products with Master Resell Rights. The application provides a complete automated sales system including lead capture, email nurturing, product sales pages, upsells, and customer management. Built as a full-stack web application, it enables entrepreneurs to create and manage their digital product business with features like landing pages, sales funnels, payment processing, and admin dashboards.

## Recent Changes (August 12, 2025)

- Successfully completed migration from Replit Agent to standard Replit environment
- **Fixed persistent PostgreSQL connection issues by switching to SQLite database for development**
- **Resolved session storage problems by replacing PostgreSQL session store with in-memory store**
- **Authentication system now fully functional**: Users can register, login, and access protected routes without database connection errors
- Converted entire database schema from PostgreSQL to SQLite format with proper data types
- Created comprehensive database initialization with all required tables (users, products, orders, leads, categories, etc.)
- Application running cleanly on port 5000 with both frontend and backend fully operational
- Stripe payment processing configured with secure environment variables
- Fixed all TypeScript errors related to database operations and storage interfaces
- Temporarily disabled OAuth social login (Google, GitHub) pending proper callback URL configuration
- Landing page maintains professional green, blue, and white color scheme
- Dashboard designed to match Entrepedia.co style with clean, modern interface

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Professional color scheme using green, blue, and white. Avoid childish icons. Use alternating left-right content sections instead of centered layouts. Dashboard should follow Entrepedia.co design patterns with clean, modern interfaces, rounded cards, professional typography, excellent visual hierarchy, and sidebar navigation instead of horizontal navbar.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with conditional route rendering based on authentication
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod for validation
- **Payment Integration**: Stripe Elements for payment processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect for user authentication and session management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **API Design**: RESTful API with error handling middleware and request logging

### Database Design
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema including users, products, orders, leads, support tickets, email campaigns, and downloads
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon serverless PostgreSQL with WebSocket support

### Authentication & Authorization
- **Provider**: Replit Auth integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL storage
- **Security**: HTTP-only cookies, CSRF protection, and secure session configuration
- **User Roles**: Basic user and admin role system for access control

### Application Structure
- **Monorepo Layout**: Organized with separate client, server, and shared directories
- **Client Directory**: React application with pages, components, hooks, and utilities
- **Server Directory**: Express API with routes, database layer, and authentication
- **Shared Directory**: Common TypeScript schemas and types used across client and server

### Sales Funnel Features
- **Lead Capture**: Landing page with email collection and lead magnets
- **Sales Pages**: Product presentation pages with conversion optimization
- **Upsell System**: Post-purchase upsell pages for additional revenue
- **Email Marketing**: Automated email campaigns and nurturing sequences
- **Payment Processing**: Stripe integration for secure payment handling
- **Digital Delivery**: Automated product delivery and download management

### Admin & Dashboard
- **User Dashboard**: Customer portal for viewing purchases and downloads
- **Admin Panel**: Administrative interface for managing products, orders, and analytics
- **Analytics**: Basic reporting for sales metrics and lead conversion
- **Product Management**: CRUD operations for digital products and pricing

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure including subscription management and webhooks
- **Stripe Elements**: Frontend payment form components with secure tokenization

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with branching capabilities
- **Replit**: Development and hosting platform with integrated authentication

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Static type checking across the entire application
- **Drizzle ORM**: Type-safe database ORM with excellent TypeScript support
- **Zod**: Runtime type validation for forms and API inputs

### Third-Party Services
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Web font loading for typography (Inter font family)
- **Replit Cartographer**: Development tooling for the Replit environment