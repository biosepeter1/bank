"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditService", {
    enumerable: true,
    get: function() {
        return AuditService;
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
let AuditService = class AuditService {
    async getAllLogs(filters) {
        const where = {};
        if (filters.action) {
            where.action = filters.action;
        }
        if (filters.entity) {
            where.entity = filters.entity;
        }
        if (filters.actorRole) {
            where.actorRole = filters.actorRole;
        }
        return this.prisma.auditLog.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: filters.limit || 100,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        });
    }
    async getStats() {
        const [totalLogs, todayLogs, criticalActions, topActors, actionBreakdown, entityBreakdown] = await Promise.all([
            // Total logs
            this.prisma.auditLog.count(),
            // Today's logs
            this.prisma.auditLog.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            // Critical actions (KYC, Account changes, Balance adjustments)
            this.prisma.auditLog.count({
                where: {
                    action: {
                        in: [
                            'KYC_APPROVED',
                            'KYC_REJECTED',
                            'ACCOUNT_FROZEN',
                            'ACCOUNT_UNFROZEN',
                            'BALANCE_ADJUSTED'
                        ]
                    }
                }
            }),
            // Top actors by log count
            this.prisma.auditLog.groupBy({
                by: [
                    'actorEmail',
                    'actorRole'
                ],
                _count: true,
                orderBy: {
                    _count: {
                        actorEmail: 'desc'
                    }
                },
                take: 5
            }),
            // Action breakdown
            this.prisma.auditLog.groupBy({
                by: [
                    'action'
                ],
                _count: true,
                orderBy: {
                    _count: {
                        action: 'desc'
                    }
                },
                take: 10
            }),
            // Entity breakdown
            this.prisma.auditLog.groupBy({
                by: [
                    'entity'
                ],
                _count: true,
                orderBy: {
                    _count: {
                        entity: 'desc'
                    }
                }
            })
        ]);
        return {
            totalLogs,
            todayLogs,
            criticalActions,
            topActors: topActors.map((actor)=>({
                    email: actor.actorEmail,
                    role: actor.actorRole,
                    count: actor._count
                })),
            actionBreakdown: actionBreakdown.map((item)=>({
                    action: item.action,
                    count: item._count
                })),
            entityBreakdown: entityBreakdown.map((item)=>({
                    entity: item.entity,
                    count: item._count
                }))
        };
    }
    async deleteAuditLog(logId) {
        return this.prisma.auditLog.delete({
            where: {
                id: logId
            }
        });
    }
    async deleteAuditLogs(logIds) {
        return this.prisma.auditLog.deleteMany({
            where: {
                id: {
                    in: logIds
                }
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
AuditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AuditService);

//# sourceMappingURL=audit.service.js.map