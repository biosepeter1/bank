import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserCurrency() {
  const email = process.argv[2];
  const newCurrency = process.argv[3];

  if (!email || !newCurrency) {
    console.error('Usage: ts-node scripts/update-user-currency.ts <email> <currency>');
    console.error('Example: ts-node scripts/update-user-currency.ts alliansmart@gmail.com USD');
    process.exit(1);
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    // Update user and wallet currency in a transaction
    await prisma.$transaction(async (tx) => {
      // Update user currency
      await tx.user.update({
        where: { id: user.id },
        data: { currency: newCurrency },
      });

      // Update wallet currency if exists
      if (user.wallet) {
        await tx.wallet.update({
          where: { userId: user.id },
          data: { currency: newCurrency },
        });
      }
    });

    console.log(`✅ Successfully updated currency for ${email}`);
    console.log(`   User currency: ${user.currency} → ${newCurrency}`);
    if (user.wallet) {
      console.log(`   Wallet currency: ${user.wallet.currency} → ${newCurrency}`);
      console.log(`   Wallet balance: ${user.wallet.balance} ${newCurrency}`);
    }
  } catch (error) {
    console.error('❌ Error updating currency:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserCurrency();
