# 🔧 Backend API Implementation Guide for Dashboard

## Overview

This guide covers backend API endpoints, database schema extensions, and NestJS module implementations for dashboard features.

---

## 1. New Database Models

### 1.1 Loan & Grant Models

**Update**: `backend/prisma/schema.prisma`

```prisma
enum LoanStatus {
  PENDING
  APPROVED
  REJECTED
  ACTIVE
  COMPLETED
  DEFAULTED
}

enum GrantType {
  TAX_REFUND
  GOVERNMENT_GRANT
  BUSINESS_GRANT
  EDUCATIONAL_GRANT
}

model LoanApplication {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  amount          Decimal     @db.Decimal(15, 2)
  currency        String      @default("NGN")
  duration        Int         // Months
  purpose         String
  
  status          LoanStatus  @default(PENDING)
  
  // Admin Review
  reviewedBy      String?
  reviewedAt      DateTime?
  approvalNote    String?
  rejectionReason String?
  
  // Terms
  interestRate    Decimal?    @db.Decimal(5, 2)
  monthlyPayment  Decimal?    @db.Decimal(15, 2)
  
  // Disbursement
  disbursedAt     DateTime?
  disbursedAmount Decimal?    @db.Decimal(15, 2)
  
  // Repayment
  totalRepaid     Decimal     @default(0) @db.Decimal(15, 2)
  lastPaymentAt   DateTime?
  nextPaymentDue  DateTime?
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([status])
  @@map("loan_applications")
}

model Grant {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type            GrantType
  amount          Decimal     @db.Decimal(15, 2)
  currency        String      @default("NGN")
  
  purpose         String
  description     String?
  
  status          String      @default("PENDING") // PENDING, APPROVED, REJECTED, COMPLETED
  
  // Document uploads
  documentUrls    String[]    @default([])
  
  // Admin Review
  reviewedBy      String?
  reviewedAt      DateTime?
  approvalNote    String?
  rejectionReason String?
  
  // Disbursement
  disbursedAt     DateTime?
  disbursedAmount Decimal?    @db.Decimal(15, 2)
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([status])
  @@map("grants")
}

model Deposit {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  amount          Decimal     @db.Decimal(15, 2)
  currency        String      @default("NGN")
  
  depositMethod   String      // USDT, PAYPAL, BANK_TRANSFER, BITCOIN
  
  paymentProvider String      // PAYSTACK, FLUTTERWAVE, MANUAL
  providerRef     String?     @unique
  
  status          String      @default("PENDING") // PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
  
  // Proof
  proofUrl        String?
  
  // Transaction
  transactionId   String?
  transaction     Transaction? @relation(fields: [transactionId], references: [id])
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([providerRef])
  @@map("deposits")
}

model CurrencyExchange {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  fromCurrency    String
  toCurrency      String
  fromAmount      Decimal     @db.Decimal(15, 2)
  toAmount        Decimal     @db.Decimal(15, 2)
  exchangeRate    Decimal     @db.Decimal(15, 6)
  
  status          String      @default("COMPLETED") // PENDING, COMPLETED, FAILED
  
  feesApplied     Decimal     @default(0) @db.Decimal(15, 2)
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([createdAt])
  @@map("currency_exchanges")
}

// Update User model to include relations
// Add to existing User model:
// loans         LoanApplication[]
// grants        Grant[]
// deposits      Deposit[]
// currencySwaps CurrencyExchange[]
```

### 1.2 Beneficiary Model

**Add to Prisma schema**:

```prisma
model Beneficiary {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name            String
  accountNumber   String
  bankName        String
  bankCode        String?
  
  transferType    String      // INTERNAL, DOMESTIC, INTERNATIONAL
  
  // International details
  swiftCode       String?
  iban            String?
  routingNumber   String?
  country         String?
  
  isDefault       Boolean     @default(false)
  isVerified      Boolean     @default(false)
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@unique([userId, accountNumber])
  @@index([userId])
  @@map("beneficiaries")
}
```

---

## 2. New NestJS Modules

