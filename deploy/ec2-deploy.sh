#!/bin/bash

set -e

# Configuration
EC2_HOST="13.61.100.30"
EC2_USER="ec2-user"
SSH_KEY="$(dirname "$0")/../github_ec2_key"
APP_DIR="/home/ec2-user/aimerz-todo-app"
DOCKER_IMAGE="0xprathameshdoteth/aimerz-assignment:ec2"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key not found: $SSH_KEY"
    echo "Please generate SSH keys first:"
    echo "ssh-keygen -t ed25519 -C 'github-actions-ec2' -f github_ec2_key"
    exit 1
fi

# Set proper permissions for SSH key
chmod 600 "$SSH_KEY"

echo "🚀 Starting EC2 deployment for Aimerz Todo App..."
echo "📡 Connecting to: $EC2_USER@$EC2_HOST"
echo "🔑 Using SSH key: $SSH_KEY"

ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
set -e

echo "🚀 Starting deployment on EC2..."

# Update system packages
sudo yum update -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create app directory
mkdir -p /home/ec2-user/aimerz-todo-app
cd /home/ec2-user/aimerz-todo-app

# Pull latest Docker image
echo "📦 Pulling latest Docker image..."
docker pull 0xprathameshdoteth/aimerz-assignment:ec2

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env << 'ENVEOF'
MONGODB_URI=mongodb+srv://0x:0x@todo.eqs4szd.mongodb.net/?retryWrites=true&w=majority&appName=Todo
NEXTAUTH_SECRET=secrets
NEXTAUTH_URL=https://todo.enrollengineer.in
NODE_ENV=production
PORT=3000
ENVEOF

# Create docker-compose.yml
echo "🐳 Creating Docker Compose configuration..."
cat > docker-compose.yml << 'COMPOSEEOF'
version: "3.8"

services:
  app:
    image: 0xprathameshdoteth/aimerz-assignment:ec2
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
COMPOSEEOF

# Copy nginx configuration from repository or create default
if [ -f "/home/ec2-user/aimerz-todo-app/nginx.conf" ]; then
    echo "📋 Using existing nginx configuration..."
else
    echo "📋 Creating nginx configuration..."
    cat > nginx.conf << 'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    upstream nextjs_app {
        server app:3000;
        keepalive 32;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name todo.enrollengineer.in www.todo.enrollengineer.in;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server (with self-signed certificate for now)
    server {
        listen 443 ssl http2;
        server_name todo.enrollengineer.in www.todo.enrollengineer.in;

        # Self-signed SSL configuration
        ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
        ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Main application
        location / {
            proxy_pass http://nextjs_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # Health check endpoint
        location /api/health {
            proxy_pass http://nextjs_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            access_log off;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            proxy_pass http://nextjs_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
NGINXEOF
fi

# Generate self-signed SSL certificate if it doesn't exist
if [ ! -f "./ssl/nginx-selfsigned.crt" ]; then
    echo "🔐 Generating self-signed SSL certificate..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/nginx-selfsigned.key \
        -out ssl/nginx-selfsigned.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=todo.enrollengineer.in"
fi

# Stop current services
echo "⏹️ Stopping current services..."
docker-compose down || true

# Start services with new image
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is running at https://todo.enrollengineer.in"
    echo "📊 You can also access it via HTTP at http://$(curl -s ifconfig.me) (will redirect to HTTPS)"
else
    echo "❌ Deployment failed!"
    echo "📋 Checking logs..."
    docker-compose logs
    exit 1
fi
EOF

echo "🎉 EC2 deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with production values:"
echo "   - MONGODB_URI: your MongoDB Atlas connection string"
echo "   - NEXTAUTH_SECRET: your production NextAuth secret"
echo "2. For production SSL, replace the self-signed certificate with a real one"
echo "3. Restart the application:"
echo "   ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd $APP_DIR && docker-compose restart'"
echo "4. Check application status:"
echo "   ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd $APP_DIR && docker-compose ps'"
echo ""
echo "🌐 Our application is now available at: https://todo.enrollengineer.in"