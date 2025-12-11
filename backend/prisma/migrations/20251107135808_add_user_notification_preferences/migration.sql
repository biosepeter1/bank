-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailSecurity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailTransactions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "smsSecurity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "smsTransactions" BOOLEAN NOT NULL DEFAULT true;
