-- CreateEnum
CREATE TYPE "TransferCodeType" AS ENUM ('COT', 'IMF', 'TAX');

-- CreateTable
CREATE TABLE "transfer_codes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransferCodeType" NOT NULL,
    "code" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "activatedBy" TEXT,
    "activatedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transfer_codes_userId_idx" ON "transfer_codes"("userId");

-- CreateIndex
CREATE INDEX "transfer_codes_type_idx" ON "transfer_codes"("type");

-- CreateIndex
CREATE INDEX "transfer_codes_isActive_idx" ON "transfer_codes"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_codes_userId_type_key" ON "transfer_codes"("userId", "type");

-- AddForeignKey
ALTER TABLE "transfer_codes" ADD CONSTRAINT "transfer_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
