"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LiveChatController", {
    enumerable: true,
    get: function() {
        return LiveChatController;
    }
});
const _common = require("@nestjs/common");
const _livechatservice = require("./live-chat.service");
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
let LiveChatController = class LiveChatController {
    async getSessions(status) {
        return this.liveChatService.getSessions(status);
    }
    async getAdminSessions(status) {
        return this.liveChatService.getSessions(status);
    }
    async getSession(id) {
        return this.liveChatService.getSession(id);
    }
    async endSession(id) {
        return this.liveChatService.endSession(id);
    }
    constructor(liveChatService){
        this.liveChatService = liveChatService;
    }
};
_ts_decorate([
    (0, _common.Get)('sessions'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all chat sessions (Admin)'
    }),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatController.prototype, "getSessions", null);
_ts_decorate([
    (0, _common.Get)('admin/sessions'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all chat sessions for Admin Dashboard'
    }),
    _ts_param(0, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatController.prototype, "getAdminSessions", null);
_ts_decorate([
    (0, _common.Get)('sessions/:id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get a specific session with messages'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatController.prototype, "getSession", null);
_ts_decorate([
    (0, _common.Post)('sessions/:id/end'),
    (0, _swagger.ApiOperation)({
        summary: 'End a chat session'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatController.prototype, "endSession", null);
LiveChatController = _ts_decorate([
    (0, _swagger.ApiTags)('Live Chat'),
    (0, _common.Controller)('live-chat'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _livechatservice.LiveChatService === "undefined" ? Object : _livechatservice.LiveChatService
    ])
], LiveChatController);

//# sourceMappingURL=live-chat.controller.js.map