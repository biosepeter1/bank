"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaystackWebhookController", {
    enumerable: true,
    get: function() {
        return PaystackWebhookController;
    }
});
const _common = require("@nestjs/common");
const _depositsservice = require("../deposits/deposits.service");
const _paystackwebhook = require("../deposits/paystack.webhook");
const _swagger = require("@nestjs/swagger");
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
let PaystackWebhookController = class PaystackWebhookController {
    /**
   * Paystack webhook endpoint for demo mode
   * In demo mode, this accepts both signed webhooks and test requests
   */ async handlePaystackWebhook(event, signature) {
        const isDemoMode = process.env.PAYSTACK_DEMO_MODE === 'true';
        if (!isDemoMode && signature) {
            // In production, verify the signature
            const payload = JSON.stringify(event);
            const isValid = this.paystackWebhookService.verifyWebhookSignature(payload, signature);
            if (!isValid) {
                throw new _common.BadRequestException('Invalid webhook signature');
            }
        }
        this.logger.log(`Received Paystack webhook: ${event.event} - Reference: ${event.data?.reference}`);
        // Handle the webhook event
        await this.paystackWebhookService.handleWebhookEvent(event);
        return {
            status: 'success'
        };
    }
    /**
   * Demo endpoint to simulate successful payment
   * For testing in development
   */ async simulatePaystackSuccess(data) {
        if (process.env.PAYSTACK_DEMO_MODE !== 'true') {
            throw new _common.BadRequestException('Demo mode is not enabled');
        }
        this.logger.log(`[DEMO] Simulating successful payment - Reference: ${data.reference}`);
        try {
            const result = await this.depositsService.confirmPaystackDeposit(data.reference);
            return {
                status: 'success',
                data: result
            };
        } catch (error) {
            this.logger.error(`[DEMO] Error confirming deposit: ${error.message}`);
            throw new _common.BadRequestException(`Failed to confirm deposit: ${error.message}`);
        }
    }
    /**
   * Demo endpoint to simulate failed payment
   */ async simulatePaystackFailed(data) {
        if (process.env.PAYSTACK_DEMO_MODE !== 'true') {
            throw new _common.BadRequestException('Demo mode is not enabled');
        }
        this.logger.log(`[DEMO] Simulating failed payment - Reference: ${data.reference}`);
        // In a real scenario, you would update the deposit status to FAILED
        return {
            status: 'success',
            message: 'Demo payment failure recorded'
        };
    }
    /**
   * Health check endpoint
   */ async healthCheck() {
        return {
            status: 'healthy',
            demoMode: process.env.PAYSTACK_DEMO_MODE === 'true',
            timestamp: new Date().toISOString()
        };
    }
    constructor(paystackWebhookService, depositsService){
        this.paystackWebhookService = paystackWebhookService;
        this.depositsService = depositsService;
        this.logger = new _common.Logger(PaystackWebhookController.name);
    }
};
_ts_decorate([
    (0, _common.Post)('paystack'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Paystack webhook endpoint (supports demo mode)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Headers)('x-paystack-signature')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PaystackWebhookController.prototype, "handlePaystackWebhook", null);
_ts_decorate([
    (0, _common.Post)('paystack/demo/success'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Demo endpoint to simulate successful Paystack payment'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], PaystackWebhookController.prototype, "simulatePaystackSuccess", null);
_ts_decorate([
    (0, _common.Post)('paystack/demo/failed'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Demo endpoint to simulate failed Paystack payment'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], PaystackWebhookController.prototype, "simulatePaystackFailed", null);
_ts_decorate([
    (0, _common.Post)('paystack/health'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Health check for webhook endpoint'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], PaystackWebhookController.prototype, "healthCheck", null);
PaystackWebhookController = _ts_decorate([
    (0, _swagger.ApiTags)('Webhooks'),
    (0, _common.Controller)('webhooks'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paystackwebhook.PaystackWebhookService === "undefined" ? Object : _paystackwebhook.PaystackWebhookService,
        typeof _depositsservice.DepositsService === "undefined" ? Object : _depositsservice.DepositsService
    ])
], PaystackWebhookController);

//# sourceMappingURL=paystack.webhook.controller.js.map