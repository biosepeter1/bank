"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _config = require("@nestjs/config");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _usersmodule = require("../users/users.module");
const _emailservice = require("../../common/services/email.service");
const _settingsmodule = require("../settings/settings.module");
const _otpmodule = require("../otp/otp.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _usersmodule.UsersModule,
            _settingsmodule.SettingsModule,
            _otpmodule.OtpModule,
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: async (configService)=>({
                        secret: configService.get('JWT_SECRET') || 'default-secret',
                        signOptions: {
                            expiresIn: '7d'
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _emailservice.EmailService
        ],
        exports: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _passport.PassportModule
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map