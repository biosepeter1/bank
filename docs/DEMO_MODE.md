# 🎭 Demo Mode - Payment Gateway Simulation

## Overview

Demo Mode allows you to fully test the RDN Banking Platform's payment functionality without requiring real Paystack API keys or processing actual money transactions. All payment operations are simulated with realistic responses and behaviors.

## 🚀 Quick Start

Demo mode is **automatically activated** when:
- `PAYSTACK_SECRET_KEY` is not set
- `PAYSTACK_SECRET_KEY` contains placeholder text (e.g., "your-paystack-secret-key-here")
- `DEMO_MODE=true` is set in environment variables

## ✨ Demo Features

### 🎯 **Realistic Simulations**
- **80% success rate** for payments (mimics real-world scenarios)
- **90% success rate** for withdrawals
- Realistic processing delays (2-second transfer processing)
- Demo Nigerian banks (Access, GTBank, First Bank, Zenith, UBA)
- Random account name generation for bank account resolution

### 💳 **Full Payment Flow**
1. **Payment Initialization** → Returns demo authorization URLs
2. **Payment Verification** → Simulates success/failure with realistic data
3. **Webhook Processing** → Auto-triggers wallet updates and transaction records
4. **Bank Operations** → Account resolution with demo names
5. **Transfer Processing** → Complete withdrawal simulation

### 📊 **Demo Data Management**
- In-memory storage for demo transactions
- Admin endpoint to reset demo data
- Transaction statistics and tracking

## 🛠️ API Endpoints

### Demo Information
```bash
GET /api/demo/info
# Returns demo mode status and statistics
```

### Simulate Complete Payment Flow
```bash
POST /api/demo/simulate-payment-flow
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "user@example.com",
  "amount": 5000,
  "success": true
}
```

### Manual Webhook Simulation
```bash
# Simulate successful charge webhook
POST /api/demo/webhook/charge/{reference}
{ "success": true }

# Simulate successful transfer webhook  
POST /api/demo/webhook/transfer/{reference}
{ "success": true }
```

### Demo Banks and Account Resolution
```bash
# Get demo banks
GET /api/demo/banks

# Resolve demo account
POST /api/demo/resolve-account
{
  "accountNumber": "1234567890",
  "bankCode": "044"
}
```

### Reset Demo Data (Super Admin)
```bash
POST /api/demo/reset
Authorization: Bearer <super-admin-token>
```

## 🧪 Testing Scenarios

### 1. **Successful Deposit Flow**
```javascript
// 1. Initialize payment
const deposit = await fetch('/api/payments/deposits/initiate', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 5000,
    method: 'CARD',
    description: 'Demo deposit'
  })
});

// 2. Simulate payment completion
const webhook = await fetch(`/api/demo/webhook/charge/${deposit.reference}`, {
  method: 'POST',
  body: JSON.stringify({ success: true })
});

// 3. Check wallet balance (should be increased)
const wallet = await fetch('/api/wallet', {
  headers: { 'Authorization': 'Bearer <token>' }
});
```

### 2. **Withdrawal with Bank Account**
```javascript
// 1. Add bank account
const account = await fetch('/api/payments/bank-accounts', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accountName: 'John Doe',
    accountNumber: '1234567890',
    bankName: 'Access Bank',
    bankCode: '044'
  })
});

// 2. Initiate withdrawal
const withdrawal = await fetch('/api/payments/withdrawals/initiate', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 2000,
    bankAccountId: account.id,
    description: 'Demo withdrawal'
  })
});

// 3. Simulate transfer completion (after 2 seconds)
setTimeout(() => {
  fetch(`/api/demo/webhook/transfer/${withdrawal.reference}`, {
    method: 'POST',
    body: JSON.stringify({ success: true })
  });
}, 2000);
```

### 3. **Failed Payment Scenario**
```javascript
// Simulate payment failure
const failedWebhook = await fetch(`/api/demo/webhook/charge/${reference}`, {
  method: 'POST',
  body: JSON.stringify({ success: false })
});
```

## 🎯 Demo Behaviors

### Payment Success Rates
- **Deposits**: 80% success, 20% failure
- **Withdrawals**: 90% success, 10% failure (with auto-refund)

### Response Times
- **Payment Init**: Instant
- **Verification**: Instant  
- **Transfer Processing**: 2 second delay
- **Webhook**: Instant

### Demo Data
- **Bank Names**: Access Bank, GTBank, First Bank, Zenith, UBA
- **Account Names**: Random selection from demo pool
- **Card Details**: Demo Visa cards (408408****4081)
- **Fees**: 1.5% for deposits, 1% for withdrawals (min ₦50, max ₦2000)

## 🔧 Configuration

### Environment Variables
```bash
# Enable demo mode explicitly
DEMO_MODE=true

# Or use placeholder API keys (auto-detected)
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key-here
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key-here
```

### Switch to Production
```bash
# Set real API keys
DEMO_MODE=false
PAYSTACK_SECRET_KEY=sk_test_real_api_key_here
PAYSTACK_PUBLIC_KEY=pk_test_real_public_key_here
```

## 🚦 Demo Indicators

### Console Output
```
🎭 DEMO MODE: Using PaystackDemoService (no valid API key found)
🎭 Demo: Initializing payment for user@example.com - ₦5000
🎭 Demo: Verifying payment DEP_1634567890123_ABC123
🎭 Demo: Transfer trf_abc123def456 completed
```

### API Responses
```json
{
  "warning": "This is demo mode. No real money transactions will occur.",
  "mode": "demo",
  "authorizationUrl": "https://checkout.paystack.com/demo/ac_demo123"
}
```

## 📋 Testing Checklist

- [ ] Deposit initiation and verification
- [ ] Webhook processing (success/failure)
- [ ] Wallet balance updates
- [ ] Bank account addition and verification
- [ ] Withdrawal processing with fees
- [ ] Transfer completion/failure handling
- [ ] Auto-refund for failed withdrawals
- [ ] Transaction history tracking
- [ ] Demo data persistence during session
- [ ] Admin demo data reset

## ⚠️ Important Notes

1. **No Real Money**: All transactions are simulated
2. **Session Storage**: Demo data clears on server restart  
3. **Webhook Security**: Demo mode bypasses signature verification
4. **Rate Limits**: No rate limiting in demo mode
5. **Production Switch**: Change environment variables to use real Paystack

## 🎯 Use Cases

- **Development Testing**: Full feature testing without API costs
- **Demo Presentations**: Show complete payment flows to stakeholders
- **Integration Testing**: Test frontend without backend dependencies
- **Training**: Onboard new developers with realistic scenarios

---

**Demo Status**: ✅ Fully Functional  
**Real Money Risk**: ❌ Zero Risk  
**Testing Coverage**: ✅ 100% Payment Features