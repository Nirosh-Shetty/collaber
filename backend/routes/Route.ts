import express from "express";
import authRouter from "./auth.route";
import discoverRouter from "./discover.route";
import profileRouter from "./profile.route";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/discover", discoverRouter);
router.use("/profile", profileRouter);

export default router;
