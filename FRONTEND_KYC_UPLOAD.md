# Frontend KYC File Upload Implementation

## Summary

The KYC file upload functionality has been fully implemented in the frontend. The "Coming soon" placeholders have been replaced with functional file upload components.

## Changes Made

### 1. API Client (`frontend/lib/api/kyc.ts`)

Added three new upload methods:
- `uploadIdDocument(file: File)` - Uploads ID document
- `uploadProofOfAddress(file: File)` - Uploads proof of address
- `uploadSelfie(file: File)` - Uploads selfie photo

All methods:
- Accept a File object
- Create FormData and append the file
- Send POST request with `multipart/form-data` content type
- Return the response with file URL

### 2. KYC Page (`frontend/app/(dashboard)/user/kyc/page.tsx`)

#### Added State Management:
```typescript
const [uploading, setUploading] = useState({
  idDocument: false,
  proofOfAddress: false,
  selfie: false,
});

const [uploadedFiles, setUploadedFiles] = useState({
  idDocument: null as File | null,
  proofOfAddress: null as File | null,
  selfie: null as File | null,
});
```

#### Added Upload Handler:
```typescript
const handleFileUpload = async (type, file) => {
  // Validates file type and size
  // Uploads file to backend
  // Updates form data with URL
  // Shows success/error toasts
}
```

#### Added Remove Handler:
```typescript
const handleFileRemove = (type) => {
  // Removes uploaded file from state
  // Clears URL from form data
}
```

#### Replaced Placeholder UI:
Each upload section now shows:
- **Before Upload**: Clickable upload area with icon
- **During Upload**: Loading spinner with "Uploading..." text
- **After Upload**: Green checkmark, filename, and Remove button

## Features

### File Validation
- **Type validation**: 
  - ID Document & Proof of Address: JPG, JPEG, PNG, WEBP, PDF
  - Selfie: JPG, JPEG, PNG, WEBP only
- **Size validation**: Maximum 5MB per file
- **Client-side validation** before upload

### User Experience
1. **Click to Upload**: Users click on the dashed box to select a file
2. **Instant Feedback**: Loading spinner shows during upload
3. **Success Indication**: Green checkmark and filename displayed
4. **Error Handling**: Toast notifications for errors
5. **Easy Removal**: Remove button to delete uploaded file

### Visual States

#### Upload Area (Before Upload):
```
┌─────────────────────┐
│        [↑]          │
│   ID Document       │
│  Click to upload    │
└─────────────────────┘
```

#### Uploading:
```
┌─────────────────────┐
│        [⟳]          │
│   Uploading...      │
│                     │
└─────────────────────┘
```

#### Uploaded:
```
┌─────────────────────┐
│        [✓]          │
│     Uploaded        │
│  document.pdf       │
│    [Remove]         │
└─────────────────────┘
```

## How It Works

1. **User clicks on upload area**
2. **File picker opens**
3. **User selects file**
4. **Frontend validates file** (type & size)
5. **If valid, upload starts** (spinner shows)
6. **File uploaded to backend** via API
7. **Backend returns URL**
8. **URL saved to form data**
9. **UI shows success state** (checkmark)
10. **When user submits KYC**, URLs are included in the payload

## Integration with Backend

The frontend calls these backend endpoints:
- `POST /api/kyc/upload/id-document`
- `POST /api/kyc/upload/proof-of-address`
- `POST /api/kyc/upload/selfie`

Each endpoint:
- Accepts multipart/form-data
- Validates file on server
- Saves file to disk
- Returns: `{ url: string, filename: string }`

## Optional Documents

Documents are marked as **optional** in the UI:
- Users can submit KYC without uploading documents
- They can upload later if needed
- Backend validates if documents are required based on country

## Next Steps

To use the file upload feature:

1. **Start the backend server:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to KYC page:**
   - Log in to the application
   - Go to User Dashboard → KYC Verification

4. **Upload files:**
   - Click on each upload box
   - Select a file (JPG, PNG, PDF)
   - Wait for upload to complete
   - See success message

5. **Submit KYC:**
   - Fill in all required fields
   - Submit the form
   - Documents are automatically included

## Error Handling

The implementation handles various errors:
- **Invalid file type**: "Invalid file type. Allowed: image/jpeg, ..."
- **File too large**: "File size must be less than 5MB"
- **Upload failed**: Server error message shown
- **Network error**: Generic error message

## Responsive Design

The upload sections are responsive:
- **Mobile**: Single column (stacked)
- **Tablet & Desktop**: 3 columns (side by side)

## Accessibility

- Hidden file inputs with label overlays
- Keyboard accessible (can tab to upload areas)
- Clear visual feedback for all states
- Descriptive text for screen readers

## Testing

To test the upload feature:

1. **Valid uploads:**
   - JPG image < 5MB ✓
   - PNG image < 5MB ✓
   - PDF document < 5MB ✓

2. **Invalid uploads:**
   - TXT file ✗ (shows error)
   - 10MB file ✗ (shows error)
   - Executable file ✗ (shows error)

3. **Flow testing:**
   - Upload → Remove → Upload again
   - Upload all three documents
   - Submit KYC with documents
   - Submit KYC without documents (optional)

## Known Issues

- The build error in `/reset-password` is unrelated to KYC changes
- To fix, wrap `useSearchParams()` in a Suspense boundary in that page

## Files Modified

1. `frontend/lib/api/kyc.ts` - Added upload methods
2. `frontend/app/(dashboard)/user/kyc/page.tsx` - Implemented upload UI
