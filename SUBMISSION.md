# Aimerz Assignment - Todo & Notes App

## Project Overview

Built a full-stack todo and notes management app with Next.js, MongoDB, and Docker. Users can create, organize, and manage tasks and notes with features like categories, priorities, and real-time updates.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand stores
- **Styling**: Tailwind CSS, shadcn/ui components
- **Deployment**: Docker, EC2, Vercel
- **CI/CD**: GitHub Actions

## Key Features

- User authentication with NextAuth.js
- Todo management with categories and priorities
- Notes system with rich text support
- Real-time state management with Zustand
- Responsive design with dark/light mode
- Docker containerization
- Health check endpoints

## Project Structure

```
aimerz-assignment/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   └── dashboard/         # Main app pages
├── components/            # React components
│   ├── auth/             # Login/register forms
│   ├── dashboard/        # Layout components
│   ├── notes/            # Notes components
│   └── todos/            # Todo components
├── lib/                  # Utilities and configs
│   ├── stores/           # Zustand stores
│   └── hooks/            # Custom hooks
├── models/               # MongoDB models
└── types/                # TypeScript types
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET/POST /api/todos` - Todo CRUD operations
- `GET/POST /api/notes` - Notes CRUD operations
- `GET /api/health` - Health check

## Data Flow

1. User logs in via NextAuth.js
2. Frontend fetches data from API routes
3. API routes connect to MongoDB via Mongoose
4. State managed with Zustand stores
5. Real-time updates across components

## Setup Instructions

### Development

```bash
# Clone repo
git clone https://github.com/0xprathamesh/aimerz-assignment.git
cd aimerz-assignment

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your MongoDB URI and NextAuth secret

# Run development server
npm run dev
```

### Production

```bash
# Build Docker image
docker build -t aimerz-assignment .

# Run with docker-compose
docker-compose up -d
```

## Deployment

- **Live URL**: https://aimerztodo.vercel.app || http://todo.enrollengineer.in
- **GitHub**: https://github.com/0xprathamesh/aimerz-assignment
- **Vercel**: Auto-deployed from main branch
- **EC2**: Docker deployment with nginx reverse proxy

## Screenshots

See SCREENSHOTS.md for app screenshots and demo images.

## Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=production
```

## Features Implemented

- ✅ User authentication
- ✅ Todo CRUD operations
- ✅ Notes management
- ✅ Category and priority filters
- ✅ Search functionality
- ✅ Responsive design
- ✅ Dark/light mode
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Health monitoring
