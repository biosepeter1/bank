"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoansService", {
    enumerable: true,
    get: function() {
        return LoansService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _library = require("@prisma/client/runtime/library");
const _emailservice = require("../../common/services/email.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoansService = class LoansService {
    /**
   * Apply for a loan
   */ async applyForLoan(userId, data) {
        // Check KYC verification and get wallet
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                kyc: true,
                wallet: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        if (!user.kyc || user.kyc.status !== 'APPROVED') {
            throw new _common.BadRequestException('KYC verification is required to apply for a loan. Please complete your KYC verification first.');
        }
        if (!user.wallet) {
            throw new _common.BadRequestException('User wallet not found');
        }
        // Validate amount
        if (new _library.Decimal(data.amount).lessThanOrEqualTo(0)) {
            throw new _common.BadRequestException('Invalid loan amount');
        }
        // Use user's wallet currency if not specified
        const currency = data.currency || user.wallet.currency;
        // Create application
        const application = await this.prisma.loanApplication.create({
            data: {
                userId,
                amount: new _library.Decimal(data.amount),
                currency,
                duration: data.duration,
                purpose: data.purpose,
                status: 'PENDING'
            }
        });
        // Notify user that application was received
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Loan Application Submitted',
                message: `Your loan application for ${data.amount} ${currency} was received and is pending review.`,
                type: 'INFO'
            }
        });
        return application;
    }
    /**
   * Get all loan applications for a user
   */ async getLoanApplications(userId) {
        return this.prisma.loanApplication.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /** Admin: list all applications */ async adminListApplications(status) {
        return this.prisma.loanApplication.findMany({
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
                        lastName: true
                    }
                }
            }
        });
    }
    /**
   * Get a specific loan application
   */ async getLoanApplication(userId, loanId) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan || loan.userId !== userId) {
            throw new _common.NotFoundException('Loan application not found');
        }
        return loan;
    }
    /**
   * Approve a loan application (Admin only)
   */ async approveLoan(loanId, adminId, data) {
        const loanApplication = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loanApplication) {
            throw new _common.NotFoundException('Loan not found');
        }
        if (loanApplication.status !== 'PENDING') {
            throw new _common.BadRequestException('Loan is not in pending status');
        }
        // Calculate interest rate (5.5% annual)
        const interestRate = new _library.Decimal('5.5');
        const monthlyRate = interestRate.div(12).div(100);
        // If approvalNote contains an accepted offer amount, use it; else current amount
        const acceptedAmount = this.parseAcceptedAmountFromNote(loanApplication.approvalNote);
        const amountForSchedule = acceptedAmount || loanApplication.amount;
        const monthlyPayment = this.calculateMonthlyPayment(amountForSchedule, monthlyRate, loanApplication.duration);
        // Next payment due in 30 days
        const nextPaymentDue = new Date();
        nextPaymentDue.setDate(nextPaymentDue.getDate() + 30);
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                amount: amountForSchedule,
                status: 'APPROVED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                approvalNote: data?.approvalNote ?? loanApplication.approvalNote,
                interestRate,
                monthlyPayment,
                nextPaymentDue
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: 'admin',
                actorRole: 'BANK_ADMIN',
                action: 'PAYMENT_COMPLETED',
                entity: 'LoanApplication',
                entityId: loanId,
                description: 'Loan approved'
            }
        });
        await this.prisma.notification.create({
            data: {
                userId: loanApplication.userId,
                title: 'Loan Approved',
                message: 'Your loan application has been approved. Disbursement will follow.',
                type: 'SUCCESS'
            }
        });
        // Keep two-step flow: approval first, disbursement is a separate action
        return updated;
    }
    /**
   * Reject a loan application (Admin only)
   */ async rejectLoan(loanId, adminId, data) {
        const loanApplication = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loanApplication) {
            throw new _common.NotFoundException('Loan not found');
        }
        if (loanApplication.status !== 'PENDING') {
            throw new _common.BadRequestException('Loan is not in pending status');
        }
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                status: 'REJECTED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                rejectionReason: data.rejectionReason
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: 'admin',
                actorRole: 'BANK_ADMIN',
                action: 'PAYMENT_FAILED',
                entity: 'LoanApplication',
                entityId: loanId,
                description: 'Loan rejected',
                metadata: {
                    reason: data.rejectionReason
                }
            }
        });
        await this.prisma.notification.create({
            data: {
                userId: loanApplication.userId,
                title: 'Loan Rejected',
                message: `Your loan was rejected. Reason: ${data.rejectionReason}`,
                type: 'ERROR'
            }
        });
        return updated;
    }
    /**
   * Request processing fee from user (Admin only)
   */ async requestProcessingFee(loanId, adminId, data) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            },
            include: {
                user: true
            }
        });
        if (!loan) {
            throw new _common.NotFoundException('Loan application not found');
        }
        if (loan.status !== 'PENDING') {
            throw new _common.BadRequestException('Loan must be in PENDING status to request fee');
        }
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                status: 'FEE_PENDING',
                processingFee: new _library.Decimal(data.processingFee),
                feeDescription: data.feeDescription,
                cryptoWalletAddress: data.cryptoWalletAddress,
                cryptoType: data.cryptoType,
                approvalNote: data.approvalNote,
                feeRequestedAt: new Date(),
                reviewedBy: adminId,
                reviewedAt: new Date()
            }
        });
        // Send email notification with better formatting
        try {
            if (loan.user.emailTransactions) {
                await this.emailService.sendGenericNotification({
                    email: loan.user.email,
                    title: '💳 Loan Processing Fee Required',
                    message: `Hi ${loan.user.firstName},<br><br>Your loan application for <strong>${loan.amount} ${loan.currency}</strong> has been reviewed and approved pending payment of a processing fee.<br><br>Please log in to your account to view the payment details, including the crypto wallet address and fee amount. Once you've made the payment, you'll need to upload proof of payment to complete your loan application.<br><br>Your loan will be disbursed shortly after fee verification.`,
                    actionLabel: 'View Loan Details',
                    actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/loans`
                });
            }
        } catch (error) {
            console.error('Failed to send loan fee request email:', error);
        }
        // Notify user in-app
        await this.prisma.notification.create({
            data: {
                userId: loan.userId,
                title: 'Loan Processing Fee Required',
                message: `Your loan application requires a processing fee. Please check your Loans page for payment details.`,
                type: 'INFO'
            }
        });
        return updated;
    }
    /**
   * User submits payment proof
   */ async submitFeePaymentProof(userId, loanId, proofUrl) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan || loan.userId !== userId) {
            throw new _common.NotFoundException('Loan application not found');
        }
        if (loan.status !== 'FEE_PENDING') {
            throw new _common.BadRequestException('Loan is not waiting for payment proof');
        }
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                status: 'FEE_PAID',
                feePaymentProof: proofUrl,
                feePaidAt: new Date()
            }
        });
        // Notify user
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Payment Proof Submitted',
                message: 'Your payment proof has been submitted and is under review.',
                type: 'SUCCESS'
            }
        });
        return updated;
    }
    /**
   * Admin verifies fee payment and approves loan
   */ async verifyFeeAndApproveLoan(loanId, adminId) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            },
            include: {
                user: true
            }
        });
        if (!loan) {
            throw new _common.NotFoundException('Loan application not found');
        }
        if (loan.status !== 'FEE_PAID') {
            throw new _common.BadRequestException('Payment proof must be submitted first');
        }
        // Calculate loan terms
        const interestRate = new _library.Decimal('5.5');
        const monthlyRate = interestRate.div(12).div(100);
        const monthlyPayment = this.calculateMonthlyPayment(loan.amount, monthlyRate, loan.duration);
        const nextPaymentDue = new Date();
        nextPaymentDue.setDate(nextPaymentDue.getDate() + 30);
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                status: 'APPROVED',
                feeVerifiedAt: new Date(),
                feeVerifiedBy: adminId,
                interestRate,
                monthlyPayment,
                nextPaymentDue
            }
        });
        // Send approval email
        try {
            if (loan.user.emailTransactions) {
                await this.emailService.sendLoanApprovedEmail({
                    email: loan.user.email,
                    firstName: loan.user.firstName,
                    loanAmount: loan.amount.toString(),
                    currency: loan.currency,
                    monthlyPayment: monthlyPayment.toString(),
                    duration: loan.duration,
                    interestRate: interestRate.toString()
                });
            }
        } catch (error) {
            console.error('Failed to send loan approval email:', error);
        }
        await this.prisma.notification.create({
            data: {
                userId: loan.userId,
                title: 'Loan Approved',
                message: 'Your payment has been verified and loan approved. Awaiting disbursement.',
                type: 'SUCCESS'
            }
        });
        return updated;
    }
    /**
   * Disburse a loan (Admin only)
   */ async disburseLoan(loanId, adminId) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                }
            }
        });
        if (!loan) {
            throw new _common.NotFoundException('Loan not found');
        }
        if (loan.status !== 'APPROVED') {
            throw new _common.BadRequestException('Loan must be approved before disbursement');
        }
        // Disburse using a transaction
        const result = await this.prisma.$transaction(async (tx)=>{
            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId: loan.userId
                },
                data: {
                    balance: {
                        increment: loan.amount
                    }
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: loan.userId,
                    type: 'DEPOSIT',
                    status: 'COMPLETED',
                    amount: loan.amount,
                    balanceBefore: updatedWallet.balance.sub(loan.amount),
                    balanceAfter: updatedWallet.balance,
                    description: `Loan disbursement for ${loan.purpose}`,
                    reference: `LOAN-${loanId}`
                }
            });
            // Update loan status
            const updated = await tx.loanApplication.update({
                where: {
                    id: loanId
                },
                data: {
                    status: 'ACTIVE',
                    disbursedAt: new Date(),
                    disbursedAmount: loan.amount
                }
            });
            // Audit log for admin
            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    actorEmail: 'admin',
                    actorRole: 'BANK_ADMIN',
                    action: 'PAYMENT_COMPLETED',
                    entity: 'LoanApplication',
                    entityId: loanId,
                    description: 'Loan disbursed'
                }
            });
            return updated;
        });
        await this.prisma.notification.create({
            data: {
                userId: loan.userId,
                title: 'Loan Disbursed',
                message: `Your loan of ${loan.amount} ${loan.currency} has been disbursed to your wallet.`,
                type: 'SUCCESS'
            }
        });
        // Send disbursement email
        try {
            if (loan.user.emailTransactions) {
                await this.emailService.sendLoanDisbursementEmail({
                    email: loan.user.email,
                    firstName: loan.user.firstName,
                    loanAmount: loan.amount.toString(),
                    currency: loan.currency,
                    monthlyPayment: loan.monthlyPayment?.toString() || 'N/A',
                    duration: loan.duration
                });
            }
        } catch (error) {
            console.error('Failed to send loan disbursement email:', error);
        }
        return result;
    }
    /**
   * Request a grant
   */ async requestGrant(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        return this.prisma.grant.create({
            data: {
                userId,
                type: data.type,
                amount: new _library.Decimal(data.amount),
                currency: data.currency || 'NGN',
                purpose: data.purpose,
                description: data.description,
                documentUrls: data.documentUrls || [],
                status: 'PENDING'
            }
        });
    }
    /**
   * Get all grants for a user
   */ async getGrants(userId) {
        return this.prisma.grant.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /**
   * Get a specific grant
   */ async getGrant(userId, grantId) {
        const grant = await this.prisma.grant.findUnique({
            where: {
                id: grantId
            }
        });
        if (!grant || grant.userId !== userId) {
            throw new _common.NotFoundException('Grant not found');
        }
        return grant;
    }
    /**
   * Approve a grant (Admin only)
   */ async approveGrant(grantId, adminId, approvalNote) {
        const grant = await this.prisma.grant.findUnique({
            where: {
                id: grantId
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                }
            }
        });
        if (!grant) {
            throw new _common.NotFoundException('Grant not found');
        }
        if (grant.status !== 'PENDING') {
            throw new _common.BadRequestException('Grant is not in pending status');
        }
        // Update grant and disburse to wallet
        const result = await this.prisma.$transaction(async (tx)=>{
            // Update grant status
            const updatedGrant = await tx.grant.update({
                where: {
                    id: grantId
                },
                data: {
                    status: 'APPROVED',
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                    approvalNote,
                    disbursedAt: new Date(),
                    disbursedAmount: grant.amount
                }
            });
            // Add to user wallet
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId: grant.userId
                },
                data: {
                    balance: {
                        increment: grant.amount
                    }
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: grant.userId,
                    type: 'DEPOSIT',
                    status: 'COMPLETED',
                    amount: grant.amount,
                    balanceBefore: updatedWallet.balance.sub(grant.amount),
                    balanceAfter: updatedWallet.balance,
                    description: `${grant.type} - ${grant.purpose}`,
                    reference: `GRANT-${grantId}`
                }
            });
            return updatedGrant;
        });
        return result;
    }
    /**
   * Reject a grant (Admin only)
   */ async rejectGrant(grantId, adminId, rejectionReason) {
        const grant = await this.prisma.grant.findUnique({
            where: {
                id: grantId
            }
        });
        if (!grant) {
            throw new _common.NotFoundException('Grant not found');
        }
        if (grant.status !== 'PENDING') {
            throw new _common.BadRequestException('Grant is not in pending status');
        }
        return this.prisma.grant.update({
            where: {
                id: grantId
            },
            data: {
                status: 'REJECTED',
                reviewedBy: adminId,
                reviewedAt: new Date(),
                rejectionReason
            }
        });
    }
    /**
   * Calculate monthly payment using amortization formula
   * Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
   * P = Principal, r = monthly rate, n = number of months
   */ calculateMonthlyPayment(principal, monthlyRate, months) {
        if (monthlyRate.eq(0)) {
            return principal.div(months);
        }
        const rPlusOne = monthlyRate.add(1);
        const rPlusOnePowN = rPlusOne.pow(months);
        const numerator = principal.mul(monthlyRate).mul(rPlusOnePowN);
        const denominator = rPlusOnePowN.sub(1);
        return numerator.div(denominator);
    }
    /** User: delete own application if not ACTIVE */ async deleteLoanApplication(userId, loanId) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan || loan.userId !== userId) throw new _common.NotFoundException('Loan application not found');
        if (loan.status === 'ACTIVE') throw new _common.BadRequestException('Cannot delete an active loan');
        await this.prisma.loanApplication.delete({
            where: {
                id: loanId
            }
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Loan Application Deleted',
                message: 'You deleted a non-active loan application.',
                type: 'INFO'
            }
        });
        return {
            message: 'Application deleted'
        };
    }
    /** User: repay loan from wallet */ async userRepayLoan(userId, loanId, amountNum) {
        if (!amountNum || amountNum <= 0) throw new _common.BadRequestException('Invalid amount');
        const [loan, wallet] = await Promise.all([
            this.prisma.loanApplication.findUnique({
                where: {
                    id: loanId
                }
            }),
            this.prisma.wallet.findUnique({
                where: {
                    userId
                }
            })
        ]);
        if (!loan || loan.userId !== userId) throw new _common.NotFoundException('Loan not found');
        if (loan.status !== 'ACTIVE') throw new _common.BadRequestException('Loan is not active');
        if (!wallet) throw new _common.BadRequestException('Wallet not found');
        const amount = new _library.Decimal(amountNum);
        if (wallet.balance.lt ? wallet.balance.lt(amount) : new _library.Decimal(wallet.balance).lt(amount)) {
            throw new _common.BadRequestException('Insufficient wallet balance');
        }
        // Remaining principal (simple rule: repay until reaching principal). You can extend to include interest.
        const principal = new _library.Decimal(loan.amount);
        const totalRepaid = new _library.Decimal(loan.totalRepaid || 0);
        const remaining = principal.sub(totalRepaid);
        if (remaining.lte(0)) throw new _common.BadRequestException('Loan already fully repaid');
        // Enforce minimum monthly payment when applicable (allow smaller final payment)
        const monthly = loan.monthlyPayment ? new _library.Decimal(loan.monthlyPayment) : null;
        if (monthly && remaining.gt(monthly) && amount.lt(monthly)) {
            throw new _common.BadRequestException(`Minimum repayment is ${monthly.toString()}`);
        }
        const pay = amount.gt(remaining) ? remaining : amount;
        const result = await this.prisma.$transaction(async (tx)=>{
            const walletBefore = wallet.balance;
            const walletAfter = walletBefore.sub(pay);
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
                    amount: pay,
                    currency: wallet.currency,
                    balanceBefore: walletBefore,
                    balanceAfter: walletAfter,
                    description: 'Loan repayment',
                    reference: `LOANREPAY-${Date.now()}-${loanId.substring(0, 8)}`,
                    transferId: null,
                    metadata: {
                        loanId
                    }
                }
            });
            const newTotal = totalRepaid.add(pay);
            const toUpdate = {
                totalRepaid: newTotal,
                lastPaymentAt: new Date()
            };
            if (newTotal.gte(principal)) {
                toUpdate.status = 'COMPLETED';
            } else {
                // set next payment due 30 days from now (simple plan)
                const next = new Date();
                next.setDate(next.getDate() + 30);
                toUpdate.nextPaymentDue = next;
            }
            await tx.loanApplication.update({
                where: {
                    id: loanId
                },
                data: toUpdate
            });
            return {
                txId: txRec.id,
                walletAfter
            };
        });
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Loan Repayment',
                message: `You repaid ${pay.toString()} ${wallet.currency}.`,
                type: 'SUCCESS'
            }
        });
        return {
            message: 'Repayment successful',
            amount: pay.toNumber()
        };
    }
    /** Admin proposes a revised loan offer (no schema change; embeds info in approvalNote) */ async proposeOffer(loanId, adminId, amount, note) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            },
            include: {
                user: true
            }
        });
        if (!loan) throw new _common.NotFoundException('Loan not found');
        if (loan.status !== 'PENDING') throw new _common.BadRequestException('Loan must be pending');
        const amt = new _library.Decimal(amount);
        if (amt.lte(0)) throw new _common.BadRequestException('Invalid amount');
        const message = `PROPOSED_AMOUNT=${amt.toString()};NOTE=${note || ''}`;
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                approvalNote: message,
                reviewedBy: adminId,
                reviewedAt: new Date()
            }
        });
        // Send in-app notification
        await this.prisma.notification.create({
            data: {
                userId: loan.userId,
                title: 'Loan Offer Proposed',
                message: `Admin proposed a revised amount of ${amt.toString()} ${loan.currency}. Please review and accept to proceed.`,
                type: 'INFO'
            }
        });
        // Send email notification
        try {
            if (loan.user.emailTransactions) {
                const noteSection = note ? `<br><br><strong>Note from our team:</strong><br>${note}` : '';
                await this.emailService.sendGenericNotification({
                    email: loan.user.email,
                    title: '💼 New Loan Offer Available',
                    message: `Hi ${loan.user.firstName},<br><br>We have reviewed your loan application for <strong>${loan.amount} ${loan.currency}</strong>.<br><br>Based on our assessment, we would like to offer you <strong style="color:#16a34a;font-size:18px">${amt.toString()} ${loan.currency}</strong> instead.${noteSection}<br><br>Please log in to your account to review the offer and choose to accept or decline. Once you accept, we'll proceed with the next steps.`,
                    actionLabel: 'Review Offer',
                    actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/loans`
                });
            }
        } catch (error) {
            console.error('Failed to send loan proposal email:', error);
        }
        return updated;
    }
    /** User accepts or declines proposed offer */ async userRespondToOffer(loanId, userId, action) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan || loan.userId !== userId) throw new _common.NotFoundException('Loan not found');
        if (loan.status !== 'PENDING') throw new _common.BadRequestException('Loan must be pending');
        const proposed = this.parseProposedAmountFromNote(loan.approvalNote);
        if (!proposed) throw new _common.BadRequestException('No offer to respond to');
        if (action === 'DECLINE') {
            const updated = await this.prisma.loanApplication.update({
                where: {
                    id: loanId
                },
                data: {
                    approvalNote: `${loan.approvalNote};USER_DECLINED=true`
                }
            });
            return updated;
        }
        // ACCEPT -> tag note so admin can approve
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                approvalNote: `${loan.approvalNote};USER_ACCEPTED=true`
            }
        });
        return updated;
    }
    parseProposedAmountFromNote(note) {
        if (!note) return null;
        const m = /PROPOSED_AMOUNT\s*=\s*([0-9.]+)/i.exec(note);
        if (!m) return null;
        try {
            return new _library.Decimal(m[1]);
        } catch  {
            return null;
        }
    }
    parseAcceptedAmountFromNote(note) {
        if (!note) return null;
        const accepted = /USER_ACCEPTED\s*=\s*true/i.test(note);
        if (!accepted) return null;
        return this.parseProposedAmountFromNote(note);
    }
    /** Get repayments and disbursement for a loan */ async getRepayments(userId, loanId) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan || loan.userId !== userId) throw new _common.NotFoundException('Loan not found');
        const last8 = loanId.substring(0, 8);
        const repayments = await this.prisma.transaction.findMany({
            where: {
                userId,
                type: 'WITHDRAWAL',
                OR: [
                    {
                        metadata: {
                            path: [
                                'loanId'
                            ],
                            equals: loanId
                        }
                    },
                    {
                        reference: {
                            contains: last8
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                amount: true,
                currency: true,
                createdAt: true,
                reference: true,
                description: true
            }
        });
        const disbursement = await this.prisma.transaction.findFirst({
            where: {
                userId,
                reference: `LOAN-${loanId}`
            },
            select: {
                id: true,
                amount: true,
                currency: true,
                createdAt: true,
                reference: true,
                description: true
            }
        });
        return {
            disbursement,
            repayments
        };
    }
    /** Admin: Update loan currency */ async updateLoanCurrency(loanId, adminId, currency) {
        const loan = await this.prisma.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
        if (!loan) throw new _common.NotFoundException('Loan not found');
        const validCurrencies = [
            'USD',
            'EUR',
            'GBP',
            'NGN',
            'JPY',
            'CAD',
            'AUD'
        ];
        if (!validCurrencies.includes(currency)) {
            throw new _common.BadRequestException(`Invalid currency. Must be one of: ${validCurrencies.join(', ')}`);
        }
        const updated = await this.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                currency
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: 'admin',
                actorRole: 'BANK_ADMIN',
                action: 'SETTINGS_CHANGED',
                entity: 'LoanApplication',
                entityId: loanId,
                description: `Updated loan currency from ${loan.currency} to ${currency}`
            }
        });
        return {
            message: 'Loan currency updated successfully',
            loan: updated
        };
    }
    constructor(prisma, emailService){
        this.prisma = prisma;
        this.emailService = emailService;
    }
};
LoansService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], LoansService);

//# sourceMappingURL=loans.service.js.map