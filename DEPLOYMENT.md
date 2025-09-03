# Deployment Guide

This guide covers deploying the Aimerz Todo App using various platforms.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Deploy with GitHub Actions
1. Fork this repository
2. Set up the following secrets in your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `MONGODB_URL`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A random secret for NextAuth
   - `NEXTAUTH_URL`: Your production URL

3. Push to the `main` branch to trigger deployment

## 🐳 Docker Deployment

### Local Development with Docker
```bash
# Build and run with docker-compose
npm run docker:dev

# Or build and run manually
npm run docker:build
npm run docker:run
```

### Production Docker Deployment
```bash
# Build the image
docker build -t aimerz-todo-app .

# Run the container
docker run -p 3000:3000 \
  -e MONGODB_URL=your_mongodb_url \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  aimerz-todo-app
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URL=mongodb://localhost:27017/aimerz-todo
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Production Environment Variables
- `MONGODB_URL`: MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: Random 32+ character string
- `NEXTAUTH_URL`: Your production domain

## 📋 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. ✅ Lints code with ESLint
2. ✅ Runs TypeScript type checking
3. ✅ Builds the application
4. 🐳 Builds and pushes Docker image to Docker Hub
5. 🚀 Deploys to Vercel

### Required GitHub Secrets
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `MONGODB_URL`: MongoDB connection string
- `NEXTAUTH_SECRET`: NextAuth secret
- `NEXTAUTH_URL`: Production URL

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP addresses
5. Get the connection string

### Local MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
# Follow MongoDB installation guide for your OS
```

## 🔍 Monitoring and Logs

### Vercel
- View logs in Vercel dashboard
- Monitor performance and errors
- Set up alerts for critical issues

### Docker
```bash
# View container logs
docker logs <container_id>

# Monitor resource usage
docker stats <container_id>
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Ensure all dependencies are installed
   - Verify TypeScript types

2. **Database Connection Issues**
   - Verify MongoDB URL
   - Check network connectivity
   - Ensure database user permissions

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure MongoDB connection is working

### Getting Help
- Check the GitHub Issues
- Review the application logs
- Verify environment variables
- Test locally first

## 📈 Performance Optimization

- Enable Vercel Analytics
- Use MongoDB Atlas for better performance
- Implement caching strategies
- Optimize images and assets
- Monitor Core Web Vitals