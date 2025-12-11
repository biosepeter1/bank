# 🚀 RDN Banking Platform - Quick Setup Guide

## ✅ What's Already Done

Your project foundation is **100% complete** with:
- ✅ NestJS backend with all dependencies
- ✅ Next.js frontend with Tailwind CSS
- ✅ Complete Prisma database schema
- ✅ Module structure created
- ✅ Environment templates
- ✅ Documentation

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14 installed and running
- **npm** >= 9.0.0
- A code editor (VS Code recommended)

## 🎯 Step-by-Step Setup (10 minutes)

### Step 1: Install Root Dependencies (1 min)

```powershell
cd C:\Users\user\rdn-banking-platform
npm install
```

### Step 2: Setup PostgreSQL Database (2 min)

Create a new PostgreSQL database:

```sql
-- Open PostgreSQL command line or pgAdmin
CREATE DATABASE rdn_banking;
CREATE USER rdn_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rdn_banking TO rdn_user;
```

Or use this PowerShell command:
```powershell
psql -U postgres -c "CREATE DATABASE rdn_banking;"
```

### Step 3: Configure Backend Environment (2 min)

```powershell
cd backend
cp .env.example .env
```

Edit `backend\.env` and update:
```env
DATABASE_URL="postgresql://rdn_user:your_password@localhost:5432/rdn_banking?schema=public"
JWT_SECRET=change-this-to-random-secret-key
JWT_REFRESH_SECRET=change-this-to-another-random-key
ENCRYPTION_KEY=your-32-character-encryption-key
```

### Step 4: Generate Prisma Client & Migrate Database (2 min)

```powershell
# Still in backend directory
npx prisma generate
npx prisma migrate dev --name init
```

This will:
- Generate Prisma Client
- Create all database tables
- Apply the schema to PostgreSQL

### Step 5: Configure Frontend Environment (1 min)

```powershell
cd ..\frontend
cp .env.example .env.local
```

The defaults in `.env.local` should work fine for local development.

### Step 6: Initialize shadcn/ui (1 min)

```powershell
# Still in frontend directory
npx shadcn@latest init
```

When prompted, select:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### Step 7: Start Development Servers (1 min)

**Option A: Run both simultaneously (from root)**
```powershell
cd C:\Users\user\rdn-banking-platform
npm run dev
```

**Option B: Run separately in two terminals**

Terminal 1 (Backend):
```powershell
cd C:\Users\user\rdn-banking-platform
npm run backend
```

Terminal 2 (Frontend):
```powershell
cd C:\Users\user\rdn-banking-platform
npm run frontend
```

## 🌐 Access Your Application

After starting the servers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api (Swagger UI)
- **Prisma Studio**: Run `cd backend && npx prisma studio`

## 🐛 Troubleshooting

### Database Connection Error

**Problem**: `Can't reach database server`

**Solution**:
1. Verify PostgreSQL is running:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service postgresql*
   ```

2. Start PostgreSQL if stopped:
   ```powershell
   Start-Service postgresql-x64-14  # Adjust version number
   ```

3. Verify database exists:
   ```powershell
   psql -U postgres -l
   ```

### Port Already in Use

**Problem**: `Port 3000 or 3001 already in use`

**Solution**:
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or change port in .env files
# Backend: PORT=3002
# Frontend: Not directly configurable, use: npm run dev -- -p 3001
```

### Prisma Generate Fails

**Problem**: `Prisma Client generation failed`

**Solution**:
```powershell
cd backend
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

### Dependencies Installation Issues

**Problem**: npm install fails

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

## 📦 What's Installed

### Backend Dependencies
- @nestjs/core, @nestjs/common - NestJS framework
- @nestjs/jwt, @nestjs/passport - Authentication
- @prisma/client - Database ORM
- passport-jwt - JWT strategy
- bcrypt - Password hashing
- class-validator, class-transformer - Validation
- helmet - Security headers

### Frontend Dependencies
- next - Next.js 14 framework
- react, react-dom - React library
- tailwindcss - CSS framework
- zustand - State management
- axios - HTTP client
- recharts - Charts library
- lucide-react - Icon library
- framer-motion - Animations
- react-toastify - Notifications

## 🎨 Next Steps

### For Backend Development:

1. **Complete Auth Module**
   ```powershell
   cd backend\src\modules\auth
   # Create auth.service.ts, auth.controller.ts, DTOs, strategies
   ```

2. **Create Seed Data**
   ```powershell
   cd backend\prisma
   # Create seed.ts file
   npx prisma db seed
   ```

3. **Test API**
   - Visit http://localhost:3001/api
   - Test endpoints with Swagger UI

### For Frontend Development:

1. **Install shadcn UI Components**
   ```powershell
   cd frontend
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add input
   npx shadcn@latest add table
   # ... add more as needed
   ```

2. **Create Layout Components**
   ```powershell
   mkdir components\layout
   # Create Sidebar.tsx, Topbar.tsx, etc.
   ```

3. **Setup Zustand Stores**
   ```powershell
   mkdir stores
   # Create authStore.ts, userStore.ts, etc.
   ```

## 📚 Useful Resources

- **NestJS Docs**: https://docs.nestjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🆘 Need Help?

Check these files:
- `README.md` - Main project documentation
- `PROJECT_STRUCTURE.md` - Detailed project structure
- `backend/.env.example` - Backend configuration reference
- `frontend/.env.example` - Frontend configuration reference
- `backend/prisma/schema.prisma` - Database schema

## ✨ Development Tips

1. **Use Prisma Studio** to visualize and edit database data:
   ```powershell
   cd backend
   npx prisma studio
   ```

2. **Auto-restart backend on changes**:
   Already configured with `npm run start:dev`

3. **Format code**:
   ```powershell
   # Backend
   cd backend
   npm run format

   # Frontend
   cd frontend
   npm run lint
   ```

4. **View database migrations**:
   ```powershell
   cd backend\prisma\migrations
   dir
   ```

---

## 🎉 You're Ready!

Your RDN Banking Platform foundation is complete. Start by:
1. ✅ Running the setup steps above
2. ✅ Verify both servers start successfully
3. ✅ Access the Swagger API documentation
4. ✅ Begin implementing authentication module

**Happy coding! 🚀**
