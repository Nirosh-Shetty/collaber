import { Request, Response } from "express";
import { Earning } from "../models/Earning";
import { Payment } from "../models/Payment";

/**
 * Get all earnings for an influencer
 */
export const getInfluencerEarnings = async (req: Request, res: Response) => {
  try {
    const { influencerId } = req.params;
    const { status, skip = 0, limit = 20 } = req.query;

    const query: any = { influencerId };
    if (status) {
      query.status = status;
    }

    const earnings = await Earning.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await Earning.countDocuments(query);

    return res.json({
      success: true,
      data: earnings,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching influencer earnings:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch earnings" });
  }
};

/**
 * Get earnings summary for an influencer
 */
export const getInfluencerEarningsSummary = async (req: Request, res: Response) => {
  try {
    const { influencerId } = req.params;

    const earnings = await Earning.find({ influencerId }).lean();

    const summary = {
      totalEarned: 0,
      pending: 0,
      readyForPayment: 0,
      paid: 0,
      byPaymentMethod: {
        direct: 0,
        escrow: 0,
      },
      byStatus: {
        pending: 0,
        ready_for_payment: 0,
        paid: 0,
        failed: 0,
      },
    };

    earnings.forEach((earning) => {
      if (earning.status === "paid") {
        summary.totalEarned += earning.amount;
        summary.paid += earning.amount;
      } else if (earning.status === "ready_for_payment") {
        summary.readyForPayment += earning.amount;
      } else if (earning.status === "pending") {
        summary.pending += earning.amount;
      }

      summary.byPaymentMethod[earning.paymentMethod] += earning.amount;
      summary.byStatus[earning.status] += earning.amount;
    });

    return res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch summary" });
  }
};

/**
 * Get single earning by ID
 */
export const getEarningById = async (req: Request, res: Response) => {
  try {
    const { earningId } = req.params;

    const earning = await Earning.findById(earningId).lean();

    if (!earning) {
      return res.status(404).json({ success: false, error: "Earning not found" });
    }

    return res.json({
      success: true,
      data: earning,
    });
  } catch (error) {
    console.error("Error fetching earning:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch earning" });
  }
};

/**
 * Create earning record (called when campaign is completed)
 */
export const createEarning = async (req: Request, res: Response) => {
  try {
    const {
      influencerId,
      campaignId,
      brandId,
      amount,
      paymentMethod,
      description,
      dueDate,
      currency = "USD",
    } = req.body;

    // Validate required fields
    if (!influencerId || !campaignId || !brandId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const earning = new Earning({
      influencerId,
      campaignId,
      brandId,
      amount,
      paymentMethod,
      currency,
      description,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
    });

    await earning.save();

    return res.status(201).json({
      success: true,
      data: earning,
    });
  } catch (error) {
    console.error("Error creating earning:", error);
    return res.status(500).json({ success: false, error: "Failed to create earning" });
  }
};

/**
 * Update earning status
 */
export const updateEarningStatus = async (req: Request, res: Response) => {
  try {
    const { earningId } = req.params;
    const { status, failureReason, transactionId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updateData: any = { status };

    if (status === "paid") {
      updateData.paidDate = new Date();
      if (transactionId) {
        updateData.transactionId = transactionId;
      }
    }

    if (status === "failed" && failureReason) {
      updateData.failureReason = failureReason;
    }

    const earning = await Earning.findByIdAndUpdate(earningId, updateData, {
      new: true,
    });

    if (!earning) {
      return res.status(404).json({ success: false, error: "Earning not found" });
    }

    return res.json({
      success: true,
      data: earning,
    });
  } catch (error) {
    console.error("Error updating earning:", error);
    return res.status(500).json({ success: false, error: "Failed to update earning" });
  }
};

/**
 * Get earnings by campaign
 */
export const getEarningsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const earnings = await Earning.find({ campaignId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error("Error fetching campaign earnings:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch earnings" });
  }
};
