"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvestmentsService", {
    enumerable: true,
    get: function() {
        return InvestmentsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _library = require("@prisma/client/runtime/library");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let InvestmentsService = class InvestmentsService {
    /**
   * Get available investment plans
   */ getInvestmentPlans() {
        return this.investmentPlans;
    }
    /**
   * Create a new investment
   */ async createInvestment(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                wallet: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Validate plan
        const plan = this.investmentPlans[data.planType];
        if (!plan) {
            throw new _common.BadRequestException('Invalid investment plan');
        }
        const amount = new _library.Decimal(data.amount);
        // Validate amount
        if (amount.lessThan(new _library.Decimal(plan.minAmount))) {
            throw new _common.BadRequestException(`Minimum investment for ${plan.name} is ₦${plan.minAmount}`);
        }
        if (plan.maxAmount && amount.greaterThan(new _library.Decimal(plan.maxAmount))) {
            throw new _common.BadRequestException(`Maximum investment for ${plan.name} is ₦${plan.maxAmount}`);
        }
        // Check wallet balance
        if (user.wallet.balance.lessThan(amount)) {
            throw new _common.BadRequestException('Insufficient wallet balance');
        }
        // Calculate expected returns
        const roiAmount = amount.mul(new _library.Decimal(plan.roi)).div(100);
        const totalReturn = amount.add(roiAmount);
        // Create investment transaction
        const result = await this.prisma.$transaction(async (tx)=>{
            // Debit wallet
            const walletBefore = user.wallet.balance;
            const walletAfter = walletBefore.sub(amount);
            await tx.wallet.update({
                where: {
                    userId
                },
                data: {
                    balance: walletAfter
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'INVESTMENT',
                    status: 'COMPLETED',
                    amount,
                    balanceBefore: walletBefore,
                    balanceAfter: walletAfter,
                    description: `Investment in ${plan.name} plan`,
                    reference: `INV_${Date.now()}`
                }
            });
            // Calculate maturity date
            const maturityDate = new Date();
            maturityDate.setDate(maturityDate.getDate() + plan.duration);
            // Create investment record
            const investment = await tx.investment.create({
                data: {
                    userId,
                    planType: data.planType,
                    amount,
                    roi: new _library.Decimal(plan.roi),
                    expectedReturn: roiAmount,
                    duration: plan.duration,
                    maturityDate,
                    status: 'ACTIVE'
                }
            });
            return investment;
        });
        return result;
    }
    /**
   * Get user investments
   */ async getUserInvestments(userId) {
        return this.prisma.investment.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /**
   * Get investment details
   */ async getInvestmentById(userId, investmentId) {
        const investment = await this.prisma.investment.findUnique({
            where: {
                id: investmentId
            }
        });
        if (!investment || investment.userId !== userId) {
            throw new _common.NotFoundException('Investment not found or unauthorized');
        }
        return investment;
    }
    /**
   * Calculate current interest accrued
   */ calculateAccruedInterest(investment) {
        if (investment.status !== 'ACTIVE') {
            return 0;
        }
        const now = new Date();
        const startDate = new Date(investment.startDate);
        const maturityDate = new Date(investment.maturityDate);
        const totalDays = (maturityDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        if (elapsedDays <= 0) return 0;
        if (elapsedDays >= totalDays) return investment.expectedReturn.toNumber();
        return investment.expectedReturn.toNumber() * elapsedDays / totalDays;
    }
    /**
   * Get investment summary
   */ async getInvestmentSummary(userId) {
        const investments = await this.getUserInvestments(userId);
        const summary = {
            totalInvested: new _library.Decimal(0),
            activeInvestments: 0,
            completedInvestments: 0,
            totalExpectedReturn: new _library.Decimal(0),
            accruedInterest: 0,
            investments: []
        };
        investments.forEach((inv)=>{
            summary.totalInvested = summary.totalInvested.add(inv.amount);
            summary.totalExpectedReturn = summary.totalExpectedReturn.add(inv.expectedReturn);
            if (inv.status === 'ACTIVE') {
                summary.activeInvestments++;
                summary.accruedInterest += this.calculateAccruedInterest(inv);
            } else if (inv.status === 'MATURED') {
                summary.completedInvestments++;
            }
            summary.investments.push({
                ...inv,
                accruedInterest: this.calculateAccruedInterest(inv),
                daysRemaining: Math.max(0, Math.ceil((new Date(inv.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
            });
        });
        return summary;
    }
    /**
   * Process matured investments (called by cron job)
   */ async processMatureInvestments() {
        const now = new Date();
        const matureInvestments = await this.prisma.investment.findMany({
            where: {
                status: 'ACTIVE',
                maturityDate: {
                    lte: now
                }
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                }
            }
        });
        this.logger.log(`Processing ${matureInvestments.length} mature investments`);
        for (const investment of matureInvestments){
            await this.prisma.$transaction(async (tx)=>{
                // Credit wallet with total return
                const walletBefore = investment.user.wallet.balance;
                const walletAfter = walletBefore.add(investment.expectedReturn);
                await tx.wallet.update({
                    where: {
                        userId: investment.userId
                    },
                    data: {
                        balance: walletAfter
                    }
                });
                // Create transaction record
                await tx.transaction.create({
                    data: {
                        userId: investment.userId,
                        type: 'INVESTMENT_MATURITY',
                        status: 'COMPLETED',
                        amount: investment.amount.add(investment.expectedReturn),
                        balanceBefore: walletBefore,
                        balanceAfter: walletAfter,
                        description: `Investment maturity credit - Total return ₦${investment.amount.add(investment.expectedReturn)}`,
                        reference: investment.id
                    }
                });
                // Mark investment as completed
                await tx.investment.update({
                    where: {
                        id: investment.id
                    },
                    data: {
                        status: 'MATURED'
                    }
                });
            });
        }
        return matureInvestments.length;
    }
    /**
   * Liquidate investment early (with penalty)
   */ async liquidateInvestment(userId, investmentId) {
        const investment = await this.prisma.investment.findUnique({
            where: {
                id: investmentId
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                }
            }
        });
        if (!investment || investment.userId !== userId) {
            throw new _common.NotFoundException('Investment not found or unauthorized');
        }
        if (investment.status !== 'ACTIVE') {
            throw new _common.BadRequestException('Only active investments can be liquidated');
        }
        // Calculate penalty (10% of expected return)
        const penalty = investment.expectedReturn.mul(0.1);
        const returnAmount = investment.amount.add(investment.expectedReturn).sub(penalty);
        const result = await this.prisma.$transaction(async (tx)=>{
            // Credit wallet
            const walletBefore = investment.user.wallet.balance;
            const walletAfter = walletBefore.add(returnAmount);
            await tx.wallet.update({
                where: {
                    userId: investment.userId
                },
                data: {
                    balance: walletAfter
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: investment.userId,
                    type: 'INVESTMENT_LIQUIDATION',
                    status: 'COMPLETED',
                    amount: returnAmount,
                    balanceBefore: walletBefore,
                    balanceAfter: walletAfter,
                    description: `Early liquidation (Penalty: Ã¢â€šÂ¦${penalty})`,
                    reference: investment.id
                }
            });
            // Mark investment as liquidated
            return tx.investment.update({
                where: {
                    id: investment.id
                },
                data: {
                    status: 'LIQUIDATED'
                }
            });
        });
        return result;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(InvestmentsService.name);
        // Investment plans with details
        this.investmentPlans = {
            BASIC: {
                name: 'Basic',
                minAmount: 1000,
                maxAmount: 50000,
                roi: 5,
                duration: 30
            },
            STANDARD: {
                name: 'Standard',
                minAmount: 50000,
                maxAmount: 500000,
                roi: 8,
                duration: 60
            },
            PREMIUM: {
                name: 'Premium',
                minAmount: 500000,
                maxAmount: 5000000,
                roi: 12,
                duration: 90
            },
            VIP: {
                name: 'VIP',
                minAmount: 5000000,
                maxAmount: null,
                roi: 15,
                duration: 120
            }
        };
    }
};
InvestmentsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], InvestmentsService);

//# sourceMappingURL=investments.service.js.map