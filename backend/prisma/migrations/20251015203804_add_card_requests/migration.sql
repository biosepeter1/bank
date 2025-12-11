-- CreateEnum
CREATE TYPE "CardRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'CARD_REQUEST_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'CARD_REQUEST_APPROVED';
ALTER TYPE "AuditAction" ADD VALUE 'CARD_REQUEST_REJECTED';

-- CreateTable
CREATE TABLE "card_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL DEFAULT 'VIRTUAL',
    "status" "CardRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "cardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "card_requests_cardId_key" ON "card_requests"("cardId");

-- CreateIndex
CREATE INDEX "card_requests_userId_idx" ON "card_requests"("userId");

-- CreateIndex
CREATE INDEX "card_requests_status_idx" ON "card_requests"("status");

-- AddForeignKey
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
