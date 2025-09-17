# Mini Investment Platform - Grip Invest Winter Internship

A comprehensive full-stack investment platform built for the Grip Invest Winter Internship program. This platform enables users to explore investment opportunities, build portfolios, and receive AI-powered financial insights through an intuitive interface backed by a robust API.

## ✨ Core Features

### 🔐 Authentication & Security

- **Secure User Authentication**: JWT-based signup and login system
- **Password Management**: Complete password reset flow with email verification
- **Change Password**: Secure password update functionality for authenticated users
- **Real-time Password Analysis**: Instant feedback on password strength during signup
- **Protected Routes**: Role-based access control for admin and user areas

### 💼 Investment Management

- **Product Discovery**: Comprehensive gallery of investment products (bonds, ETFs, FDs, etc.)
- **Advanced Filtering**: Dynamic product filters by category, risk level, and returns
- **Interactive Investing**: Seamless investment flow through modal interfaces
- **Investment Tracking**: Complete transaction history and investment monitoring
- **Investment Cancellation**: Cancel recent investments with proper validation

### 📊 Portfolio & Analytics

- **Dynamic Dashboard**: Interactive dashboard with key performance indicators
- **Asset Allocation**: Visual representation of portfolio distribution with charts
- **Performance Tracking**: Historical performance analysis with interactive charts
- **Real-time Metrics**: Live portfolio value and return calculations
- **Detailed Reporting**: Comprehensive portfolio insights and analytics

### 👨‍💼 Admin Capabilities

- **Product Management**: Complete CRUD operations for investment products
- **AI Content Generation**: Automated product description creation using AI
- **Admin Interface**: Dedicated admin panel accessible only to authorized users
- **Product Analytics**: Advanced product performance and user engagement metrics

### 🤖 AI-Powered Features

- **Intelligent Chatbot "Finley"**: Context-aware AI assistant for investment queries
- **Portfolio Insights**: Personalized AI-generated investment recommendations
- **Product Analysis**: AI-driven pros and cons analysis for each investment product
- **Content Generation**: Automated creation of compelling product descriptions
- **Transaction Summaries**: AI-powered summaries of transaction logs and errors
- **Smart Recommendations**: Personalized investment suggestions based on user profile

### 🔧 Technical Features

- **Containerized Architecture**: Full Docker and Docker Compose setup
- **Transaction Logging**: Comprehensive API request logging and monitoring
- **Error Handling**: Robust error management with detailed logging
- **Responsive Design**: Mobile-first, fully responsive user interface
- **Hot Reloading**: Development environment with live code reloading
- **Type Safety**: End-to-end TypeScript implementation

## 🛠️ Technology Stack

| Category                   | Technologies                                         |
| -------------------------- | ---------------------------------------------------- |
| **Backend**                | Node.js, Express.js, TypeScript, Prisma ORM          |
| **Frontend**               | Next.js, React, TypeScript, Tailwind CSS             |
| **Database**               | MySQL 8.0                                            |
| **AI Services**            | Google Gemini API (1.5-flash-latest, 1.5-pro-latest) |
| **UI Components**          | Radix UI, Headless UI, Framer Motion                 |
| **Charts & Visualization** | Recharts                                             |
| **DevOps**                 | Docker, Docker Compose                               |
| **Package Management**     | pnpm (monorepo)                                      |
| **Authentication**         | JWT, bcrypt.js                                       |
| **Validation**             | Zod                                                  |

## 📁 Project Structure

