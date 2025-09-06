#!/bin/bash

set -e

if [ -z "$MONGODB_URI" ] || [ -z "$NEXTAUTH_SECRET" ] || [ -z "$NEXTAUTH_URL" ]; then
  echo "ERROR: Missing required environment variables"
  echo "Please set: MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL"
  echo "Example:"
  echo "  export MONGODB_URI='mongodb+srv://user:pass@cluster.mongodb.net/db'"
  echo "  export NEXTAUTH_SECRET='your-secret'"
  echo "  export NEXTAUTH_URL='http://localhost:3000'"
  echo "  ./build-docker.sh"
  exit 1
fi

docker build \
  --build-arg MONGODB_URI="$MONGODB_URI" \
  --build-arg NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" \
  -t aimerz-todo-app:latest \
  -t prathameshdoteth/aimerz-assignment:latest \
  .