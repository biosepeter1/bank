import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔧 Starting user role fix...\n');

    // Get all users with their current roles
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accountStatus: true,
      },
    });

    console.log(`📊 Found ${allUsers.length} users in database\n`);

    // List of admin emails (you can modify this)
    const adminEmails = [
      'admin@rdnbank.com',
      'superadmin@rdnbank.com',
    ];

    let fixed = 0;
    let alreadyCorrect = 0;

    for (const user of allUsers) {
      const shouldBeAdmin = adminEmails.includes(user.email.toLowerCase());
      const currentRole = user.role;
      const correctRole = shouldBeAdmin ? 'BANK_ADMIN' : 'USER';

      if (currentRole !== correctRole) {
        console.log(`🔄 Fixing: ${user.email}`);
        console.log(`   Current role: ${currentRole}`);
        console.log(`   Correct role: ${correctRole}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { role: correctRole },
        });

        console.log(`   ✅ Fixed!\n`);
        fixed++;
      } else {
        console.log(`✓ ${user.email} - ${currentRole} (Correct)`);
        alreadyCorrect++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   Already correct: ${alreadyCorrect}`);
    console.log(`   Fixed: ${fixed}`);
    console.log('\n✅ User role fix completed!\n');

    // Verify the specific user
    const targetUser = await prisma.user.findUnique({
      where: { email: 'biosejohn@gmail.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accountStatus: true,
      },
    });

    if (targetUser) {
      console.log('🎯 Target user (biosejohn@gmail.com) status:');
      console.log(`   Name: ${targetUser.firstName} ${targetUser.lastName}`);
      console.log(`   Email: ${targetUser.email}`);
      console.log(`   Role: ${targetUser.role}`);
      console.log(`   Status: ${targetUser.accountStatus}`);
      
      if (targetUser.role === 'USER') {
        console.log('   ✅ Role is correct!\n');
      } else {
        console.log('   ⚠️  Role needs to be USER\n');
      }
    } else {
      console.log('⚠️  User biosejohn@gmail.com not found in database\n');
    }

  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();
