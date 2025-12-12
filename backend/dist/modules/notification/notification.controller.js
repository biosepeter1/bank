"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationController", {
    enumerable: true,
    get: function() {
        return NotificationController;
    }
});
const _common = require("@nestjs/common");
const _notificationservice = require("./notification.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
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
let NotificationController = class NotificationController {
    async getUserNotifications(req) {
        return this.notificationService.getUserNotifications(req.user.userId);
    }
    async getUnreadCount(req) {
        const count = await this.notificationService.getUnreadCount(req.user.userId);
        return {
            count
        };
    }
    async markAsRead(id, req) {
        return this.notificationService.markAsRead(id, req.user.userId);
    }
    async markAllAsRead(req) {
        await this.notificationService.markAllAsRead(req.user.userId);
        return {
            message: 'All notifications marked as read'
        };
    }
    async deleteNotification(id, req) {
        await this.notificationService.deleteNotification(id, req.user.userId);
        return {
            message: 'Notification deleted successfully'
        };
    }
    async deleteAllNotifications(req) {
        await this.notificationService.deleteAllNotifications(req.user.userId);
        return {
            message: 'All notifications deleted successfully'
        };
    }
    constructor(notificationService){
        this.notificationService = notificationService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "getUserNotifications", null);
_ts_decorate([
    (0, _common.Get)('unread-count'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
_ts_decorate([
    (0, _common.Patch)(':id/read'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
_ts_decorate([
    (0, _common.Post)('mark-all-read'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
_ts_decorate([
    (0, _common.Post)('delete-all'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteAllNotifications", null);
NotificationController = _ts_decorate([
    (0, _common.Controller)('notifications'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _notificationservice.NotificationService === "undefined" ? Object : _notificationservice.NotificationService
    ])
], NotificationController);

//# sourceMappingURL=notification.controller.js.map