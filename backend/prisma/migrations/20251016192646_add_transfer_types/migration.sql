-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('INTERNAL', 'DOMESTIC', 'INTERNATIONAL');

-- DropForeignKey
ALTER TABLE "public"."transfers" DROP CONSTRAINT "transfers_receiverId_fkey";

-- AlterTable
ALTER TABLE "transfers" ADD COLUMN     "bankCode" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "beneficiaryAccount" TEXT,
ADD COLUMN     "beneficiaryName" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "providerRef" TEXT,
ADD COLUMN     "providerResponse" JSONB,
ADD COLUMN     "routingNumber" TEXT,
ADD COLUMN     "swiftCode" TEXT,
ADD COLUMN     "transferType" "TransferType" NOT NULL DEFAULT 'INTERNAL',
ALTER COLUMN "receiverId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "transfers_transferType_idx" ON "transfers"("transferType");

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
