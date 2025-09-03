# Aimerz Todo App - Full Stack

A scalable todo list application built with Next.js, NextAuth, and MongoDB.

## Features

- 🔐 User authentication with NextAuth
- 📱 Responsive dashboard with dark/light mode
- 🗄️ MongoDB integration
- 🐳 Docker support
- 🚀 CI/CD pipeline with GitHub Actions
- ⚡ Built with Next.js 15 and Turbopack

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/0xprathamesh/aimerz-assignment
cd aimerz-assignment
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
MONGODB_URL=
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run docker:build` - Build Docker image
- `npm run docker:dev` - Run with Docker Compose

## Deployment

### Vercel (Recommended)


### Docker

```bash
npm run docker:build
npm run docker:run
```

### GitHub Actions

The repository includes a CI/CD pipeline that:
- Lints and tests code
- Builds Docker images
- Deploys to Vercel automatically

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Deployment**: Vercel + Docker
- **CI/CD**: GitHub Actions

