# Portfolio Analytics Dashboard

A comprehensive full-stack portfolio management and analytics application built with React, Node.js, Prisma ORM, and NeonDB.

## 🚀 Features

### Backend API
- **Portfolio Holdings Endpoint**: Complete holdings data with real-time valuations
- **Portfolio Allocation Endpoint**: Sector and asset allocation analysis  
- **Performance Comparison Endpoint**: Historical performance tracking and benchmarking
- **Portfolio Summary Endpoint**: Comprehensive portfolio overview and metrics

### Frontend Dashboard
- **Portfolio Overview Cards**: Key metrics and performance indicators
- **Asset Allocation Visualizations**: Interactive pie charts and sector breakdowns
- **Holdings Table/Grid**: Sortable, detailed holdings management interface
- **Performance Comparison Chart**: Historical performance visualization with multiple timeframes
- **Top Performers Section**: Best and worst performing assets analysis

### Technical Features
- Responsive design optimized for desktop, tablet, and mobile
- Real-time data updates and refresh capabilities
- Professional UI with smooth animations and hover effects
- Comprehensive error handling and loading states
- Type-safe development with TypeScript

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Prisma
- **Charts**: Chart.js with React-ChartJS-2
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- NeonDB account and database URL

### 1. Environment Setup
```bash
# Clone or setup the project
npm install

# Configure your database URL in .env
DATABASE_URL="your_neon_database_url_here"
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

### 3. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run client  # Frontend on http://localhost:5173
npm run server  # Backend on http://localhost:3001
```

## 🎯 Usage

1. **Initial Setup**: The app will prompt you to create sample data on first visit
2. **Portfolio Management**: View and analyze your investment portfolios
3. **Performance Tracking**: Monitor gains/losses and performance over time
4. **Allocation Analysis**: Understand your portfolio's sector and asset distribution
5. **Top Performers**: Identify your best and worst performing investments

## 📊 API Endpoints

- `GET /api/portfolios` - List all portfolios
- `GET /api/portfolios/:id/summary` - Portfolio summary
- `GET /api/portfolios/:id/holdings` - Portfolio holdings
- `GET /api/portfolios/:id/allocation` - Asset allocation data
- `GET /api/portfolios/:id/performance` - Performance metrics
- `POST /api/seed-data` - Create sample data

## 🎨 Design System

- **Primary Colors**: Blue (#3B82F6), Green (#10B981), Orange (#F59E0B)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: 8px grid system for consistent layout
- **Components**: Reusable, accessible UI components
- **Animations**: Subtle transitions and hover effects

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
server/                 # Express.js backend
prisma/                 # Database schema and migrations
```

## 🚀 Deployment Ready

This application is production-ready with:
- Environment-based configuration
- Error handling and validation
- Optimized build process
- Database connection pooling
- Responsive design
- Performance optimizations

## 🔧 Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:studio` - Open Prisma Studio

Built with modern web technologies and best practices for a professional portfolio management experience.