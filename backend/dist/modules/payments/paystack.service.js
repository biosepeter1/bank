"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaystackService", {
    enumerable: true,
    get: function() {
        return PaystackService;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
let PaystackService = class PaystackService {
    /**
   * Initialize a payment transaction
   */ async initializePayment(data) {
        try {
            const response = await this.httpClient.post('/transaction/initialize', data);
            if (!response.data.status) {
                throw new _common.BadRequestException(response.data.message || 'Payment initialization failed');
            }
            return response.data;
        } catch (error) {
            this.logger.error('Payment initialization failed:', error.response?.data || error.message);
            throw new _common.BadRequestException(error.response?.data?.message || 'Failed to initialize payment');
        }
    }
    /**
   * Verify a payment transaction
   */ async verifyPayment(reference) {
        try {
            const response = await this.httpClient.get(`/transaction/verify/${reference}`);
            if (!response.data.status) {
                throw new _common.BadRequestException(response.data.message || 'Payment verification failed');
            }
            return response.data;
        } catch (error) {
            this.logger.error('Payment verification failed:', error.response?.data || error.message);
            throw new _common.BadRequestException(error.response?.data?.message || 'Failed to verify payment');
        }
    }
    /**
   * Get list of banks
   */ async getBanks() {
        try {
            const response = await this.httpClient.get('/bank?country=nigeria');
            return response.data;
        } catch (error) {
            this.logger.error('Failed to fetch banks:', error.response?.data || error.message);
            throw new _common.BadRequestException('Failed to fetch bank list');
        }
    }
    /**
   * Resolve bank account details
   */ async resolveAccountNumber(data) {
        try {
            const response = await this.httpClient.get(`/bank/resolve?account_number=${data.account_number}&bank_code=${data.bank_code}`);
            if (!response.data.status) {
                throw new _common.BadRequestException(response.data.message || 'Account resolution failed');
            }
            return response.data;
        } catch (error) {
            this.logger.error('Account resolution failed:', error.response?.data || error.message);
            throw new _common.BadRequestException(error.response?.data?.message || 'Failed to resolve account');
        }
    }
    /**
   * Create a transfer recipient
   */ async createTransferRecipient(data) {
        try {
            const response = await this.httpClient.post('/transferrecipient', {
                ...data,
                currency: data.currency || 'NGN'
            });
            if (!response.data.status) {
                throw new _common.BadRequestException(response.data.message || 'Failed to create transfer recipient');
            }
            return response.data;
        } catch (error) {
            this.logger.error('Transfer recipient creation failed:', error.response?.data || error.message);
            throw new _common.BadRequestException(error.response?.data?.message || 'Failed to create transfer recipient');
        }
    }
    /**
   * Initiate a transfer
   */ async initiateTransfer(data) {
        try {
            const response = await this.httpClient.post('/transfer', data);
            if (!response.data.status) {
                throw new _common.BadRequestException(response.data.message || 'Transfer initiation failed');
            }
            return response.data;
        } catch (error) {
            this.logger.error('Transfer initiation failed:', error.response?.data || error.message);
            throw new _common.BadRequestException(error.response?.data?.message || 'Failed to initiate transfer');
        }
    }
    /**
   * Verify webhook signature
   */ verifyWebhookSignature(payload, signature) {
        try {
            const hash = _crypto.createHmac('sha512', this.secretKey).update(payload).digest('hex');
            return hash === signature;
        } catch (error) {
            this.logger.error('Webhook signature verification failed:', error);
            return false;
        }
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
    constructor(configService){
        this.configService = configService;
        this.logger = new _common.Logger(PaystackService.name);
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        this.baseUrl = this.configService.get('PAYSTACK_BASE_URL') || 'https://api.paystack.co';
        if (!secretKey) {
            throw new Error('PAYSTACK_SECRET_KEY is not configured');
        }
        this.secretKey = secretKey;
        this.httpClient = _axios.default.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        // Request interceptor for logging
        this.httpClient.interceptors.request.use((config)=>{
            this.logger.debug(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error)=>{
            this.logger.error('Request interceptor error:', error);
            return Promise.reject(error);
        });
        // Response interceptor for logging
        this.httpClient.interceptors.response.use((response)=>{
            this.logger.debug(`Response from ${response.config.url}: ${response.status}`);
            return response;
        }, (error)=>{
            const message = error.response?.data?.message || error.message || 'Unknown error';
            this.logger.error(`Request failed: ${error.config?.url} - ${message}`);
            return Promise.reject(error);
        });
    }
};
PaystackService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], PaystackService);

//# sourceMappingURL=paystack.service.js.map