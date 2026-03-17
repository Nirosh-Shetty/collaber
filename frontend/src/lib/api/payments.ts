import axios, { AxiosInstance } from "axios";

interface PaymentsParams {
  skip?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
}

interface PaymentData {
  brandId: string;
  influencerId: string;
  campaignId: string;
  earningId: string;
  amount: number;
  paymentMethod: "direct" | "escrow";
  currency?: string;
  dueDate?: string;
  notes?: string;
}

interface UpdatePaymentStatusData {
  status: string;
  failureReason?: string;
  notes?: string;
}

interface ProcessPaymentsData {
  paymentIds: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export class PaymentsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/payments`,
      withCredentials: true,
    });
  }

  /**
   * Get all payments for a brand
   */
  async getBrandPayments(brandId: string, params?: PaymentsParams) {
    try {
      const response = await this.api.get(`/brand/${brandId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payments summary for a brand
   */
  async getBrandPaymentsSummary(brandId: string) {
    try {
      const response = await this.api.get(`/brand/${brandId}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment method breakdown for a brand
   */
  async getPaymentMethodBreakdown(brandId: string) {
    try {
      const response = await this.api.get(`/brand/${brandId}/breakdown`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single payment by ID
   */
  async getPaymentById(paymentId: string) {
    try {
      const response = await this.api.get(`/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new payment record
   */
  async createPayment(data: PaymentData) {
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId: string, data: UpdatePaymentStatusData) {
    try {
      const response = await this.api.patch(`/${paymentId}/status`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payments by campaign
   */
  async getPaymentsByCampaign(campaignId: string) {
    try {
      const response = await this.api.get(`/campaign/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process pending payments (batch operation)
   */
  async processPendingPayments(brandId: string, data: ProcessPaymentsData) {
    try {
      const response = await this.api.post(`/brand/${brandId}/process`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const paymentsService = new PaymentsService();
