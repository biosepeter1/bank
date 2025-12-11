# Account Status Access Control

## Overview
This document explains how account status affects user access to the platform and what suspended users can and cannot do.

## Account Statuses

### 1. **PENDING**
- New accounts waiting for KYC verification
- Can log in
- Can submit KYC documents
- Cannot perform financial transactions

### 2. **ACTIVE**
- Fully verified accounts
- Full access to all features
- Can perform all transactions

### 3. **SUSPENDED**
- Accounts temporarily suspended (e.g., failed KYC, suspicious activity)
- **CAN log in** but with **LIMITED ACCESS**
- See "Suspended Account Access" section below

### 4. **FROZEN**
- Accounts frozen due to serious issues
- **CANNOT log in**
- Must contact support

### 5. **CLOSED**
- Permanently closed accounts
- **CANNOT log in**
- Must contact support

## Suspended Account Access

Suspended accounts can log in but have very limited access. This allows users to:
- Understand why their account was suspended
- Submit or update KYC documents to resolve the issue
- Contact support
- View account information

### What Suspended Users CAN Do:

#### Authentication & Profile
- ✅ Login to their account
- ✅ View their profile (`GET /api/auth/me`)
- ✅ Change password
- ✅ View notification settings (`GET /api/auth/settings`)
- ✅ Update notification settings (`PATCH /api/auth/settings`)

#### KYC (to resolve suspension)
- ✅ View KYC requirements (`GET /api/kyc/requirements`)
- ✅ View their KYC status (`GET /api/kyc/status`)
- ✅ Upload KYC documents
  - `POST /api/kyc/upload/id-document`
  - `POST /api/kyc/upload/proof-of-address`
  - `POST /api/kyc/upload/selfie`
- ✅ Submit KYC (`POST /api/kyc/submit`)

### What Suspended Users CANNOT Do:

- ❌ View wallet balance
- ❌ Make transfers
- ❌ Make payments
- ❌ Make withdrawals
- ❌ Make deposits
- ❌ Request cards
- ❌ View or create transactions
- ❌ Apply for loans
- ❌ Make investments
- ❌ Any other financial operations

When trying to access blocked endpoints, suspended users will receive:
```json
{
  "statusCode": 403,
  "message": "Your account is suspended. You have limited access. Please contact support or check your account status."
}
```

## Implementation Details

### AccountStatusGuard

The `AccountStatusGuard` is applied globally to all routes with the following logic:

1. **SUSPENDED accounts**: Blocked from most actions unless endpoint is marked with `@AllowSuspended()`
2. **FROZEN accounts**: Blocked from all actions (cannot log in)
3. **CLOSED accounts**: Blocked from all actions (cannot log in)
4. **PENDING and ACTIVE accounts**: Normal access based on permissions

### @AllowSuspended() Decorator

Use this decorator on endpoints that suspended accounts should be able to access:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
@AllowSuspended() // Suspended users can view their profile
async getProfile(@CurrentUser() user: any) {
  return this.userService.getProfile(user.id);
}
```

### Adding Support for Suspended Users

To allow suspended users to access a new endpoint:

1. Add the `@AllowSuspended()` decorator to the route handler
2. Document the endpoint as accessible to suspended users
3. Test with a suspended account

Example:
```typescript
import { AllowSuspended } from '../../common/decorators/allow-suspended.decorator';

@Controller('support')
export class SupportController {
  @Post('ticket')
  @UseGuards(JwtAuthGuard)
  @AllowSuspended() // Allow suspended users to create support tickets
  async createTicket(@Body() data: CreateTicketDto) {
    // ...
  }
}
```

## Login Flow Changes

### Before
```
User attempts login
  ↓
Verify credentials
  ↓
Check account status
  ↓
IF SUSPENDED → Reject with error ❌
IF ACTIVE → Allow login ✅
```

### After
```
User attempts login
  ↓
Verify credentials
  ↓
Check account status
  ↓
IF CLOSED/FROZEN → Reject with error ❌
IF SUSPENDED → Allow login with limited access ✅
IF PENDING/ACTIVE → Allow login ✅
  ↓
On each API request → AccountStatusGuard checks if endpoint is allowed
```

## Testing

### Test Suspended Account Access

1. **Create a test user and suspend their account:**
```sql
UPDATE users SET account_status = 'SUSPENDED' WHERE email = 'test@example.com';
```

2. **Test successful login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Test allowed endpoints (should succeed):**
```bash
# View profile
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# View KYC status
curl -X GET http://localhost:3001/api/kyc/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. **Test blocked endpoints (should fail with 403):**
```bash
# Try to view wallet
curl -X GET http://localhost:3001/api/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"

# Try to make transfer
curl -X POST http://localhost:3001/api/transfers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "recipientId": "..."}'
```

## User Experience Recommendations

### Frontend Implementation

1. **Show clear status indicator:**
```jsx
{user.accountStatus === 'SUSPENDED' && (
  <Alert severity="warning">
    Your account is suspended. You have limited access.
    Please complete your KYC verification or contact support.
  </Alert>
)}
```

2. **Disable blocked features in UI:**
```jsx
<Button 
  disabled={user.accountStatus === 'SUSPENDED'}
  onClick={handleTransfer}
>
  Make Transfer
</Button>
```

3. **Guide users to resolution:**
```jsx
{user.accountStatus === 'SUSPENDED' && (
  <Card>
    <h3>Account Suspended</h3>
    <p>To restore full access:</p>
    <ol>
      <li>Complete your KYC verification</li>
      <li>Wait for admin review</li>
      <li>Or contact support for more information</li>
    </ol>
    <Button onClick={() => navigate('/kyc')}>
      Complete KYC
    </Button>
  </Card>
)}
```

## API Response Enhancement

Consider including account status in all responses:

```typescript
// In JWT strategy or CurrentUser decorator
async validate(payload: any) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      accountStatus: true, // Include status
      // ...
    }
  });
  
  return user;
}
```

This allows the frontend to:
- Show appropriate UI based on account status
- Disable features proactively
- Provide helpful guidance

## Admin Tools

Admins should be able to:
1. View the reason for suspension
2. Unsuspend accounts after review
3. See suspended account activity

Consider adding these admin endpoints:
- `GET /api/admin/suspended-accounts` - List all suspended accounts
- `POST /api/admin/users/:id/unsuspend` - Unsuspend an account
- `GET /api/admin/users/:id/suspension-history` - View suspension history

## Security Considerations

1. **Rate Limiting**: Suspended accounts should still be rate-limited to prevent abuse
2. **Audit Logging**: Log all actions by suspended accounts for review
3. **Session Management**: Consider shorter session durations for suspended accounts
4. **Notification**: Send email notification when account is suspended
5. **Auto-Review**: Consider auto-unsuspending after successful KYC resubmission

## Related Files

- `src/common/guards/account-status.guard.ts` - Main guard implementation
- `src/common/decorators/allow-suspended.decorator.ts` - Decorator for marking allowed endpoints
- `src/modules/auth/auth.service.ts` - Updated login logic
- `src/modules/auth/auth.controller.ts` - Endpoints marked with @AllowSuspended()
- `src/modules/kyc/kyc.controller.ts` - KYC endpoints marked with @AllowSuspended()
- `src/app.module.ts` - Global guard registration
