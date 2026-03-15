import { Router } from "express";
import {
  getInfluencerEarnings,
  getInfluencerEarningsSummary,
  getEarningById,
  createEarning,
  updateEarningStatus,
  getEarningsByCampaign,
} from "../controllers/earnings.controller";

const router = Router();

// Get influencer earnings
router.get("/influencer/:influencerId", getInfluencerEarnings);

// Get influencer earnings summary
router.get("/influencer/:influencerId/summary", getInfluencerEarningsSummary);

// Get single earning
router.get("/:earningId", getEarningById);

// Create earning
router.post("/", createEarning);

// Update earning status
router.patch("/:earningId/status", updateEarningStatus);

// Get earnings by campaign
router.get("/campaign/:campaignId", getEarningsByCampaign);

export default router;
