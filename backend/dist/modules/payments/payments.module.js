"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentsModule", {
    enumerable: true,
    get: function() {
        return PaymentsModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _paymentscontroller = require("./payments.controller");
const _paymentsservice = require("./payments.service");
const _paystackservice = require("./paystack.service");
const _paystackdemoservice = require("./paystack-demo.service");
const _webhookservice = require("./webhook.service");
const _democontroller = require("./demo.controller");
const _prismamodule = require("../../prisma/prisma.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PaymentsModule = class PaymentsModule {
};
PaymentsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule,
            _prismamodule.PrismaModule
        ],
        controllers: [
            _paymentscontroller.PaymentsController,
            _democontroller.DemoController
        ],
        providers: [
            _paymentsservice.PaymentsService,
            _webhookservice.WebhookService,
            _paystackdemoservice.PaystackDemoService,
            {
                provide: _paystackservice.PaystackService,
                useFactory: (configService, demoService)=>{
                    const paystackSecretKey = configService.get('PAYSTACK_SECRET_KEY');
                    // Use demo service if no real API key is provided or if key contains placeholder text
                    if (!paystackSecretKey || paystackSecretKey.includes('your-paystack-secret-key')) {
                        console.log('🎭 DEMO MODE: Using PaystackDemoService (no valid API key found)');
                        return demoService;
                    }
                    console.log('🔑 PRODUCTION MODE: Using real PaystackService');
                    return new _paystackservice.PaystackService(configService);
                },
                inject: [
                    _config.ConfigService,
                    _paystackdemoservice.PaystackDemoService
                ]
            }
        ],
        exports: [
            _paymentsservice.PaymentsService,
            _paystackservice.PaystackService,
            _webhookservice.WebhookService,
            _paystackdemoservice.PaystackDemoService
        ]
    })
], PaymentsModule);

//# sourceMappingURL=payments.module.js.map