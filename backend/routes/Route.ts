import express from "express";
import authRouter from "./authRoute";
const router = express.Router();

router.use(authRouter);

export default router;
