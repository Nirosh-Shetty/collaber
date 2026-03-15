import axios, { AxiosInstance } from "axios";

interface EarningsParams {
  skip?: number;
  limit?: number;
  status?: string;
}

interface EarningData {
  influencerId: string;
  campaignId: string;
  brandId: string;
  amount: number;
  paymentMethod: "direct" | "escrow";
  description?: string;
  dueDate?: string;
  currency?: string;
}

interface UpdateEarningStatusData {
  status: string;
  failureReason?: string;
  transactionId?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class EarningsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/earnings`,
      withCredentials: true,
    });
  }

  /**
   * Get all earnings for an influencer
   */
  async getInfluencerEarnings(influencerId: string, params?: EarningsParams) {
    try {
      const response = await this.api.get(`/influencer/${influencerId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get earnings summary for an influencer
   */
  async getInfluencerEarningsSummary(influencerId: string) {
    try {
      const response = await this.api.get(`/influencer/${influencerId}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single earning by ID
   */
  async getEarningById(earningId: string) {
    try {
      const response = await this.api.get(`/${earningId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new earning record
   */
  async createEarning(data: EarningData) {
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update earning status
   */
  async updateEarningStatus(earningId: string, data: UpdateEarningStatusData) {
    try {
      const response = await this.api.patch(`/${earningId}/status`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get earnings by campaign
   */
  async getEarningsByCampaign(campaignId: string) {
    try {
      const response = await this.api.get(`/campaign/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const earningsService = new EarningsService();
