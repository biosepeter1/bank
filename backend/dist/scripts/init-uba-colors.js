"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _client = require("@prisma/client");
const prisma = new _client.PrismaClient();
async function initUBAColors() {
    console.log('🎨 Setting up UBA brand colors...');
    try {
        // Set UBA as the bank
        await prisma.systemSetting.upsert({
            where: {
                key: 'general.bankCode'
            },
            update: {
                value: '033'
            },
            create: {
                key: 'general.bankCode',
                value: '033',
                description: 'Bank code'
            }
        });
        await prisma.systemSetting.upsert({
            where: {
                key: 'general.bankName'
            },
            update: {
                value: 'United Bank of Africa'
            },
            create: {
                key: 'general.bankName',
                value: 'United Bank of Africa',
                description: 'Bank name'
            }
        });
        await prisma.systemSetting.upsert({
            where: {
                key: 'general.siteName'
            },
            update: {
                value: 'United Bank of Africa'
            },
            create: {
                key: 'general.siteName',
                value: 'United Bank of Africa',
                description: 'Site name'
            }
        });
        // Set UBA brand colors (Red theme)
        await prisma.systemSetting.upsert({
            where: {
                key: 'general.brandPrimaryColor'
            },
            update: {
                value: '#8B0000'
            },
            create: {
                key: 'general.brandPrimaryColor',
                value: '#8B0000',
                description: 'Primary brand color for emails and UI'
            }
        });
        await prisma.systemSetting.upsert({
            where: {
                key: 'general.brandSecondaryColor'
            },
            update: {
                value: '#B30000'
            },
            create: {
                key: 'general.brandSecondaryColor',
                value: '#B30000',
                description: 'Secondary brand color for emails and UI'
            }
        });
        console.log('✅ UBA brand colors set successfully!');
        console.log('   Primary: #8B0000 (Dark Red)');
        console.log('   Secondary: #B30000 (Bright Red)');
        console.log('');
        console.log('🔄 Please restart your backend server to apply changes');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally{
        await prisma.$disconnect();
    }
}
initUBAColors();

//# sourceMappingURL=init-uba-colors.js.map