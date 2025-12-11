import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as crypto from 'crypto';

export interface PaystackInitializePaymentDto {
  email: string;
  amount: number; // Amount in kobo (NGN * 100)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: Record<string, any>;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: Record<string, any>;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

export interface PaystackBankListResponse {
  status: boolean;
  message: string;
  data: Array<{
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    supports_transfer: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface PaystackResolveAccountDto {
  account_number: string;
  bank_code: string;
}

export interface PaystackResolveAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export interface PaystackTransferRecipientDto {
  type: string; // Usually 'nuban'
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

export interface PaystackTransferRecipientResponse {
  status: boolean;
  message: string;
  data: {
    active: boolean;
    createdAt: string;
    currency: string;
    domain: string;
    id: number;
    integration: number;
    name: string;
    recipient_code: string;
    type: string;
    updatedAt: string;
    is_deleted: boolean;
    isDeleted: boolean;
    details: {
      authorization_code: string | null;
      account_number: string;
      account_name: string | null;
      bank_code: string;
      bank_name: string;
    };
  };
}

export interface PaystackInitiateTransferDto {
  source: string; // Usually 'balance'
  amount: number; // Amount in kobo
  recipient: string; // Recipient code
  reason?: string;
  reference?: string;
}

export interface PaystackInitiateTransferResponse {
  status: boolean;
  message: string;
  data: {
    integration: number;
    domain: string;
    amount: number;
    currency: string;
    source: string;
    reason: string;
    recipient: number;
    status: string;
    transfer_code: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly httpClient: AxiosInstance;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL') || 'https://api.paystack.co';

    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }
    
    this.secretKey = secretKey;

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for logging
    this.httpClient.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response from ${response.config.url}: ${response.status}`);
        return response;
      },
      (error) => {
        const message = error.response?.data?.message || error.message || 'Unknown error';
        this.logger.error(`Request failed: ${error.config?.url} - ${message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize a payment transaction
   */
  async initializePayment(data: PaystackInitializePaymentDto): Promise<PaystackInitializeResponse> {
    try {
      const response: AxiosResponse<PaystackInitializeResponse> = await this.httpClient.post(
        '/transaction/initialize',
        data
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Payment initialization failed');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Payment initialization failed:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to initialize payment'
      );
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response: AxiosResponse<PaystackVerifyResponse> = await this.httpClient.get(
        `/transaction/verify/${reference}`
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Payment verification failed');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Payment verification failed:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to verify payment'
      );
    }
  }

  /**
   * Get list of banks
   */
  async getBanks(): Promise<PaystackBankListResponse> {
    try {
      const response: AxiosResponse<PaystackBankListResponse> = await this.httpClient.get(
        '/bank?country=nigeria'
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch banks:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch bank list');
    }
  }

  /**
   * Resolve bank account details
   */
  async resolveAccountNumber(data: PaystackResolveAccountDto): Promise<PaystackResolveAccountResponse> {
    try {
      const response: AxiosResponse<PaystackResolveAccountResponse> = await this.httpClient.get(
        `/bank/resolve?account_number=${data.account_number}&bank_code=${data.bank_code}`
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Account resolution failed');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Account resolution failed:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to resolve account'
      );
    }
  }

  /**
   * Create a transfer recipient
   */
  async createTransferRecipient(data: PaystackTransferRecipientDto): Promise<PaystackTransferRecipientResponse> {
    try {
      const response: AxiosResponse<PaystackTransferRecipientResponse> = await this.httpClient.post(
        '/transferrecipient',
        {
          ...data,
          currency: data.currency || 'NGN',
        }
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Failed to create transfer recipient');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Transfer recipient creation failed:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to create transfer recipient'
      );
    }
  }

  /**
   * Initiate a transfer
   */
  async initiateTransfer(data: PaystackInitiateTransferDto): Promise<PaystackInitiateTransferResponse> {
    try {
      const response: AxiosResponse<PaystackInitiateTransferResponse> = await this.httpClient.post(
        '/transfer',
        data
      );

      if (!response.data.status) {
        throw new BadRequestException(response.data.message || 'Transfer initiation failed');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Transfer initiation failed:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Failed to initiate transfer'
      );
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const hash = crypto
        .createHmac('sha512', this.secretKey)
        .update(payload)
        .digest('hex');
      
      return hash === signature;
    } catch (error) {
      this.logger.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Generate payment reference
   */
  generateReference(prefix = 'RDN'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Convert amount to kobo (for Paystack)
   */
  toKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert kobo to naira
   */
  fromKobo(kobo: number): number {
    return kobo / 100;
  }
}