# KYC Email Notifications

## Overview

The KYC module now sends email notifications to users when their KYC status changes. This includes approval, rejection, and resubmission requests.

## Implementation Details

### Changes Made

1. **KycService** (`backend/src/modules/kyc/kyc.service.ts`)
   - Added `EmailService` dependency injection
   - Integrated email sending in the `reviewKyc` method
   - Sends emails for all three KYC status changes: APPROVED, REJECTED, RESUBMIT_REQUIRED

2. **KycModule** (`backend/src/modules/kyc/kyc.module.ts`)
   - Imported `SettingsModule` to access `EmailService`

### Email Notifications

When an admin reviews a KYC submission, the following happens:

#### 1. KYC APPROVED
- **Account Status**: Changed to `ACTIVE`
- **In-app Notification**: Created with title "KYC Approved"
- **Email**: Sent to user with approval confirmation and full access message
- **Template**: Includes success message and access to all features

#### 2. KYC REJECTED
- **Account Status**: Changed to `SUSPENDED`
- **In-app Notification**: Created with title "KYC Rejected" and reason
- **Email**: Sent to user with rejection notification and reason
- **Template**: Includes reason for rejection if provided

#### 3. RESUBMIT_REQUIRED
- **Account Status**: Kept as `PENDING`
- **In-app Notification**: Created with title "KYC Resubmission Required"
- **Email**: Sent to user requesting document resubmission with reason
- **Template**: Includes guidance on what needs to be corrected

### Error Handling

Email sending is **non-blocking**:
- If email fails to send, it's logged to console but doesn't block the KYC review process
- The KYC status update and in-app notification are always created
- This ensures that email delivery issues don't prevent KYC workflow from completing

### Code Example

```typescript
// After updating KYC status
const user = await this.prisma.user.findUnique({
  where: { id: kyc.userId },
  select: { email: true, firstName: true, accountStatus: true },
});

// Send email notification (non-blocking)
try {
  await this.emailService.sendKycStatusEmail({
    email: user.email,
    firstName: user.firstName,
    status: 'APPROVED',
  });
} catch (error) {
  console.error('Failed to send KYC approval email:', error);
}
```

## Testing

### Prerequisites
- Ensure SMTP settings are configured in the settings panel
- Or check console logs for email content if SMTP is not configured

### Test Steps

1. **Submit KYC as a user**
   - Upload required documents
   - Submit KYC form

2. **Review KYC as admin**
   - Navigate to admin KYC review page
   - Approve/reject a KYC submission

3. **Verify Email Sent**
   - Check user's email inbox
   - Verify email contains correct status, user name, and reason (if applicable)

4. **Verify In-app Notification**
   - Log in as the user
   - Check notifications panel for in-app notification

## Email Template Structure

All KYC emails use the standardized brand template that includes:
- Brand logo and colors
- Personalized greeting with user's first name
- Clear status message (APPROVED, REJECTED, or RESUBMIT_REQUIRED)
- Additional details:
  - **APPROVED**: "You now have full access to all features"
  - **REJECTED/RESUBMIT_REQUIRED**: Reason for rejection/resubmission
- Professional footer with support contact

## Dependencies

- **EmailService**: Located in `backend/src/common/services/email.service.ts`
- **SettingsService**: Required by EmailService for brand configuration
- **SettingsModule**: Exports both EmailService and SettingsService

## Configuration

No additional configuration needed. The system uses:
- Brand settings from the settings panel (logo, site name, support email)
- SMTP configuration from settings (if available)
- Falls back to console logging if SMTP is not configured

## Future Enhancements

Potential improvements:
- Add retry logic for failed email delivery
- Queue emails for background processing
- Add email delivery tracking/logging
- Support for email templates customization via admin panel
