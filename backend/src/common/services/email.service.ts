import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../../modules/settings/settings.service';

interface Brand {
  name: string;
  logo: string;
  primary: string;
  secondary: string;
  supportEmail?: string;
  websiteUrl?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private cachedBrand: Brand | null = null;

  constructor(private readonly settingsService: SettingsService) {}

  private async getBrand(): Promise<Brand> {
    // Always fetch fresh to get latest brand colors
    try {
      const settings = await this.settingsService.getSettings();
      this.cachedBrand = {
        name: settings?.general?.siteName || 'Banking Platform',
        logo: settings?.general?.logo || 'https://dummyimage.com/120x120/4f46e5/ffffff&text=B',
        primary: settings?.general?.brandPrimaryColor || '#4F46E5',
        secondary: settings?.general?.brandSecondaryColor || '#7C3AED',
        supportEmail: settings?.general?.supportEmail || 'support@example.com',
        websiteUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      };
    } catch (_) {
      this.cachedBrand = { name: 'Banking Platform', logo: '', primary: '#4F46E5', secondary: '#7C3AED', supportEmail: 'support@example.com', websiteUrl: 'http://localhost:3000' };
    }
    return this.cachedBrand!;
  }

  async sendWelcomeEmail(params: {
    email: string;
    firstName: string;
    lastName: string;
    accountNumber: string;
  }): Promise<void> {
    const { email, firstName, lastName, accountNumber } = params;
    const brand = await this.getBrand();

    const subject = `Welcome to ${brand.name}`;
    const html = this.renderTemplate(brand, {
      title: 'Welcome!',
      intro: `Hi ${firstName} ${lastName}, your ${brand.name} account is ready.`,
      lines: [
        `Account Holder: ${firstName} ${lastName}`,
        `Account Number: ${accountNumber}`,
        `Login: ${(process.env.FRONTEND_URL || 'http://localhost:3000') + '/login'}`,
      ],
      cta: { label: 'Go to Dashboard', url: (process.env.FRONTEND_URL || 'http://localhost:3000') + '/dashboard' },
    });

    this.logSend(email, subject, html);
  }

  async sendAccountStatusEmail(params: {
    email: string;
    firstName: string;
    status: string;
    reason?: string;
  }): Promise<void> {
    const { email, firstName, status, reason } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · Account ${status}`;
    const html = this.renderTemplate(brand, {
      title: `Account ${status}`,
      intro: `Hello ${firstName}, your account status is now ${status}.`,
      lines: reason ? [`Reason: ${reason}`] : [],
    });
    this.logSend(email, subject, html);
  }

  async sendKycStatusEmail(params: {
    email: string;
    firstName: string;
    status: string;
    reason?: string;
  }): Promise<void> {
    const { email, firstName, status, reason } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · KYC ${status}`;
    const html = this.renderTemplate(brand, {
      title: `KYC ${status}`,
      intro: `Hi ${firstName}, your KYC is ${status}.`,
      lines: [status === 'APPROVED' ? 'You now have full access to all features.' : '', reason ? `Reason: ${reason}` : ''].filter(Boolean) as string[],
    });
    this.logSend(email, subject, html);
  }

