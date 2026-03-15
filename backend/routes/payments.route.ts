import { Router } from "express";
import {
  getBrandPayments,
  getBrandPaymentsSummary,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getPaymentsByCampaign,
  processPendingPayments,
  getPaymentMethodBreakdown,
} from "../controllers/payments.controller";

const router = Router();

// Get brand payments
router.get("/brand/:brandId", getBrandPayments);

// Get brand payments summary
router.get("/brand/:brandId/summary", getBrandPaymentsSummary);

// Get payment method breakdown
router.get("/brand/:brandId/breakdown", getPaymentMethodBreakdown);

// Get single payment
router.get("/:paymentId", getPaymentById);

// Create payment
router.post("/", createPayment);

// Update payment status
router.patch("/:paymentId/status", updatePaymentStatus);

// Get payments by campaign
router.get("/campaign/:campaignId", getPaymentsByCampaign);

// Process pending payments (batch)
router.post("/brand/:brandId/process", processPendingPayments);

export default router;