### 2.1 Transfers Module

**File**: `backend/src/modules/transfers/transfers.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TransfersService],
})
export class TransfersModule {}
```

**File**: `backend/src/modules/transfers/transfers.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService) {}

  async initiateLocalTransfer(userId: string, data: CreateTransferDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!sender) throw new BadRequestException('Sender not found');

    const receiver = await this.prisma.user.findUnique({
      where: { email: data.recipientEmail },
      include: { wallet: true },
    });

    if (!receiver) throw new BadRequestException('Recipient not found');

    const amount = new Decimal(data.amount);

    if (sender.wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Transaction: Create transfer + Update balances
    const transfer = await this.prisma.$transaction(async (tx) => {
      // Create transfer record
      const newTransfer = await tx.transfer.create({
        data: {
          senderId: userId,
          receiverId: receiver.id,
          transferType: 'INTERNAL',
          amount,
          currency: sender.wallet.currency,
          description: data.description,
          status: 'COMPLETED',
        },
      });

      // Debit sender
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Credit receiver
      await tx.wallet.update({
        where: { userId: receiver.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction records
      await tx.transaction.create({
        data: {
          userId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount,
          balanceBefore: sender.wallet.balance,
          balanceAfter: sender.wallet.balance.sub(amount),
          description: `Transfer to ${receiver.firstName} ${receiver.lastName}`,
          reference: `XFER-${Date.now()}`,
          transferId: newTransfer.id,
        },
      });

      await tx.transaction.create({
        data: {
          userId: receiver.id,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount,
          balanceBefore: receiver.wallet.balance,
          balanceAfter: receiver.wallet.balance.add(amount),
          description: `Transfer from ${sender.firstName} ${sender.lastName}`,
          reference: `XFER-${Date.now()}`,
          transferId: newTransfer.id,
        },
      });

      return newTransfer;
    });

    return transfer;
  }

  async initiateDomesticTransfer(userId: string, data: any) {
    // Validate transfer codes
    if (data.transferCodes && data.transferCodes.length > 0) {
      const validCodes = await this.validateTransferCodes(
        userId,
        data.transferCodes
      );
      if (!validCodes) {
        throw new BadRequestException('Invalid transfer codes');
      }
    }

    // Initiate payment gateway transfer
    const transfer = await this.prisma.transfer.create({
      data: {
        senderId: userId,
        transferType: 'DOMESTIC',
        amount: new Decimal(data.amount),
        currency: data.currency || 'NGN',
        description: data.description,
        status: 'PENDING',
        beneficiaryName: data.beneficiaryName,
        beneficiaryAccount: data.beneficiaryAccount,
        bankName: data.bankName,
        bankCode: data.bankCode,
      },
    });

    return transfer;
  }

  async validateTransferCodes(userId: string, codes: string[]): Promise<boolean> {
    // Check against user's transfer codes
    const transferCodes = await this.prisma.transferCode.findMany({
      where: {
        userId,
        code: { in: codes },
        isActive: true,
        isVerified: true,
      },
    });

    return transferCodes.length === codes.length;
  }

  async getBeneficiaries(userId: string) {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createBeneficiary(userId: string, data: CreateBeneficiaryDto) {
    return this.prisma.beneficiary.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async deleteBeneficiary(userId: string, beneficiaryId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (beneficiary?.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.prisma.beneficiary.delete({
      where: { id: beneficiaryId },
    });
  }
}
```