  async sendOtpEmail(params: { email: string; firstName: string; code: string; purpose?: string }): Promise<void> {
    const { email, firstName, code, purpose } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · ${purpose || 'Verification'} Code`;
    
    const otpBox = `
      <div style="background:linear-gradient(135deg, ${brand.primary}08 0%, ${brand.secondary}08 100%);border:3px solid ${brand.primary}30;border-radius:16px;padding:32px 24px;margin:24px 0;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.08)">
        <div style="color:#64748b;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px">Your Verification Code</div>
        <div style="font-size:40px;font-weight:800;letter-spacing:12px;margin:16px 0;background:linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-shadow:0 4px 12px rgba(0,0,0,0.1)">${code}</div>
        <div style="width:60px;height:3px;background:linear-gradient(90deg, ${brand.primary} 0%, ${brand.secondary} 100%);margin:16px auto 12px;border-radius:2px"></div>
        <div style="color:#94a3b8;font-size:13px;font-weight:500">⏰ Expires in 5 minutes</div>
      </div>
    `;
    
    const html = this.renderTemplate(brand, {
      title: `🔐 ${purpose || 'Verification'} Code`,
      intro: `Hi ${firstName}, please use the verification code below to continue:`,
      lines: [
        otpBox,
        '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;margin:16px 0;border-radius:8px"><strong style="color:#92400e">⚠️ Security Note:</strong><br/><span style="color:#78350f;font-size:14px">Never share this code with anyone. Our team will never ask for your verification code.</span></div>',
      ],
    });
    this.logSend(email, subject, html);
  }

  async sendEmailVerificationCode(params: { email: string; firstName: string; code: string }): Promise<void> {
    const { email, firstName, code } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · Verify Your Email Address`;
    
    const verificationBox = `
      <div style="background:linear-gradient(135deg, ${brand.primary}10 0%, ${brand.secondary}10 100%);border:3px dashed ${brand.primary}50;border-radius:20px;padding:40px 32px;margin:24px 0;text-align:center;position:relative;overflow:hidden">
        <div style="position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:${brand.primary}15;border-radius:50%;filter:blur(30px)"></div>
        <div style="position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:${brand.secondary}15;border-radius:50%;filter:blur(30px)"></div>
        <div style="font-size:48px;margin-bottom:12px">📧</div>
        <div style="color:#64748b;font-size:14px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px">Email Verification Code</div>
        <div style="font-size:44px;font-weight:900;letter-spacing:14px;margin:20px 0;background:linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;position:relative;z-index:1">${code}</div>
        <div style="width:80px;height:4px;background:linear-gradient(90deg, ${brand.primary} 0%, ${brand.secondary} 100%);margin:20px auto 16px;border-radius:2px"></div>
        <div style="color:#94a3b8;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px"><span>⏱️</span> Valid for 5 minutes</div>
      </div>
    `;
    
    const html = this.renderTemplate(brand, {
      title: '✨ Verify Your Email',
      intro: `Hi ${firstName}! Welcome to ${brand.name}. Please verify your email address to activate your account.`,
      lines: [
        verificationBox,
        '<div style="text-align:center;margin:20px 0;padding:16px;background:#f8fafc;border-radius:12px"><strong style="color:#0f172a">Why verify?</strong><br/><span style="color:#64748b;font-size:14px">Email verification helps secure your account and enables important notifications.</span></div>',
        '<div style="background:#dcfce7;border:2px solid #16a34a;border-radius:12px;padding:12px 16px;margin:16px 0;text-align:center"><span style="color:#166534;font-size:13px;font-weight:600">✅ Complete verification to unlock all features</span></div>',
      ],
      cta: { label: 'Verify Email', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/profile` },
    });
    this.logSend(email, subject, html);
  }

  async sendPasswordResetEmail(params: { email: string; firstName: string; resetUrl: string }): Promise<void> {
    const { email, firstName, resetUrl } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · Reset your password`;
    const html = this.renderTemplate(brand, {
      title: 'Reset your password',
      intro: `Hi ${firstName}, click the button below to reset your password.`,
      cta: { label: 'Reset Password', url: resetUrl },
      lines: ['If you did not request this, please ignore this email.'],
    });
    this.logSend(email, subject, html);
  }

  async sendGenericNotification(params: { email: string; title: string; message: string; actionUrl?: string; actionLabel?: string }): Promise<void> {
    const { email, title, message, actionUrl, actionLabel } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · ${title}`;
    const html = this.renderTemplate(brand, {
      title,
      intro: message,
      cta: actionUrl ? { label: actionLabel || 'Open', url: actionUrl } : undefined,
    });
    this.logSend(email, subject, html);
  }

  async sendTransferCodeEmail(params: { email: string; firstName: string; type: 'COT'|'IMF'|'TAX'; code: string }): Promise<void> {
    const { email, firstName, type, code } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · ${type} Code Issued`;
    const html = this.renderTemplate(brand, {
      title: `${type} Verification Code`,
      intro: `Hi ${firstName}, your ${type} code has been approved and issued. Use this code for international transfers and keep it safe.`,
      lines: [
        `<div style=\"font-size:28px;font-weight:700;letter-spacing:6px;margin:12px 0\">${code}</div>`,
        'This code is linked to your account. Do not share it with anyone.',
      ],
    });
    this.logSend(email, subject, html);
  }

  async sendSupportTicketEmail(params: { email: string; firstName: string; ticketId: string; subject: string; message: string }): Promise<void> {
    const { email, firstName, ticketId, subject: ticketSubject, message } = params;
    const brand = await this.getBrand();
    const subject = `${brand.name} · Support Ticket #${ticketId}`;
    
    const ticketBox = `
      <div style="background:linear-gradient(135deg, ${brand.primary}08 0%, ${brand.secondary}08 100%);border:2px solid ${brand.primary}30;border-radius:16px;padding:24px;margin:24px 0;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px ${brand.primary}30">
              <span style="font-size:24px">🎫</span>
            </div>
            <div>
              <div style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">Support Ticket</div>
              <div style="color:#0f172a;font-size:18px;font-weight:700;margin-top:2px">#${ticketId}</div>
            </div>
          </div>
          <div style="padding:8px 16px;background:#dcfce7;border-radius:8px;border:2px solid #16a34a">
            <span style="color:#166534;font-size:13px;font-weight:700">✅ Received</span>
          </div>
        </div>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:16px">
          <div style="color:#64748b;font-size:12px;font-weight:600;margin-bottom:8px">SUBJECT</div>
          <div style="color:#0f172a;font-weight:600;font-size:15px;margin-bottom:16px">${ticketSubject}</div>
          <div style="color:#64748b;font-size:12px;font-weight:600;margin-bottom:8px">YOUR MESSAGE</div>
          <div style="color:#475569;font-size:14px;line-height:1.6">${message}</div>
        </div>
      </div>
    `;
    
    const html = this.renderTemplate(brand, {
      title: '🎯 Support Request Received',
      intro: `Hi ${firstName}, thank you for contacting us! We've received your support request and our team will respond shortly.`,
      lines: [
        ticketBox,
        '<div style="background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;text-align:center"><div style="color:#0f172a;font-weight:700;font-size:16px;margin-bottom:8px">⚡ Quick Response Time</div><div style="color:#64748b;font-size:14px">Our support team typically responds within 24 hours. You\'ll receive an email notification when we reply.</div></div>',
        `<div style="background:linear-gradient(135deg, ${brand.primary}08 0%, ${brand.secondary}08 100%);border-left:4px solid ${brand.primary};padding:16px 20px;border-radius:8px;margin:16px 0"><strong style="color:${brand.primary}">💡 Need urgent help?</strong><br/><span style="color:#64748b;font-size:14px">For urgent matters, please call us at ${brand.supportEmail || 'our support number'}.</span></div>`,
      ],
      cta: { label: 'View Ticket Status', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/support` },
    });
    this.logSend(email, subject, html);
  }

  async sendLoanFeeRequestEmail(params: {
    email: string;
    firstName: string;
    loanAmount: string;
    currency: string;
    processingFee: string;
    cryptoWalletAddress: string;
    cryptoType: string;
    feeDescription: string;
  }): Promise<void> {
    const { email, firstName, loanAmount, currency, processingFee, cryptoWalletAddress, cryptoType, feeDescription } = params;
    const brand = await this.getBrand();
    
    const subject = `${brand.name} · Loan Processing Fee Required`;
    const html = this.renderTemplate(brand, {
      title: '💳 Loan Processing Fee Required',
      intro: `Hi ${firstName}, your loan application for ${currency} ${loanAmount} has been reviewed.`,
      lines: [
        `<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:16px;margin:16px 0">
          <div style="color:#92400e;font-weight:700;font-size:16px;margin-bottom:8px">⚠️ Action Required</div>
          <div style="color:#78350f">${feeDescription}</div>
        </div>`,
        `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:16px 0">
          <div style="margin-bottom:12px"><strong>Processing Fee:</strong> <span style="color:#dc2626;font-size:18px;font-weight:700">${processingFee} ${cryptoType}</span></div>
          <div style="margin-bottom:8px"><strong>Crypto Type:</strong> ${cryptoType}</div>
          <div style="margin-bottom:8px"><strong>Wallet Address:</strong></div>
          <div style="background:#ffffff;border:1px solid #cbd5e1;padding:12px;border-radius:8px;font-family:monospace;word-break:break-all;font-size:13px">${cryptoWalletAddress}</div>
        </div>`,
        '<strong>Payment Instructions:</strong>',
        '1. Send the exact fee amount to the wallet address above',
        '2. Take a screenshot or save transaction ID as proof',
        '3. Return to your loan application and upload the payment proof',
        '4. Wait for admin verification and loan approval',
        '<em style="color:#64748b;font-size:13px">Note: Your loan will only be processed after fee payment verification.</em>',
      ],
      cta: { label: 'Upload Payment Proof', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/loans` },
    });
    this.logSend(email, subject, html);
  }

  async sendLoanApprovedEmail(params: {
    email: string;
    firstName: string;
    loanAmount: string;
    currency: string;
    monthlyPayment: string;
    duration: number;
    interestRate: string;
  }): Promise<void> {
    const { email, firstName, loanAmount, currency, monthlyPayment, duration, interestRate } = params;
    const brand = await this.getBrand();
    
    const subject = `${brand.name} · Loan Approved!`;
    const html = this.renderTemplate(brand, {
      title: '✅ Loan Approved',
      intro: `Great news ${firstName}! Your loan application has been approved.`,
      lines: [
        `<div style="background:#dcfce7;border:2px solid #16a34a;border-radius:12px;padding:16px;margin:16px 0">
          <div style="text-align:center">
            <div style="font-size:32px;margin-bottom:8px">✅</div>
            <div style="color:#166534;font-weight:700;font-size:18px">Loan Approved</div>
            <div style="color:#15803d;font-size:24px;font-weight:800;margin-top:8px">${currency} ${loanAmount}</div>
          </div>
        </div>`,
        '<strong>Loan Details:</strong>',
        `<strong>Amount:</strong> ${currency} ${loanAmount}`,
        `<strong>Duration:</strong> ${duration} months`,
        `<strong>Interest Rate:</strong> ${interestRate}% per annum`,
        `<strong>Monthly Payment:</strong> ${currency} ${monthlyPayment}`,
        '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin:16px 0;border-radius:4px">\n          <strong style="color:#92400e">Next Steps:</strong><br/>\n          <span style="color:#78350f">Your loan will be disbursed to your wallet shortly. You will receive a notification once funds are available.</span>\n        </div>',
      ],
      cta: { label: 'View Loan Details', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/loans` },
    });
    this.logSend(email, subject, html);
  }

  async sendLoanDisbursementEmail(params: {
    email: string;
    firstName: string;
    loanAmount: string;
    currency: string;
    monthlyPayment: string;
    duration: number;
  }): Promise<void> {
    const { email, firstName, loanAmount, currency, monthlyPayment, duration } = params;
    const brand = await this.getBrand();
    
    const subject = `${brand.name} · Loan Disbursed!`;
    const html = this.renderTemplate(brand, {
      title: '💰 Loan Disbursed',
      intro: `Hi ${firstName}, your loan has been successfully disbursed to your wallet!`,
      lines: [
        `<div style="background:#dcfce7;border:2px solid #16a34a;border-radius:12px;padding:20px;margin:16px 0;text-align:center">
          <div style="font-size:40px;margin-bottom:8px">💰</div>
          <div style="color:#166534;font-weight:700;font-size:16px;margin-bottom:8px">Funds Disbursed</div>
          <div style="color:#15803d;font-size:28px;font-weight:800">${currency} ${loanAmount}</div>
        </div>`,
        `<strong>Repayment Schedule:</strong>`,
        `<strong>Monthly Payment:</strong> ${currency} ${monthlyPayment}`,
        `<strong>Duration:</strong> ${duration} months`,
        `<strong>First Payment Due:</strong> 30 days from today`,
        '<div style="background:#fee2e2;border-left:4px solid #dc2626;padding:12px;margin:16px 0;border-radius:4px">\n          <strong style="color:#991b1b">Important:</strong><br/>\n          <span style="color:#7f1d1d">Please ensure timely monthly payments to maintain your credit standing. Late payments may incur penalties.</span>\n        </div>',
      ],
      cta: { label: 'View Wallet', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/dashboard` },
    });
    this.logSend(email, subject, html);
  }

  async sendTransactionEmail(params: {
    email: string;
    firstName: string;
    transactionType: string;
    amount: string;
    currency: string;
    balance: string;
    reference: string;
    description?: string;
  }): Promise<void> {
    const { email, firstName, transactionType, amount, currency, balance, reference, description } = params;
    const brand = await this.getBrand();
    
    const isCredit = ['DEPOSIT', 'PAYMENT_GATEWAY_DEPOSIT'].includes(transactionType) || (description || '').toLowerCase().includes('from');
    const title = isCredit ? 'Money Received' : 'Transaction Alert';
    const emoji = isCredit ? '💰' : '📤';
    const badgeBg = isCredit ? '#dcfce7' : '#fee2e2';
    const badgeText = isCredit ? '#166534' : '#991b1b';
    const badgeLabel = isCredit ? 'CREDIT' : 'DEBIT';
    
    const detailsCard = `
      <div style="margin-top:24px;border:2px solid #e2e8f0;border-radius:16px;padding:24px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px">
          <div style="display:inline-flex;gap:10px;align-items:center">
            <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${badgeBg};color:${badgeText};font-size:13px;font-weight:700;letter-spacing:0.05em">${badgeLabel}</span>
            <span style="color:#334155;font-weight:600;font-size:15px">${transactionType.replace('_', ' ')}</span>
          </div>
          <div style="color:${isCredit ? '#16a34a' : '#dc2626'};font-weight:800;font-size:22px">${isCredit ? '+' : '-'} ${currency} ${amount}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px">
            <div style="color:#64748b;font-size:13px;margin-bottom:8px;font-weight:600">Reference</div>
            <div style="color:#0f172a;font-weight:600;font-size:14px;word-break:break-all;line-height:1.5">${reference}</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px">
            <div style="color:#64748b;font-size:13px;margin-bottom:8px;font-weight:600">New Balance</div>
            <div style="color:#0f172a;font-weight:700;font-size:16px">${currency} ${balance}</div>
          </div>
          ${description ? `<div style=\"grid-column:1 / -1;background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:12px\"><div style=\"color:#64748b;font-size:13px;margin-bottom:8px;font-weight:600\">Description</div><div style=\"color:#0f172a;font-size:14px;line-height:1.6\">${description}</div></div>` : ''}
        </div>
      </div>
    `.trim();
    
    const subject = `${brand.name} · ${title}`;
    const html = this.renderTemplate(brand, {
      title: `${emoji} ${title}`,
      intro: `Hi ${firstName}, ${isCredit ? 'you have received a credit on' : 'a transaction was made on'} your account. See details below:`,
      lines: [detailsCard],
      cta: { label: 'View Transaction', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/transactions` },
    });
    this.logSend(email, subject, html);
  }

