import express from "express";
import authRouter from "./auth.route";
const router = express.Router();

router.use("/auth", authRouter);

export default router;
