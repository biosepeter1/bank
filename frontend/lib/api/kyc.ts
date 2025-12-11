import apiClient from './client';

export interface SubmitKycData {
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  idType: string;
  idNumber: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  selfieUrl?: string;
}

export const kycApi = {
  submitKyc: async (data: SubmitKycData) => {
    const response = await apiClient.post('/kyc/submit', data);
    return response.data;
  },

  getStatus: async () => {
    const response = await apiClient.get('/kyc/status');
    return response.data;
  },

  uploadIdDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/kyc/upload/id-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadProofOfAddress: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/kyc/upload/proof-of-address', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadSelfie: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/kyc/upload/selfie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
