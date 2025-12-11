export type CountryConfig = {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  kycDocuments: {
    value: string;
    label: string;
  }[];
  addressFields: {
    stateLabel: string;
    postalCodeLabel: string;
    postalCodeFormat?: RegExp;
  };
};

export const COUNTRIES: Record<string, CountryConfig> = {
  NG: {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    phoneCode: '+234',
    currency: {
      code: 'NGN',
      symbol: '₦',
      name: 'Nigerian Naira',
    },
    kycDocuments: [
      { value: 'NIN', label: 'National Identity Number (NIN)' },
      { value: 'BVN', label: 'Bank Verification Number (BVN)' },
      { value: 'PASSPORT', label: 'International Passport' },
      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
      { value: 'VOTERS_CARD', label: "Voter's Card" },
    ],
    addressFields: {
      stateLabel: 'State',
      postalCodeLabel: 'Postal Code',
    },
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    phoneCode: '+1',
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
    },
    kycDocuments: [
      { value: 'SSN', label: 'Social Security Number (SSN)' },
      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
      { value: 'PASSPORT', label: 'US Passport' },
      { value: 'STATE_ID', label: 'State ID Card' },
    ],
    addressFields: {
      stateLabel: 'State',
      postalCodeLabel: 'ZIP Code',
      postalCodeFormat: /^\d{5}(-\d{4})?$/,
    },
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    phoneCode: '+44',
    currency: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
    },
    kycDocuments: [
      { value: 'PASSPORT', label: 'UK Passport' },
      { value: 'DRIVERS_LICENSE', label: "Driver's Licence" },
      { value: 'NATIONAL_ID', label: 'National Identity Card' },
      { value: 'RESIDENCE_PERMIT', label: 'Biometric Residence Permit' },
    ],
    addressFields: {
      stateLabel: 'County',
      postalCodeLabel: 'Postcode',
      postalCodeFormat: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    },
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    phoneCode: '+27',
    currency: {
      code: 'ZAR',
      symbol: 'R',
      name: 'South African Rand',
    },
    kycDocuments: [
      { value: 'ID_NUMBER', label: 'South African ID Number' },
      { value: 'PASSPORT', label: 'Passport' },
      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
      { value: 'ASYLUM_SEEKER', label: 'Asylum Seeker Permit' },
    ],
    addressFields: {
      stateLabel: 'Province',
      postalCodeLabel: 'Postal Code',
    },
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    phoneCode: '+254',
    currency: {
      code: 'KES',
      symbol: 'KSh',
      name: 'Kenyan Shilling',
    },
    kycDocuments: [
      { value: 'NATIONAL_ID', label: 'National ID Card' },
      { value: 'PASSPORT', label: 'Passport' },
      { value: 'ALIEN_ID', label: 'Alien ID Card' },
      { value: 'MILITARY_ID', label: 'Military ID' },
    ],
    addressFields: {
      stateLabel: 'County',
      postalCodeLabel: 'Postal Code',
    },
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    phoneCode: '+233',
    currency: {
      code: 'GHS',
      symbol: '₵',
      name: 'Ghanaian Cedi',
    },
    kycDocuments: [
      { value: 'GHANA_CARD', label: 'Ghana Card (National ID)' },
      { value: 'PASSPORT', label: 'Passport' },
      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
      { value: 'VOTERS_ID', label: 'Voter ID Card' },
    ],
    addressFields: {
      stateLabel: 'Region',
      postalCodeLabel: 'Digital Address / Postal Code',
    },
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    phoneCode: '+91',
    currency: {
      code: 'INR',
      symbol: '₹',
      name: 'Indian Rupee',
    },
    kycDocuments: [
      { value: 'AADHAAR', label: 'Aadhaar Card' },
      { value: 'PAN', label: 'PAN Card' },
      { value: 'PASSPORT', label: 'Passport' },
      { value: 'DRIVERS_LICENSE', label: "Driver's License" },
      { value: 'VOTERS_ID', label: 'Voter ID Card' },
    ],
    addressFields: {
      stateLabel: 'State',
      postalCodeLabel: 'PIN Code',
      postalCodeFormat: /^\d{6}$/,
    },
  },
  CN: {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    phoneCode: '+86',
    currency: {
      code: 'CNY',
      symbol: '¥',
      name: 'Chinese Yuan',
    },
    kycDocuments: [
      { value: 'NATIONAL_ID', label: 'National ID Card' },
      { value: 'PASSPORT', label: 'Passport' },
      { value: 'RESIDENCE_PERMIT', label: 'Residence Permit' },
    ],
    addressFields: {
      stateLabel: 'Province',
      postalCodeLabel: 'Postal Code',
    },
  },
};

export const getCountryByPhoneCode = (phoneCode: string): CountryConfig | undefined => {
  return Object.values(COUNTRIES).find(c => c.phoneCode === phoneCode);
};

export const getCountryByCode = (code: string): CountryConfig | undefined => {
  return COUNTRIES[code];
};

export const getCountryList = () => {
  return Object.values(COUNTRIES);
};
