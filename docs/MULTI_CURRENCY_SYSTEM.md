# Multi-Currency Banking System

## Overview
The RDN Banking Platform now supports multi-country operations with automatic currency handling based on user's country selection during registration.

## Supported Countries

| Country | Code | Currency | Symbol | KYC Documents |
|---------|------|----------|--------|---------------|
| Nigeria | NG | NGN | ₦ | NIN, BVN, Passport, Driver's License, Voter's Card |
| United States | US | USD | $ | SSN, Driver's License, Passport, State ID |
| United Kingdom | GB | GBP | £ | Passport, Driver's Licence, National ID, Residence Permit |
| South Africa | ZA | ZAR | R | ID Number, Passport, Driver's License |
| Kenya | KE | KES | KSh | National ID, Passport, Alien ID, Military ID |
| Ghana | GH | GHS | ₵ | Ghana Card, Passport, Driver's License, Voter ID |
| India | IN | INR | ₹ | Aadhaar, PAN Card, Passport, Driver's License |
| China | CN | CNY | ¥ | National ID, Passport, Residence Permit |

## How It Works

### 1. Registration
- User selects country via phone code dropdown
- Country and currency are automatically determined
- Both are saved to:
  - Database (User table)
  - Wallet (with user's currency)
  - localStorage (for immediate access)

### 2. Database Schema
```prisma
model User {
  // ... existing fields
  country   String @default("NG")  // ISO country code
  currency  String @default("NGN") // Currency code
  // ...
}

model Wallet {
  // ... existing fields
  currency  String @default("NGN") // User's currency
  // ...
}
```

### 3. Frontend Integration

#### Country Configuration
All country data is centralized in `lib/config/countries.ts`:
```typescript
export const COUNTRIES: Record<string, CountryConfig> = {
  NG: {
    code: 'NG',
    name: 'Nigeria',
    currency: { code: 'NGN', symbol: '₦' },
    kycDocuments: [...],
    addressFields: {...}
  },
  // ... other countries
}
```

#### Currency Hook
Use the `useCurrency` hook in any component:
```typescript
import { useCurrency } from '@/lib/hooks/useCurrency';

function MyComponent() {
  const { currency, formatAmount } = useCurrency();
  
  return <div>{formatAmount(1000)}</div>; // Shows: ₦1,000 or $1,000 etc.
}
```

### 4. KYC System
KYC forms automatically adapt based on user's country:

**Nigeria:**
- Documents: NIN, BVN, Passport, Driver's License
- Address: State, Postal Code

**USA:**
- Documents: SSN, Driver's License, State ID
- Address: State, ZIP Code

**UK:**
- Documents: Passport, Driver's Licence, National ID
- Address: County, Postcode

### 5. Dashboard
- All amounts display in user's currency
- Wallet balance shown with correct symbol
- Transactions formatted correctly

## API Endpoints

### Registration
```
POST /auth/register
{
  "email": "user@example.com",
  "phone": "+447123456789",
  "firstName": "John",
  "lastName": "Doe",
  "password": "Password@123",
  "country": "GB",      // Optional, defaults to NG
  "currency": "GBP"     // Optional, defaults to NGN
}
```

### Login Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "country": "GB",
    "currency": "GBP",
    "role": "USER",
    "accountStatus": "ACTIVE"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Future Enhancements

1. **Currency Exchange**
   - Allow users to hold multiple currencies
   - Real-time exchange rates
   - Cross-currency transfers

2. **Geo-IP Detection**
   - Auto-detect country from IP
   - Suggest appropriate country during registration

3. **Compliance**
   - Country-specific transaction limits
   - Automated tax reporting
   - Regional regulations enforcement

4. **Admin Features**
   - Filter users by country
   - Country-specific reports
   - Currency conversion analytics

## Testing

### Test Registration
1. Select different country codes during registration
2. Verify user is created with correct country/currency
3. Check wallet has matching currency
4. Verify KYC form shows country-specific documents

### Test Currency Display
1. Login with different country users
2. Verify dashboard shows correct currency symbol
3. Check transaction history formatting
4. Verify currency persists across sessions

## Migration
Run the following to update existing database:
```bash
cd backend
npx prisma migrate dev --name add_user_country_currency
npx prisma generate
```

## Configuration Files
- Frontend: `frontend/lib/config/countries.ts`
- Backend: `backend/prisma/schema.prisma`
- DTOs: `backend/src/modules/auth/dto/register.dto.ts`
- Service: `backend/src/modules/auth/auth.service.ts`
