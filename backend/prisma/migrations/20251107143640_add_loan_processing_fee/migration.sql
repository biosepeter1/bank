-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LoanStatus" ADD VALUE 'FEE_PENDING';
ALTER TYPE "LoanStatus" ADD VALUE 'FEE_PAID';

-- AlterTable
ALTER TABLE "loan_applications" ADD COLUMN     "cryptoType" TEXT,
ADD COLUMN     "cryptoWalletAddress" TEXT,
ADD COLUMN     "feeDescription" TEXT,
ADD COLUMN     "feePaidAt" TIMESTAMP(3),
ADD COLUMN     "feePaymentProof" TEXT,
ADD COLUMN     "feeRequestedAt" TIMESTAMP(3),
ADD COLUMN     "feeVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "feeVerifiedBy" TEXT,
ADD COLUMN     "processingFee" DECIMAL(15,2);
