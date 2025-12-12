"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvestmentsController", {
    enumerable: true,
    get: function() {
        return InvestmentsController;
    }
});
const _common = require("@nestjs/common");
const _investmentsservice = require("./investments.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _createinvestmentdto = require("./dto/create-investment.dto");
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
let InvestmentsController = class InvestmentsController {
    /**
   * Get available investment plans
   */ getInvestmentPlans() {
        return this.investmentsService.getInvestmentPlans();
    }
    /**
   * Create a new investment
   */ async createInvestment(req, createInvestmentDto) {
        const userId = req.user.id;
        return this.investmentsService.createInvestment(userId, createInvestmentDto);
    }
    /**
   * Get user investments
   */ async getUserInvestments(req) {
        const userId = req.user.id;
        return this.investmentsService.getUserInvestments(userId);
    }
    /**
   * Get investment summary
   */ async getInvestmentSummary(req) {
        const userId = req.user.id;
        return this.investmentsService.getInvestmentSummary(userId);
    }
    /**
   * Get specific investment details
   */ async getInvestmentById(req, investmentId) {
        const userId = req.user.id;
        return this.investmentsService.getInvestmentById(userId, investmentId);
    }
    /**
   * Liquidate investment early
   */ async liquidateInvestment(req, investmentId) {
        const userId = req.user.id;
        return this.investmentsService.liquidateInvestment(userId, investmentId);
    }
    constructor(investmentsService){
        this.investmentsService = investmentsService;
    }
};
_ts_decorate([
    (0, _common.Get)('plans'),
    (0, _swagger.ApiOperation)({
        summary: 'Get available investment plans'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], InvestmentsController.prototype, "getInvestmentPlans", null);
_ts_decorate([
    (0, _common.Post)('create'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new investment'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createinvestmentdto.CreateInvestmentDto === "undefined" ? Object : _createinvestmentdto.CreateInvestmentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InvestmentsController.prototype, "createInvestment", null);
_ts_decorate([
    (0, _common.Get)('list'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user investments'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], InvestmentsController.prototype, "getUserInvestments", null);
_ts_decorate([
    (0, _common.Get)('summary'),
    (0, _swagger.ApiOperation)({
        summary: 'Get investment summary with accrued interest'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], InvestmentsController.prototype, "getInvestmentSummary", null);
_ts_decorate([
    (0, _common.Get)(':investmentId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get investment details'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('investmentId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvestmentsController.prototype, "getInvestmentById", null);
_ts_decorate([
    (0, _common.Post)(':investmentId/liquidate'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Liquidate investment early (with penalty)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('investmentId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvestmentsController.prototype, "liquidateInvestment", null);
InvestmentsController = _ts_decorate([
    (0, _swagger.ApiTags)('Investments'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('investments'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _investmentsservice.InvestmentsService === "undefined" ? Object : _investmentsservice.InvestmentsService
    ])
], InvestmentsController);

//# sourceMappingURL=investments.controller.js.map