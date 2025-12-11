-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'NG',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NGN';
