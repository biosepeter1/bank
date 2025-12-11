# 🚀 RDN Banking - Quick Start (No PostgreSQL Required!)

## Option 1: Use SQLite for Testing (Fastest - No PostgreSQL needed!)

### Step 1: Update Prisma to use SQLite (2 min)

1. Navigate to backend:
```powershell
cd C:\Users\user\rdn-banking-platform\backend
```

2. Open `prisma\schema.prisma` and change the datasource from:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Create .env file

```powershell
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=my-super-secret-jwt-key-for-testing
JWT_REFRESH_SECRET=my-super-secret-refresh-key-for-testing
ENCRYPTION_KEY=my-32-char-encryption-key-test
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Step 3: Generate Prisma Client & Create Database

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Start Backend

```powershell
npm run start:dev
```

✅ **Backend running at:** http://localhost:3001/api

---

## Option 2: Install PostgreSQL (Production-Ready)

### For Windows:

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 14 or higher
   - Run installer and follow wizard

2. **During Installation:**
   - Set password for postgres user (remember this!)
   - Port: 5432 (default)
   - Accept other defaults

3. **Create Database:**
   ```powershell
   # Open Command Prompt or PowerShell
   cd "C:\Program Files\PostgreSQL\14\bin"
   .\psql.exe -U postgres
   
   # In psql console:
   CREATE DATABASE rdn_banking;
   \q
   ```

4. **Configure Backend:**
   ```powershell
   cd C:\Users\user\rdn-banking-platform\backend
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/rdn_banking?schema=public"
   JWT_SECRET=change-this-to-random-secret-key
   JWT_REFRESH_SECRET=change-this-to-another-random-key
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

5. **Run Migrations:**
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init
   npm run start:dev
   ```

---

## Frontend Setup (5 minutes)

### Step 1: Configure Environment

```powershell
cd C:\Users\user\rdn-banking-platform\frontend
cp .env.example .env.local
```

The defaults should work fine!

### Step 2: Initialize shadcn/ui

```powershell
npx shadcn@latest init
```

**Selections:**
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: tailwind.config.ts
- Components location: @/components
- Utils location: @/lib/utils
- React Server Components: Yes
- Write config: Yes

### Step 3: Start Frontend

```powershell
npm run dev
```

✅ **Frontend running at:** http://localhost:3000

---

## Test Your Setup

### 1. Test Backend API

Open browser: http://localhost:3001/api

You should see Swagger UI with all API endpoints!

### 2. Test Registration

**Using Swagger UI:**
1. Go to http://localhost:3001/api
2. Find `/auth/register` endpoint
3. Click "Try it out"
4. Use this test data:
```json
{
  "email": "test@example.com",
  "phone": "+2348012345678",
  "firstName": "Test",
  "lastName": "User",
  "password": "Password@123"
}
```
5. Click "Execute"

You should get a `201` response with access token!

### 3. Test Login

1. Find `/auth/login` endpoint
2. Use:
```json
{
  "email": "test@example.com",
  "password": "Password@123"
}
```

Success! 🎉

---

## What's Working Now?

✅ **Backend API**
- User registration
- User login with JWT
- Token refresh
- User profile endpoint
- Role-based access control
- Swagger documentation

✅ **Database**
- SQLite (for testing) OR PostgreSQL
- Complete schema with migrations
- User, Wallet, Transactions, Cards, KYC, etc.

✅ **Security**
- Password hashing with bcrypt
- JWT authentication
- Role-based guards (User, Bank Admin, Super Admin)

---

## Next Steps

### 1. View Database (Prisma Studio)

```powershell
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

You can view/edit all database records!

### 2. Create Admin User

Use Prisma Studio or create via API with role modifications.

### 3. Continue Development

Check `PROJECT_STRUCTURE.md` for what to build next!

**Recommended order:**
1. ✅ Authentication (DONE!)
2. Wallet operations
3. Transactions
4. KYC module
5. Admin dashboards
6. Frontend pages

---

## Troubleshooting

### "Cannot find module '@prisma/client'"

```powershell
cd backend
npx prisma generate
```

### Backend won't start

1. Check `.env` file exists
2. Verify DATABASE_URL is set
3. Run: `npx prisma migrate dev`

### Port already in use

```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 🎯 You're Ready!

Your banking platform backend is fully functional with:
- ✅ User authentication
- ✅ JWT security  
- ✅ Database migrations
- ✅ API documentation
- ✅ Role-based access

**Start building features or test the API!** 🚀
