# KYC Module Documentation

## Overview
The KYC (Know Your Customer) module handles identity verification for users based on their country of residence. It includes country-specific requirements, document uploads, and admin review workflows.

## Features

### 1. Country-Specific Requirements
- Different countries have different KYC requirements
- Supported countries: Nigeria (NG), United States (US), United Kingdom (GB), Canada (CA), Ghana (GH), South Africa (ZA), Kenya (KE)
- Default configuration for other countries

### 2. Document Upload
- ID Document (PDF, JPEG, PNG, WEBP) - max 5MB
- Proof of Address (PDF, JPEG, PNG, WEBP) - max 5MB
- Selfie (JPEG, PNG, WEBP) - max 5MB

### 3. Validation
- Age verification (minimum 18 years)
- ID number format validation (country-specific)
- Required field validation based on country
- Document type validation

## API Endpoints

### Get KYC Requirements
```
GET /api/kyc/requirements?countryCode=NG
```
Returns country-specific KYC requirements including:
- Accepted ID types
- Required documents
- Required address fields
- Minimum age

**Response Example:**
```json
{
  "country": "Nigeria",
  "countryCode": "NG",
  "idTypes": [
    { "value": "NIN", "label": "National Identification Number", "required": true },
    { "value": "BVN", "label": "Bank Verification Number", "required": false }
  ],
  "requiredDocuments": {
    "idDocument": true,
    "proofOfAddress": true,
    "selfie": true
  },
  "addressFields": {
    "postalCode": false,
    "state": true,
    "city": true
  },
  "minAge": 18
}
```

### Upload ID Document
```
POST /api/kyc/upload/id-document
Content-Type: multipart/form-data

file: [binary data]
```

**Response:**
```json
{
  "url": "/uploads/kyc/id-documents/id-doc-1234567890.jpg",
  "filename": "id-doc-1234567890.jpg"
}
```

### Upload Proof of Address
```
POST /api/kyc/upload/proof-of-address
Content-Type: multipart/form-data

file: [binary data]
```

### Upload Selfie
```
POST /api/kyc/upload/selfie
Content-Type: multipart/form-data

file: [binary data]
```

### Submit KYC
```
POST /api/kyc/submit
Content-Type: application/json

{
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "NG",
  "postalCode": "100001",
  "idType": "NIN",
  "idNumber": "12345678901",
  "idDocumentUrl": "/uploads/kyc/id-documents/id-doc-1234567890.jpg",
  "proofOfAddressUrl": "/uploads/kyc/proof-of-address/proof-1234567890.pdf",
  "selfieUrl": "/uploads/kyc/selfies/selfie-1234567890.jpg"
}
```

**Validation:**
- User must be at least 18 years old (or country-specific minimum age)
- ID number format must match country requirements
- All required documents must be uploaded
- ID type must be valid for the specified country

### Get KYC Status
```
GET /api/kyc/status
```

**Response:**
```json
{
  "id": "kyc-id",
  "userId": "user-id",
  "status": "PENDING",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "NG",
  "idType": "NIN",
  "idNumber": "12345678901",
  "idDocumentUrl": "/uploads/kyc/id-documents/...",
  "proofOfAddressUrl": "/uploads/kyc/proof-of-address/...",
  "selfieUrl": "/uploads/kyc/selfies/...",
  "submittedAt": "2025-11-07T10:00:00.000Z"
}
```

### Get All KYC (Admin)
```
GET /api/kyc/all
```
Requires: `SUPER_ADMIN` or `BANK_ADMIN` role

### Get Pending KYC (Admin)
```
GET /api/kyc/pending
```
Requires: `SUPER_ADMIN` or `BANK_ADMIN` role

### Review KYC (Admin)
```
POST /api/kyc/review/:id
Content-Type: application/json

{
  "status": "APPROVED",
  "rejectionReason": "Optional reason if rejected"
}
```

**Status Options:**
- `APPROVED` - Activates user account
- `REJECTED` - Suspends user account
- `RESUBMIT_REQUIRED` - Keeps account as pending
- `UNDER_REVIEW` - Sets status to under review

## Country-Specific Requirements

### Nigeria (NG)
- **ID Types:** NIN (required), BVN, Driver's License, Voter's Card, International Passport
- **Required Fields:** State, City
- **Optional Fields:** Postal Code
- **Validation:** NIN must be 11 digits

