#!/bin/bash

set -e

# Check for required environment variables
if [ -z "$MONGODB_URI" ] || [ -z "$NEXTAUTH_SECRET" ] || [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ ERROR: Missing required environment variables"
  echo "Please set: MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL"
  echo ""
  echo "Example to test locally:"
  echo "  export MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net/db'"
  echo "  export NEXTAUTH_SECRET='your-secret-minimum-32-characters'"
  echo "  export NEXTAUTH_URL='http://localhost:3000'"
  echo "  ./build-docker.sh"
  echo ""
  echo "For production deployment:"
  echo "  export MONGODB_URI='mongodb+srv://0x:0x@todo.eqs4szd.mongodb.net/?retryWrites=true&w=majority&appName=Todo'"
  echo "  export NEXTAUTH_SECRET='secrets'"
  echo "  export NEXTAUTH_URL='https://todo.enrollengineer.in'"
  echo "  ./build-docker.sh"
  exit 1
fi

echo "🚀 Building Docker image for Aimerz Todo App..."
echo "📦 MONGODB_URI: ${MONGODB_URI:0:20}..."
echo "🔐 NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."
echo "🌐 NEXTAUTH_URL: $NEXTAUTH_URL"

# Build Docker image with multiple tags
docker build \
  --build-arg MONGODB_URI="$MONGODB_URI" \
  --build-arg NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" \
  -t aimerz-todo-app:latest \
  -t 0xprathameshdoteth/aimerz-assignment:latest \
  -t 0xprathameshdoteth/aimerz-assignment:ec2 \
  .

echo "✅ Docker image built successfully!"
echo "📋 Available tags:"
echo "  - aimerz-todo-app:latest"
echo "  - 0xprathameshdoteth/aimerz-assignment:latest"
echo "  - 0xprathameshdoteth/aimerz-assignment:ec2"
echo ""
echo "🚀 To push to Docker Hub:"
echo "  docker push 0xprathameshdoteth/aimerz-assignment:latest"
echo "  docker push 0xprathameshdoteth/aimerz-assignment:ec2"