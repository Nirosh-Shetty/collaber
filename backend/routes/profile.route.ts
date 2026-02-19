import express from "express";
import { getPublicInfluencerProfile, profile } from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth";

const profileRouter = express.Router();

profileRouter.get("/public/:userId", getPublicInfluencerProfile);
profileRouter.get("/me", authMiddleware, profile);

export default profileRouter;
