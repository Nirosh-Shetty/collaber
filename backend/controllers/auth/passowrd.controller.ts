import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../../models/Users";
import { mailer } from "../../utils/mailer/index";
// import crypto from "crypto";
import sessionStore from "../../utils/sessionStore";

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Rate-limit resend attempts (30 seconds)
    const blockKey = `reset_block_${email}`;
    const isBlocked = await sessionStore.get(blockKey);
    if (isBlocked) {
      return res.status(429).json({ message: "Please wait before resending" });
    }
    await sessionStore.setWithKey(blockKey, "1", 60); // block next request for 1 minute

    // Store reset info in Redis session store
    const tokenPayload = {
      userId: user._id,
      email: user.email,
    };

    const tokenTTL = 60 * 60; // 1 hour
    const token = await sessionStore.set(tokenPayload, tokenTTL);

    //Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    //Send email
    await mailer(user.email, user.username, resetLink, "resetPassword");

    return res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token, newPassword } = req.body;
  const ip = req.ip;

  if (!token || !newPassword) {
    return res.status(400).json({
      message: "Token and new password are required",
      errorIn: "invalid-token",
    });
  }

  try {
    // Rate limiting section
    const ipKey = `reset_attempts_ip_${ip}`;
    const tokenKey = `reset_attempts_token_${token}`;
    const maxAttempts = 5;
    const ttl = 15 * 60; // 15 minutes

    const ipAttempts = parseInt((await sessionStore.get(ipKey)) || "0");
    const tokenAttempts = parseInt((await sessionStore.get(tokenKey)) || "0");

    if (ipAttempts >= maxAttempts || tokenAttempts >= maxAttempts) {
      return res.status(429).json({
        message: "Too many attempts. Please try again later.",
        errorIn: "rate-limited",
      });
    }

    await sessionStore.setWithKey(ipKey, (ipAttempts + 1).toString(), ttl);
    await sessionStore.setWithKey(
      tokenKey,
      (tokenAttempts + 1).toString(),
      ttl
    );
    //TODO: Add Account Lockout After Multiple Fails (Optional)
    // If you notice brute-force attempts (e.g., 10+ fails per user/IP per hour), consider locking the account or requiring captcha/email verification.

    // Validate token
    const tokenPayload = await sessionStore.get(token);
    if (!tokenPayload || !tokenPayload.email) {
      return res.status(400).json({
        message: "Invalid or expired token",
        errorIn: "invalid-token",
      });
    }

    const user = await UserModel.findOne({ email: tokenPayload.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        errorIn: "user-not-found",
      });
    }

    // Hash & save new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up
    await sessionStore.delete(token);
    await sessionStore.delete(`reset_block_${user.email}`);
    await sessionStore.delete(tokenKey);
    await sessionStore.delete(ipKey);

    // Send confirmation email
    await mailer(user.email, user.username, undefined, "resetPassConfirmation");

    return res.status(200).json({
      message: "Password reset successfully",
      errorIn: "success",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      message: "Internal server error",
      errorIn: "error",
    });
  }
};
