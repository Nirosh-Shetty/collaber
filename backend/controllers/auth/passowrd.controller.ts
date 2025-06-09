import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../../models/Users";
import { mailer } from "../../utils/mailer";
import crypto from "crypto";
import sessionStore from "../../utils/sessionStore";

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const email = await sessionStore.get(hashedToken);
    if (!email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sessionStore.delete(hashedToken); // Delete the token after use
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await UserModel.find({ email });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a random token and hash it
    const existingToken = await sessionStore.get(email);
    if (existingToken) {
      return res
        .status(400)
        .json({ message: "A reset request is already pending" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await sessionStore.set(hashedToken, email, 3600); // Store token for 1 hour
    await mailer(email, " ", hashedToken, "resetPassword");
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