**File**: `backend/src/modules/transfers/transfers.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private transfersService: TransfersService) {}

  @Post('local')
  async initiateLocalTransfer(
    @Request() req,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transfersService.initiateLocalTransfer(
      req.user.id,
      createTransferDto,
    );
  }

  @Post('international')
  async initiateInternationalTransfer(
    @Request() req,
    @Body() data: any,
  ) {
    return this.transfersService.initiateDomesticTransfer(req.user.id, data);
  }

  @Get('beneficiaries')
  async getBeneficiaries(@Request() req) {
    return this.transfersService.getBeneficiaries(req.user.id);
  }

  @Post('beneficiaries')
  async createBeneficiary(
    @Request() req,
    @Body() data: CreateBeneficiaryDto,
  ) {
    return this.transfersService.createBeneficiary(req.user.id, data);
  }

  @Delete('beneficiaries/:id')
  async deleteBeneficiary(
    @Request() req,
    @Param('id') beneficiaryId: string,
  ) {
    return this.transfersService.deleteBeneficiary(req.user.id, beneficiaryId);
  }

  @Post('validate-codes')
  async validateCodes(
    @Request() req,
    @Body() { codes }: { codes: string[] },
  ) {
    const valid = await this.transfersService.validateTransferCodes(
      req.user.id,
      codes,
    );
    return { valid };
  }
}
```

### 2.2 Loans Module

**File**: `backend/src/modules/loans/loans.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLoanApplicationDto } from './dto/create-loan-application.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async applyForLoan(userId: string, data: CreateLoanApplicationDto) {
    // Validate amount
    if (new Decimal(data.amount).lessThanOrEqualTo(0)) {
      throw new BadRequestException('Invalid loan amount');
    }

    // Create application
    const application = await this.prisma.loanApplication.create({
      data: {
        userId,
        amount: new Decimal(data.amount),
        currency: data.currency || 'NGN',
        duration: data.duration,
        purpose: data.purpose,
        status: 'PENDING',
      },
    });

    // Notify admin
    // await this.emailService.notifyAdminNewLoan(application);

    return application;
  }

  async getLoanApplications(userId: string) {
    return this.prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLoanApplication(userId: string, loanId: string) {
    const loan = await this.prisma.loanApplication.findUnique({
      where: { id: loanId },
    });

    if (loan?.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return loan;
  }

  // Admin methods
  async approveLoan(loanId: string, adminId: string, approvalNote: string) {
    const interestRate = new Decimal('5.5'); // 5.5% annual
    const loanApplication = await this.prisma.loanApplication.findUnique({
      where: { id: loanId },
    });

    if (!loanApplication) throw new BadRequestException('Loan not found');

    const monthlyRate = interestRate.div(12).div(100);
    const monthlyPayment = this.calculateMonthlyPayment(
      loanApplication.amount,
      monthlyRate,
      loanApplication.duration,
    );

    return this.prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        status: 'APPROVED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        approvalNote,
        interestRate,
        monthlyPayment,
      },
    });
  }

  async rejectLoan(
    loanId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    return this.prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        status: 'REJECTED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        rejectionReason,
      },
    });
  }

  private calculateMonthlyPayment(
    principal: Decimal,
    monthlyRate: Decimal,
    months: number,
  ): Decimal {
    // Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const numerator = principal.mul(monthlyRate).mul(
      new Decimal(1).add(monthlyRate).pow(months),
    );
    const denominator = new Decimal(1)
      .add(monthlyRate)
      .pow(months)
      .sub(1);
    return numerator.div(denominator);
  }
}
```

### 2.3 Deposits Module

