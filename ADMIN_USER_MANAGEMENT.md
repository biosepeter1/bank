# Admin User Management Feature

## ✅ Completed Backend Implementation

### Database Schema

**New TransferCode Model Added:**
- `TransferCodeType` enum: COT, IMF, TAX
- Fields: `code`, `type`, `amount`, `isActive`, `isVerified`, `activatedBy`, `verifiedBy`
- Auto-generated for each new user (all inactive by default)

**Migration:** `20251017195622_add_transfer_codes`

### Backend API Endpoints

All endpoints require `BANK_ADMIN` or `SUPER_ADMIN` role authentication.

#### 1. Create User Account
```
POST /admin/users/create
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+2348012345678",
  "password": "SecurePass123!",
  "initialBalance": 1000.00,
  "country": "NG",
  "currency": "NGN",
  "accountStatus": "ACTIVE",
  "kycStatus": "PENDING"
}
```

**What it does:**
- ✅ Validates email and phone uniqueness
- ✅ Hashes password
- ✅ Generates unique 10-digit account number
- ✅ Creates user account
- ✅ Creates wallet with initial balance
- ✅ Creates KYC record
- ✅ Creates 3 transfer codes (COT, IMF, TAX) - all inactive
- ✅ Creates initial deposit transaction if balance > 0
- ✅ Creates audit log
- ✅ Sends welcome email with account details

#### 2. Update User Details
```
PATCH /admin/users/:id
```
**Request Body:**
```json
{
  "firstName": "Jane",
  "email": "jane.doe@example.com",
  "accountStatus": "SUSPENDED"
}
```

#### 3. Update User Balance
```
PATCH /admin/users/:id/balance
```
**Request Body:**
```json
{
  "amount": 500.00,
  "reason": "Bonus credit"
}
```
- Supports positive (credit) and negative (debit) amounts
- Creates adjustment transaction
- Updates wallet balance atomically

#### 4. Update KYC Status
```
PATCH /admin/users/:id/kyc
```
**Request Body:**
```json
{
  "status": "APPROVED",
  "reason": "All documents verified"
}
```
- Updates KYC status (PENDING, APPROVED, REJECTED, etc.)
- Sends email notification to user
- Creates audit log

#### 5. Get Transfer Codes
```
GET /admin/users/:id/transfer-codes
```
Returns all three transfer codes (COT, IMF, TAX) for the user.

#### 6. Update Transfer Code
```
PATCH /admin/users/:id/transfer-codes/:type
```
**URL Parameters:** `:type` = COT | IMF | TAX

**Request Body:**
```json
{
  "code": "COT-123456",
  "amount": 50.00,
  "isActive": true,
  "isVerified": true,
  "description": "Cost of transfer fee"
}
```

### Email Service

**Location:** `src/common/services/email.service.ts`

**Functions:**
- `sendWelcomeEmail()` - Sent after account creation
- `sendAccountStatusEmail()` - Sent when account status changes
- `sendKycStatusEmail()` - Sent when KYC status updated

**Note:** Currently logs emails to console. To enable actual email sending:
1. Install email provider SDK (SendGrid, AWS SES, Mailgun, etc.)
2. Add credentials to `.env`
3. Uncomment and configure provider in `email.service.ts`

### Files Created/Modified

**New Files:**
- `backend/src/common/services/email.service.ts`
- `backend/src/modules/admin/dto/create-user.dto.ts`
- `backend/prisma/migrations/20251017195622_add_transfer_codes/`

**Modified Files:**
- `backend/prisma/schema.prisma` - Added TransferCode model and enum
- `backend/src/modules/admin/admin.service.ts` - Added user management methods
- `backend/src/modules/admin/admin.controller.ts` - Added new endpoints
- `backend/src/modules/admin/admin.module.ts` - Added EmailService provider

## 🚧 Remaining Frontend Work

### 1. Create User Form Component

**Location:** `frontend/components/admin/CreateUserForm.tsx`

**Requirements:**
- Form fields: firstName, lastName, email, phone, password, initialBalance, country, currency, accountStatus, kycStatus
- Validation: Required fields, email format, phone format, password strength
- Submit to `POST /admin/users/create`
- Show success message with account number
- Handle errors

### 2. Update Admin Users Page

**Location:** `frontend/app/(dashboard)/admin/users/page.tsx`

