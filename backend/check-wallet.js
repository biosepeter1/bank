require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkWallets() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    console.log('\n=== WALLETS IN DATABASE ===\n');
    wallets.forEach(wallet => {
      console.log(`User: ${wallet.user.firstName} ${wallet.user.lastName} (${wallet.user.email})`);
      console.log(`Balance: ${wallet.balance} ${wallet.currency}`);
      console.log(`User ID: ${wallet.userId}`);
      console.log('---');
    });

    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });

    console.log('\n=== RECENT TRANSACTIONS ===\n');
    transactions.forEach(tx => {
      console.log(`${tx.type} - ${tx.amount} ${tx.currency}`);
      console.log(`User: ${tx.user.email}`);
      console.log(`Status: ${tx.status}`);
      console.log(`Description: ${tx.description}`);
      console.log(`Date: ${tx.createdAt}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWallets();
