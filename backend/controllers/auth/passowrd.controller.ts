import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../../models/Users";
import { mailer } from "../../utils/mailer/index";

// import crypto from "crypto";
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
    // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tokenPayload = await sessionStore.get(token);
    if (!tokenPayload || !tokenPayload.email) {
      // Token is invalid or expired
      return res
        .status(400)
        .json({ message: "Invalid or expired token", tokenExpired: true });
    }
    const user = await UserModel.findOne({ email: tokenPayload.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sessionStore.delete(token); // Delete the token after use
    await sessionStore.delete(`reset_block_${user.email}`); // Clear any block for this user

    //send a confirmation email
    await mailer(user.email, user.username, undefined, "resetPassConfirmation");
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
    // 1. Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Optional: Rate-limit resend attempts (30 seconds)
    const blockKey = `reset_block_${email}`;
    const isBlocked = await sessionStore.get(blockKey);
    if (isBlocked) {
      return res.status(429).json({ message: "Please wait before resending" });
    }
    await sessionStore.setWithKey(blockKey, "1", 60); // block next request for 1 minute

    // 3. Store reset info in Redis session store
    const tokenPayload = {
      userId: user._id,
      email: user.email,
    };

    const tokenTTL = 60 * 30; // 30 minutes
    const token = await sessionStore.set(tokenPayload, tokenTTL);

    // 4. Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // 5. Send email
    await mailer(user.email, user.username, resetLink, "resetPassword");

    return res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
