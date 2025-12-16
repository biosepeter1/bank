#!/bin/bash
# Deploy script for VPS
# Clean build on VPS - .next is not tracked in git

set -e

echo "🚀 Starting deployment..."

cd /var/www/bank

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Frontend: clean build
echo "🔧 Building frontend..."
cd frontend
rm -rf .next
npm install --legacy-peer-deps
npm run build
cd ..

# Restart backend
echo "🔧 Restarting backend..."
pm2 restart backend

# Restart frontend
echo "🔧 Restarting frontend..."
pm2 restart frontend

echo "✅ Deployment complete!"
pm2 status
