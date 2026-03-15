import { Request, Response } from "express";
import { Payment } from "../models/Payment";
import { Earning } from "../models/Earning";

/**
 * Get all payments for a brand
 */
export const getBrandPayments = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const { status, skip = 0, limit = 20, paymentMethod } = req.query;

    const query: any = { brandId };
    if (status) {
      query.status = status;
    }
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await Payment.countDocuments(query);

    return res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching brand payments:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
};

/**
 * Get payments summary for a brand
 */
export const getBrandPaymentsSummary = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;

    const payments = await Payment.find({ brandId }).lean();

    const summary = {
      totalSpent: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      byPaymentMethod: {
        direct: 0,
        escrow: 0,
      },
      byStatus: {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      },
    };

    payments.forEach((payment) => {
      summary.totalSpent += payment.amount;

      if (payment.status === "completed") {
        summary.completed += payment.amount;
      } else if (payment.status === "processing") {
        summary.processing += payment.amount;
      } else if (payment.status === "pending") {
        summary.pending += payment.amount;
      } else if (payment.status === "failed") {
        summary.failed += payment.amount;
      }

      summary.byPaymentMethod[payment.paymentMethod] += payment.amount;
      summary.byStatus[payment.status] += payment.amount;
    });

    return res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching payments summary:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch summary" });
  }
};

/**
 * Get single payment by ID
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).lean();

    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch payment" });
  }
};

/**
 * Create payment record from earning
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      brandId,
      influencerId,
      campaignId,
      earningId,
      amount,
      paymentMethod,
      dueDate,
      currency = "USD",
      notes,
    } = req.body;

    if (
      !brandId ||
      !influencerId ||
      !campaignId ||
      !earningId ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const payment = new Payment({
      brandId,
      influencerId,
      campaignId,
      earningId,
      amount,
      paymentMethod,
      currency,
      issuedDate: new Date(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
      notes,
    });

    await payment.save();

    return res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ success: false, error: "Failed to create payment" });
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { status, failureReason, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updateData: any = { status };

    if (status === "completed") {
      updateData.processedDate = new Date();
    }

    if (status === "failed" && failureReason) {
      updateData.failureReason = failureReason;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const payment = await Payment.findByIdAndUpdate(paymentId, updateData, {
      new: true,
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }

    // Update corresponding earning status
    if (status === "completed") {
      await Earning.findByIdAndUpdate(payment.earningId, {
        status: "paid",
        paidDate: new Date(),
      });
    } else if (status === "failed") {
      await Earning.findByIdAndUpdate(payment.earningId, {
        status: "failed",
        failureReason,
      });
    }

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({ success: false, error: "Failed to update payment" });
  }
};

/**
 * Get payments by campaign
 */
export const getPaymentsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const payments = await Payment.find({ campaignId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching campaign payments:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
};

/**
 * Process pending payments (batch operation)
 */
export const processPendingPayments = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const { paymentIds } = req.body;

    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Payment IDs array is required",
      });
    }

    const result = await Payment.updateMany(
      {
        _id: { $in: paymentIds },
        brandId,
        status: "pending",
      },
      {
        status: "processing",
        $set: { updatedAt: new Date() },
      }
    );

    return res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} payments are now processing`,
      },
    });
  } catch (error) {
    console.error("Error processing payments:", error);
    return res.status(500).json({ success: false, error: "Failed to process payments" });
  }
};

/**
 * Get payment breakdown by method for a brand
 */
export const getPaymentMethodBreakdown = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;

    const payments = await Payment.find({ brandId }).lean();

    const breakdown = {
      direct: {
        total: 0,
        count: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      },
      escrow: {
        total: 0,
        count: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      },
    };

    payments.forEach((payment) => {
      const method = breakdown[payment.paymentMethod];
      method.total += payment.amount;
      method.count += 1;
      method[payment.status] += payment.amount;
    });

    return res.json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    console.error("Error fetching payment breakdown:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch breakdown" });
  }
};
