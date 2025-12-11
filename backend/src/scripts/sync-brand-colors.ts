import { PrismaClient } from '@prisma/client';
import { getBankBrandingByCodeOrName } from '../../../frontend/lib/data/bank-branding';

const prisma = new PrismaClient();

async function syncBrandColors() {
  try {
    // Get bank code from settings
    const bankCodeSetting = await prisma.systemSetting.findUnique({
      where: { key: 'general.bankCode' },
    });

    const bankNameSetting = await prisma.systemSetting.findUnique({
      where: { key: 'general.bankName' },
    });

    const bankCode = bankCodeSetting?.value || '011';
    const bankName = bankNameSetting?.value || 'First Bank of Nigeria';

    console.log(`🏦 Syncing brand colors for: ${bankName} (${bankCode})`);

    // Get branding from frontend data (you'll need to implement this)
    // For now, let's use a mapping
    const brandColors: Record<string, { primary: string; secondary: string }> = {
      '011': { primary: '#00416A', secondary: '#00B4D8' }, // First Bank
      '058': { primary: '#D4AF37', secondary: '#C5A028' }, // GTBank
      '033': { primary: '#8B0000', secondary: '#B30000' }, // UBA
      '214': { primary: '#FF6B00', secondary: '#FF8533' }, // FCMB
      '215': { primary: '#1B5E20', secondary: '#2E7D32' }, // Unity Bank
    };

    const colors = brandColors[bankCode] || { primary: '#4F46E5', secondary: '#7C3AED' };

    // Update or create brand color settings
    await prisma.systemSetting.upsert({
      where: { key: 'general.brandPrimaryColor' },
      update: { value: colors.primary },
      create: {
        key: 'general.brandPrimaryColor',
        value: colors.primary,
        description: 'Primary brand color for emails and UI',
      },
    });

    await prisma.systemSetting.upsert({
      where: { key: 'general.brandSecondaryColor' },
      update: { value: colors.secondary },
      create: {
        key: 'general.brandSecondaryColor',
        value: colors.secondary,
        description: 'Secondary brand color for emails and UI',
      },
    });

    console.log(`✅ Brand colors synced successfully!`);
    console.log(`   Primary: ${colors.primary}`);
    console.log(`   Secondary: ${colors.secondary}`);
  } catch (error) {
    console.error('❌ Failed to sync brand colors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncBrandColors();
