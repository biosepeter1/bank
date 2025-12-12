"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationService", {
    enumerable: true,
    get: function() {
        return NotificationService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotificationService = class NotificationService {
    async getUserNotifications(userId) {
        const notifications = await this.prisma.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });
        return notifications;
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId
            }
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return this.prisma.notification.update({
            where: {
                id: notificationId
            },
            data: {
                isRead: true
            }
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    }
    async createNotification(userId, title, message, type = 'INFO', metadata) {
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                metadata
            }
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
    }
    async deleteNotification(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId
            }
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return this.prisma.notification.delete({
            where: {
                id: notificationId
            }
        });
    }
    async deleteAllNotifications(userId) {
        return this.prisma.notification.deleteMany({
            where: {
                userId
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
NotificationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], NotificationService);

//# sourceMappingURL=notification.service.js.map