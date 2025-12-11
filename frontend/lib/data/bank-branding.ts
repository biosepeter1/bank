export interface BankBranding {
  name: string;
  code: string;
  shortName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  colors: {
    primary: string;
    secondary: string;
    rgb: number[]; // For PDF (RGB values)
  };
  tagline: string;
  watermark: string;
  logo?: string; // Optional logo URL from settings
}

export const BANK_BRANDING: Record<string, BankBranding> = {
  '011': { // First Bank
    name: 'First Bank of Nigeria',
    code: '011',
    shortName: 'FirstBank',
    email: 'support@firstbank.ng',
    phone: '+234 800 000 0000',
    website: 'www.firstbanknigeria.com',
    address: 'Samuel Asabia House, 35 Marina',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#00416A',
      secondary: '#FFB81C',
      rgb: [0, 65, 106],
    },
    tagline: 'Truly the First',
    watermark: 'FIRST BANK',
  },
  '033': { // UBA
    name: 'United Bank for Africa',
    code: '033',
    shortName: 'UBA',
    email: 'contactcentre@ubagroup.com',
    phone: '+234 700 225 5822',
    website: 'www.ubagroup.com',
    address: 'UBA House, 57 Marina',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#D4002A',
      secondary: '#000000',
      rgb: [212, 0, 42],
    },
    tagline: 'Africa\'s Global Bank',
    watermark: 'UBA',
  },
  '057': { // Zenith Bank
    name: 'Zenith Bank',
    code: '057',
    shortName: 'Zenith',
    email: 'customercare@zenithbank.com',
    phone: '+234 1 278 7000',
    website: 'www.zenithbank.com',
    address: 'Plot 84, Ajose Adeogun Street',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#EB1C24',
      secondary: '#000000',
      rgb: [235, 28, 36],
    },
    tagline: 'Your Bank, Our Pride',
    watermark: 'ZENITH BANK',
  },
  '058': { // GTBank
    name: 'Guaranty Trust Bank',
    code: '058',
    shortName: 'GTBank',
    email: 'gti@gtbank.com',
    phone: '+234 1 448 0000',
    website: 'www.gtbank.com',
    address: 'Plot 635, Akin Adesola Street',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#FF6600',
      secondary: '#000000',
      rgb: [255, 102, 0],
    },
    tagline: 'Africa\'s Leading Financial Institution',
    watermark: 'GTBANK',
  },
  '044': { // Access Bank
    name: 'Access Bank',
    code: '044',
    shortName: 'Access',
    email: 'contactcenter@accessbankplc.com',
    phone: '+234 1 271 2005',
    website: 'www.accessbankplc.com',
    address: 'Plot 1665, Oyin Jolayemi Street',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#F37920',
      secondary: '#000000',
      rgb: [243, 121, 32],
    },
    tagline: 'Your Partner in Progress',
    watermark: 'ACCESS BANK',
  },
  '035': { // Wema Bank
    name: 'Wema Bank',
    code: '035',
    shortName: 'Wema',
    email: 'customercare@wemabank.com',
    phone: '+234 1 277 5050',
    website: 'www.wemabank.com',
    address: '54 Marina',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#800080',
      secondary: '#FFD700',
      rgb: [128, 0, 128],
    },
    tagline: 'We are Wema',
    watermark: 'WEMA BANK',
  },
  '070': { // Fidelity Bank
    name: 'Fidelity Bank',
    code: '070',
    shortName: 'Fidelity',
    email: 'customerservice@fidelitybank.ng',
    phone: '+234 1 448 5500',
    website: 'www.fidelitybank.ng',
    address: '2 Kofo Abayomi Street',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#D4AF37',
      secondary: '#1A1A1A',
      rgb: [212, 175, 55],
    },
    tagline: 'Fidelity Bank - Your Trusted Partner',
    watermark: 'FIDELITY BANK',
  },
  '232': { // Sterling Bank
    name: 'Sterling Bank',
    code: '232',
    shortName: 'Sterling',
    email: 'contactcentre@sterling.ng',
    phone: '+234 700 7835 7546',
    website: 'www.sterling.ng',
    address: '20 Marina',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#00D5FF',
      secondary: '#FF5C00',
      rgb: [0, 213, 255],
    },
    tagline: 'One Customer, One Bank',
    watermark: 'STERLING BANK',
  },
  '214': { // FCMB
    name: 'First City Monument Bank',
    code: '214',
    shortName: 'FCMB',
    email: 'hello@fcmb.com',
    phone: '+234 700 329 0000',
    website: 'www.fcmb.com',
    address: 'Primrose Towers, 17A Tinubu Street',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#6D2077',
      secondary: '#FDB913',
      rgb: [109, 32, 119],
    },
    tagline: 'The Right Way Forward',
    watermark: 'FCMB',
  },
  '032': { // Union Bank
    name: 'Union Bank of Nigeria',
    code: '032',
    shortName: 'Union',
    email: 'unioncontactcentre@unionbankng.com',
    phone: '+234 700 700 7000',
    website: 'www.unionbankng.com',
    address: 'Stallion Plaza, 36 Marina',
    city: 'Lagos Island, Lagos',
    colors: {
      primary: '#002D5B',
      secondary: '#00A651',
      rgb: [0, 45, 91],
    },
    tagline: 'Big, Strong, Reliable',
    watermark: 'UNION BANK',
  },
  '050': { // Ecobank
    name: 'Ecobank Nigeria',
    code: '050',
    shortName: 'Ecobank',
    email: 'customercare@ecobank.com',
    phone: '+234 1 270 9502',
    website: 'www.ecobank.com',
    address: '21 Ahmadu Bello Way',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#003399',
      secondary: '#FF0000',
      rgb: [0, 51, 153],
    },
    tagline: 'The Pan African Bank',
    watermark: 'ECOBANK',
  },
  '221': { // Stanbic IBTC
    name: 'Stanbic IBTC Bank',
    code: '221',
    shortName: 'Stanbic',
    email: 'contactcentre@stanbicibtc.com',
    phone: '+234 1 422 2222',
    website: 'www.stanbicibtcbank.com',
    address: 'IBTC Place, Walter Carrington Crescent',
    city: 'Victoria Island, Lagos',
    colors: {
      primary: '#0033A1',
      secondary: '#FFFFFF',
      rgb: [0, 51, 161],
    },
    tagline: 'Moving Forward',
    watermark: 'STANBIC IBTC',
  },
};

