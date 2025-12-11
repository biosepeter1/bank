export interface KycCountryRequirement {
  country: string;
  countryCode: string;
  idTypes: {
    value: string;
    label: string;
    required: boolean;
  }[];
  requiredDocuments: {
    idDocument: boolean;
    proofOfAddress: boolean;
    selfie: boolean;
  };
  addressFields: {
    postalCode: boolean;
    state: boolean;
    city: boolean;
  };
  minAge: number;
  additionalValidation?: {
    idNumberPattern?: RegExp;
    idNumberLength?: number;
  };
}

export const KYC_COUNTRY_REQUIREMENTS: Record<string, KycCountryRequirement> = {
  // Nigeria
  NG: {
    country: 'Nigeria',
    countryCode: 'NG',
    idTypes: [
      { value: 'NIN', label: 'National Identification Number', required: true },
      { value: 'BVN', label: 'Bank Verification Number', required: false },
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
      { value: 'VOTERS_CARD', label: "Voter's Card", required: false },
      { value: 'INTERNATIONAL_PASSPORT', label: 'International Passport', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: false, // Not commonly used in Nigeria
      state: true,
      city: true,
    },
    minAge: 18,
    additionalValidation: {
      idNumberLength: 11, // NIN is 11 digits
    },
  },

  // United States
  US: {
    country: 'United States',
    countryCode: 'US',
    idTypes: [
      { value: 'SSN', label: 'Social Security Number', required: true },
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
      { value: 'STATE_ID', label: 'State ID', required: false },
      { value: 'PASSPORT', label: 'US Passport', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: true, // ZIP code
      state: true,
      city: true,
    },
    minAge: 18,
    additionalValidation: {
      idNumberPattern: /^\d{3}-\d{2}-\d{4}$|^\d{9}$/, // SSN format
    },
  },

  // United Kingdom
  GB: {
    country: 'United Kingdom',
    countryCode: 'GB',
    idTypes: [
      { value: 'PASSPORT', label: 'UK Passport', required: false },
      { value: 'DRIVERS_LICENSE', label: "Driver's Licence", required: false },
      { value: 'NATIONAL_ID', label: 'National Identity Card', required: false },
      { value: 'RESIDENCE_PERMIT', label: 'Biometric Residence Permit', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: true,
      state: false, // UK uses counties, not required
      city: true,
    },
    minAge: 18,
  },

  // Canada
  CA: {
    country: 'Canada',
    countryCode: 'CA',
    idTypes: [
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
      { value: 'PASSPORT', label: 'Canadian Passport', required: false },
      { value: 'PROVINCIAL_ID', label: 'Provincial ID Card', required: false },
      { value: 'HEALTH_CARD', label: 'Health Card', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: true,
      state: true, // Provinces
      city: true,
    },
    minAge: 18,
    additionalValidation: {
      idNumberPattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, // Postal code format
    },
  },

  // Ghana
  GH: {
    country: 'Ghana',
    countryCode: 'GH',
    idTypes: [
      { value: 'GHANA_CARD', label: 'Ghana Card (National ID)', required: true },
      { value: 'VOTERS_ID', label: "Voter's ID", required: false },
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
      { value: 'PASSPORT', label: 'Passport', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: false,
      state: true,
      city: true,
    },
    minAge: 18,
  },

  // South Africa
  ZA: {
    country: 'South Africa',
    countryCode: 'ZA',
    idTypes: [
      { value: 'ID_NUMBER', label: 'South African ID Number', required: true },
      { value: 'PASSPORT', label: 'Passport', required: false },
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: true,
      state: true,
      city: true,
    },
    minAge: 18,
    additionalValidation: {
      idNumberLength: 13, // SA ID is 13 digits
    },
  },

  // Kenya
  KE: {
    country: 'Kenya',
    countryCode: 'KE',
    idTypes: [
      { value: 'NATIONAL_ID', label: 'National ID', required: true },
      { value: 'PASSPORT', label: 'Passport', required: false },
      { value: 'ALIEN_ID', label: 'Alien ID', required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: false,
      state: true,
      city: true,
    },
    minAge: 18,
  },

  // Default for other countries
  DEFAULT: {
    country: 'Other',
    countryCode: 'DEFAULT',
    idTypes: [
      { value: 'NATIONAL_ID', label: 'National ID', required: false },
      { value: 'PASSPORT', label: 'Passport', required: false },
      { value: 'DRIVERS_LICENSE', label: "Driver's License", required: false },
    ],
    requiredDocuments: {
      idDocument: true,
      proofOfAddress: true,
      selfie: true,
    },
    addressFields: {
      postalCode: true,
      state: true,
      city: true,
    },
    minAge: 18,
  },
};

export function getKycRequirements(countryCode: string): KycCountryRequirement {
  return KYC_COUNTRY_REQUIREMENTS[countryCode] || KYC_COUNTRY_REQUIREMENTS.DEFAULT;
}

export function validateIdNumber(
  countryCode: string,
  idType: string,
  idNumber: string,
): { valid: boolean; error?: string } {
  const requirements = getKycRequirements(countryCode);

  if (!requirements.additionalValidation) {
    return { valid: true };
  }

  const { idNumberPattern, idNumberLength } = requirements.additionalValidation;

  if (idNumberLength && idNumber.length !== idNumberLength) {
    return {
      valid: false,
      error: `ID number must be ${idNumberLength} characters long`,
    };
  }

  if (idNumberPattern && !idNumberPattern.test(idNumber)) {
    return {
      valid: false,
      error: 'Invalid ID number format',
    };
  }

  return { valid: true };
}

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age;
}
