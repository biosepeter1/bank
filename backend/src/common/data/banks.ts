export interface Bank {
  name: string;
  code: string;
  country: string;
}

// Nigerian Banks
export const NIGERIAN_BANKS: Bank[] = [
  { name: 'Access Bank', code: '044', country: 'NG' },
  { name: 'Citibank Nigeria', code: '023', country: 'NG' },
  { name: 'Ecobank Nigeria', code: '050', country: 'NG' },
  { name: 'Fidelity Bank', code: '070', country: 'NG' },
  { name: 'First Bank of Nigeria', code: '011', country: 'NG' },
  { name: 'First City Monument Bank (FCMB)', code: '214', country: 'NG' },
  { name: 'Globus Bank', code: '00103', country: 'NG' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058', country: 'NG' },
  { name: 'Heritage Bank', code: '030', country: 'NG' },
  { name: 'Keystone Bank', code: '082', country: 'NG' },
  { name: 'Polaris Bank', code: '076', country: 'NG' },
  { name: 'Providus Bank', code: '101', country: 'NG' },
  { name: 'Stanbic IBTC Bank', code: '221', country: 'NG' },
  { name: 'Standard Chartered Bank', code: '068', country: 'NG' },
  { name: 'Sterling Bank', code: '232', country: 'NG' },
  { name: 'SunTrust Bank', code: '100', country: 'NG' },
  { name: 'Union Bank of Nigeria', code: '032', country: 'NG' },
  { name: 'United Bank for Africa (UBA)', code: '033', country: 'NG' },
  { name: 'Unity Bank', code: '215', country: 'NG' },
  { name: 'Wema Bank', code: '035', country: 'NG' },
  { name: 'Zenith Bank', code: '057', country: 'NG' },
];

// US Banks
export const US_BANKS: Bank[] = [
  { name: 'Bank of America', code: 'BOFAUS3N', country: 'US' },
  { name: 'Chase Bank (JPMorgan)', code: 'CHASUS33', country: 'US' },
  { name: 'Wells Fargo', code: 'WFBIUS6S', country: 'US' },
  { name: 'Citibank', code: 'CITIUS33', country: 'US' },
  { name: 'U.S. Bank', code: 'USBKUS44', country: 'US' },
  { name: 'PNC Bank', code: 'PNCCUS33', country: 'US' },
  { name: 'Capital One', code: 'NFBKUS33', country: 'US' },
  { name: 'TD Bank', code: 'NRTHUS33', country: 'US' },
  { name: 'Bank of New York Mellon', code: 'IRVTUS3N', country: 'US' },
  { name: 'State Street Bank', code: 'SBOSUS33', country: 'US' },
];

// UK Banks
export const UK_BANKS: Bank[] = [
  { name: 'Barclays Bank', code: 'BARCGB22', country: 'GB' },
  { name: 'HSBC UK', code: 'HBUKGB4B', country: 'GB' },
  { name: 'Lloyds Bank', code: 'LOYDGB2L', country: 'GB' },
  { name: 'NatWest', code: 'NWBKGB2L', country: 'GB' },
  { name: 'Santander UK', code: 'ABBYGB2L', country: 'GB' },
  { name: 'Royal Bank of Scotland', code: 'RBOSGB2L', country: 'GB' },
  { name: 'Metro Bank', code: 'MYMGGB2L', country: 'GB' },
  { name: 'Nationwide Building Society', code: 'NAIAGB21', country: 'GB' },
  { name: 'TSB Bank', code: 'TSBSGB2A', country: 'GB' },
  { name: 'Monzo Bank', code: 'MONZGB2L', country: 'GB' },
];

// Combined banks list
export const BANKS_BY_COUNTRY: Record<string, Bank[]> = {
  NG: NIGERIAN_BANKS,
  US: US_BANKS,
  GB: UK_BANKS,
};

export function getBanksByCountry(countryCode: string): Bank[] {
  return BANKS_BY_COUNTRY[countryCode] || [];
}

export function getBankByCode(countryCode: string, bankCode: string): Bank | undefined {
  const banks = getBanksByCountry(countryCode);
  return banks.find(bank => bank.code === bankCode);
}
