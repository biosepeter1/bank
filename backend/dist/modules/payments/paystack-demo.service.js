"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaystackDemoService", {
    enumerable: true,
    get: function() {
        return PaystackDemoService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaystackDemoService = class PaystackDemoService {
    /**
   * Initialize a payment transaction (Demo)
   */ async initializePayment(data) {
        this.logger.log(`🎭 Demo: Initializing payment for ${data.email} - ₦${data.amount / 100}`);
        const reference = data.reference || this.generateReference('DEMO');
        const accessCode = `ac_${Math.random().toString(36).substr(2, 12)}`;
        // Store demo payment data
        this.demoPayments.set(reference, {
            id: Math.floor(Math.random() * 100000),
            email: data.email,
            amount: data.amount,
            reference,
            status: 'pending',
            created_at: new Date().toISOString(),
            metadata: data.metadata
        });
        return {
            status: true,
            message: 'Authorization URL created',
            data: {
                authorization_url: `https://checkout.paystack.com/demo/${accessCode}`,
                access_code: accessCode,
                reference
            }
        };
    }
    /**
   * Verify a payment transaction (Demo)
   */ async verifyPayment(reference) {
        this.logger.log(`🎭 Demo: Verifying payment ${reference}`);
        const payment = this.demoPayments.get(reference);
        if (!payment) {
            throw new _common.BadRequestException('Payment not found');
        }
        // Simulate 80% success rate for demo
        const isSuccess = Math.random() > 0.2;
        const status = isSuccess ? 'success' : 'failed';
        const gatewayResponse = isSuccess ? 'Successful' : 'Declined by bank';
        // Update payment status
        payment.status = status;
        payment.paid_at = isSuccess ? new Date().toISOString() : null;
        payment.gateway_response = gatewayResponse;
        this.demoPayments.set(reference, payment);
        return {
            status: true,
            message: 'Verification successful',
            data: {
                id: payment.id,
                domain: 'test',
                status,
                reference,
                amount: payment.amount,
                message: null,
                gateway_response: gatewayResponse,
                paid_at: payment.paid_at || '',
                created_at: payment.created_at,
                channel: 'card',
                currency: 'NGN',
                ip_address: '127.0.0.1',
                metadata: payment.metadata || {},
                log: {},
                fees: Math.floor(payment.amount * 0.015),
                fees_split: null,
                authorization: {
                    authorization_code: `auth_${Math.random().toString(36).substr(2, 12)}`,
                    bin: '408408',
                    last4: '4081',
                    exp_month: '12',
                    exp_year: '2030',
                    channel: 'card',
                    card_type: 'visa',
                    bank: 'TEST BANK',
                    country_code: 'NG',
                    brand: 'visa',
                    reusable: true,
                    signature: `sig_${Math.random().toString(36).substr(2, 12)}`,
                    account_name: null
                },
                customer: {
                    id: Math.floor(Math.random() * 100000),
                    first_name: null,
                    last_name: null,
                    email: payment.email,
                    customer_code: `cus_${Math.random().toString(36).substr(2, 12)}`,
                    phone: null,
                    metadata: {},
                    risk_action: 'default',
                    international_format_phone: null
                },
                plan: null,
                split: {},
                order_id: null,
                paidAt: payment.paid_at || '',
                createdAt: payment.created_at,
                requested_amount: payment.amount,
                pos_transaction_data: null,
                source: null,
                fees_breakdown: null
            }
        };
    }
    /**
   * Get list of banks (Demo)
   */ async getBanks() {
        this.logger.log('🎭 Demo: Fetching Nigerian banks');
        const demoBanks = [
            {
                name: 'Access Bank',
                slug: 'access-bank',
                code: '044',
                longcode: '044150149',
                gateway: null,
                pay_with_bank: true,
                supports_transfer: true,
                active: true,
                country: 'Nigeria',
                currency: 'NGN',
                type: 'nuban',
                is_deleted: false,
                createdAt: '2016-07-14T10:04:29.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            },
            {
                name: 'GTBank',
                slug: 'guaranty-trust-bank',
                code: '058',
                longcode: '058152036',
                gateway: null,
                pay_with_bank: true,
                supports_transfer: true,
                active: true,
                country: 'Nigeria',
                currency: 'NGN',
                type: 'nuban',
                is_deleted: false,
                createdAt: '2016-07-14T10:04:29.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            },
            {
                name: 'First Bank of Nigeria',
                slug: 'first-bank-of-nigeria',
                code: '011',
                longcode: '011151003',
                gateway: null,
                pay_with_bank: true,
                supports_transfer: true,
                active: true,
                country: 'Nigeria',
                currency: 'NGN',
                type: 'nuban',
                is_deleted: false,
                createdAt: '2016-07-14T10:04:29.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            },
            {
                name: 'Zenith Bank',
                slug: 'zenith-bank',
                code: '057',
                longcode: '057150013',
                gateway: null,
                pay_with_bank: true,
                supports_transfer: true,
                active: true,
                country: 'Nigeria',
                currency: 'NGN',
                type: 'nuban',
                is_deleted: false,
                createdAt: '2016-07-14T10:04:29.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            },
            {
                name: 'UBA',
                slug: 'united-bank-for-africa',
                code: '033',
                longcode: '033153513',
                gateway: null,
                pay_with_bank: true,
                supports_transfer: true,
                active: true,
                country: 'Nigeria',
                currency: 'NGN',
                type: 'nuban',
                is_deleted: false,
                createdAt: '2016-07-14T10:04:29.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        ];
        return {
            status: true,
            message: 'Banks retrieved',
            data: demoBanks
        };
    }
    /**
   * Resolve bank account details (Demo)
   */ async resolveAccountNumber(data) {
        this.logger.log(`🎭 Demo: Resolving account ${data.account_number} - ${data.bank_code}`);
        // Simulate account resolution with demo names
        const demoNames = [
            'John Doe',
            'Jane Smith',
            'David Johnson',
            'Sarah Williams',
            'Michael Brown',
            'Emma Davis',
            'James Wilson',
            'Olivia Taylor'
        ];
        const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
        return {
            status: true,
            message: 'Account number resolved',
            data: {
                account_number: data.account_number,
                account_name: randomName.toUpperCase(),
                bank_id: Math.floor(Math.random() * 1000) + 1
            }
        };
    }
    /**
   * Create a transfer recipient (Demo)
   */ async createTransferRecipient(data) {
        this.logger.log(`🎭 Demo: Creating transfer recipient for ${data.name}`);
        const recipientCode = `rcp_${Math.random().toString(36).substr(2, 12)}`;
        const recipientId = Math.floor(Math.random() * 100000);
        const recipient = {
            active: true,
            createdAt: new Date().toISOString(),
            currency: data.currency || 'NGN',
            domain: 'test',
            id: recipientId,
            integration: 123456,
            name: data.name,
            recipient_code: recipientCode,
            type: data.type,
            updatedAt: new Date().toISOString(),
            is_deleted: false,
            isDeleted: false,
            details: {
                authorization_code: null,
                account_number: data.account_number,
                account_name: data.name,
                bank_code: data.bank_code,
                bank_name: 'DEMO BANK'
            }
        };
        this.demoRecipients.set(recipientCode, recipient);
        return {
            status: true,
            message: 'Transfer recipient created',
            data: recipient
        };
    }
    /**
   * Initiate a transfer (Demo)
   */ async initiateTransfer(data) {
        this.logger.log(`🎭 Demo: Initiating transfer of ₦${data.amount / 100} to ${data.recipient}`);
        const transferCode = `trf_${Math.random().toString(36).substr(2, 12)}`;
        const transferId = Math.floor(Math.random() * 100000);
        const transfer = {
            integration: 123456,
            domain: 'test',
            amount: data.amount,
            currency: 'NGN',
            source: data.source,
            reason: data.reason || 'Transfer',
            recipient: parseInt(data.recipient.split('_')[1]) || 1,
            status: 'pending',
            transfer_code: transferCode,
            id: transferId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.demoTransfers.set(transferCode, transfer);
        // Simulate transfer processing with 90% success rate
        setTimeout(()=>{
            const isSuccess = Math.random() > 0.1;
            transfer.status = isSuccess ? 'success' : 'failed';
            this.demoTransfers.set(transferCode, transfer);
            this.logger.log(`🎭 Demo: Transfer ${transferCode} ${isSuccess ? 'completed' : 'failed'}`);
        }, 2000); // 2 second delay
        return {
            status: true,
            message: 'Transfer has been queued',
            data: transfer
        };
    }
    /**
   * Verify webhook signature (Demo)
   */ verifyWebhookSignature(payload, signature) {
        // In demo mode, always return true for webhook verification
        this.logger.log('🎭 Demo: Webhook signature verified (always true in demo mode)');
        return true;
    }
    /**
   * Generate payment reference
   */ generateReference(prefix = 'RDN') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}_${timestamp}_${random}`;
    }
    /**
   * Convert amount to kobo (for Paystack)
   */ toKobo(amount) {
        return Math.round(amount * 100);
    }
    /**
   * Convert kobo to naira
   */ fromKobo(kobo) {
        return kobo / 100;
    }
    /**
   * Simulate webhook events for testing
   */ async simulateWebhookEvent(reference, eventType) {
        this.logger.log(`🎭 Demo: Simulating webhook event ${eventType} for ${reference}`);
        const payment = this.demoPayments.get(reference);
        if (payment && (eventType === 'charge.success' || eventType === 'charge.failed')) {
            return {
                event: eventType,
                data: {
                    id: payment.id,
                    domain: 'test',
                    status: eventType === 'charge.success' ? 'success' : 'failed',
                    reference,
                    amount: payment.amount,
                    message: null,
                    gateway_response: eventType === 'charge.success' ? 'Successful' : 'Declined',
                    paid_at: eventType === 'charge.success' ? new Date().toISOString() : '',
                    created_at: payment.created_at,
                    channel: 'card',
                    currency: 'NGN',
                    ip_address: '127.0.0.1',
                    metadata: payment.metadata || {},
                    fees: Math.floor(payment.amount * 0.015),
                    customer: {
                        id: Math.floor(Math.random() * 100000),
                        first_name: null,
                        last_name: null,
                        email: payment.email,
                        customer_code: `cus_${Math.random().toString(36).substr(2, 12)}`,
                        phone: null,
                        metadata: {},
                        risk_action: 'default'
                    }
                }
            };
        }
        // Return generic webhook data for transfers
        return {
            event: eventType,
            data: {
                id: Math.floor(Math.random() * 100000),
                domain: 'test',
                status: eventType.includes('success') ? 'success' : 'failed',
                reference,
                amount: 100000,
                gateway_response: eventType.includes('success') ? 'Successful' : 'Failed',
                created_at: new Date().toISOString()
            }
        };
    }
    /**
   * Get demo mode status info
   */ getDemoInfo() {
        return {
            mode: 'demo',
            totalPayments: this.demoPayments.size,
            totalTransfers: this.demoTransfers.size,
            totalRecipients: this.demoRecipients.size,
            warning: 'This is demo mode. No real money transactions will occur.'
        };
    }
    constructor(configService){
        this.configService = configService;
        this.logger = new _common.Logger(PaystackDemoService.name);
        // Demo data storage
        this.demoPayments = new Map();
        this.demoTransfers = new Map();
        this.demoRecipients = new Map();
        this.secretKey = 'demo-paystack-secret-key';
        this.baseUrl = 'https://api.paystack.co';
        this.logger.warn('🎭 DEMO MODE: Using simulated Paystack service');
    }
};
PaystackDemoService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], PaystackDemoService);

//# sourceMappingURL=paystack-demo.service.js.map