# VeloCity (formerly Lion Lease, a.k.a LL)

<div align="center">
  <h3>🏠 Your Gem-Finder for NYC Apartment Hunting</h3>
  <p>Discover hidden gem apartments near Columbia University with AI-powered smart filters and collaborative group search</p>
</div>

---

## 📋 Overview

**VeloCity** (formerly Lion Lease) is a modern, full-stack apartment listing platform designed specifically for Columbia University students and NYC renters. The application aggregates rental listings and provides intelligent tools to help users find the perfect apartment through smart filtering, AI-powered scoring, group collaboration features, and comprehensive comparison tools.

### 🎯 The Problem We Solve

Traditional apartment hunting platforms often show listings that are:
- Already rented by the time you see them
- Overpriced for their actual value
- Missing crucial amenity information
- Difficult to compare effectively

**VeloCity** addresses these issues by providing:
- **First Access** to newly listed apartments
- **Better Value** through intelligent LionScore ratings
- **Higher Quality** filtering with natural language search
- **Group Collaboration** for roommate hunting
- **Smart Comparisons** based on your priorities

---

## ✨ Key Features

### 🔍 Smart Filters
- **Natural language search** for apartment amenities (e.g., "in unit washer", "doorman", "rooftop")
- **Fuzzy matching** using Fuse.js for intelligent suggestions
- **Analytics tracking** to improve feature recommendations
- 50+ curated NYC-specific apartment features

### 🦁 LionScore Rating System
- Proprietary scoring algorithm that rates apartments based on:
  - Budget alignment
  - Distance to Columbia University
  - Amenities quality
  - Neighborhood safety
  - Building features
- Visual gem indicators for easy identification of great deals

### 👥 Group Collaboration
- **Create or join apartment hunting groups** with unique invite codes
- **Shared dashboard** for group-saved listings
- **Voting system** (upvote/downvote) on group apartments
- **Activity feed** to see what teammates are viewing and saving
- Perfect for roommate hunting

### ⚖️ Comparison Tool
- **Side-by-side comparison** of up to 3 apartments
- **Custom priority ranking** (Budget, Location, Amenities, etc.)
- **Weighted scoring** based on your priorities
- **Visual breakdown** of each apartment's strengths

### 🗺️ Interactive Maps
- **Google Maps integration** with custom markers
- **Clustering** for dense listing areas
- **Distance calculation** from Columbia University
- **Single listing map view** on detail pages

### 📊 Personal Dashboard
- **Saved listings** management
- **Viewed history** tracking
- **User preferences** storage
- **Analytics** on your search behavior

### 🎓 Student Resources
- **Senior Blueprint** - Apartment hunting guide for seniors
- **Early Bird Launchpad** - Resources for first-time renters
- **Interactive checklists** and platform recommendations
- **Priority setting guides**

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **TailwindCSS 4** - Styling
- **Zustand** - State management
- **Fuse.js** - Fuzzy search
- **React Leaflet & Google Maps API** - Interactive maps
- **Supabase Client** - Authentication and real-time features
- **Lucide React** - Icon library
- **Swiper** - Touch-enabled carousels

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **Supabase** - Authentication and database hosting
- **Nodemailer & Resend** - Email services
- **UUID** - Unique identifier generation

### Infrastructure
- **Supabase** - Backend-as-a-Service (Auth + PostgreSQL)
- **Render** - Backend hosting
- **Netlify/Vercel** - Frontend hosting (velocitygems.com)

---

## 📁 Project Structure

```
VeloCity/
├── LL Back End/                 # Express.js API server
│   ├── routes/                  # API route handlers
│   │   ├── group.js            # Group collaboration endpoints
│   │   ├── saved.js            # Saved listings management
│   │   ├── viewed.js           # Viewed listings tracking
│   │   ├── preferences.js      # User preferences
│   │   └── smartFilters.js     # Analytics for smart filters
│   ├── utils/                   # Utility functions
│   │   └── sendCustomEmail.js  # Email sending utilities
│   ├── prisma/                  # Database schema and migrations
│   │   ├── schema.prisma       # Database models
│   │   └── migrations/         # Database migration history
│   ├── db.js                    # Prisma client setup
│   └── index.js                 # Main server entry point
│
├── LL Front End/
│   └── apartment-listings/      # React + Vite application
│       ├── src/
│       │   ├── assets/          # Images, SVG icons, fonts
│       │   ├── components/      # Reusable React components
│       │   │   ├── Compare/    # Comparison tool components
│       │   │   ├── GuideTabs/  # Student guide components
│       │   │   └── SeniorInsights/ # Senior-specific resources
│       │   ├── context/         # React Context providers
│       │   ├── data/            # Static listing data (JSON)
│       │   ├── hooks/           # Custom React hooks
│       │   ├── layouts/         # Page layout wrappers
│       │   ├── lib/             # Third-party client setup
│       │   ├── pages/           # Route page components
│       │   ├── services/        # API communication layer
│       │   ├── store/           # Zustand state stores
│       │   └── utils/           # Utility functions
│       ├── public/              # Static assets
│       ├── vite.config.js       # Vite configuration
│       └── tailwind.config.js   # TailwindCSS configuration
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Supabase account)
- **Supabase** account for authentication
- **Google Maps API key** (optional, for map features)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/VeloCity.git
cd VeloCity
```