```
gripinvest_winter_internship_backend/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/          # Business logic controllers
│   │   │   ├── middlewares/          # Auth, logging, validation middleware
│   │   │   ├── routes/               # API route definitions
│   │   │   ├── schemas/              # Data validation schemas
│   │   │   └── services/             # Service layer for data operations
│   │   ├── utils/
│   │   │   └── aiHelper.ts           # AI integration utilities
│   │   └── validation/               # Input validation rules
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/                   # Authentication pages
│   │   ├── (dashboard)/              # Protected dashboard area
│   │   │   ├── admin/                # Admin-only pages
│   │   │   ├── investments/          # Investment management
│   │   │   ├── portfolio/            # Portfolio dashboard
│   │   │   ├── products/             # Product catalog
│   │   │   ├── profile/              # User profile management
│   │   │   └── transactions/         # Transaction history
│   │   └── forgot-password/          # Password recovery
│   ├── components/
│   │   ├── admin/                    # Admin-specific components
│   │   ├── auth/                     # Authentication components
│   │   ├── chatbot/                  # AI chatbot interface
│   │   ├── dashboard/                # Dashboard widgets
│   │   ├── portfolio/                # Portfolio visualization
│   │   ├── products/                 # Product display components
│   │   ├── profile/                  # Profile management
│   │   └── transactions/             # Transaction components
│   ├── context/                      # React context providers
│   ├── lib/                          # Utility libraries
│   ├── stores/                       # State management
│   ├── types/                        # TypeScript type definitions
│   └── Dockerfile
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (`npm install -g pnpm`)
- **Docker Desktop**

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gripinvest_winter_internship_backend
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Credentials
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_DATABASE=gripinvest

# Backend JWT Secret
JWT_SECRET=your-super-secret-key-that-is-long-and-secure

# Google Gemini API Key for AI features
GEMINI_API_KEY=your_gemini_api_key_here
```

Create a `.env` file in the `/backend` directory:

```bash
# For local Prisma commands
DATABASE_URL="mysql://root:your_strong_password@localhost:3306/gripinvest"
JWT_SECRET="your-super-secret-key-that-is-long-and-secure"
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Launch the Application

```bash
docker-compose up --build
```

### 5. Database Setup

```bash
# Apply database schema
docker-compose exec backend npx prisma migrate deploy

# Seed the database with sample data
docker-compose exec backend npx prisma db seed
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📝 API Endpoints

| Method             | Endpoint                       | Description                     | Auth Required |
| ------------------ | ------------------------------ | ------------------------------- | ------------- |
| **Authentication** |
| POST               | `/api/auth/signup`             | Register a new user             | No            |
| POST               | `/api/auth/login`              | User authentication             | No            |
| POST               | `/api/auth/forgot-password`    | Request password reset          | No            |
| POST               | `/api/auth/reset-password`     | Reset user password             | No            |
| POST               | `/api/auth/change-password`    | Change password (authenticated) | Yes           |
| **Products**       |
| GET                | `/api/products`                | Get all investment products     | Yes           |
| POST               | `/api/products`                | Create new product (admin)      | Yes           |
| PUT                | `/api/products/:id`            | Update product (admin)          | Yes           |
| DELETE             | `/api/products/:id`            | Delete product (admin)          | Yes           |
| GET                | `/api/products/:id`            | Get product details             | Yes           |
| **Investments**    |
| POST               | `/api/investments`             | Create new investment           | Yes           |
| GET                | `/api/investments/:id`         | Get investment details          | Yes           |
| POST               | `/api/investments/:id/cancel`  | Cancel recent investment        | Yes           |
| **Portfolio**      |
| GET                | `/api/portfolio/details`       | Get complete portfolio data     | Yes           |
| GET                | `/api/dashboard`               | Get dashboard analytics         | Yes           |
| **Profile**        |
| GET                | `/api/profile`                 | Get user profile                | Yes           |
| PUT                | `/api/profile`                 | Update user profile             | Yes           |
| **Transactions**   |
| GET                | `/api/transactions`            | Get transaction history         | Yes           |
| **AI Services**    |
| POST               | `/api/ai/chat`                 | Chat with AI assistant          | Yes           |
| POST               | `/api/ai/generate-description` | Generate product description    | Yes           |
| POST               | `/api/ai/portfolio-insights`   | Get AI portfolio analysis       | Yes           |
| POST               | `/api/ai/product-analysis`     | Get AI product analysis         | Yes           |

