"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaystackWebhookService", {
    enumerable: true,
    get: function() {
        return PaystackWebhookService;
    }
});
const _common = require("@nestjs/common");
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
const _depositsservice = require("./deposits.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaystackWebhookService = class PaystackWebhookService {
    /**
   * Verify Paystack webhook signature
   */ verifyWebhookSignature(payload, signature) {
        const secret = process.env.PAYSTACK_SECRET_KEY || '';
        if (!secret) {
            this.logger.error('Paystack secret key not configured');
            return false;
        }
        const hash = _crypto.createHmac('sha512', secret).update(payload).digest('hex');
        return hash === signature;
    }
    /**
   * Handle Paystack webhook events
   */ async handleWebhookEvent(event) {
        const { event: eventType, data } = event;
        try {
            switch(eventType){
                case 'charge.success':
                    await this.handleChargeSuccess(data);
                    break;
                case 'charge.failed':
                    await this.handleChargeFailed(data);
                    break;
                default:
                    this.logger.log(`Unhandled Paystack event: ${eventType}`);
            }
        } catch (error) {
            this.logger.error(`Error handling Paystack webhook: ${error.message}`, error);
            throw new _common.BadRequestException('Webhook processing failed');
        }
    }
    /**
   * Handle successful charge
   */ async handleChargeSuccess(data) {
        const reference = data.reference;
        this.logger.log(`Processing successful charge with reference: ${reference}`);
        // Confirm the deposit
        await this.depositsService.confirmPaystackDeposit(reference);
    }
    /**
   * Handle failed charge
   */ async handleChargeFailed(data) {
        const reference = data.reference;
        this.logger.log(`Charge failed with reference: ${reference}`);
    // TODO: Update deposit status to FAILED
    }
    constructor(depositsService){
        this.depositsService = depositsService;
        this.logger = new _common.Logger(PaystackWebhookService.name);
    }
};
PaystackWebhookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _depositsservice.DepositsService === "undefined" ? Object : _depositsservice.DepositsService
    ])
], PaystackWebhookService);

//# sourceMappingURL=paystack.webhook.js.map