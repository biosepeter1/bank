"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get KYC_COUNTRY_REQUIREMENTS () {
        return KYC_COUNTRY_REQUIREMENTS;
    },
    get calculateAge () {
        return calculateAge;
    },
    get getKycRequirements () {
        return getKycRequirements;
    },
    get validateIdNumber () {
        return validateIdNumber;
    }
});
const KYC_COUNTRY_REQUIREMENTS = {
    // Nigeria
    NG: {
        country: 'Nigeria',
        countryCode: 'NG',
        idTypes: [
            {
                value: 'NIN',
                label: 'National Identification Number',
                required: true
            },
            {
                value: 'BVN',
                label: 'Bank Verification Number',
                required: false
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            },
            {
                value: 'VOTERS_CARD',
                label: "Voter's Card",
                required: false
            },
            {
                value: 'INTERNATIONAL_PASSPORT',
                label: 'International Passport',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: false,
            state: true,
            city: true
        },
        minAge: 18,
        additionalValidation: {
            idNumberLength: 11
        }
    },
    // United States
    US: {
        country: 'United States',
        countryCode: 'US',
        idTypes: [
            {
                value: 'SSN',
                label: 'Social Security Number',
                required: true
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            },
            {
                value: 'STATE_ID',
                label: 'State ID',
                required: false
            },
            {
                value: 'PASSPORT',
                label: 'US Passport',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: true,
            state: true,
            city: true
        },
        minAge: 18,
        additionalValidation: {
            idNumberPattern: /^\d{3}-\d{2}-\d{4}$|^\d{9}$/
        }
    },
    // United Kingdom
    GB: {
        country: 'United Kingdom',
        countryCode: 'GB',
        idTypes: [
            {
                value: 'PASSPORT',
                label: 'UK Passport',
                required: false
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's Licence",
                required: false
            },
            {
                value: 'NATIONAL_ID',
                label: 'National Identity Card',
                required: false
            },
            {
                value: 'RESIDENCE_PERMIT',
                label: 'Biometric Residence Permit',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: true,
            state: false,
            city: true
        },
        minAge: 18
    },
    // Canada
    CA: {
        country: 'Canada',
        countryCode: 'CA',
        idTypes: [
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            },
            {
                value: 'PASSPORT',
                label: 'Canadian Passport',
                required: false
            },
            {
                value: 'PROVINCIAL_ID',
                label: 'Provincial ID Card',
                required: false
            },
            {
                value: 'HEALTH_CARD',
                label: 'Health Card',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: true,
            state: true,
            city: true
        },
        minAge: 18,
        additionalValidation: {
            idNumberPattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/
        }
    },
    // Ghana
    GH: {
        country: 'Ghana',
        countryCode: 'GH',
        idTypes: [
            {
                value: 'GHANA_CARD',
                label: 'Ghana Card (National ID)',
                required: true
            },
            {
                value: 'VOTERS_ID',
                label: "Voter's ID",
                required: false
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            },
            {
                value: 'PASSPORT',
                label: 'Passport',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: false,
            state: true,
            city: true
        },
        minAge: 18
    },
    // South Africa
    ZA: {
        country: 'South Africa',
        countryCode: 'ZA',
        idTypes: [
            {
                value: 'ID_NUMBER',
                label: 'South African ID Number',
                required: true
            },
            {
                value: 'PASSPORT',
                label: 'Passport',
                required: false
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: true,
            state: true,
            city: true
        },
        minAge: 18,
        additionalValidation: {
            idNumberLength: 13
        }
    },
    // Kenya
    KE: {
        country: 'Kenya',
        countryCode: 'KE',
        idTypes: [
            {
                value: 'NATIONAL_ID',
                label: 'National ID',
                required: true
            },
            {
                value: 'PASSPORT',
                label: 'Passport',
                required: false
            },
            {
                value: 'ALIEN_ID',
                label: 'Alien ID',
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: false,
            state: true,
            city: true
        },
        minAge: 18
    },
    // Default for other countries
    DEFAULT: {
        country: 'Other',
        countryCode: 'DEFAULT',
        idTypes: [
            {
                value: 'NATIONAL_ID',
                label: 'National ID',
                required: false
            },
            {
                value: 'PASSPORT',
                label: 'Passport',
                required: false
            },
            {
                value: 'DRIVERS_LICENSE',
                label: "Driver's License",
                required: false
            }
        ],
        requiredDocuments: {
            idDocument: true,
            proofOfAddress: true,
            selfie: true
        },
        addressFields: {
            postalCode: true,
            state: true,
            city: true
        },
        minAge: 18
    }
};
function getKycRequirements(countryCode) {
    return KYC_COUNTRY_REQUIREMENTS[countryCode] || KYC_COUNTRY_REQUIREMENTS.DEFAULT;
}
function validateIdNumber(countryCode, idType, idNumber) {
    const requirements = getKycRequirements(countryCode);
    if (!requirements.additionalValidation) {
        return {
            valid: true
        };
    }
    const { idNumberPattern, idNumberLength } = requirements.additionalValidation;
    if (idNumberLength && idNumber.length !== idNumberLength) {
        return {
            valid: false,
            error: `ID number must be ${idNumberLength} characters long`
        };
    }
    if (idNumberPattern && !idNumberPattern.test(idNumber)) {
        return {
            valid: false,
            error: 'Invalid ID number format'
        };
    }
    return {
        valid: true
    };
}
function calculateAge(dateOfBirth) {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) {
        age--;
    }
    return age;
}

//# sourceMappingURL=kyc-country.config.js.map