import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find a user to create notifications for (preferably the first user)
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('No users found. Please create a user first.');
    return;
  }

  console.log(`Creating test notifications for user: ${user.email}`);

  // Create different types of notifications
  const notifications = [
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
    {
      userId: user.id,
      title: 'Card Request Approved',
      message: 'Your virtual card request has been approved and is ready to use.',
      type: 'SUCCESS',
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification,
    });
  }

  console.log(`✓ Created ${notifications.length} test notifications`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
