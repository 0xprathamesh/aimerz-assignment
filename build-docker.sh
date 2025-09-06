#!/bin/bash

set -e

MONGODB_URI=${MONGODB_URI:-"mongodb+srv://0x:0x@todo.eqs4szd.mongodb.net/?retryWrites=true&w=majority&appName=Todo"}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"secret"}
NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}

docker build \
  --build-arg MONGODB_URI="$MONGODB_URI" \
  --build-arg NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" \
  -t aimerz-todo-app:latest \
  -t prathameshdoteth/aimerz-assignment:latest \
  .