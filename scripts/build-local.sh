#!/bin/bash
# Local build and deploy script
# Run this on your local machine before pushing to production

set -e

echo "🔨 Building frontend locally..."
cd frontend
# Force production API URL during build (overrides .env.local)
NEXT_PUBLIC_API_URL=http://64.227.45.177/api npm run build

echo "📦 Adding built files to git..."
cd ..
git add frontend/.next

echo "✅ Build complete! Now commit and push:"
echo "   git commit -m 'build: pre-built frontend'"
echo "   git push origin main"
echo ""
echo "The webhook will auto-deploy on the VPS after push."
