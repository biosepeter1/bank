"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
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
let UsersService = class UsersService {
    async findAll(adminRole) {
        // SUPER_ADMIN can see all users (including other admins)
        // BANK_ADMIN can only see regular users (role: USER)
        const where = adminRole === 'SUPER_ADMIN' ? {} : {
            role: 'USER'
        };
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                phone: true,
                country: true,
                currency: true,
                accountType: true,
                role: true,
                accountStatus: true,
                createdAt: true,
                lastLoginAt: true,
                wallet: {
                    select: {
                        balance: true,
                        currency: true,
                        updatedAt: true
                    }
                },
                kyc: {
                    select: {
                        status: true,
                        dateOfBirth: true,
                        address: true,
                        city: true,
                        state: true,
                        postalCode: true
                    }
                }
            }
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                wallet: true,
                kyc: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, updateData) {
        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
            }
        });
    }
    async updateUserStatus(userId, status) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                accountStatus: status
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                accountStatus: true
            }
        });
    }
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Delete user and all related data (cascading delete should handle related records)
        await this.prisma.user.delete({
            where: {
                id: userId
            }
        });
        return {
            message: 'User deleted successfully',
            userId
        };
    }
    async adjustBalance(userId, type, amount, reason, adminId) {
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
        if (!user.wallet) {
            throw new _common.BadRequestException('User wallet not found');
        }
        const adjustmentAmount = new _library.Decimal(amount);
        if (type === 'debit' && user.wallet.balance.lessThan(adjustmentAmount)) {
            throw new _common.BadRequestException('Insufficient balance');
        }
        // Perform balance adjustment in a transaction
        const result = await this.prisma.$transaction(async (tx)=>{
            const oldBalance = user.wallet.balance;
            const newBalance = type === 'credit' ? oldBalance.add(adjustmentAmount) : oldBalance.sub(adjustmentAmount);
            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId
                },
                data: {
                    balance: newBalance
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'ADJUSTMENT',
                    amount: adjustmentAmount,
                    currency: user.wallet.currency,
                    status: 'COMPLETED',
                    balanceBefore: oldBalance,
                    balanceAfter: newBalance,
                    description: reason && reason.trim() || (type === 'credit' ? 'Account Credited' : 'Account Debited'),
                    reference: `ADM-${Date.now()}-${Math.random().toString(36).substring(7)}`
                }
            });
            return updatedWallet;
        });
        return {
            message: `Successfully ${type}ed ${amount} to user's account`,
            balance: result.balance.toNumber()
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map