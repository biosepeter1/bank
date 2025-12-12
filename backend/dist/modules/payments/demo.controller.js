"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DemoController", {
    enumerable: true,
    get: function() {
        return DemoController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _paystackdemoservice = require("./paystack-demo.service");
const _webhookservice = require("./webhook.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _client = require("@prisma/client");
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
let DemoController = class DemoController {
    getDemoInfo() {
        return this.demoService.getDemoInfo();
    }
    async simulateChargeWebhook(reference, success = true) {
        const eventType = success ? 'charge.success' : 'charge.failed';
        const webhookEvent = await this.demoService.simulateWebhookEvent(reference, eventType);
        const payload = JSON.stringify(webhookEvent);
        const signature = 'demo-signature'; // Demo signature
        return this.webhookService.handlePaystackWebhook(signature, payload);
    }
    async simulateTransferWebhook(reference, success = true) {
        const eventType = success ? 'transfer.success' : 'transfer.failed';
        const webhookEvent = await this.demoService.simulateWebhookEvent(reference, eventType);
        const payload = JSON.stringify(webhookEvent);
        const signature = 'demo-signature'; // Demo signature
        return this.webhookService.handlePaystackWebhook(signature, payload);
    }
    async simulatePaymentFlow(data) {
        // Step 1: Initialize payment
        const initResponse = await this.demoService.initializePayment({
            email: data.email,
            amount: this.demoService.toKobo(data.amount),
            metadata: {
                demo: true,
                simulatedFlow: true
            }
        });
        // Step 2: Verify payment
        const verifyResponse = await this.demoService.verifyPayment(initResponse.data.reference);
        // Step 3: Simulate webhook (if payment was successful)
        let webhookResponse = null;
        if (verifyResponse.data.status === 'success') {
            const webhookEvent = await this.demoService.simulateWebhookEvent(initResponse.data.reference, 'charge.success');
            webhookResponse = await this.webhookService.handlePaystackWebhook('demo-signature', JSON.stringify(webhookEvent));
        }
        return {
            step1: initResponse,
            step2: verifyResponse,
            step3: webhookResponse,
            message: 'Complete demo payment flow executed successfully',
            warning: 'This is a demo simulation. No real money was processed.'
        };
    }
    async getDemoBanks() {
        return this.demoService.getBanks();
    }
    async resolveDemoAccount(data) {
        return this.demoService.resolveAccountNumber({
            account_number: data.accountNumber,
            bank_code: data.bankCode
        });
    }
    // Admin endpoint to reset demo data
    async resetDemoData() {
        // Clear demo data maps
        this.demoService.demoPayments.clear();
        this.demoService.demoTransfers.clear();
        this.demoService.demoRecipients.clear();
        return {
            message: 'Demo data has been reset successfully',
            timestamp: new Date().toISOString()
        };
    }
    constructor(demoService, webhookService){
        this.demoService = demoService;
        this.webhookService = webhookService;
    }
};
_ts_decorate([
    (0, _common.Get)('info'),
    (0, _swagger.ApiOperation)({
        summary: 'Get demo mode information',
        description: 'Get current demo mode status and statistics'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Demo info retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    example: 'demo'
                },
                totalPayments: {
                    type: 'number',
                    example: 5
                },
                totalTransfers: {
                    type: 'number',
                    example: 2
                },
                totalRecipients: {
                    type: 'number',
                    example: 3
                },
                warning: {
                    type: 'string',
                    example: 'This is demo mode. No real money transactions will occur.'
                }
            }
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], DemoController.prototype, "getDemoInfo", null);
_ts_decorate([
    (0, _common.Post)('webhook/charge/:reference'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Simulate charge webhook event',
        description: 'Simulate a Paystack webhook for charge success/failure (Demo only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Webhook event simulated successfully'
    }),
    _ts_param(0, (0, _common.Param)('reference')),
    _ts_param(1, (0, _common.Body)('success')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "simulateChargeWebhook", null);
_ts_decorate([
    (0, _common.Post)('webhook/transfer/:reference'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Simulate transfer webhook event',
        description: 'Simulate a Paystack webhook for transfer success/failure (Demo only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Webhook event simulated successfully'
    }),
    _ts_param(0, (0, _common.Param)('reference')),
    _ts_param(1, (0, _common.Body)('success')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "simulateTransferWebhook", null);
_ts_decorate([
    (0, _common.Post)('simulate-payment-flow'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Simulate complete payment flow',
        description: 'Simulate a complete payment flow from initiation to webhook confirmation (Demo only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Payment flow simulated successfully',
        schema: {
            type: 'object',
            properties: {
                step1: {
                    type: 'object',
                    description: 'Payment initialization'
                },
                step2: {
                    type: 'object',
                    description: 'Payment verification'
                },
                step3: {
                    type: 'object',
                    description: 'Webhook processing'
                },
                message: {
                    type: 'string',
                    example: 'Complete demo payment flow executed successfully'
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "simulatePaymentFlow", null);
_ts_decorate([
    (0, _common.Get)('banks'),
    (0, _swagger.ApiOperation)({
        summary: 'Get demo banks list',
        description: 'Get list of demo Nigerian banks for testing'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Demo banks retrieved successfully'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "getDemoBanks", null);
_ts_decorate([
    (0, _common.Post)('resolve-account'),
    (0, _swagger.ApiOperation)({
        summary: 'Resolve demo account',
        description: 'Resolve a demo bank account (returns random demo names)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Demo account resolved successfully'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "resolveDemoAccount", null);
_ts_decorate([
    (0, _common.Post)('reset'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_client.UserRole.SUPER_ADMIN),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Reset demo data (Super Admin only)',
        description: 'Clear all demo payment and transfer data'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Demo data reset successfully'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DemoController.prototype, "resetDemoData", null);
DemoController = _ts_decorate([
    (0, _swagger.ApiTags)('demo'),
    (0, _common.Controller)('demo'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paystackdemoservice.PaystackDemoService === "undefined" ? Object : _paystackdemoservice.PaystackDemoService,
        typeof _webhookservice.WebhookService === "undefined" ? Object : _webhookservice.WebhookService
    ])
], DemoController);

//# sourceMappingURL=demo.controller.js.map