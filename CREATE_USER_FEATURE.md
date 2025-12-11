# Create User Feature - Admin & Super Admin

## Summary
Added **"Create User"** button and functionality to both Admin and Super Admin user management pages.

## Changes Made

### 1. Frontend - Admin API (`frontend/lib/api/admin.ts`)
- Added `createUser` method that calls `POST /admin/users/create`
- Accepts: firstName, lastName, email, phone, password

### 2. Frontend - Admin Users Page (`frontend/app/(dashboard)/admin/users/page.tsx`)
- Added **"Create User"** button next to the filters
- Added state management for new user form fields:
  - `newUserFirstName`
  - `newUserLastName`
  - `newUserEmail`
  - `newUserPhone`
  - `newUserPassword`
- Added `handleCreateUser()` function with validation:
  - Checks all fields are filled
  - Validates password is at least 8 characters
  - Calls admin API
  - Shows success/error toast
  - Refreshes user list after creation
- Added Create User Dialog modal with form fields

### 3. Frontend - Super Admin Users Page (`frontend/app/(dashboard)/super-admin/users/page.tsx`)
- Copied all the same functionality from admin users page
- Both admins and super admins can now create users

## Backend API (Already Exists)
The backend already had the endpoint:
- **POST** `/admin/users/create`
- Accessible by: `BANK_ADMIN` and `SUPER_ADMIN` roles
- Located in: `backend/src/modules/admin/admin.controller.ts`

## How to Use

### As Admin or Super Admin:
1. Login to admin dashboard
2. Navigate to **User Management** page
3. Click **"Create User"** button (green button with + icon)
4. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Phone (format: +2341234567890)
   - Password (minimum 8 characters)
5. Click **"Create User"**
6. New user will appear in the user list

## Features
- ✅ Form validation (all fields required, password min 8 chars)
- ✅ Loading state during creation
- ✅ Success/error toast notifications
- ✅ Auto-refresh user list after creation
- ✅ Clean modal dialog UI
- ✅ Available for both BANK_ADMIN and SUPER_ADMIN

## Testing
1. Login as admin: `superadmin@rdn.bank` / `SuperAdmin@123`
2. Go to `/admin/users`
3. Click "Create User"
4. Create a test user
5. Verify user appears in list
6. Try logging in with new user credentials

## Notes
- Created users will have:
  - Default role: USER
  - Account status: ACTIVE
  - KYC status: NOT_SUBMITTED
  - Balance: ₦0.00 (can be credited by admin later)
