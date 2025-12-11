# Proposed Amount Flow - Still Working ✅

## Complete Flow Confirmed

### 1. User Applies for Loan
**Example:** User requests $50,000 for 24 months

**Status:** `PENDING`

### 2. Admin Proposes Different Amount
**Admin Action:** Admin thinks $50,000 is too much, proposes $30,000 instead

**Backend:** `loansApi.adminPropose(loanId, 30000, "We can offer $30,000 based on your profile")`

**What Happens:**
- `approvalNote` updated to: `PROPOSED_AMOUNT=30000;NOTE=We can offer $30,000 based on your profile`
- User gets notification: "Admin proposed a revised amount of 30000 USD. Please review and accept to proceed."
- Status remains `PENDING`

### 3. User Sees Offer
**UI Display:**
- ✅ **Amber/Yellow alert banner appears**
- Shows: "Offer available - You have a loan offer of 30,000 USD"
- Shows custom note if admin provided one
- ✅ **Accept button** (green with checkmark)
- ✅ **Decline button** (outline with X)

**Code Reference:**
```typescript
const proposed = parseProposedAmountFromNote(a.approvalNote);
const showOfferActions = a.status === 'PENDING' && proposed && !userAccepted && !userDeclined;

{showOfferBanner && (
  <Alert className="mt-1 border-amber-200 bg-amber-50">
    <Info className="h-4 w-4 text-amber-700" />
    <AlertTitle className="text-amber-800">Offer available</AlertTitle>
    <AlertDescription>You have a loan offer of {proposed?.toLocaleString()} {a.currency}.</AlertDescription>
  </Alert>
)}

{showOfferActions && (
  <div className="flex gap-2">
    <Button onClick={() => handleRespond(a.id, 'DECLINE')}>Decline</Button>
    <Button onClick={() => handleRespond(a.id, 'ACCEPT')}>Accept</Button>
  </div>
)}
```

### 4a. If User Declines
**Backend:** Appends `;USER_DECLINED=true` to approvalNote

**Result:**
- Accept/Decline buttons disappear
- Loan stays `PENDING`
- Admin can propose again or reject loan

### 4b. If User Accepts ✅
**Backend:** Appends `;USER_ACCEPTED=true` to approvalNote

**Result:**
- Accept/Decline buttons disappear
- Loan amount updated from $50,000 → **$30,000** (the accepted offer)
- Status stays `PENDING`

**Backend Logic:**
```typescript
const proposed = this.parseProposedAmountFromNote(loan.approvalNote);
if (proposed) {
  // Update loan amount to accepted amount
  data: { 
    approvalNote: `${loan.approvalNote};USER_ACCEPTED=true`,
    amount: proposed // Updates to $30,000
  }
}
```

### 5. Admin Requests Processing Fee
**Admin sees:** User accepted $30,000 offer

**Admin Action:** Request processing fee

**Status Changes:** `PENDING` → `FEE_PENDING`

**Important:** The fee is calculated based on the **accepted amount ($30,000)**, not the original request ($50,000)

### 6. User Pays Fee
- Sees yellow "Processing Fee Required" alert
- Clicks "Pay Fee" button
- Dialog shows:
  - **Loan Amount: 30,000 USD** (the accepted amount!)
  - Processing Fee: 50 USDT (or whatever admin set)
- Uploads proof
- Status: `FEE_PENDING` → `FEE_PAID`

### 7. Admin Verifies & Disburses
- Verifies payment proof
- Approves loan
- Disburses **$30,000** to user wallet (the accepted amount)

## Key Points

✅ **Proposed amount flow still works perfectly**
✅ **Accept/Decline buttons appear for proposed offers**
✅ **When user accepts, loan amount updates to proposed amount**
✅ **Fee payment dialog shows the correct (accepted) amount**
✅ **Disbursement uses the accepted amount, not original**

## Example Complete Flow

1. User applies: $50,000
2. Admin proposes: $30,000 → User sees offer banner with Accept/Decline
3. User clicks **Accept** → Amount changes to $30,000
4. Admin requests fee → User sees "Pay Fee" button
5. User opens dialog → Shows "$30,000" as loan amount
6. User pays fee → Uploads proof
7. Admin verifies → Approves
8. Admin disburses → **$30,000** goes to user wallet

Everything works together! The proposed amount integrates seamlessly with the fee payment flow. 🎯