## 🤖 AI Integration Details

This platform leverages Google Gemini API with a sophisticated implementation:

### Resilient AI Architecture

- **Primary Model**: gemini-1.5-flash-latest (fast, cost-effective)
- **Fallback Model**: gemini-1.5-pro-latest (high-capacity backup)
- **Auto-failover**: Seamless switching on API overload (503 errors)
- **Centralized Management**: Single `aiHelper.ts` utility for all AI operations

### AI Features Implementation

#### 🎯 Context-Aware Chatbot "Finley"

- Receives user's current page context for relevant responses
- Integrates real-time portfolio data into conversations
- Provides personalized investment advice and explanations

#### 📈 AI Portfolio Insights

- Analyzes user's investment distribution
- Generates actionable recommendations
- Provides risk assessment and diversification suggestions

#### 🔍 AI Product Analysis

- Automated pros and cons generation for investment products
- Risk level analysis and comparison
- Performance prediction insights

#### ✍️ AI Content Generation

- Automated product description creation for admins
- SEO-optimized content generation
- Consistent tone and style across all descriptions

#### 📊 AI Log Summaries

- Intelligent analysis of transaction logs
- Error pattern recognition
- Automated reporting of system issues

## 🏗️ Architecture Highlights

### Backend Architecture

- **Modular Structure**: Clean separation of controllers, services, and routes
- **Middleware Pipeline**: Authentication, logging, and validation layers
- **Service Layer**: Abstracted business logic for reusability
- **Prisma ORM**: Type-safe database operations with migrations

### Frontend Architecture

- **App Router**: Next.js 14 app directory structure
- **Component Library**: Reusable, accessible components
- **Context Management**: Centralized authentication state
- **Type Safety**: Full TypeScript coverage with custom type definitions

### DevOps & Deployment

- **Multi-stage Dockerfiles**: Optimized production builds
- **Docker Compose**: Orchestrated multi-container setup
- **Environment Management**: Secure configuration handling
- **Health Checks**: Built-in application monitoring

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt.js for secure password storage
- **Input Validation**: Zod schemas for request validation
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Secure configuration management
- **Admin Guards**: Role-based access control
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 🎨 User Experience

### Design System

- **Modern UI**: Clean, professional interface design
- **Responsive Layout**: Mobile-first, cross-device compatibility
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Interactive Charts**: Real-time data visualization with Recharts
- **Toast Notifications**: User-friendly feedback system

### Accessibility

- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling throughout the app

## 📊 Performance & Monitoring

- **Request Logging**: Comprehensive API request tracking
- **Error Monitoring**: Detailed error logging and analysis
- **Performance Metrics**: Response time and throughput monitoring
- **Database Optimization**: Efficient queries and indexing
- **Caching Strategy**: Optimized data fetching and storage

## 🚦 Quality Assurance

- **TypeScript**: End-to-end type safety
- **Input Validation**: Server-side validation with Zod
- **Error Boundaries**: Graceful error handling in React
- **API Testing**: Comprehensive endpoint testing
- **Code Standards**: Consistent code formatting and structure

## 📈 Scalability Considerations

- **Microservices Ready**: Modular architecture for easy service extraction
- **Database Design**: Normalized schema with efficient relationships
- **API Design**: RESTful principles with consistent response formats
- **Containerization**: Easy horizontal scaling with Docker
- **Environment Separation**: Clear development/production boundaries

## 🔧 Development Workflow

### Local Development

```bash
# Start development environment with hot-reloading
docker-compose up --build

# Run database migrations
docker-compose exec backend npx prisma migrate dev

# Access database directly
docker-compose exec backend npx prisma studio
```

### Production Deployment

```bash
# Build optimized production images
docker-compose -f docker-compose.yml up --build

# Health check
curl http://localhost:3001/health
```

## 📄 License

This project is developed for the Grip Invest Winter Internship program.

---

**Built with ❤️ for Grip Invest Winter Internship Program**
