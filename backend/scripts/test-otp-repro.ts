
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting OTP reproduction test...');

    try {
        // 1. Check if we can connect
        await prisma.$connect();
        console.log('Connected to database.');

        // 2. Find a user to attach OTP to
        const user = await prisma.user.findFirst();
        if (!user) {
            console.error('No users found in DB. Cannot test OTP creation.');
            return;
        }
        console.log(`Found user: ${user.email} (${user.id})`);

        // 3. Try to create an OTP
        const code = '123456';
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        console.log('Attempting to create OtpCode...');
        const otp = await prisma.otpCode.create({
            data: {
                userId: user.id,
                purpose: 'TEST_RESET',
                codeHash,
                expiresAt,
                metadata: { test: true },
            },
        });

        console.log('OTP created successfully:', otp.id);
        console.log('Test PASSED: OtpCode table exists and is writable.');

        // Cleanup
        await prisma.otpCode.delete({ where: { id: otp.id } });
        console.log('Cleanup successful.');

    } catch (error: any) {
        console.error('Test FAILED:', error);
        if (error.code === 'P2021') {
            console.error('ERROR: Table does not exist in the current database.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
