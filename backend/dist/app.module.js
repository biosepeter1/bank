"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _prismamodule = require("./prisma/prisma.module");
const _uploadmodule = require("./common/upload/upload.module");
const _accountstatusguard = require("./common/guards/account-status.guard");
const _authmodule = require("./modules/auth/auth.module");
const _usersmodule = require("./modules/users/users.module");
const _walletmodule = require("./modules/wallet/wallet.module");
const _transactionsmodule = require("./modules/transactions/transactions.module");
const _cardsmodule = require("./modules/cards/cards.module");
const _kycmodule = require("./modules/kyc/kyc.module");
const _paymentsmodule = require("./modules/payments/payments.module");
const _auditmodule = require("./modules/audit/audit.module");
const _adminmodule = require("./modules/admin/admin.module");
const _transfersmodule = require("./modules/transfers/transfers.module");
const _loansmodule = require("./modules/loans/loans.module");
const _depositsmodule = require("./modules/deposits/deposits.module");
const _currencymodule = require("./modules/currency/currency.module");
const _withdrawalsmodule = require("./modules/withdrawals/withdrawals.module");
const _investmentsmodule = require("./modules/investments/investments.module");
const _settingsmodule = require("./modules/settings/settings.module");
const _otpmodule = require("./modules/otp/otp.module");
const _supportmodule = require("./modules/support/support.module");
const _notificationmodule = require("./modules/notification/notification.module");
const _chatmodule = require("./modules/chat/chat.module");
const _livechatmodule = require("./modules/live-chat/live-chat.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            _prismamodule.PrismaModule,
            _uploadmodule.UploadModule,
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _walletmodule.WalletModule,
            _transactionsmodule.TransactionsModule,
            _cardsmodule.CardsModule,
            _kycmodule.KycModule,
            _paymentsmodule.PaymentsModule,
            _auditmodule.AuditModule,
            _adminmodule.AdminModule,
            _transfersmodule.TransfersModule,
            _loansmodule.LoansModule,
            _depositsmodule.DepositsModule,
            _currencymodule.CurrencyModule,
            _withdrawalsmodule.WithdrawalsModule,
            _investmentsmodule.InvestmentsModule,
            _settingsmodule.SettingsModule,
            _otpmodule.OtpModule,
            _supportmodule.SupportModule,
            _notificationmodule.NotificationModule,
            _chatmodule.ChatModule,
            _livechatmodule.LiveChatModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            {
                provide: _core.APP_GUARD,
                useClass: _accountstatusguard.AccountStatusGuard
            }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map