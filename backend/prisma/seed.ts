import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@rdn.bank' },
    update: {},
    create: {
      email: 'superadmin@rdn.bank',
      phone: '+234 900 000 0001',
      firstName: 'Super',
      lastName: 'Admin',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // Create wallet for Super Admin
  await prisma.wallet.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      balance: 0,
      currency: 'NGN',
    },
  });

  // Create Bank Admin
  const bankAdminPassword = await bcrypt.hash('BankAdmin@123', 10);
  const bankAdmin = await prisma.user.upsert({
    where: { email: 'admin@rdn.bank' },
    update: {},
    create: {
      email: 'admin@rdn.bank',
      phone: '+234 900 000 0002',
      firstName: 'Bank',
      lastName: 'Admin',
      password: bankAdminPassword,
      role: 'BANK_ADMIN',
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
  console.log('✅ Bank Admin created:', bankAdmin.email);

  // Create wallet for Bank Admin
  await prisma.wallet.upsert({
    where: { userId: bankAdmin.id },
    update: {},
    create: {
      userId: bankAdmin.id,
      balance: 0,
      currency: 'NGN',
    },
  });

  // Create Test User
  const testUserPassword = await bcrypt.hash('TestUser@123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      phone: '+234 801 234 5678',
      firstName: 'Test',
      lastName: 'User',
      password: testUserPassword,
      role: 'USER',
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
  console.log('✅ Test User created:', testUser.email);

  // Create wallet for Test User with initial balance
  await prisma.wallet.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      balance: 50000, // Initial balance for testing
      currency: 'NGN',
    },
  });

  // Create KYC for Test User (approved)
  await prisma.kYC.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      status: 'APPROVED',
      dateOfBirth: new Date('1990-01-01'),
      address: '123 Test Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '100001',
      idType: 'NIN',
      idNumber: '12345678901',
      submittedAt: new Date(),
      reviewedAt: new Date(),
    },
  });
  console.log('✅ KYC created for Test User');

  // Create Virtual Cards with different brands for Test User
  const cardBrands = [
    { brand: 'VISA', number: '4532', color: 'Blue' },
    { brand: 'MASTERCARD', number: '5425', color: 'Orange-Red' },
    { brand: 'AMERICAN_EXPRESS', number: '3782', color: 'Teal' },
    { brand: 'DISCOVER', number: '6011', color: 'Orange' },
  ];

  for (const { brand, number, color } of cardBrands) {
    await prisma.card.create({
      data: {
        userId: testUser.id,
        cardType: 'VIRTUAL',
        cardBrand: brand as any,
        status: 'ACTIVE',
        cardNumber: `${number} **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
        cardHolderName: `${testUser.firstName} ${testUser.lastName}`.toUpperCase(),
        expiryMonth: Math.floor(Math.random() * 12) + 1,
        expiryYear: new Date().getFullYear() + Math.floor(Math.random() * 3) + 1,
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        provider: 'MOCK',
        providerCardId: `mock_${brand.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });
    console.log(`✅ ${brand} virtual card created (${color} gradient)`);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Super Admin:');
  console.log('   Email: superadmin@rdn.bank');
  console.log('   Password: SuperAdmin@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Bank Admin:');
  console.log('   Email: admin@rdn.bank');
  console.log('   Password: BankAdmin@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Test User:');
  console.log('   Email: user@test.com');
  console.log('   Password: TestUser@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
