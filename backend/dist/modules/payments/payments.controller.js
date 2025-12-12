"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentsController", {
    enumerable: true,
    get: function() {
        return PaymentsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _paymentsservice = require("./payments.service");
const _webhookservice = require("./webhook.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _client = require("@prisma/client");
const _paymentdto = require("./dto/payment.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let PaymentsController = class PaymentsController {
    async initiateDeposit(req, dto) {
        return this.paymentsService.initiateDeposit(req.user.sub, dto);
    }
    async verifyPayment(dto) {
        return this.paymentsService.verifyPayment(dto);
    }
    async getPaymentStatus(req, paymentId) {
        return this.paymentsService.getPaymentStatus(paymentId, req.user.sub);
    }
    async getBanks() {
        return this.paymentsService.getBanks();
    }
    async resolveAccount(dto) {
        return this.paymentsService.resolveAccount(dto);
    }
    async addBankAccount(req, dto) {
        return this.paymentsService.addBankAccount(req.user.sub, dto);
    }
    async getBankAccounts(req) {
        return this.paymentsService.getBankAccounts(req.user.sub);
    }
    async initiateWithdrawal(req, dto) {
        return this.paymentsService.initiateWithdrawal(req.user.sub, dto);
    }
    async getWithdrawals(req) {
        return this.paymentsService.getWithdrawals(req.user.sub);
    }
    async handlePaystackWebhook(signature, req) {
        if (!signature) {
            this.logger.warn('Webhook received without signature');
            throw new _common.BadRequestException('Missing webhook signature');
        }
        const payload = req.rawBody?.toString('utf8') || '';
        if (!payload) {
            this.logger.warn('Webhook received with empty payload');
            throw new _common.BadRequestException('Empty webhook payload');
        }
        this.logger.log(`Received Paystack webhook: ${signature.substring(0, 20)}...`);
        return this.webhookService.handlePaystackWebhook(signature, payload);
    }
    // Admin endpoints
    async getAdminPayments(page = '1', limit = '50', status, provider) {
        // This would be implemented to get paginated payments for admin
        // For now, return a placeholder response
        return {
            message: 'Admin payments endpoint - to be implemented',
            filters: {
                page: parseInt(page),
                limit: parseInt(limit),
                status,
                provider
            }
        };
    }
    async getAdminWithdrawals(page = '1', limit = '50', status) {
        // This would be implemented to get paginated withdrawals for admin
        // For now, return a placeholder response
        return {
            message: 'Admin withdrawals endpoint - to be implemented',
            filters: {
                page: parseInt(page),
                limit: parseInt(limit),
                status
            }
        };
    }
    constructor(paymentsService, webhookService){
        this.paymentsService = paymentsService;
        this.webhookService = webhookService;
        this.logger = new _common.Logger(PaymentsController.name);
    }
};
_ts_decorate([
    (0, _common.Post)('deposits/initiate'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Initiate a deposit payment',
        description: 'Create a new deposit payment and get authorization URL for payment gateway'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Deposit initiated successfully',
        schema: {
            type: 'object',
            properties: {
                paymentId: {
                    type: 'string',
                    description: 'Payment ID'
                },
                reference: {
                    type: 'string',
                    description: 'Payment reference'
                },
                authorizationUrl: {
                    type: 'string',
                    description: 'Payment gateway URL'
                },
                accessCode: {
                    type: 'string',
                    description: 'Payment access code'
                },
                amount: {
                    type: 'number',
                    description: 'Payment amount'
                },
                status: {
                    type: 'string',
                    description: 'Payment status'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        typeof _paymentdto.InitiateDepositDto === "undefined" ? Object : _paymentdto.InitiateDepositDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateDeposit", null);
_ts_decorate([
    (0, _common.Post)('verify'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Verify payment status',
        description: 'Verify payment with payment gateway and update local status'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Payment verified successfully',
        schema: {
            type: 'object',
            properties: {
                paymentId: {
                    type: 'string',
                    description: 'Payment ID'
                },
                reference: {
                    type: 'string',
                    description: 'Payment reference'
                },
                status: {
                    type: 'string',
                    description: 'Payment status'
                },
                amount: {
                    type: 'number',
                    description: 'Paid amount'
                },
                paidAt: {
                    type: 'string',
                    description: 'Payment date'
                },
                channel: {
                    type: 'string',
                    description: 'Payment channel'
                },
                gatewayResponse: {
                    type: 'string',
                    description: 'Gateway response'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Payment not found'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentdto.VerifyPaymentDto === "undefined" ? Object : _paymentdto.VerifyPaymentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
_ts_decorate([
    (0, _common.Get)('status/:paymentId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get payment status',
        description: 'Get the current status of a payment'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Payment status retrieved',
        type: _paymentdto.PaymentStatusResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Payment not found'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Param)('paymentId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentStatus", null);
_ts_decorate([
    (0, _common.Get)('banks'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get supported banks',
        description: 'Get list of banks supported for transfers and withdrawals'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Banks retrieved successfully',
        type: [
            _paymentdto.BankListResponseDto
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getBanks", null);
_ts_decorate([
    (0, _common.Post)('banks/resolve'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Resolve bank account',
        description: 'Verify and get details of a bank account'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Account resolved successfully',
        type: _paymentdto.ResolveAccountResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid account details'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentdto.ResolveAccountDto === "undefined" ? Object : _paymentdto.ResolveAccountDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "resolveAccount", null);
_ts_decorate([
    (0, _common.Post)('bank-accounts'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Add bank account',
        description: 'Add a new bank account for withdrawals'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Bank account added successfully',
        type: _paymentdto.BankAccountResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Bank account already exists'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        typeof _paymentdto.AddBankAccountDto === "undefined" ? Object : _paymentdto.AddBankAccountDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "addBankAccount", null);
_ts_decorate([
    (0, _common.Get)('bank-accounts'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user bank accounts',
        description: 'Get all bank accounts for the authenticated user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Bank accounts retrieved successfully',
        type: [
            _paymentdto.BankAccountResponseDto
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getBankAccounts", null);
_ts_decorate([
    (0, _common.Post)('withdrawals/initiate'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Initiate withdrawal',
        description: 'Create a new withdrawal request to a bank account'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Withdrawal initiated successfully',
        schema: {
            type: 'object',
            properties: {
                withdrawalId: {
                    type: 'string',
                    description: 'Withdrawal ID'
                },
                reference: {
                    type: 'string',
                    description: 'Withdrawal reference'
                },
                amount: {
                    type: 'number',
                    description: 'Withdrawal amount'
                },
                fee: {
                    type: 'number',
                    description: 'Processing fee'
                },
                totalAmount: {
                    type: 'number',
                    description: 'Total deducted amount'
                },
                status: {
                    type: 'string',
                    description: 'Withdrawal status'
                },
                bankAccount: {
                    type: 'object',
                    properties: {
                        accountName: {
                            type: 'string'
                        },
                        accountNumber: {
                            type: 'string'
                        },
                        bankName: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Bank account not found'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        typeof _paymentdto.InitiateWithdrawalDto === "undefined" ? Object : _paymentdto.InitiateWithdrawalDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateWithdrawal", null);
_ts_decorate([
    (0, _common.Get)('withdrawals'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get user withdrawals',
        description: 'Get all withdrawals for the authenticated user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Withdrawals retrieved successfully',
        type: [
            _paymentdto.WithdrawalResponseDto
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getWithdrawals", null);
_ts_decorate([
    (0, _common.Post)('webhook/paystack'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Paystack webhook endpoint',
        description: 'Handle webhook events from Paystack payment gateway'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Webhook processed successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid webhook signature'
    }),
    _ts_param(0, (0, _common.Headers)('x-paystack-signature')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof RawBodyRequest === "undefined" ? Object : RawBodyRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "handlePaystackWebhook", null);
_ts_decorate([
    (0, _common.Get)('admin/payments'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.UserRole.BANK_ADMIN, _client.UserRole.SUPER_ADMIN),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all payments (Admin)',
        description: 'Get all payments in the system - admin only'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number'
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page'
    }),
    (0, _swagger.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by status'
    }),
    (0, _swagger.ApiQuery)({
        name: 'provider',
        required: false,
        type: String,
        description: 'Filter by provider'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Payments retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions'
    }),
    _ts_param(0, (0, _common.Query)('page')),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_param(2, (0, _common.Query)('status')),
    _ts_param(3, (0, _common.Query)('provider')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        void 0,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAdminPayments", null);
_ts_decorate([
    (0, _common.Get)('admin/withdrawals'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.UserRole.BANK_ADMIN, _client.UserRole.SUPER_ADMIN),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all withdrawals (Admin)',
        description: 'Get all withdrawals in the system - admin only'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number'
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page'
    }),
    (0, _swagger.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by status'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Payments retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions'
    }),
    _ts_param(0, (0, _common.Query)('page')),
    _ts_param(1, (0, _common.Query)('limit')),
    _ts_param(2, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAdminWithdrawals", null);
PaymentsController = _ts_decorate([
    (0, _swagger.ApiTags)('payments'),
    (0, _common.Controller)('payments'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentsservice.PaymentsService === "undefined" ? Object : _paymentsservice.PaymentsService,
        typeof _webhookservice.WebhookService === "undefined" ? Object : _webhookservice.WebhookService
    ])
], PaymentsController);

//# sourceMappingURL=payments.controller.js.map