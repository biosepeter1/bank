"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardsService", {
    enumerable: true,
    get: function() {
        return CardsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _library = require("@prisma/client/runtime/library");
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CardsService = class CardsService {
    async getUserCards(userId) {
        const cards = await this.prisma.card.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (cards.length === 0) return cards;
        const cardIds = cards.map((c)=>c.id);
        // Sum completed topups per card
        const topups = await this.prisma.transaction.groupBy({
            by: [
                'cardId'
            ],
            where: {
                cardId: {
                    in: cardIds
                },
                type: 'CARD_TOPUP',
                status: 'COMPLETED'
            },
            _sum: {
                amount: true
            }
        });
        // Sum completed withdrawals (back to wallet) per card
        const withdrawals = await this.prisma.transaction.groupBy({
            by: [
                'cardId'
            ],
            where: {
                cardId: {
                    in: cardIds
                },
                type: 'WITHDRAWAL',
                status: 'COMPLETED'
            },
            _sum: {
                amount: true
            }
        });
        const topupMap = new Map();
        for (const row of topups){
            topupMap.set(row.cardId, new _library.Decimal(row._sum?.amount || 0));
        }
        const withdrawMap = new Map();
        for (const row of withdrawals){
            withdrawMap.set(row.cardId, new _library.Decimal(row._sum?.amount || 0));
        }
        return cards.map((c)=>{
            const t = topupMap.get(c.id) || new _library.Decimal(0);
            const w = withdrawMap.get(c.id) || new _library.Decimal(0);
            const available = t.sub(w);
            return {
                ...c,
                availableBalance: Number(available)
            };
        });
    }
    async getUserCardRequests(userId) {
        return this.prisma.cardRequest.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                card: true
            }
        });
    }
    async getCardById(id, userId) {
        return this.prisma.card.findFirst({
            where: {
                id,
                userId
            }
        });
    }
    // Create card request (requires admin approval)
    async createVirtualCard(userId, cardType = 'VIRTUAL', reason) {
        // Check if user KYC is approved
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                kyc: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        if (!user.kyc) {
            throw new _common.BadRequestException('Please complete your KYC verification before requesting a card');
        }
        if (user.kyc.status !== 'APPROVED') {
            throw new _common.BadRequestException(`Your KYC verification is ${user.kyc.status}. Please wait for KYC approval before requesting a card`);
        }
        // Check if user has pending request
        const pendingRequest = await this.prisma.cardRequest.findFirst({
            where: {
                userId,
                status: 'PENDING'
            }
        });
        if (pendingRequest) {
            throw new _common.BadRequestException('You already have a pending card request');
        }
        const cardRequest = await this.prisma.cardRequest.create({
            data: {
                userId,
                cardType,
                reason,
                status: 'PENDING'
            }
        });
        // Create audit log
        const auditUser = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!auditUser) {
            throw new _common.NotFoundException('Audit user not found');
        }
        await this.prisma.auditLog.create({
            data: {
                userId,
                actorEmail: auditUser.email,
                actorRole: auditUser.role,
                action: 'CARD_REQUEST_CREATED',
                entity: 'CardRequest',
                entityId: cardRequest.id,
                description: `User requested a ${cardType} card`
            }
        });
        return {
            message: 'Card request submitted successfully. Awaiting admin approval.',
            requestId: cardRequest.id,
            status: 'PENDING'
        };
    }
    // Admin: Get all card requests
    async getAllCardRequests(status) {
        return this.prisma.cardRequest.findMany({
            where: status ? {
                status: status
            } : undefined,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        country: true,
                        accountStatus: true
                    }
                },
                card: true
            }
        });
    }
    // Admin: Approve card request
    async approveCardRequest(requestId, adminId) {
        const request = await this.prisma.cardRequest.findUnique({
            where: {
                id: requestId
            },
            include: {
                user: true
            }
        });
        if (!request) {
            throw new _common.NotFoundException('Card request not found');
        }
        if (request.status !== 'PENDING') {
            throw new _common.BadRequestException('Card request already processed');
        }
        // Determine preferred brand from request.reason if provided
        const cardBrands = [
            'VISA',
            'MASTERCARD',
            'AMERICAN_EXPRESS',
            'DISCOVER'
        ];
        let selectedBrand = null;
        const reason = request.reason || '';
        const match = /(?:PREF_BRAND|BRAND)\s*[:=]\s*(VISA|MASTERCARD)/i.exec(reason);
        if (match) selectedBrand = match[1].toUpperCase();
        if (!selectedBrand) selectedBrand = cardBrands[Math.floor(Math.random() * cardBrands.length)];
        const card = await this.prisma.card.create({
            data: {
                userId: request.userId,
                cardType: request.cardType,
                cardBrand: selectedBrand,
                status: 'ACTIVE',
                cardNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
                cardHolderName: `${request.user.firstName} ${request.user.lastName}`.toUpperCase(),
                expiryMonth: new Date().getMonth() + 1,
                expiryYear: new Date().getFullYear() + 3,
                cvv: Math.floor(100 + Math.random() * 900).toString(),
                provider: 'MOCK',
                providerCardId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }
        });
        // Update request
        await this.prisma.cardRequest.update({
            where: {
                id: requestId
            },
            data: {
                status: 'APPROVED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                cardId: card.id
            }
        });
        // Create audit log
        const admin = await this.prisma.user.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) {
            throw new _common.NotFoundException('Admin user not found');
        }
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: admin.email,
                actorRole: admin.role,
                action: 'CARD_REQUEST_APPROVED',
                entity: 'CardRequest',
                entityId: requestId,
                description: `Admin approved card request for ${request.user.email}`,
                metadata: {
                    cardId: card.id
                }
            }
        });
        // Create notification for user
        await this.prisma.notification.create({
            data: {
                userId: request.userId,
                title: 'Card Request Approved',
                message: `Your ${request.cardType} card request has been approved and your card is now active!`,
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Card request approved and card created successfully',
            card
        };
    }
    // Admin: Reject card request
    async rejectCardRequest(requestId, adminId, rejectionReason) {
        const request = await this.prisma.cardRequest.findUnique({
            where: {
                id: requestId
            },
            include: {
                user: true
            }
        });
        if (!request) {
            throw new _common.NotFoundException('Card request not found');
        }
        if (request.status !== 'PENDING') {
            throw new _common.BadRequestException('Card request already processed');
        }
        await this.prisma.cardRequest.update({
            where: {
                id: requestId
            },
            data: {
                status: 'REJECTED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                rejectionReason
            }
        });
        // Create audit log
        const admin = await this.prisma.user.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) {
            throw new _common.NotFoundException('Admin user not found');
        }
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: admin.email,
                actorRole: admin.role,
                action: 'CARD_REQUEST_REJECTED',
                entity: 'CardRequest',
                entityId: requestId,
                description: `Admin rejected card request for ${request.user.email}`,
                metadata: {
                    reason: rejectionReason
                }
            }
        });
        // Create notification for user
        await this.prisma.notification.create({
            data: {
                userId: request.userId,
                title: 'Card Request Rejected',
                message: `Your card request has been rejected. Reason: ${rejectionReason}`,
                type: 'ERROR'
            }
        });
        return {
            message: 'Card request rejected successfully'
        };
    }
    async getAllCards() {
        const cards = await this.prisma.card.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return cards.map((card)=>({
                id: card.id,
                userId: card.userId,
                userName: `${card.user.firstName} ${card.user.lastName}`,
                userEmail: card.user.email,
                cardNumber: `****-****-****-${card.cardNumber}`,
                cardType: card.cardType,
                cardBrand: card.cardBrand,
                status: card.status,
                expiryDate: `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}`,
                cardholderName: card.cardHolderName,
                createdAt: card.createdAt,
                lastUsed: card.updatedAt,
                provider: card.provider
            }));
    }
    async blockCard(cardId, adminId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            },
            include: {
                user: true
            }
        });
        if (!card) {
            throw new _common.NotFoundException('Card not found');
        }
        if (card.status === 'BLOCKED') {
            throw new _common.BadRequestException('Card is already blocked');
        }
        await this.prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                status: 'BLOCKED',
                blockedAt: new Date()
            }
        });
        // Create audit log
        const admin = await this.prisma.user.findUnique({
            where: {
                id: adminId
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: admin?.email || 'admin',
                actorRole: admin?.role || 'BANK_ADMIN',
                action: 'CARD_BLOCKED',
                entity: 'Card',
                entityId: cardId,
                description: `Admin blocked card for ${card.user.email}`
            }
        });
        // Notify user
        await this.prisma.notification.create({
            data: {
                userId: card.userId,
                title: 'Card Blocked',
                message: 'Your card has been blocked by administrator.',
                type: 'WARNING'
            }
        });
        return {
            message: 'Card blocked successfully'
        };
    }
    async unblockCard(cardId, adminId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            },
            include: {
                user: true
            }
        });
        if (!card) {
            throw new _common.NotFoundException('Card not found');
        }
        if (card.status !== 'BLOCKED') {
            throw new _common.BadRequestException('Card is not blocked');
        }
        await this.prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                status: 'ACTIVE',
                blockedAt: null
            }
        });
        // Create audit log
        const admin = await this.prisma.user.findUnique({
            where: {
                id: adminId
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: admin?.email || 'admin',
                actorRole: admin?.role || 'BANK_ADMIN',
                action: 'CARD_BLOCKED',
                entity: 'Card',
                entityId: cardId,
                description: `Admin unblocked card for ${card.user.email}`
            }
        });
        // Notify user
        await this.prisma.notification.create({
            data: {
                userId: card.userId,
                title: 'Card Unblocked',
                message: 'Your card has been unblocked and is now active.',
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Card unblocked successfully'
        };
    }
    // User actions
    async userBlockCard(cardId, userId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            }
        });
        if (!card || card.userId !== userId) {
            throw new _common.NotFoundException('Card not found');
        }
        if (card.status === 'BLOCKED') {
            throw new _common.BadRequestException('Card is already blocked');
        }
        await this.prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                status: 'BLOCKED',
                blockedAt: new Date()
            }
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Card Blocked',
                message: 'You blocked your card.',
                type: 'WARNING'
            }
        });
        return {
            message: 'Card blocked successfully'
        };
    }
    async userUnblockCard(cardId, userId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            }
        });
        if (!card || card.userId !== userId) {
            throw new _common.NotFoundException('Card not found');
        }
        if (card.status !== 'BLOCKED') {
            throw new _common.BadRequestException('Card is not blocked');
        }
        await this.prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                status: 'ACTIVE',
                blockedAt: null
            }
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Card Unblocked',
                message: 'You unblocked your card.',
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Card unblocked successfully'
        };
    }
    async deleteCard(cardId, adminId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            },
            include: {
                user: true
            }
        });
        if (!card) {
            throw new _common.NotFoundException('Card not found');
        }
        // Delete the card
        await this.prisma.card.delete({
            where: {
                id: cardId
            }
        });
        // Create audit log
        // const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
        // await this.prisma.auditLog.create({
        //   data: {
        //     userId: adminId,
        //     actorEmail: admin?.email || 'admin',
        //     actorRole: admin?.role || 'BANK_ADMIN',
        //     action: 'DELETE',
        //     entity: 'Card',
        //     entityId: cardId,
        //     description: `Admin deleted card for ${card.user.email}`,
        //   },
        // });
        // Notify user
        await this.prisma.notification.create({
            data: {
                userId: card.userId,
                title: 'Card Deleted',
                message: 'Your card has been deleted by an administrator.',
                type: 'INFO'
            }
        });
        return {
            message: 'Card deleted successfully'
        };
    }
    // User: fund card from wallet
    async userFundCard(cardId, userId, amountNum) {
        if (!amountNum || amountNum <= 0) {
            throw new _common.BadRequestException('Invalid amount');
        }
        const [card, wallet] = await Promise.all([
            this.prisma.card.findUnique({
                where: {
                    id: cardId
                }
            }),
            this.prisma.wallet.findUnique({
                where: {
                    userId
                }
            })
        ]);
        if (!card || card.userId !== userId) {
            throw new _common.NotFoundException('Card not found');
        }
        if (!wallet) {
            throw new _common.BadRequestException('Wallet not found');
        }
        const amount = new _library.Decimal(amountNum);
        if (wallet.balance.lessThan(amount)) {
            throw new _common.BadRequestException('Insufficient wallet balance');
        }
        const result = await this.prisma.$transaction(async (tx)=>{
            const walletBefore = wallet.balance;
            const walletAfter = walletBefore.sub(amount);
            await tx.wallet.update({
                where: {
                    userId
                },
                data: {
                    balance: walletAfter
                }
            });
            const txRec = await tx.transaction.create({
                data: {
                    userId,
                    type: 'CARD_TOPUP',
                    status: 'COMPLETED',
                    amount,
                    currency: wallet.currency,
                    balanceBefore: walletBefore,
                    balanceAfter: walletAfter,
                    description: `Top-up ${card.cardBrand} ${card.cardType} card`,
                    reference: `CARDTOPUP-${Date.now()}-${cardId.substring(0, 8)}`,
                    cardId: card.id
                }
            });
            return {
                walletAfter,
                txId: txRec.id
            };
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Card Funded',
                message: `You funded your card with ${amountNum} ${wallet.currency}.`,
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Card funded successfully',
            transactionId: result.txId
        };
    }
    // User: withdraw from card back to wallet
    async userWithdrawFromCard(cardId, userId, amountNum) {
        if (!amountNum || amountNum <= 0) {
            throw new _common.BadRequestException('Invalid amount');
        }
        const [card, wallet] = await Promise.all([
            this.prisma.card.findUnique({
                where: {
                    id: cardId
                }
            }),
            this.prisma.wallet.findUnique({
                where: {
                    userId
                }
            })
        ]);
        if (!card || card.userId !== userId) {
            throw new _common.NotFoundException('Card not found');
        }
        if (!wallet) {
            throw new _common.BadRequestException('Wallet not found');
        }
        const amount = new _library.Decimal(amountNum);
        // Compute current available card balance for this card (topups - withdrawals)
        const [topupAgg, withdrawAgg] = await Promise.all([
            this.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    cardId: card.id,
                    type: 'CARD_TOPUP',
                    status: 'COMPLETED'
                }
            }),
            this.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    cardId: card.id,
                    type: 'WITHDRAWAL',
                    status: 'COMPLETED'
                }
            })
        ]);
        const current = new _library.Decimal(topupAgg._sum.amount || 0).sub(new _library.Decimal(withdrawAgg._sum.amount || 0));
        if (current.lt(amount)) {
            throw new _common.BadRequestException('Insufficient card balance');
        }
        const result = await this.prisma.$transaction(async (tx)=>{
            const walletBefore = wallet.balance;
            const walletAfter = walletBefore.add(amount);
            await tx.wallet.update({
                where: {
                    userId
                },
                data: {
                    balance: walletAfter
                }
            });
            const txRec = await tx.transaction.create({
                data: {
                    userId,
                    type: 'WITHDRAWAL',
                    status: 'COMPLETED',
                    amount,
                    currency: wallet.currency,
                    balanceBefore: walletBefore,
                    balanceAfter: walletAfter,
                    description: `Withdrawal from ${card.cardBrand} ${card.cardType} card to wallet`,
                    reference: `CARDWDR-${Date.now()}-${cardId.substring(0, 8)}`,
                    cardId: card.id
                }
            });
            return {
                walletAfter,
                txId: txRec.id
            };
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Card Withdrawal',
                message: `You withdrew ${amountNum} ${wallet.currency} from your card to wallet.`,
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Withdrawal successful',
            transactionId: result.txId
        };
    }
    // Deterministic demo PAN generator (do NOT use in production)
    generatePan(brand, seed, last4) {
        const prefix = brand === 'MASTERCARD' ? '5' : '4';
        const hash = _crypto.createHash('sha256').update(seed).digest('hex');
        const digits = [];
        for(let i = 0; digits.length < 15; i += 2){
            digits.push(parseInt(hash.substring(i, i + 2), 16) % 10);
        }
        // Set first and last4
        const pan = new Array(16).fill(0);
        pan[0] = Number(prefix);
        for(let i = 1; i < 12; i++)pan[i] = digits[i] % 10;
        // place last 4
        const l4 = (last4 || '0000').padStart(4, '0');
        pan[12] = Number(l4[0]);
        pan[13] = Number(l4[1]);
        pan[14] = Number(l4[2]);
        // compute Luhn check for first 15 digits, then set last digit
        const check = (arr)=>{
            let sum = 0;
            for(let i = 0; i < 15; i++){
                let d = arr[14 - i]; // right to left excluding check
                if (i % 2 === 0) {
                    d *= 2;
                    if (d > 9) d -= 9;
                }
                sum += d;
            }
            return (10 - sum % 10) % 10;
        };
        pan[15] = check(pan);
        const s = pan.join('').replace(/(.{4})/g, '$1 ').trim();
        return s;
    }
    async userGetPan(cardId, userId) {
        const card = await this.prisma.card.findUnique({
            where: {
                id: cardId
            }
        });
        if (!card || card.userId !== userId) {
            throw new _common.NotFoundException('Card not found');
        }
        const last4 = (card.cardNumber || '').slice(-4);
        const pan = this.generatePan(card.cardBrand, card.providerCardId || card.id, last4);
        return {
            brand: card.cardBrand,
            pan,
            cvv: card.cvv,
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
CardsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CardsService);

//# sourceMappingURL=cards.service.js.map