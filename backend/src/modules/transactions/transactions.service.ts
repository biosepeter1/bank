import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  async getUserTransactions(userId: string, limit = 50) {
    const list = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        transfer: {
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            receiver: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });

    // Compute signedAmount per transaction on the server to avoid brittle UI heuristics
    const withSigned = list.map((tx) => {
      const amount = Number(tx.amount);
      const before = tx.balanceBefore == null ? null : Number(tx.balanceBefore as any);
      const after = tx.balanceAfter == null ? null : Number(tx.balanceAfter as any);

      const deltaKnown = before !== null && after !== null;
      const balanceIncreased = deltaKnown ? after! > before! : undefined;

      const lowerDesc = (tx as any).description?.toLowerCase?.() || '';

      let signedAmount = amount; // default positive
      switch (tx.type) {
        case 'DEPOSIT':
        case 'PAYMENT_GATEWAY_DEPOSIT':
        case 'REFUND':
        case 'INVESTMENT_MATURITY':
          signedAmount = amount; // credit
          break;
        case 'WITHDRAWAL':
        case 'PAYMENT_GATEWAY_WITHDRAWAL':
        case 'FEE':
        case 'CARD_PAYMENT':
        case 'INVESTMENT':
        case 'INVESTMENT_LIQUIDATION':
          signedAmount = -amount; // debit
          break;
        case 'TRANSFER':
          if (tx.transfer) {
            if (tx.transfer.receiver?.id === userId) signedAmount = amount; // received
            else if (tx.transfer.sender?.id === userId) signedAmount = -amount; // sent
            else signedAmount = amount; // default to credit if unsure
          } else if (deltaKnown) {
            signedAmount = balanceIncreased ? amount : -amount;
          }
          break;
        case 'ADJUSTMENT':
        default:
          if (deltaKnown) {
            signedAmount = balanceIncreased ? amount : -amount;
          } else if (lowerDesc.includes('debit')) {
            signedAmount = -amount;
          } else if (lowerDesc.includes('credit')) {
            signedAmount = amount;
          } else {
            signedAmount = amount; // default to credit
          }
      }

      return { ...tx, signedAmount } as any;
    });

    return withSigned;
  }

  async getTransactionById(id: string, userId: string) {
    return this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        transfer: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            receiver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        card: true,
      },
    });
  }

  async getAllTransactions(limit = 100) {
    const list = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        userId: true,
        type: true,
        amount: true,
        currency: true,
        status: true,
        description: true,
        createdAt: true,
        balanceBefore: true,
        balanceAfter: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        transfer: {
          select: {
            sender: { select: { id: true } },
            receiver: { select: { id: true } },
          },
        },
      },
    });

    const withSigned = list.map((tx: any) => {
      const amount = Number(tx.amount);
      const before = tx.balanceBefore == null ? null : Number(tx.balanceBefore);
      const after = tx.balanceAfter == null ? null : Number(tx.balanceAfter);
      const deltaKnown = before !== null && after !== null;
      const balanceIncreased = deltaKnown ? after! > before! : undefined;
      const lowerDesc = tx.description?.toLowerCase?.() || '';

      let signedAmount = amount;
      switch (tx.type) {
        case 'DEPOSIT':
        case 'PAYMENT_GATEWAY_DEPOSIT':
        case 'REFUND':
        case 'INVESTMENT_MATURITY':
          signedAmount = amount; break;
        case 'WITHDRAWAL':
        case 'PAYMENT_GATEWAY_WITHDRAWAL':
        case 'FEE':
        case 'CARD_PAYMENT':
        case 'INVESTMENT':
        case 'INVESTMENT_LIQUIDATION':
          signedAmount = -amount; break;
        case 'TRANSFER':
          if (tx.transfer) {
            if (tx.transfer.receiver?.id === tx.userId) signedAmount = amount;
            else if (tx.transfer.sender?.id === tx.userId) signedAmount = -amount;
            else if (deltaKnown) signedAmount = balanceIncreased ? amount : -amount;
            else signedAmount = amount;
          } else if (deltaKnown) {
            signedAmount = balanceIncreased ? amount : -amount;
          }
          break;
        case 'ADJUSTMENT':
        default:
          if (deltaKnown) signedAmount = balanceIncreased ? amount : -amount;
          else if (lowerDesc.includes('debit')) signedAmount = -amount;
          else if (lowerDesc.includes('credit')) signedAmount = amount;
          else signedAmount = amount;
      }

      return { ...tx, signedAmount };
    });

    return withSigned as any;
  }

  async getTransactionStats(userId: string) {
    // All-time completed transactions
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      select: {
        type: true,
        amount: true,
        balanceBefore: true,
        balanceAfter: true,
        createdAt: true,
        transfer: {
          select: {
            sender: { select: { id: true } },
            receiver: { select: { id: true } },
          },
        },
      },
    }) as any[];

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    // Current-month completed transactions
    const monthTx = transactions.filter(tx => tx.createdAt >= startOfMonth);

    const computeTotals = (list: typeof transactions) => {
      let income = 0;
      let expenses = 0;
      let deposits = 0;
      let withdrawals = 0;
      let transfersSent = 0;
      let transfersReceived = 0;

      list.forEach((tx: any) => {
        const amount = Number(tx.amount);
        const before = tx.balanceBefore == null ? null : Number(tx.balanceBefore);
        const after = tx.balanceAfter == null ? null : Number(tx.balanceAfter);
        const deltaKnown = before !== null && after !== null;
        const balanceIncreased = deltaKnown ? after! > before! : undefined;
        const lowerDesc = tx.description?.toLowerCase?.() || '';

        switch (tx.type) {
          case 'DEPOSIT':
          case 'PAYMENT_GATEWAY_DEPOSIT':
            deposits += amount;
            income += amount;
            break;
          case 'WITHDRAWAL':
          case 'PAYMENT_GATEWAY_WITHDRAWAL':
            withdrawals += amount;
            expenses += amount;
            break;
          case 'TRANSFER':
            if (tx.transfer) {
              if (tx.transfer.receiver?.id === userId) {
                transfersReceived += amount;
                income += amount;
              } else if (tx.transfer.sender?.id === userId) {
                transfersSent += amount;
                expenses += amount;
              } else if (deltaKnown) {
                if (balanceIncreased) { transfersReceived += amount; income += amount; }
                else { transfersSent += amount; expenses += amount; }
              } else {
                // fallback: assume credit
                transfersReceived += amount; income += amount;
              }
            } else if (deltaKnown) {
              if (balanceIncreased) { transfersReceived += amount; income += amount; }
              else { transfersSent += amount; expenses += amount; }
            }
            break;
          case 'ADJUSTMENT':
            if (deltaKnown) {
              if (balanceIncreased) income += amount; else expenses += amount;
            } else if (lowerDesc.includes('debit')) {
              expenses += amount;
            } else if (lowerDesc.includes('credit')) {
              income += amount;
            } else {
              income += amount; // default credit
            }
            break;
        }
      });

      return { income, expenses, deposits, withdrawals, transfersSent, transfersReceived };
    };

    const all = computeTotals(transactions);
    const month = computeTotals(monthTx);

    return {
      totalIncome: all.income,
      totalExpenses: all.expenses,
      totalDeposits: all.deposits,
      totalWithdrawals: all.withdrawals,
      totalTransfersSent: all.transfersSent,
      totalTransfersReceived: all.transfersReceived,
      transactionCount: transactions.length,
      thisMonthIncome: month.income,
      thisMonthExpenses: month.expenses,
      thisMonthNet: month.income - month.expenses,
      thisMonth: month.income - month.expenses,
    };
  }
  async getAdminTransactionStats() {
    const allTransactions = await this.prisma.transaction.findMany({
      select: {
        type: true,
        amount: true,
        status: true,
        balanceBefore: true,
        balanceAfter: true,
        createdAt: true,
        transfer: {
          select: {
            sender: { select: { id: true } },
            receiver: { select: { id: true } },
          },
        },
      },
    }) as any[];

    let totalVolume = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    allTransactions.forEach((tx) => {
      const amount = Number(tx.amount);

      // Count by status
      if (tx.status === 'PENDING') pending++;
      else if (tx.status === 'COMPLETED') approved++;
      else if (tx.status === 'FAILED') rejected++;

      // Calculate volume (sum of absolute amounts of all transactions)
      // We use absolute amount because volume represents total money moved
      totalVolume += Math.abs(amount);
    });

    return {
      totalVolume,
      totalTransactions: allTransactions.length,
      pending,
      approved,
      rejected,
    };
  }
}
