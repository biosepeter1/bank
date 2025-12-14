#!/bin/bash
# Deploy script for VPS - Run this after git pull

set -e

echo "🚀 Starting deployment..."

cd /var/www/bank

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Restart backend (no build needed - uses typescript directly with ts-node)
echo "🔧 Restarting backend..."
pm2 restart backend

# For frontend: if you push pre-built .next folder, just restart
# If you need to rebuild (only when dependencies change):
# cd frontend && npm install && npm run build

echo "🔧 Restarting frontend..."
pm2 restart frontend

echo "✅ Deployment complete!"
pm2 status
