#!/bin/bash
set -e

echo "🚀 Starting Aimerz Todo App with Docker Compose..."

export MONGODB_URI="mongodb://mongodb:27017/aimerz-todo"
export NEXTAUTH_SECRET="local-development-secret-key"
export NEXTAUTH_URL="http://localhost:3000"
export MONGO_USERNAME="admin"
export MONGO_PASSWORD="password"

echo "📦 Building and starting containers..."
docker compose up --build

echo "✅ Application is running at http://localhost:3000"