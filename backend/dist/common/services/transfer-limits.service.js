"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransferLimitsService", {
    enumerable: true,
    get: function() {
        return TransferLimitsService;
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
let TransferLimitsService = class TransferLimitsService {
    /**
   * Calculate transfer fee based on type and amount
   */ calculateFee(amount, transferType) {
        let feePercent = 0;
        switch(transferType){
            case 'INTERNAL':
                feePercent = this.defaultLimits.internalFeePercent;
                break;
            case 'DOMESTIC':
                feePercent = this.defaultLimits.domesticFeePercent;
                break;
            case 'INTERNATIONAL':
                feePercent = this.defaultLimits.internationalFeePercent;
                break;
        }
        const calculatedFee = amount * feePercent / 100;
        // Apply minimum fee for non-internal transfers
        if (transferType !== 'INTERNAL') {
            return Math.max(calculatedFee, this.defaultLimits.minFee);
        }
        return calculatedFee;
    }
    /**
   * Check if transfer amount exceeds single transaction limit
   */ checkSingleTransferLimit(amount) {
        if (amount > this.defaultLimits.singleTransferLimit) {
            throw new _common.BadRequestException(`Transfer amount exceeds single transaction limit of ${this.defaultLimits.singleTransferLimit.toLocaleString()}`);
        }
    }
    /**
   * Check daily and monthly transfer limits
   */ async checkTransferLimits(userId, amount) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Get today's transfers
        const dailyTransfers = await this.prisma.transaction.aggregate({
            where: {
                userId,
                type: 'TRANSFER',
                status: 'COMPLETED',
                createdAt: {
                    gte: startOfDay
                }
            },
            _sum: {
                amount: true
            }
        });
        const dailyTotal = Number(dailyTransfers._sum.amount || 0);
        if (dailyTotal + amount > this.defaultLimits.dailyLimit) {
            throw new _common.BadRequestException(`Daily transfer limit exceeded. Limit: ${this.defaultLimits.dailyLimit.toLocaleString()}, ` + `Used: ${dailyTotal.toLocaleString()}, Remaining: ${(this.defaultLimits.dailyLimit - dailyTotal).toLocaleString()}`);
        }
        // Get this month's transfers
        const monthlyTransfers = await this.prisma.transaction.aggregate({
            where: {
                userId,
                type: 'TRANSFER',
                status: 'COMPLETED',
                createdAt: {
                    gte: startOfMonth
                }
            },
            _sum: {
                amount: true
            }
        });
        const monthlyTotal = Number(monthlyTransfers._sum.amount || 0);
        if (monthlyTotal + amount > this.defaultLimits.monthlyLimit) {
            throw new _common.BadRequestException(`Monthly transfer limit exceeded. Limit: ${this.defaultLimits.monthlyLimit.toLocaleString()}, ` + `Used: ${monthlyTotal.toLocaleString()}, Remaining: ${(this.defaultLimits.monthlyLimit - monthlyTotal).toLocaleString()}`);
        }
    }
    /**
   * Get user's remaining limits
   */ async getRemainingLimits(userId) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [dailyTransfers, monthlyTransfers] = await Promise.all([
            this.prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'TRANSFER',
                    status: 'COMPLETED',
                    createdAt: {
                        gte: startOfDay
                    }
                },
                _sum: {
                    amount: true
                }
            }),
            this.prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'TRANSFER',
                    status: 'COMPLETED',
                    createdAt: {
                        gte: startOfMonth
                    }
                },
                _sum: {
                    amount: true
                }
            })
        ]);
        const dailyUsed = Number(dailyTransfers._sum.amount || 0);
        const monthlyUsed = Number(monthlyTransfers._sum.amount || 0);
        return {
            daily: {
                limit: this.defaultLimits.dailyLimit,
                used: dailyUsed,
                remaining: this.defaultLimits.dailyLimit - dailyUsed
            },
            monthly: {
                limit: this.defaultLimits.monthlyLimit,
                used: monthlyUsed,
                remaining: this.defaultLimits.monthlyLimit - monthlyUsed
            },
            singleTransaction: this.defaultLimits.singleTransferLimit
        };
    }
    /**
   * Get fee information for display
   */ getFeeInfo() {
        return {
            internal: {
                percent: this.defaultLimits.internalFeePercent,
                min: 0
            },
            domestic: {
                percent: this.defaultLimits.domesticFeePercent,
                min: this.defaultLimits.minFee
            },
            international: {
                percent: this.defaultLimits.internationalFeePercent,
                min: this.defaultLimits.minFee
            }
        };
    }
    constructor(prisma){
        this.prisma = prisma;
        // Default limits (can be overridden per user or from database)
        this.defaultLimits = {
            dailyLimit: 1000000,
            monthlyLimit: 10000000,
            singleTransferLimit: 500000,
            internalFeePercent: 0,
            domesticFeePercent: 0.5,
            internationalFeePercent: 2,
            minFee: 10
        };
    }
};
TransferLimitsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], TransferLimitsService);

//# sourceMappingURL=transfer-limits.service.js.map