// Fallback/default branding - UBA
export const DEFAULT_BANK_BRANDING: BankBranding = {
  name: 'United Bank for Africa',
  code: '033',
  shortName: 'UBA',
  email: 'contactcentre@ubagroup.com',
  phone: '+234 700 225 5822',
  website: 'www.ubagroup.com',
  address: 'UBA House, 57 Marina',
  city: 'Lagos Island, Lagos',
  colors: {
    primary: '#D4002A',
    secondary: '#000000',
    rgb: [212, 0, 42],
  },
  tagline: 'Africa\'s Global Bank',
  watermark: 'UBA',
};

export function getBankBranding(bankCode: string): BankBranding {
  return BANK_BRANDING[bankCode] || DEFAULT_BANK_BRANDING;
}

export function getBankBrandingByName(bankName: string): BankBranding {
  const entry = Object.values(BANK_BRANDING).find(
    (bank) => bank.name.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(bank.shortName.toLowerCase())
  );
  return entry || DEFAULT_BANK_BRANDING;
}

export function getBankBrandingByCodeOrName(bankCode?: string, bankName?: string): BankBranding {
  // Try by code first (most accurate)
  if (bankCode && BANK_BRANDING[bankCode]) {
    return BANK_BRANDING[bankCode];
  }
  // Fall back to name search
  if (bankName) {
    return getBankBrandingByName(bankName);
  }
  return DEFAULT_BANK_BRANDING;
}
