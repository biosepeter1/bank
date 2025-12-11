'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, MoreVertical, Calendar, X, FileDown, FileImage, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { transactionsApi } from '@/lib/api/transactions';
import { profileApi } from '@/lib/api/profile';
import { settingsApi } from '@/lib/api/settings';
import { walletApi } from '@/lib/api/wallet';
import { kycApi } from '@/lib/api/kyc';
import { getBankBrandingByCodeOrName, BankBranding, DEFAULT_BANK_BRANDING } from '@/lib/data/bank-branding';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  recipientName?: string;
  senderName?: string;
  signedAmount?: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bankBranding, setBankBranding] = useState<BankBranding>(DEFAULT_BANK_BRANDING);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userKyc, setUserKyc] = useState<any>(null);
  const [adminSettings, setAdminSettings] = useState<{ email: string; phone: string; logo: string } | null>(null);
  const [userCurrency, setUserCurrency] = useState({ code: 'NGN', symbol: '₦' });
  const exportRef = useRef<HTMLDivElement>(null);

  // Helper function to load images for PDF
  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  useEffect(() => {
    fetchTransactions();
    fetchUserProfile();
    fetchUserKyc();
    fetchAdminSettings();
    fetchUserCurrency();
  }, []);

  const getCurrencyInfo = (currencyCode: string) => {
    const currencies: Record<string, { symbol: string; code: string }> = {
      'NGN': { symbol: '₦', code: 'NGN' },
      'USD': { symbol: '$', code: 'USD' },
      'GBP': { symbol: '£', code: 'GBP' },
      'EUR': { symbol: '€', code: 'EUR' },
      'GHS': { symbol: '₵', code: 'GHS' },
      'KES': { symbol: 'KSh', code: 'KES' },
      'ZAR': { symbol: 'R', code: 'ZAR' },
    };
    return currencies[currencyCode] || { symbol: currencyCode, code: currencyCode };
  };

  const fetchUserCurrency = async () => {
    try {
      const walletData = await walletApi.getWallet();
      const currencyCode = walletData.currency || 'NGN';
      setUserCurrency(getCurrencyInfo(currencyCode));
      console.log('💱 User currency:', currencyCode);
    } catch (error) {
      console.error('Failed to fetch wallet currency:', error);
      // Keep default NGN
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await profileApi.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchUserKyc = async () => {
    try {
      const kycData = await kycApi.getStatus();
      if (kycData.status !== 'NOT_SUBMITTED') {
        setUserKyc(kycData);
      }
    } catch (error) {
      console.error('Failed to fetch KYC data:', error);
    }
  };

  const fetchAdminSettings = async () => {
    try {
      const settings = await settingsApi.getSettings();

      // Store email, phone, and logo
      setAdminSettings({
        email: settings.general.supportEmail,
        phone: settings.general.supportPhone,
        logo: settings.general.logo || '/logo.png',
      });

      console.log('🖼️ Logo URL:', settings.general.logo);

      // Get bank branding based on admin-configured bank (using code + name for accuracy)
      const bankCode = settings.general.bankCode;
      const bankName = settings.general.bankName || 'First Bank of Nigeria';

      console.log('🏛️ Fetching bank branding...');
      console.log('  - Bank Code from settings:', bankCode);
      console.log('  - Bank Name from settings:', bankName);

      const branding = getBankBrandingByCodeOrName(bankCode, bankName);
      setBankBranding(branding);

      console.log('✅ Bank branding loaded:');
      console.log('  - Name:', branding.name);
      console.log('  - Code:', branding.code);
      console.log('  - Primary Color:', branding.colors.primary);
      console.log('  - Watermark:', branding.watermark);
      console.log('📧 Contact:', settings.general.supportEmail, settings.general.supportPhone);
    } catch (error) {
      console.error('❌ Failed to fetch admin settings:', error);
      // Will use fallback default bank branding
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getTransactions();
      const processedData = (data || []).map((t: any) => {
        let amount = typeof t.signedAmount === 'number' ? t.signedAmount : Number(t.amount) || 0;
        if (typeof t.signedAmount !== 'number') {
          const desc = (t.description || '').toLowerCase();
          if (amount > 0 && (desc.includes('debit') || desc.includes('admin debit'))) {
            amount = -amount;
          }
        }
        return { ...t, amount } as Transaction;
      });
      setTransactions(processedData);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions. Please try again.');
      toast.error('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;

    return transactions.filter((tx: any) => {
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesSearch = (tx.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        tx.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.senderName?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (start) matchesDate = matchesDate && new Date(tx.createdAt) >= start;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(tx.createdAt) <= endOfDay;
      }

      return matchesType && matchesSearch && matchesDate;
    });
  }, [transactions, filterType, searchTerm, dateRange]);

  const getTransactionIcon = (amount: number) => {
    return amount >= 0 ? (
      <ArrowDownLeft className="w-5 h-5 text-green-600" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-red-600" />
    );
  };

  const statusStyles = (status?: string) => {
    const s = (status || 'completed').toLowerCase();
    if (s.includes('pending')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300';
    if (s.includes('fail') || s.includes('declin')) return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  };

  const formatCurrency = (n: number) => {
    const sign = n >= 0 ? '+' : '-';
    return `${sign} ${userCurrency.symbol}${Math.abs(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCurrencyForPDF = (n: number) => {
    const sign = n >= 0 ? '+' : '-';
    return `${sign} ${userCurrency.code} ${Math.abs(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((tx: any) => tx.amount >= 0)
      .reduce((a: number, b: any) => a + Math.abs(b.amount || 0), 0);
    const expense = filteredTransactions
      .filter((tx: any) => tx.amount < 0)
      .reduce((a: number, b: any) => a + Math.abs(b.amount || 0), 0);
    return { count: filteredTransactions.length, income, expense };
  }, [filteredTransactions]);

  const clearFilters = () => {
    setFilterType('all');
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      // Add your delete API call here when backend is ready
      // await transactionsApi.deleteTransaction(id);

      // For now, just remove from local state
      setTransactions(transactions.filter(tx => tx.id !== id));
      toast.success('Transaction deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  // Pagination logic
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Status'];
    const csvData = filteredTransactions.map((tx: any) => [
      new Date(tx.createdAt).toLocaleDateString(),
      tx.type,
      tx.description,
      formatCurrency(tx.amount),
      tx.status || 'Completed',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setShowExportMenu(false);
    toast.success('CSV exported successfully!');
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const logoUrl = adminSettings?.logo || '/logo.png';

      // Add logo as watermark (centered, faded)
      if (logoUrl) {
        try {
          const logoImg = await loadImage(logoUrl);
          const watermarkSize = 100;
          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
          doc.addImage(
            logoImg,
            'PNG',
            (pageWidth - watermarkSize) / 2,
            (pageHeight - watermarkSize) / 2,
            watermarkSize,
            watermarkSize
          );
          doc.restoreGraphicsState();
        } catch (err) {
          console.warn('Failed to load logo for watermark:', err);
          // Fallback to text watermark
          doc.setFontSize(50);
          doc.setTextColor(240, 240, 240);
          doc.text(bankBranding.watermark, pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45,
          });
        }
      }

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Header Section with Bank Details (using bank's brand color)
      const [r, g, b] = bankBranding.colors.rgb;
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageWidth, 35, 'F');

      // Bank Logo in header
      if (logoUrl) {
        try {
          const logoImg = await loadImage(logoUrl);
          doc.addImage(logoImg, 'PNG', 14, 8, 20, 20);

          // Bank Name next to logo
          doc.setFontSize(16);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text(bankBranding.name.toUpperCase(), 38, 15);
        } catch (err) {
          console.warn('Failed to load logo for header:', err);
          // Fallback to text only
          doc.setFontSize(20);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text(bankBranding.name.toUpperCase(), 14, 15);
        }
      } else {
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(bankBranding.name.toUpperCase(), 14, 15);
      }

      // Bank Tagline
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const taglineX = logoUrl ? 38 : 14;
      doc.text(bankBranding.tagline, taglineX, 22);

      // Document Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TRANSACTION STATEMENT', pageWidth - 14, 15, { align: 'right' });

      // Statement Type
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Bank Statement', pageWidth - 14, 20, { align: 'right' });

      // Reset text color for content
      doc.setTextColor(0, 0, 0);

      // Customer Information Section
      let yPos = 45;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', 14, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      yPos += 7;
      if (userProfile) {
        const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
        if (fullName) {
          doc.text(`Name: ${fullName}`, 14, yPos);
          yPos += 5;
        }
        if (userProfile.email) {
          doc.text(`Email: ${userProfile.email}`, 14, yPos);
          yPos += 5;
        }
      }
      if (userKyc && userKyc.address) {
        doc.text(`Address: ${userKyc.address}`, 14, yPos);
        yPos += 5;
        const location = [userKyc.city, userKyc.state, userKyc.country].filter(Boolean).join(', ');
        if (location) {
          doc.text(`Location: ${location}`, 14, yPos);
          yPos += 5;
        }
      }

      yPos += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Statement Details', 14, yPos);

      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text(`Generated: ${new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 14, yPos);
      yPos += 6;
      doc.text(`Statement Period: ${dateRange.start || 'All Time'} to ${dateRange.end || 'Present'}`, 14, yPos);
      yPos += 6;
      doc.text(`Total Transactions: ${summary.count}`, 14, yPos);

      // Financial Summary Box (using bank's brand color)
      yPos += 8;
      const summaryBoxY = yPos;
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.5);
      doc.rect(14, summaryBoxY, pageWidth - 28, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Summary', 18, summaryBoxY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Total Inflow:`, 18, summaryBoxY + 14);
      doc.setTextColor(34, 197, 94);
      doc.text(`${formatCurrencyForPDF(summary.income)}`, 60, summaryBoxY + 14);

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Outflow:`, 18, summaryBoxY + 20);
      doc.setTextColor(239, 68, 68);
      doc.text(`${formatCurrencyForPDF(-summary.expense)}`, 60, summaryBoxY + 20);

      // Transaction Table
      doc.setTextColor(0, 0, 0);
      const tableData = filteredTransactions.map((tx: any) => [
        new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        tx.type.toUpperCase(),
        tx.description.substring(0, 40) + (tx.description.length > 40 ? '...' : ''),
        formatCurrencyForPDF(tx.amount),
        (tx.status || 'COMPLETED').toUpperCase(),
      ]);

      autoTable(doc, {
        head: [['Date', 'Type', 'Description', 'Amount', 'Status']],
        body: tableData,
        startY: summaryBoxY + 35,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: bankBranding.colors.rgb,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 70 },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 25, halign: 'center' },
        },
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY || 200;

      if (finalY < pageHeight - 40) {
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('This is a computer-generated statement and does not require a signature.', pageWidth / 2, pageHeight - 25, { align: 'center' });
        // Use admin-configured email/phone or fallback to bank branding
        const contactEmail = adminSettings?.email || bankBranding.email;
        const contactPhone = adminSettings?.phone || bankBranding.phone;
        doc.text(`For inquiries: ${contactEmail} | ${contactPhone}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

        // Bank Address
        doc.setFontSize(6);
        const currentWebsite = typeof window !== 'undefined' ? window.location.origin : 'www.yourbank.com';
        doc.text(`${bankBranding.name} | ${bankBranding.address}, ${bankBranding.city}, Nigeria`, pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text(`Licensed by the Central Bank of Nigeria | Member of NDIC | ${currentWebsite}`, pageWidth / 2, pageHeight - 11, { align: 'center' });

        // Document Reference
        doc.setFontSize(6);
        doc.text(`Statement Ref: TXN-${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
      }

      const sanitizedBankName = bankBranding.shortName.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`${sanitizedBankName}_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
      setShowExportMenu(false);
      toast.success('Statement exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export statement');
    }
  };

  const exportToImage = async () => {
    if (!exportRef.current) return;

    try {
      // Create a wrapper div with official statement styling
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        width: 1200px;
        padding: 40px;
        background: white;
        font-family: Arial, sans-serif;
      `;

      // Header with bank branding (using bank's colors)
      const logoUrl = adminSettings?.logo || '/logo.png';
      const header = document.createElement('div');
      header.style.cssText = `
        background: linear-gradient(135deg, ${bankBranding.colors.primary} 0%, ${bankBranding.colors.secondary} 100%);
        padding: 30px;
        margin: -40px -40px 30px -40px;
        color: white;
        position: relative;
      `;
      header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 15px;">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="width: 60px; height: 60px; object-fit: contain; background: white; padding: 8px; border-radius: 8px;" onerror="this.style.display='none'" />` : ''}
            <div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">${bankBranding.name.toUpperCase()}</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">${bankBranding.tagline}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold;">TRANSACTION STATEMENT</h2>
            <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">Official Bank Statement</p>
          </div>
        </div>
      `;

      // Watermark (logo or text)
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.04;
        pointer-events: none;
        z-index: 1;
        white-space: nowrap;
      `;
      if (logoUrl) {
        watermark.innerHTML = `<img src="${logoUrl}" alt="Watermark" style="width: 300px; height: 300px; object-fit: contain;" onerror="this.style.display='none'" />`;
      } else {
        watermark.style.cssText += 'font-size: 80px; font-weight: bold; color: rgba(0, 0, 0, 1); transform: translate(-50%, -50%) rotate(-45deg);';
        watermark.textContent = bankBranding.watermark;
      }

      // Customer Information
      const customerInfo = document.createElement('div');
      customerInfo.style.cssText = `
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid ${bankBranding.colors.primary};
      `;

      const fullName = userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() : '';
      const email = userProfile?.email || '';
      const address = userKyc?.address || '';
      const location = userKyc ? [userKyc.city, userKyc.state, userKyc.country].filter(Boolean).join(', ') : '';

      customerInfo.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 14px; font-weight: 600;">Customer Information</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #4b5563;">
          ${fullName ? `<div><strong>Name:</strong> ${fullName}</div>` : ''}
          ${email ? `<div><strong>Email:</strong> ${email}</div>` : ''}
          ${address ? `<div><strong>Address:</strong> ${address}</div>` : ''}
          ${location ? `<div><strong>Location:</strong> ${location}</div>` : ''}
        </div>
      `;

      // Statement details
      const details = document.createElement('div');
      details.style.cssText = `
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid ${bankBranding.colors.primary};
      `;
      details.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 14px; font-weight: 600;">Statement Details</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #4b5563;">
          <div><strong>Generated:</strong> ${new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
          <div><strong>Period:</strong> ${dateRange.start || 'All Time'} to ${dateRange.end || 'Present'}</div>
          <div><strong>Total Transactions:</strong> ${summary.count}</div>
          <div><strong>Reference:</strong> TXN-${Date.now().toString(36).toUpperCase()}</div>
        </div>
      `;

      // Summary
      const summaryBox = document.createElement('div');
      summaryBox.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      `;
      summaryBox.innerHTML = `
        <div style="padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="margin: 0; font-size: 11px; color: #047857; font-weight: 600;">TOTAL INFLOW</p>
          <p style="margin: 8px 0 0 0; font-size: 24px; color: #059669; font-weight: bold;">${formatCurrency(summary.income)}</p>
        </div>
        <div style="padding: 20px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p style="margin: 0; font-size: 11px; color: #b91c1c; font-weight: 600;">TOTAL OUTFLOW</p>
          <p style="margin: 8px 0 0 0; font-size: 24px; color: #dc2626; font-weight: bold;">${formatCurrency(-summary.expense)}</p>
        </div>
      `;

      // Clone the transactions table
      const tableClone = exportRef.current.cloneNode(true) as HTMLElement;
      tableClone.style.position = 'relative';
      tableClone.style.zIndex = '2';

      // Footer
      const footer = document.createElement('div');
      footer.style.cssText = `
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e5e7eb;
        text-align: center;
        font-size: 10px;
        color: #6b7280;
      `;
      // Use admin-configured email/phone or fallback to bank branding
      const contactEmail = adminSettings?.email || bankBranding.email;
      const contactPhone = adminSettings?.phone || bankBranding.phone;
      const currentWebsite = typeof window !== 'undefined' ? window.location.origin : 'www.yourbank.com';

      footer.innerHTML = `
        <p style="margin: 5px 0;">This is a computer-generated statement and does not require a signature.</p>
        <p style="margin: 5px 0;">For inquiries: ${contactEmail} | ${contactPhone}</p>
        <p style="margin: 10px 0 5px 0; font-size: 9px;">${bankBranding.name} | ${bankBranding.address}, ${bankBranding.city}, Nigeria</p>
        <p style="margin: 5px 0; font-size: 9px;">Licensed by the Central Bank of Nigeria | Member of NDIC | ${currentWebsite}</p>
      `;

      // Assemble the document
      wrapper.appendChild(watermark);
      wrapper.appendChild(header);
      wrapper.appendChild(customerInfo);
      wrapper.appendChild(details);
      wrapper.appendChild(summaryBox);
      wrapper.appendChild(tableClone);
      wrapper.appendChild(footer);

      // Temporarily add to DOM
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      document.body.appendChild(wrapper);

      // Capture with html2canvas
      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: 1200,
      });

      // Remove from DOM
      document.body.removeChild(wrapper);

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const sanitizedBankNameImg = bankBranding.shortName.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${sanitizedBankNameImg}_Statement_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      setShowExportMenu(false);
      toast.success('Statement image exported successfully!');
    } catch (error) {
      console.error('Error exporting image:', error);
      toast.error('Failed to export statement image');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent dark:from-blue-400/10 dark:via-blue-300/5 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
              Search, filter and export your transaction history
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={exportToCSV}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Export as PDF
                </button>
                <button
                  onClick={exportToImage}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  Export as Image
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Inflow</p>
            <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(summary.income)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-4 hidden md:block">
            <p className="text-xs text-gray-500 dark:text-gray-400">Outflow</p>
            <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(-summary.expense)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  aria-label="Clear search"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200/60 dark:hover:bg-gray-600/60"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Type segmented control */}
          <div className="grid grid-cols-2 sm:inline-flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            {[
              { key: 'all', label: 'All' },
              { key: 'DEPOSIT', label: 'Deposit' },
              { key: 'TRANSFER', label: 'Transfer' },
              { key: 'WITHDRAWAL', label: 'Withdrawal' },
              { key: 'PAYMENT', label: 'Payment' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterType(opt.key)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium transition focus:outline-none border-r last:border-r-0 border-gray-200 dark:border-gray-600 ${filterType === opt.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clear */}
          <div className="flex lg:ml-auto">
            <button onClick={clearFilters} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with pagination info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div ref={exportRef}>
          {/* Table (md+) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr className="text-left text-gray-600 dark:text-gray-200">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                        <p className="font-medium">Loading transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 grid place-items-center">
                          <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="font-medium text-red-600 dark:text-red-400">Failed to load transactions</p>
                        <p className="text-sm">{error}</p>
                        <button onClick={fetchTransactions} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Retry</button>
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 grid place-items-center">
                          <Search className="w-5 h-5" />
                        </div>
                        <p className="font-medium">No transactions match your filters</p>
                        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">Clear filters</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx: any, idx: number) => (
                    <tr key={tx.id} className={idx % 2 ? 'bg-gray-50/50 dark:bg-gray-700/30' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.amount)}
                          <span className="capitalize text-gray-800 dark:text-gray-100">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{tx.description}</td>
                      <td className="px-6 py-4 font-semibold">
                        <span className={tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles(tx.status)}`}>
                          {tx.status || 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {deleteConfirm === tx.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(tx.id)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(tx.id)}
                              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Cards (mobile) */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-2">Failed to load transactions</p>
              <button onClick={fetchTransactions} className="text-blue-600 font-medium">Retry</button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions</div>
          ) : (
            paginatedTransactions.map((tx: any) => {
              const income = tx.amount >= 0;
              return (
                <div key={tx.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${income ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                      {income ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString()} • <span className={`font-medium ${statusStyles(tx.status).split(' ')[1]}`}>{tx.status || 'Completed'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${income ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {deleteConfirm === tx.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(tx.id)}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

