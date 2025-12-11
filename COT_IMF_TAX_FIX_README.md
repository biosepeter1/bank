# COT/IMF/TAX Dialog Fix

## Problem
After users entered their OTP code for international transfers, the backend API returned:
```
❌ API 400: /transfers/international Transfer codes required (COT, IMF, TAX)
```

However, **no dialog box appeared** to collect these codes. The notification showed, but the UI didn't provide a way to input the required codes.

## Root Cause
In `frontend/app/(dashboard)/user/international/page.tsx`:

1. **OTP verification succeeded** (line 126)
2. **Transfer API was called immediately** (line 129)
3. **API returned error** requiring COT/IMF/TAX codes
4. **Error was only shown as a toast** (line 148) - no dialog triggered

The form had state fields for `cot`, `imf`, `tax` but they were never used or displayed in the UI.

## Solution
Added the COT/IMF/TAX dialog flow:

### 1. Added State Management (lines 25-27)
```typescript
const [showCodeModal, setShowCodeModal] = useState(false);
const [currentCodeType, setCurrentCodeType] = useState<'COT' | 'IMF' | 'TAX' | null>(null);
const [verifiedCodes, setVerifiedCodes] = useState<Set<string>>(new Set());
```

### 2. Updated Error Handling (lines 150-169)
When the transfer API returns an error mentioning "Transfer codes required":
- Close OTP modal
- Open the COT/IMF/TAX code modal
- Start with the first unverified code (COT)

### 3. Added Code Request Handler (lines 171-180)
Users can request codes from admin:
```typescript
const handleCodeRequest = async () => {
  await apiClient.post('/transfers/codes/request', { type: currentCodeType });
}
```

### 4. Added Code Verification Handler (lines 182-241)
When user enters a code:
- Verify it via API
- If verified, move to next code (COT → IMF → TAX)
- After all codes verified, retry the transfer
- Transfer completes successfully

### 5. Added UI Dialog (lines 551-616)
- Shows which code is needed (COT, IMF, or TAX)
- Displays helpful description for each code type
- "Request Code" button to ask admin
- "Verify Code" button to submit the code
- Shows which codes have been verified

## Flow Now Works Like This:

1. ✅ User fills transfer form
2. ✅ User clicks "Send International Transfer"
3. ✅ OTP modal appears
4. ✅ User enters OTP from email
5. ✅ OTP verified successfully
6. ✅ Transfer attempted
7. ✅ **API returns error: codes required**
8. ✅ **COT dialog appears** ← THIS WAS MISSING
9. ✅ User requests COT code from admin
10. ✅ User enters COT code
11. ✅ COT verified
12. ✅ **IMF dialog appears** ← THIS WAS MISSING
13. ✅ User requests/enters IMF code
14. ✅ IMF verified
15. ✅ **TAX dialog appears** ← THIS WAS MISSING
16. ✅ User requests/enters TAX code
17. ✅ TAX verified
18. ✅ Transfer completes successfully!

## Files Modified
- `frontend/app/(dashboard)/user/international/page.tsx`

## Testing
1. Start an international transfer
2. Enter OTP code from email
3. Verify the COT/IMF/TAX dialogs now appear sequentially
4. Request codes from admin
5. Enter the codes
6. Confirm transfer completes after all codes verified

## Backend API Endpoints Used
- `POST /otp/start` - Start OTP flow
- `POST /otp/verify` - Verify OTP code
- `POST /transfers/codes/request` - Request a code from admin
- `POST /transfers/codes/verify` - Verify entered code
- `POST /transfers/international` - Submit transfer (retried after codes verified)
