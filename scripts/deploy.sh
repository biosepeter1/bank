#!/bin/bash
# Deploy script for VPS
# Pre-built: Just pull and restart. Build locally before pushing.

set -e

echo "🚀 Starting deployment..."

cd /var/www/bank

# Pull latest code (includes pre-built .next folder)
echo "📥 Pulling latest code..."
git pull origin main

# Restart backend
echo "🔧 Restarting backend..."
pm2 restart backend

# Restart frontend (uses pre-built .next from repo)
echo "🔧 Restarting frontend..."
pm2 restart frontend

echo "✅ Deployment complete!"
pm2 status
