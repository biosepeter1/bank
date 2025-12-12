"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LiveChatService", {
    enumerable: true,
    get: function() {
        return LiveChatService;
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
let LiveChatService = class LiveChatService {
    async createSession(data) {
        return this.prisma.chatSession.create({
            data: {
                socketId: data.socketId,
                userId: data.userId,
                userIp: data.userIp,
                status: 'QUEUED'
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                messages: true
            }
        });
    }
    async getSessions(status) {
        return this.prisma.chatSession.findMany({
            where: status ? {
                status
            } : undefined,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                admin: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
    }
    async getSession(id) {
        return this.prisma.chatSession.findUnique({
            where: {
                id
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                admin: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }
    async assignAdminToSession(sessionId, adminId) {
        return this.prisma.chatSession.update({
            where: {
                id: sessionId
            },
            data: {
                adminId,
                status: 'ACTIVE'
            }
        });
    }
    async saveMessage(sessionId, message, sender) {
        return this.prisma.chatMessage.create({
            data: {
                sessionId,
                message,
                sender
            }
        });
    }
    async endSession(sessionId) {
        return this.prisma.chatSession.update({
            where: {
                id: sessionId
            },
            data: {
                status: 'ENDED'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
LiveChatService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], LiveChatService);

//# sourceMappingURL=live-chat.service.js.map