"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportController", {
    enumerable: true,
    get: function() {
        return SupportController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _rolesguard = require("../../common/guards/roles.guard");
const _rolesdecorator = require("../../common/decorators/roles.decorator");
const _supportservice = require("./support.service");
const _createticketdto = require("./dto/create-ticket.dto");
const _contactformdto = require("./dto/contact-form.dto");
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
let SupportController = class SupportController {
    /**
   * Public: Submit a contact form (no auth required)
   */ async submitContactForm(data) {
        return this.supportService.createGuestTicket(data);
    }
    /**
   * User: Create a support ticket
   */ async createTicket(req, data) {
        return this.supportService.createTicket(req.user.id, data);
    }
    /**
   * User: Get all own tickets
   */ async getUserTickets(req) {
        return this.supportService.getUserTickets(req.user.id);
    }
    /**
   * User: Get specific ticket
   */ async getTicket(req, ticketId) {
        return this.supportService.getTicket(req.user.id, ticketId);
    }
    /**
   * Admin: Get all tickets
   */ async getAllTickets(status) {
        return this.supportService.getAllTickets(status);
    }
    /**
   * Admin: Get a specific ticket
   */ async getAdminTicket(ticketId) {
        return this.supportService.getAdminTicket(ticketId);
    }
    /**
   * Admin: Update ticket status
   */ async updateTicket(req, ticketId, data) {
        return this.supportService.updateTicket(ticketId, req.user.id, data);
    }
    /**
   * Admin: Delete ticket
   */ async deleteTicket(req, ticketId) {
        return this.supportService.deleteTicket(ticketId, req.user.id);
    }
    /**
   * User: Add reply to ticket
   */ async addUserReply(req, ticketId, body) {
        return this.supportService.addUserReply(req.user.id, ticketId, body.message);
    }
    /**
   * Admin: Add reply to ticket
   */ async addAdminReply(req, ticketId, body) {
        return this.supportService.addAdminReply(req.user.id, ticketId, body.message);
    }
    /**
   * Admin: Send email reply to guest
   */ async sendGuestEmailReply(req, ticketId, body) {
        return this.supportService.sendGuestEmailReply(ticketId, body, req.user);
    }
    constructor(supportService){
        this.supportService = supportService;
    }
};
_ts_decorate([
    (0, _common.Post)('contact'),
    (0, _swagger.ApiOperation)({
        summary: 'Submit a contact form (public, no auth required)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _contactformdto.ContactFormDto === "undefined" ? Object : _contactformdto.ContactFormDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "submitContactForm", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Post)('tickets'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Create a support ticket'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createticketdto.CreateTicketDto === "undefined" ? Object : _createticketdto.CreateTicketDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "createTicket", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Get)('tickets'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Get all user support tickets'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "getUserTickets", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Get)('tickets/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Get a specific support ticket'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "getTicket", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Get)('admin/tickets'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all support tickets (Admin only)'
    }),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "getAllTickets", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Get)('admin/tickets/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Get a specific support ticket (Admin only)'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "getAdminTicket", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Patch)('admin/tickets/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Update support ticket (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        typeof _createticketdto.UpdateTicketDto === "undefined" ? Object : _createticketdto.UpdateTicketDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "updateTicket", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Delete)('admin/tickets/:id'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete support ticket (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "deleteTicket", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Post)('tickets/:id/reply'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Add a reply to support ticket'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "addUserReply", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Post)('admin/tickets/:id/reply'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Add admin reply to support ticket (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "addAdminReply", null);
_ts_decorate([
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Post)('admin/tickets/:id/email-reply'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('BANK_ADMIN', 'SUPER_ADMIN'),
    (0, _swagger.ApiOperation)({
        summary: 'Send email reply to guest contact (Admin only)'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], SupportController.prototype, "sendGuestEmailReply", null);
SupportController = _ts_decorate([
    (0, _swagger.ApiTags)('support'),
    (0, _common.Controller)('support'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _supportservice.SupportService === "undefined" ? Object : _supportservice.SupportService
    ])
], SupportController);

//# sourceMappingURL=support.controller.js.map