**Add Actions:**
- "Create User" button → Opens CreateUserForm modal
- Per-user actions:
  - Edit user details
  - Adjust balance
  - Approve/Reject KYC
  - Manage transfer codes
  - Activate/Deactivate account

### 3. Transfer Codes Management Dialog

**Component:** `TransferCodesDialog.tsx`

**Features:**
- Display all 3 codes (COT, IMF, TAX)
- Show status: Active/Inactive, Verified/Unverified
- Edit code value
- Set amount
- Toggle active/verified status
- Save changes

## 🧪 Testing Guide

### Backend API Testing

1. **Start backend server:**
```bash
cd backend
npm run start:dev
```

2. **Login as admin to get JWT token:**
```bash
POST http://localhost:4000/auth/login
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

3. **Create a test user:**
```bash
POST http://localhost:4000/admin/users/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "testuser@example.com",
  "phone": "+2348123456789",
  "password": "TestPass123!",
  "initialBalance": 5000,
  "country": "NG",
  "currency": "NGN",
  "accountStatus": "ACTIVE",
  "kycStatus": "PENDING"
}
```

4. **Check server logs for welcome email**

5. **Get transfer codes:**
```bash
GET http://localhost:4000/admin/users/{userId}/transfer-codes
Authorization: Bearer <admin_token>
```

6. **Activate a transfer code:**
```bash
PATCH http://localhost:4000/admin/users/{userId}/transfer-codes/COT
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "COT-789456",
  "amount": 25.00,
  "isActive": true,
  "isVerified": true,
  "description": "Cost of transfer activated"
}
```

### Database Verification

```sql
-- Check user was created
SELECT * FROM users WHERE email = 'testuser@example.com';

-- Check wallet was created with balance
SELECT * FROM wallets WHERE userId = '<user_id>';

-- Check KYC was initialized
SELECT * FROM kyc WHERE userId = '<user_id>';

-- Check transfer codes were created
SELECT * FROM transfer_codes WHERE userId = '<user_id>' ORDER BY type;

-- Check initial deposit transaction
SELECT * FROM transactions WHERE userId = '<user_id>' AND type = 'DEPOSIT';

-- Check audit logs
SELECT * FROM audit_logs WHERE entityId = '<user_id>' ORDER BY createdAt DESC;
```

## 📋 Feature Checklist

### ✅ Backend (Complete)
- [x] TransferCode database model
- [x] Database migration
- [x] Email service
- [x] Create user endpoint with full initialization
- [x] Update user details endpoint
- [x] Update balance endpoint
- [x] Update KYC status endpoint
- [x] Get transfer codes endpoint
- [x] Update transfer code endpoint
- [x] Audit logging
- [x] Email notifications
- [x] Input validation
- [x] Error handling
- [x] Successful build

### ⏳ Frontend (Pending)
- [ ] Create user form component
- [ ] Update admin users list page
- [ ] Transfer codes management dialog
- [ ] Balance adjustment dialog
- [ ] KYC status update dialog
- [ ] Integration testing

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication required
- Role-based access control (BANK_ADMIN/SUPER_ADMIN only)
- Email/phone uniqueness validation
- Account number uniqueness (generated)
- Audit trail for all admin actions
- Email notifications for status changes

## 💡 Next Steps

1. **Frontend Development** - Create React components for user management UI
2. **Email Integration** - Set up actual email provider (SendGrid/AWS SES/Mailgun)
3. **Testing** - Write integration and E2E tests
4. **Documentation** - Add API documentation to Swagger
5. **Monitoring** - Add logging and monitoring for admin actions

## 📝 Environment Variables Needed

Add to `.env`:
```env
# Email Configuration (when ready to integrate)
EMAIL_PROVIDER=sendgrid
EMAIL_FROM=noreply@rdnbanking.com
EMAIL_API_KEY=your_api_key_here

# Frontend URL for emails
FRONTEND_URL=http://localhost:3000
```

## 🎯 Usage Example Flow

1. Admin logs into dashboard
2. Clicks "Create User" button
3. Fills out form with user details
4. Sets initial balance (e.g., $1000)
5. Submits form
6. System:
   - Creates user account
   - Creates wallet with $1000
   - Generates account number
   - Creates KYC record (Pending)
   - Creates COT, IMF, TAX codes (all inactive)
   - Logs initial deposit transaction
   - Sends welcome email to user
7. User receives email with account number and login link
8. Admin can later:
   - Approve KYC
   - Activate transfer codes as needed
   - Adjust balance
   - Update account status
