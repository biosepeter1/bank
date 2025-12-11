const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Find first user
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('No users found');
    return;
  }

  console.log(`Creating notifications for user: ${user.email}`);

  // Create test notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Welcome to RDN Banking!',
        message: 'Thank you for joining RDN Banking Platform. Your account has been successfully created.',
        type: 'SUCCESS',
      },
      {
        userId: user.id,
        title: 'Transaction Successful',
        message: 'Your transfer of ₦5,000 to John Doe has been completed successfully.',
        type: 'SUCCESS',
      },
      {
        userId: user.id,
        title: 'Security Alert',
        message: 'A new device logged into your account. If this wasn\'t you, please contact support immediately.',
        type: 'WARNING',
      },
      {
        userId: user.id,
        title: 'KYC Document Required',
        message: 'Please upload your identification documents to complete your account verification.',
        type: 'INFO',
      },
    ],
  });

  console.log('✓ Created 4 test notifications');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