**File**: `backend/src/modules/deposits/deposits.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DepositsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiateDeposit(userId: string, data: any) {
    const amount = new Decimal(data.amount);

    if (amount.lessThanOrEqualTo(0)) {
      throw new BadRequestException('Invalid deposit amount');
    }

    let deposit: any;

    if (data.method === 'PAYSTACK') {
      deposit = await this.initiatePaystackDeposit(userId, data);
    } else if (data.method === 'USDT') {
      deposit = await this.createUSDTDeposit(userId, data);
    } else {
      throw new BadRequestException('Unsupported deposit method');
    }

    return deposit;
  }

  private async initiatePaystackDeposit(userId: string, data: any) {
    const paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');
    const amount = new Decimal(data.amount);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    try {
      // Initialize Paystack transaction
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: user.email,
          amount: amount.mul(100).toNumber(), // Paystack uses kobo
          metadata: {
            userId,
            depositType: 'WALLET_DEPOSIT',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        },
      );

      const deposit = await this.prisma.deposit.create({
        data: {
          userId,
          amount,
          depositMethod: 'PAYSTACK',
          paymentProvider: 'PAYSTACK',
          providerRef: response.data.data.reference,
          status: 'PENDING',
        },
      });

      return {
        deposit,
        authorizationUrl: response.data.data.authorization_url,
      };
    } catch (error) {
      throw new BadRequestException('Failed to initiate Paystack payment');
    }
  }

  private async createUSDTDeposit(userId: string, data: any) {
    const deposit = await this.prisma.deposit.create({
      data: {
        userId,
        amount: new Decimal(data.amount),
        depositMethod: 'USDT',
        paymentProvider: 'MANUAL',
        status: 'PENDING',
      },
    });

    // Generate QR code or wallet address
    return {
      deposit,
      walletAddress: process.env.USDT_WALLET_ADDRESS,
      qrCode: null, // Generate QR code here
    };
  }

  async confirmPaystackDeposit(reference: string) {
    const paystackSecretKey = this.configService.get('PAYSTACK_SECRET_KEY');

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        },
      );

      if (response.data.data.status !== 'success') {
        throw new BadRequestException('Payment verification failed');
      }

      const deposit = await this.prisma.deposit.findUnique({
        where: { providerRef: reference },
      });

      if (!deposit) throw new BadRequestException('Deposit not found');

      // Create transaction and update wallet
      const tx = await this.prisma.$transaction(async (prisma) => {
        const updatedDeposit = await prisma.deposit.update({
          where: { id: deposit.id },
          data: { status: 'COMPLETED' },
        });

        const transaction = await prisma.transaction.create({
          data: {
            userId: deposit.userId,
            type: 'DEPOSIT',
            status: 'COMPLETED',
            amount: deposit.amount,
            description: 'Wallet deposit via Paystack',
            reference: `DEP-${Date.now()}`,
          },
        });

        await prisma.wallet.update({
          where: { userId: deposit.userId },
          data: {
            balance: {
              increment: deposit.amount,
            },
          },
        });

        return { deposit: updatedDeposit, transaction };
      });

      return tx;
    } catch (error) {
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async getDepositHistory(userId: string) {
    return this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

### 2.4 Currency Module

**File**: `backend/src/modules/currency/currency.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ExchangeRateService } from '@/common/services/exchange-rate.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CurrencyService {
  constructor(
    private prisma: PrismaService,
    private exchangeRateService: ExchangeRateService,
  ) {}

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    return this.exchangeRateService.getRate(fromCurrency, toCurrency);
  }

  async swapCurrency(
    userId: string,
    data: {
      fromCurrency: string;
      toCurrency: string;
      fromAmount: number;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    const rate = await this.exchangeRateService.getRate(
      data.fromCurrency,
      data.toCurrency,
    );

    const fromAmount = new Decimal(data.fromAmount);
    const toAmount = fromAmount.mul(new Decimal(rate));
    const fee = toAmount.mul(new Decimal('0.01')); // 1% fee
    const finalAmount = toAmount.sub(fee);

    // Transaction: Debit from wallet + Create exchange record
    const exchange = await this.prisma.$transaction(async (tx) => {
      // Update wallet currency if needed
      if (data.toCurrency !== user.wallet.currency) {
        await tx.wallet.update({
          where: { userId },
          data: {
            currency: data.toCurrency,
          },
        });
      }

      const record = await tx.currencyExchange.create({
        data: {
          userId,
          fromCurrency: data.fromCurrency,
          toCurrency: data.toCurrency,
          fromAmount,
          toAmount: finalAmount,
          exchangeRate: new Decimal(rate),
          feesApplied: fee,
        },
      });

      return record;
    });

    return exchange;
  }
}
```

---

## 3. DTOs (Data Transfer Objects)

### 3.1 Transfer DTOs

**File**: `backend/src/modules/transfers/dto/create-transfer.dto.ts`

```typescript
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsEmail()
  recipientEmail: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBeneficiaryDto {
  @IsString()
  name: string;

  @IsString()
  accountNumber: string;

  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsString()
  transferType: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL';

  @IsOptional()
  @IsString()
  swiftCode?: string;

  @IsOptional()
  @IsString()
  iban?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
```

### 3.2 Loan DTOs

**File**: `backend/src/modules/loans/dto/create-loan-application.dto.ts`

```typescript
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateLoanApplicationDto {
  @IsNumber()
  @Min(1000)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNumber()
  @Min(1)
  duration: number; // months

  @IsString()
  purpose: string;
}
```

---

## 4. Payment Gateway Integration

### 4.1 Paystack Webhook Handler

**File**: `backend/src/modules/deposits/paystack.webhook.ts`

```typescript
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { DepositsService } from './deposits.service';

@Controller('webhooks')
export class PaystackWebhookController {
  constructor(
    private depositsService: DepositsService,
    private configService: ConfigService,
  ) {}

  @Post('paystack')
  async handlePaystackWebhook(@Body() payload: any) {
    // Verify webhook signature
    const secret = this.configService.get('PAYSTACK_SECRET_KEY');
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    // In real implementation, verify the signature from request header
    // if (hash !== request.headers['x-paystack-signature']) {
    //   throw new BadRequestException('Invalid webhook signature');
    // }

    if (payload.event === 'charge.success') {
      await this.depositsService.confirmPaystackDeposit(
        payload.data.reference,
      );
    }

    return { status: 'ok' };
  }
}
```

---

## 5. Update App Module

**File**: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CardsModule } from './modules/cards/cards.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
// NEW MODULES
import { TransfersModule } from './modules/transfers/transfers.module';
import { LoansModule } from './modules/loans/loans.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionsModule,
    CardsModule,
    KycModule,
    PaymentsModule,
    AuditModule,
    AdminModule,
    TransfersModule,    // NEW
    LoansModule,        // NEW
    DepositsModule,     // NEW
    CurrencyModule,     // NEW
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 6. Database Migration

Create new migration:

```bash
cd backend
npx prisma migrate dev --name add_dashboard_models
```

---

## 7. API Response Models

### Success Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
```

### Error Response

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

---

## 8. Testing the Endpoints

### Create Transfer
```bash
curl -X POST http://localhost:3001/api/transfers/local \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "user@example.com",
    "amount": 1000,
    "description": "Payment for services"
  }'
```

### Apply for Loan
```bash
curl -X POST http://localhost:3001/api/loans/apply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "duration": 12,
    "purpose": "Business expansion"
  }'
```

### Initiate Deposit
```bash
curl -X POST http://localhost:3001/api/deposits/initiate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "method": "PAYSTACK",
    "currency": "NGN"
  }'
```

---

## 9. Security Considerations

1. **Rate Limiting**: Apply to all financial endpoints
   ```typescript
   @UseGuards(ThrottlerGuard)
   @Throttle(5, 60) // 5 requests per 60 seconds
   ```

2. **Validation**: Validate all inputs with DTOs
3. **Authorization**: Check user ownership of resources
4. **Encryption**: Encrypt sensitive data in database
5. **Audit Logging**: Log all financial transactions
6. **Transaction Isolation**: Use database transactions for money movements

---

## 10. Performance Optimization

1. **Database Indexes**: Add indexes on frequently queried fields
2. **Caching**: Cache exchange rates for 1 hour
3. **Pagination**: Implement pagination for list endpoints
4. **Query Optimization**: Use select to fetch only needed fields

---

## Quick Implementation Checklist

- [ ] Create Transfers module with local/international transfers
- [ ] Create Loans module with application workflow
- [ ] Create Deposits module with Paystack integration
- [ ] Create Currency module for swaps
- [ ] Update Prisma schema with new models
- [ ] Run database migration
- [ ] Implement webhook handlers for payment confirmations
- [ ] Add API documentation in Swagger
- [ ] Test all endpoints
- [ ] Add integration tests
- [ ] Deploy to staging environment
