"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SettingsService", {
    enumerable: true,
    get: function() {
        return SettingsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SettingsService = class SettingsService {
    async getSettings() {
        // Fetch all settings from database
        const settings = await this.prisma.systemSetting.findMany();
        // Convert to structured format
        const settingsMap = settings.reduce((acc, setting)=>{
            acc[setting.key] = setting.value;
            return acc;
        }, {});
        // Parse and return structured settings
        return {
            general: {
                siteName: settingsMap['general.siteName'] || 'Banking Platform',
                siteDescription: settingsMap['general.siteDescription'] || 'Digital Banking Solution',
                logo: settingsMap['general.logo'] || '/logo.png',
                favicon: settingsMap['general.favicon'] || '/favicon.ico',
                supportEmail: settingsMap['general.supportEmail'] || 'support@bank.com',
                supportPhone: settingsMap['general.supportPhone'] || '+234 800 000 0000',
                bankName: settingsMap['general.bankName'] || 'United Bank of Africa',
                bankCode: settingsMap['general.bankCode'] || '033',
                brandPrimaryColor: settingsMap['general.brandPrimaryColor'] || '#4F46E5',
                brandSecondaryColor: settingsMap['general.brandSecondaryColor'] || '#7C3AED'
            },
            email: {
                provider: settingsMap['email.provider'] || 'SMTP',
                smtpHost: settingsMap['email.smtpHost'] || '',
                smtpPort: parseInt(settingsMap['email.smtpPort'] || '587'),
                smtpUser: settingsMap['email.smtpUser'] || '',
                smtpPass: settingsMap['email.smtpPass'] || '',
                fromAddress: settingsMap['email.fromAddress'] || settingsMap['general.supportEmail'] || 'noreply@bank.com',
                fromName: settingsMap['email.fromName'] || settingsMap['general.siteName'] || 'Banking Platform'
            },
            payment: {
                usdtWalletAddress: settingsMap['payment.usdtWalletAddress'] || '',
                btcWalletAddress: settingsMap['payment.btcWalletAddress'] || '',
                bankName: settingsMap['payment.bankName'] || 'Bank',
                accountNumber: settingsMap['payment.accountNumber'] || '',
                accountName: settingsMap['payment.accountName'] || 'Banking Platform'
            },
            security: {
                enableTransferCodes: settingsMap['security.enableTransferCodes'] === 'true',
                enableTwoFactor: settingsMap['security.enableTwoFactor'] === 'true',
                maxLoginAttempts: parseInt(settingsMap['security.maxLoginAttempts'] || '5'),
                sessionTimeout: parseInt(settingsMap['security.sessionTimeout'] || '30'),
                requireKycForTransactions: settingsMap['security.requireKycForTransactions'] === 'true',
                requireKycForCards: settingsMap['security.requireKycForCards'] === 'true'
            },
            notifications: {
                emailNotifications: settingsMap['notifications.emailNotifications'] === 'true',
                smsNotifications: settingsMap['notifications.smsNotifications'] === 'true',
                pushNotifications: settingsMap['notifications.pushNotifications'] === 'true',
                transactionAlerts: settingsMap['notifications.transactionAlerts'] === 'true',
                securityAlerts: settingsMap['notifications.securityAlerts'] === 'true'
            },
            limits: {
                minDeposit: parseFloat(settingsMap['limits.minDeposit'] || '1000'),
                maxDeposit: parseFloat(settingsMap['limits.maxDeposit'] || '10000000'),
                minWithdrawal: parseFloat(settingsMap['limits.minWithdrawal'] || '1000'),
                maxWithdrawal: parseFloat(settingsMap['limits.maxWithdrawal'] || '5000000'),
                minTransfer: parseFloat(settingsMap['limits.minTransfer'] || '100'),
                maxTransfer: parseFloat(settingsMap['limits.maxTransfer'] || '5000000'),
                dailyTransferLimit: parseFloat(settingsMap['limits.dailyTransferLimit'] || '10000000')
            }
        };
    }
    async updateSettings(updateSettingsDto) {
        const settingsToUpdate = [];
        let shouldSyncBrandColors = false;
        // General settings
        if (updateSettingsDto.general) {
            Object.entries(updateSettingsDto.general).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `general.${key}`,
                    value: String(value)
                });
                // Check if bank code or name changed - need to sync colors
                if (key === 'bankCode' || key === 'bankName') {
                    shouldSyncBrandColors = true;
                }
            });
        }
        // Payment settings
        if (updateSettingsDto.payment) {
            Object.entries(updateSettingsDto.payment).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `payment.${key}`,
                    value: String(value)
                });
            });
        }
        // Security settings
        if (updateSettingsDto.security) {
            Object.entries(updateSettingsDto.security).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `security.${key}`,
                    value: String(value)
                });
            });
        }
        // Email settings
        if (updateSettingsDto.email) {
            Object.entries(updateSettingsDto.email).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `email.${key}`,
                    value: String(value)
                });
            });
        }
        // Notification settings
        if (updateSettingsDto.notifications) {
            Object.entries(updateSettingsDto.notifications).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `notifications.${key}`,
                    value: String(value)
                });
            });
        }
        // Limit settings
        if (updateSettingsDto.limits) {
            Object.entries(updateSettingsDto.limits).forEach(([key, value])=>{
                settingsToUpdate.push({
                    key: `limits.${key}`,
                    value: String(value)
                });
            });
        }
        // Update or create each setting
        for (const setting of settingsToUpdate){
            await this.prisma.systemSetting.upsert({
                where: {
                    key: setting.key
                },
                update: {
                    value: setting.value
                },
                create: {
                    key: setting.key,
                    value: setting.value
                }
            });
        }
        // Auto-sync brand colors if bank changed
        if (shouldSyncBrandColors) {
            await this.syncBrandColors();
        }
        return {
            message: 'Settings updated successfully',
            settings: await this.getSettings()
        };
    }
    async syncBrandColors() {
        // Get current bank code
        const bankCodeSetting = await this.prisma.systemSetting.findUnique({
            where: {
                key: 'general.bankCode'
            }
        });
        const bankCode = bankCodeSetting?.value || '011';
        // Brand color mapping
        const brandColors = {
            '011': {
                primary: '#00416A',
                secondary: '#00B4D8'
            },
            '058': {
                primary: '#D4AF37',
                secondary: '#C5A028'
            },
            '033': {
                primary: '#8B0000',
                secondary: '#B30000'
            },
            '214': {
                primary: '#FF6B00',
                secondary: '#FF8533'
            },
            '215': {
                primary: '#1B5E20',
                secondary: '#2E7D32'
            },
            '057': {
                primary: '#004D40',
                secondary: '#00796B'
            },
            '044': {
                primary: '#1565C0',
                secondary: '#1976D2'
            }
        };
        const colors = brandColors[bankCode] || {
            primary: '#4F46E5',
            secondary: '#7C3AED'
        };
        // Update brand colors
        await this.prisma.systemSetting.upsert({
            where: {
                key: 'general.brandPrimaryColor'
            },
            update: {
                value: colors.primary
            },
            create: {
                key: 'general.brandPrimaryColor',
                value: colors.primary,
                description: 'Primary brand color for emails and UI'
            }
        });
        await this.prisma.systemSetting.upsert({
            where: {
                key: 'general.brandSecondaryColor'
            },
            update: {
                value: colors.secondary
            },
            create: {
                key: 'general.brandSecondaryColor',
                value: colors.secondary,
                description: 'Secondary brand color for emails and UI'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
SettingsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], SettingsService);

//# sourceMappingURL=settings.service.js.map