  private async logSend(to: string, subject: string, html: string) {
    // Attempt real send via SMTP if configured; otherwise log
    try {
      const brandSettings = await this.settingsService.getSettings();
      const emailCfg = brandSettings.email || {} as any;
      if (emailCfg.smtpHost && emailCfg.smtpUser && emailCfg.smtpPass) {
        // Lazy import to avoid hard dependency if not installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: emailCfg.smtpHost,
          port: Number(emailCfg.smtpPort) || 587,
          secure: Number(emailCfg.smtpPort) === 465, // true for 465
          auth: { user: emailCfg.smtpUser, pass: emailCfg.smtpPass },
        });
        await transporter.sendMail({
          from: `${emailCfg.fromName || brandSettings.general.siteName} <${emailCfg.fromAddress || brandSettings.general.supportEmail}>`,
          to,
          subject,
          html,
        });
        this.logger.log(`Email sent via SMTP to ${to}`);
        return;
      }
    } catch (e) {
      this.logger.warn(`SMTP send failed or not configured: ${e?.message || e}`);
    }

    // Fallback: log only
    this.logger.log(`Email (LOG) → ${to} | ${subject}`);
    this.logger.debug(html);
  }

  private renderTemplate(brand: Brand, opts: { title: string; intro: string; lines?: string[]; cta?: { label: string; url: string } }): string {
    const { title, intro, lines = [], cta } = opts;
    const primary = brand.primary;
    const secondary = brand.secondary;
    const textLines = lines.map((line) => (line.startsWith('<') ? line : `<p style=\"margin:0 0 14px;color:#475569;line-height:1.65;font-size:15px\">${line}</p>`)).join('');
    
    // Render intro - if it contains <br> tags, it's already formatted HTML
    const introHtml = intro.includes('<br>') || intro.includes('<strong>') 
      ? `<div style=\"margin:0 0 20px;color:#475569;line-height:1.7;font-size:15px\" class=\"dark-text-secondary\">${intro}</div>`
      : `<p style=\"margin:0 0 20px;color:#475569;line-height:1.6;font-size:15px\" class=\"dark-text-secondary\">${intro}</p>`;

    const button = cta
      ? `<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin:28px auto 0\"><tr><td align=\"center\" style=\"border-radius:12px;background:linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);box-shadow:0 10px 25px -5px ${primary}40, 0 8px 10px -6px ${primary}30;transition:all 0.3s ease\"><a href=\"${cta.url}\" target=\"_blank\" style=\"display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;line-height:1;border-radius:12px;letter-spacing:0.02em\">${cta.label}</a></td></tr></table>`
      : '';

    const support = brand.supportEmail
      ? `<p style=\"margin:0 0 8px;color:#64748b;font-size:13px;line-height:1.5\">Questions? Contact us at <a href=\"mailto:${brand.supportEmail}\" style=\"color:${primary};text-decoration:none;font-weight:500\">${brand.supportEmail}</a></p>`
      : '';

    const logoBlock = brand.logo
      ? `<img src=\"${brand.logo}\" alt=\"${brand.name}\" width=\"56\" height=\"56\" style=\"display:inline-block;vertical-align:middle;border-radius:12px;filter:brightness(0) invert(1);opacity:0.95\"/>`
      : `<div style=\"width:56px;height:56px;border-radius:12px;background:rgba(255,255,255,0.2);display:inline-block;vertical-align:middle\"></div>`;

    const preheader = `${brand.name} - ${title}`;

    return `
<!DOCTYPE html>
<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
  <meta name=\"x-apple-disable-message-reformatting\">
  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
  <title>${title}</title>
  <!--[if mso]>
  <style type=\"text/css\">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
  </style>
  <![endif]-->
  <style type=\"text/css\">
    @media only screen and (max-width: 600px) {
      .content-block { padding: 20px 16px !important; }
      .header-block { padding: 16px 16px 14px !important; }
      .footer-block { padding: 16px !important; }
      h1 { font-size: 20px !important; }
      .button-cell { padding: 14px 24px !important; font-size: 14px !important; }
      .brand-name { font-size: 16px !important; }
      .blur-circle { display: none !important; }
    }
    @media (prefers-color-scheme: dark) {
      .dark-bg { background: #0f172a !important; }
      .dark-card { background: #1e293b !important; border-color: #334155 !important; }
      .dark-text { color: #e2e8f0 !important; }
      .dark-text-secondary { color: #94a3b8 !important; }
    }
  </style>
</head>
<body style=\"margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale\" class=\"dark-bg\">
  <!-- Preheader -->
  <div style=\"display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all\">${preheader}</div>
  
  <!-- Main Container -->
  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"background-color:#f1f5f9;padding:20px 0\" class=\"dark-bg\">
    <tr>
      <td align=\"center\" style=\"padding:0 16px\">
        <!-- Card Container -->
        <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"600\" style=\"max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);border:1px solid #e2e8f0;overflow:hidden\" class=\"dark-card\">
          
          <!-- Header with Logo and Brand - Gradient Background -->
          <tr>
            <td style=\"background:linear-gradient(135deg,${primary} 0%,${secondary} 100%);padding:20px 24px 18px;position:relative\" class=\"header-block\">
              <!-- Logo at far left -->
              <div style=\"position:absolute;left:20px;top:50%;transform:translateY(-50%)\">
                ${logoBlock}
              </div>
              <!-- Text centered -->
              <div style=\"text-align:center\">
                <div class=\"brand-name\" style=\"color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.01em;text-shadow:0 1px 4px rgba(0,0,0,0.12)\">${brand.name}</div>
              </div>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style=\"padding:32px 28px\" class=\"content-block dark-text\">
              <h1 style=\"margin:0 0 18px;font-size:26px;font-weight:800;background:linear-gradient(135deg,${primary} 0%,${secondary} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.3;letter-spacing:-0.03em\" class=\"dark-text\">${title}</h1>
              ${introHtml}
              <div style=\"margin:20px 0\">
                ${textLines}
              </div>
              ${button}
              ${cta ? `<p style=\"margin:20px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;text-align:center\" class=\"dark-text-secondary\">If the button doesn't work, copy and paste this link:<br/><span style=\"word-break:break-all;color:#64748b\">${cta.url}</span></p>` : ''}
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style=\"padding:0 28px\">
              <div style=\"height:1px;background-color:#e2e8f0\"></div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align=\"center\" style=\"padding:24px 28px;background-color:#f8fafc\" class=\"footer-block\">
              ${support}
              <p style=\"margin:0;color:#94a3b8;font-size:12px;line-height:1.5\" class=\"dark-text-secondary\">© ${new Date().getFullYear()} ${brand.name}. All rights reserved.<br/>This is an automated message, please do not reply.</p>
            </td>
          </tr>
          
        </table>
        
        <!-- Spacer -->
        <div style=\"height:20px\"></div>
        
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
