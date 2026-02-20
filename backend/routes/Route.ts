import express from "express";
import authRouter from "./auth.route";
import campaignRouter from "./campaign.route";
import discoverRouter from "./discover.route";
import profileRouter from "./profile.route";
import promotionRouter from "./promotion.route";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/campaigns", campaignRouter);
router.use("/discover", discoverRouter);
router.use("/profile", profileRouter);
router.use("/promotions", promotionRouter);

export default router;
