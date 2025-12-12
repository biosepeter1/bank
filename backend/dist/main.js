"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _path = require("path");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Serve static files (uploads)
    app.useStaticAssets((0, _path.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/'
    });
    // Security
    app.use((0, _helmet.default)({
        crossOriginResourcePolicy: {
            policy: 'cross-origin'
        }
    }));
    // CORS - allow all origins for development
    app.enableCors({
        origin: true,
        credentials: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept'
        ]
    });
    // Global prefix
    app.setGlobalPrefix(process.env.API_PREFIX || 'api');
    // Validation
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    // Swagger Documentation
    const config = new _swagger.DocumentBuilder().setTitle('RDN Banking Platform API').setDescription('Corporate Digital Banking Platform API Documentation').setVersion('1.0').addBearerAuth().addTag('auth', 'Authentication endpoints').addTag('users', 'User management endpoints').addTag('admin', 'Admin operations').addTag('wallet', 'Wallet operations').addTag('transactions', 'Transaction management').addTag('cards', 'Card management').addTag('kyc', 'KYC verification').build();
    const document = _swagger.SwaggerModule.createDocument(app, config);
    _swagger.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`\n🏦 RDN Banking Platform API`);
    console.log(`🚀 Server running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api\n`);
}
bootstrap();

//# sourceMappingURL=main.js.map