### United States (US)
- **ID Types:** SSN (required), Driver's License, State ID, US Passport
- **Required Fields:** State, City, Postal Code (ZIP)
- **Validation:** SSN format (XXX-XX-XXXX or 9 digits)

### United Kingdom (GB)
- **ID Types:** UK Passport, Driver's Licence, National Identity Card, Biometric Residence Permit
- **Required Fields:** City, Postal Code
- **Optional Fields:** State
- **Validation:** None specific

### Ghana (GH)
- **ID Types:** Ghana Card (required), Voter's ID, Driver's License, Passport
- **Required Fields:** State, City
- **Optional Fields:** Postal Code

### South Africa (ZA)
- **ID Types:** SA ID Number (required), Passport, Driver's License
- **Required Fields:** State, City, Postal Code
- **Validation:** ID Number must be 13 digits

### Kenya (KE)
- **ID Types:** National ID (required), Passport, Alien ID
- **Required Fields:** State, City
- **Optional Fields:** Postal Code

## File Storage

Files are stored in the following directory structure:
```
uploads/
  └── kyc/
      ├── id-documents/
      ├── proof-of-address/
      └── selfies/
```

Files are served statically at: `/uploads/kyc/...`

## Workflow

1. **User Registration**
   - User creates account (status: PENDING)
   
2. **Get Requirements**
   - Frontend calls `/kyc/requirements` to get country-specific requirements
   
3. **Upload Documents**
   - User uploads ID document, proof of address, and selfie
   - Each upload returns a URL to use in the submit request
   
4. **Submit KYC**
   - User submits KYC data with document URLs
   - Backend validates based on country requirements
   - KYC status set to PENDING
   
5. **Admin Review**
   - Admin reviews submitted KYC documents
   - Admin approves, rejects, or requests resubmission
   - User account status updated accordingly
   - User receives notification

## Notifications

The system automatically sends notifications when:
- KYC is approved (account activated)
- KYC is rejected (account suspended)
- Resubmission is required (account remains pending)

## Audit Logging

All KYC reviews are logged in the audit log with:
- Reviewer information
- Action taken (approved/rejected)
- Timestamp
- Rejection reason (if applicable)

## Error Handling

Common errors:
- `400 Bad Request` - Invalid data, missing required fields, age too young
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions (admin endpoints)
- `404 Not Found` - KYC or user not found

## Testing

### Example cURL Commands

**Get Requirements:**
```bash
curl -X GET "http://localhost:3001/api/kyc/requirements?countryCode=NG" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Upload ID Document:**
```bash
curl -X POST "http://localhost:3001/api/kyc/upload/id-document" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/id-document.jpg"
```

**Submit KYC:**
```bash
curl -X POST "http://localhost:3001/api/kyc/submit" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateOfBirth": "1990-01-15",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "country": "NG",
    "idType": "NIN",
    "idNumber": "12345678901",
    "idDocumentUrl": "/uploads/kyc/id-documents/id-doc-123.jpg",
    "proofOfAddressUrl": "/uploads/kyc/proof-of-address/proof-123.pdf",
    "selfieUrl": "/uploads/kyc/selfies/selfie-123.jpg"
  }'
```

## Frontend Integration

### React Example

```typescript
// 1. Get requirements
const getKycRequirements = async (countryCode: string) => {
  const response = await fetch(`/api/kyc/requirements?countryCode=${countryCode}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// 2. Upload document
const uploadDocument = async (file: File, type: 'id-document' | 'proof-of-address' | 'selfie') => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`/api/kyc/upload/${type}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return response.json();
};

// 3. Submit KYC
const submitKyc = async (data: KycData) => {
  const response = await fetch('/api/kyc/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
};
```

## Security Considerations

1. **File Upload Security**
   - Only allowed file types: JPEG, PNG, WEBP, PDF
   - Max file size: 5MB
   - Files stored outside public web root
   - Files served through controlled endpoint

2. **Data Privacy**
   - Sensitive KYC data should only be accessible to authorized users
   - Admin roles required for review operations
   - Audit logging for all administrative actions

3. **Validation**
   - Server-side validation of all inputs
   - Country-specific validation rules
   - Age verification
   - Document requirement checks
