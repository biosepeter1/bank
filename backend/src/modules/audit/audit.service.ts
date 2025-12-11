import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getAllLogs(filters: {
    action?: string;
    entity?: string;
    actorRole?: string;
    limit?: number;
  }) {
    const where: any = {};

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
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [
      totalLogs,
      todayLogs,
      criticalActions,
      topActors,
      actionBreakdown,
      entityBreakdown,
    ] = await Promise.all([
      // Total logs
      this.prisma.auditLog.count(),

      // Today's logs
      this.prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
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
              'BALANCE_ADJUSTED',
            ],
          },
        },
      }),

      // Top actors by log count
      this.prisma.auditLog.groupBy({
        by: ['actorEmail', 'actorRole'],
        _count: true,
        orderBy: {
          _count: {
            actorEmail: 'desc',
          },
        },
        take: 5,
      }),

      // Action breakdown
      this.prisma.auditLog.groupBy({
        by: ['action'],
        _count: true,
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
        take: 10,
      }),

      // Entity breakdown
      this.prisma.auditLog.groupBy({
        by: ['entity'],
        _count: true,
        orderBy: {
          _count: {
            entity: 'desc',
          },
        },
      }),
    ]);

    return {
      totalLogs,
      todayLogs,
      criticalActions,
      topActors: topActors.map((actor) => ({
        email: actor.actorEmail,
        role: actor.actorRole,
        count: actor._count,
      })),
      actionBreakdown: actionBreakdown.map((item) => ({
        action: item.action,
        count: item._count,
      })),
      entityBreakdown: entityBreakdown.map((item) => ({
        entity: item.entity,
        count: item._count,
      })),
    };
  }

  async deleteAuditLog(logId: string) {
    return this.prisma.auditLog.delete({
      where: { id: logId },
    });
  }

  async deleteAuditLogs(logIds: string[]) {
    return this.prisma.auditLog.deleteMany({
      where: {
        id: {
          in: logIds,
        },
      },
    });
  }
}