#### 2. Backend Setup

```bash
cd "LL Back End"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see below)

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

#### 3. Frontend Setup

```bash
cd "LL Front End/apartment-listings"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration (see below)

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`  
The backend will be available at `http://localhost:3001`

---

## 🔐 Environment Variables

### Backend (LL Back End/.env)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Supabase
SUPABASE_URL="https://yourproject.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Server
PORT=3001

# Email (Optional - for notifications)
RESEND_API_KEY="your-resend-api-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Frontend (LL Front End/apartment-listings/.env)

```env
# Supabase
VITE_SUPABASE_URL="https://yourproject.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# API URL
VITE_API_URL="http://localhost:3001"
```

---

## 🗄️ Database Schema

The application uses **PostgreSQL** via **Prisma ORM** with the following main models:

- **Profile** - User profile mirroring Supabase auth.users
- **UserPreferences** - Per-user search preferences (budget, bedrooms, etc.)
- **SavedListing** - Personally saved apartments
- **ViewedListing** - Apartment viewing history
- **Group** - Shared apartment hunting groups
- **GroupMember** - Group membership
- **GroupSavedListing** - Listings saved to group dashboards
- **ListingVote** - Upvote/downvote on group listings
- **SmartFilterUsage** - Analytics for feature usage

### Running Migrations

```bash
cd "LL Back End"

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# View database in Prisma Studio
npx prisma studio
```

---

## 🔧 Development Workflow

### Backend Development
```bash
cd "LL Back End"

# Development with auto-reload
npm run dev

# Production start
npm start
```

### Frontend Development
```bash
cd "LL Front End/apartment-listings"

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎨 Key Components

### Smart Filters (`src/components/SmartFiltersTab.jsx`)
- Natural language search with fuzzy matching
- Real-time suggestions as you type
- Analytics tracking for popular features
- Persistent filter selection

### Listing Card (`src/components/ListingCard.jsx`)
- Photo carousel with navigation
- LionScore gem indicator
- Save to personal or group dashboard
- Distance from Columbia University
- Voting interface (for group cards)

### Comparison Tool (`src/pages/ComparePage.jsx`)
- Multi-step comparison workflow
- Priority ranking with drag-and-drop
- Weighted scoring algorithm
- Visual score breakdown

### Group Dashboard (`src/pages/DashboardPage.jsx`)
- Shared listings with voting
- Activity feed
- Member management
- Invite code generation

---

## 📡 API Endpoints

### Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Create/update preferences

### Saved Listings
- `GET /api/saved` - Get saved listings
- `POST /api/saved` - Save a listing
- `DELETE /api/saved/:id` - Unsave a listing

### Viewed Listings
- `GET /api/viewed` - Get viewed history
- `POST /api/viewed` - Mark listing as viewed

### Groups
- `GET /api/group/my` - Get user's group
- `POST /api/group/create` - Create new group
- `POST /api/group/join` - Join group with code
- `GET /api/group/:groupId/saved` - Get group listings
- `POST /api/group/:groupId/save` - Save to group
- `POST /api/group/:groupId/vote` - Vote on listing

### Smart Filters
- `POST /api/smart-filters/track` - Track filter usage

---

## 🚢 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build command: `npm install && npx prisma generate`
4. Configure start command: `npm start`
5. Add environment variables
6. Deploy

### Frontend (Netlify/Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

**Production URLs:**
- Frontend: https://velocitygems.com
- Backend API: https://lion-lease-backend.onrender.com

---

## 🧪 Testing

```bash
# Frontend tests (when implemented)
cd "LL Front End/apartment-listings"
npm test

# Backend tests (when implemented)
cd "LL Back End"
npm test
```


---

<div align="center">
  <p>Built with ❤️ for Columbia University students</p>
  <p>🦁 Happy apartment hunting!</p>
</div>
